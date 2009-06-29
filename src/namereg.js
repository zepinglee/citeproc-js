dojo.provide("csl.namereg");

/**
 * The idea here will be to store names in a nested hierarchy
 * of declining ambiguity (surname, initial, given name), with
 * a query mechanism to return the correct disambig value for
 * the surname.  Each time a name is added or deleted, the query
 * mechanism is run, and the result is stored in names_inf for
 * rapid delivery via an external query method.
 *
 * What should happen is that names are filed in a
 * names registry when they are used.  so state.registry.names=(new something).
 * then a call to a method of the registry object for that name will return the
 * lowest acceptable value for the current configuration state.
 * var lev = state.registry.names(state,name);, like.
 *
 * This could be extended later to a simplification of all names
 * disambiguation, by returning both the minimum AND maximum
 * name config values from this method.  That would put all the
 * initialize-with etc jiggery-pokery in one place, and the
 * disambiguation machinery would not need to be cluttered up with
 * it; you would just increment and decrement name config values
 * within the range.  But that's for later.  For now, we just
 * set a floor value and use the existing machinery.
 *
 * No, the extension might as well happen now.  Setting the ceiling
 * through this function will bring all of the names parameters into
 * this space, where they can be easily seen and controlled.  Very
 * hard adjustments in the disambiguation machinery, but small steps,
 * man, small steps.
 *
 */
CSL.Factory.Registry.prototype.NameReg = function(state){
	//this.state = state;
	this.namereg = new Object();
	this.updateme = new Array();
	var pkey;
	var ikey;
	var skey;

	var _set_keys = function(nameobj){
		pkey = nameobj["primary-key"];
		var secondary = nameobj["secondary-key"];
		if (!secondary){
			secondary = "";
		}
		ikey = pkey+"::"+CSL.Util.Names.initializeWith(secondary,"");
		skey = pkey+"::::"+secondary.replace("."," ").replace(/\s+/," ");
	};

	var eval = function(nameobj,namenum,form,initials){
		// return vals
		var floor;
		var ceiling;

		_set_keys(nameobj);
		//
		// give literals a pass
		if ("undefined" == typeof this.namereg[skey]){
			return 2;
		}
		// keys
		var pkey_is_unique = this.namereg[pkey] == 1;
		var ikey_is_unique = this.namereg[ikey] == 1;
		//print(skey);
		var skey_is_unique = this.namereg[skey].length == 1;
		// params
		//
		// possible options are:
		//
		// <option disambiguate-add-givenname value="true"/> (a)
		// <option disambiguate-add-givenname value="all-names"/> (a)
		// <option disambiguate-add-givenname value="all-names-with-initials"/> (b)
		// <option disambiguate-add-givenname value="all-names-with-fullname"/> (c)
		// <option disambiguate-add-givenname value="primary-name"/> (d)
		// <option disambiguate-add-givenname value="primary-name-with-initials"/> (e)
		// <option disambiguate-add-givenname value="primary-name-with-fullname"/> (f)
		// <option disambiguate-add-givenname value="by-cite"/> (g)
		//
		var param = 2;
		var opt = state[state.tmp.area].opt["disambiguate-add-givenname"];
		//
		// set initial value
		//
		if ("short" == form){
			param = 0;
		} else if ("string" == typeof initials){
			param = 1;
		};
		//
		// adjust value upward if appropriate
		//
		if ("string" == typeof opt && opt.slice(0,12) == "primary-name" && namenum > 0){
			return param;
		};
		//
		// the last composite condition is for backward compatibility
		//
		if (opt == "all-names" || opt == "primary-name" || ("boolean" == typeof opt && opt == true)){
			if (!pkey_is_unique){
				param = 1;
			};
			if (!ikey_is_unique){
				param = 2;
			}
		} else if (opt == "all-names-with-initials" || opt == "primary-name-with-initials"){
			if (!pkey_is_unique){
				param = 1;
			}
		} else if (opt == "all-names-with-fullname" || opt == "primary-name-with-fullname"){
			if (!pkey_is_unique){
				param = 2;
			}
		};
		print(param+" "+nameobj["primary-key"]);
		return param;
	};

	var del = function(nameobj){
		_set_keys(nameobj);
		if (pkey){
			this.namereg[skey] += -1;
			if (this.namereg[skey] == 0){
				delete this.namereg[skey];
				this.namereg[pkey] += -1;
				this.namereg[ikey] += -1;
			};
			if (this.namereg[ikey] == 0){
				delete this.namereg[ikey];
			};
			if (this.namereg[pkey] == 0){
				delete this.namereg[pkey];
			};
		};
	};

	//
	// Oooooooh, this is hard.  The problem is where to call
	// this method from.  It can't be called on all names in an
	// Item, because that will be overaggressive (there might be
	// only one name actually visible in printed output).
	//
	// If it's called per-name at render time, that should work
	// okay (I think), but also need to be careful to call
	// del method if the name is unwound during disambiguation
	// (disambiguate-add-names).
	//
	// There's a problem, though.  Suppose [Alex] Smith, Book A (2000).
	// Then suppose a later cite to [Arnold] Smith, Book B (1990).  The
	// two sources are not in the same disambig set.  A separate tracking
	// registry is needed for names, so that a request for re-rendering
	// can be issued when the name form changes.
	//
	// And this needs to play nice with the existing machinery.
	// Swell.  Just swell.
	//
	// Okay, maybe we can escape here.  skey is an array of
	// item ids that contain the name.  we can tap into that
	// later to request/trigger updates when the name changes.
	//
	// Uh-oh.  Need to cache the name param result for each name
	// somewhere, though, so that we can tell when it's changed and
	// when it hasn't ... except we can't, can we, since whether
	// initials are used or not, and whether full or short form is
	// used, is specific to the names tag (not global across the
	// style, nor even across citation or bibliography).
	//
	// ... but disambiguation levels are set globally.  So I
	// guess we can just blunder forward on this.  There are some
	// option combinations that will break without fine-grained
	// caching -- if one name element requests full form, that
	// will force all instances of all names that it renders
	// to full form -- but maybe that can be written off as
	// CSL behavior, not an error in the program.
	//
	// okay, so this now works as an update method, and
	// maintains a list of item ids requiring onward updates
	// to keep them in sync with global names disambiguation
	// status.
	//
	// alright, that works, but it breaks the add-names disambiguation
	// routines.
	//
	// The add-names routines break because the base form of the
	// name changes during processing, as further names are added.
	// This causes the ambig key to shift around, with the result
	// that names are not properly expanded, and adding of names
	// fails.  Seems to be the problem, anyway.
	//
	// Let's try switching the order of processing.  Run ALL
	// renderings with disambiguate-add-givenname set to a value
	// with the by-cite behaviour, and then set the names-based
	// expanded form when the final makeCitationCluster rendering
	// is output.  This could be done with a single var set on
	// the state object in the execution wrappers that run the
	// style.
	var update = function(item_id,nameobj,pos){
		_set_keys(nameobj);
		var old_key = this.namereg[skey];
		if (pkey){
			if ("undefined" == typeof this.namereg[pkey]){
				this.namereg[pkey] = 0;
			};
			if ("undefined" == typeof this.namereg[skey]){
				this.namereg[skey] = [];
				if ("undefined" == typeof this.namereg[ikey]){
					this.namereg[ikey] = 0;
				};
				this.namereg[pkey] += 1;
				this.namereg[ikey] += 1;
			};
			this.namereg[skey].push(item_id);
		};
		if ("undefined" != typeof old_key && this.namereg[skey] != old_key){
			for each (var id in this.namereg[skey]){
				if (id == item_id){
					continue;
				}
				if (this.updateme.indexOf(id) == -1){
					this.updateme.push(id);
				}
			}
		}
	};
	this.update = update;
	this.del = del;
	this.eval = eval;
};
