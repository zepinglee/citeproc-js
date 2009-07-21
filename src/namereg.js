dojo.provide("csl.namereg");

/**
 * The idea here will be to store names in a nested hierarchy
 * of declining ambiguity (surname, initial, given name), with
 * a query mechanism to return the correct disambig value for
 * the surname.
 *
 * What should happen is that names are filed in a
 * names registry when they are used.  so state.registry.names=(new something).
 * then a call to a method of the registry object for that name will return the
 * lowest acceptable value for the current configuration state.
 * var lev = state.registry.names(state,name);, like.
 *
 */
CSL.Factory.Registry.NameReg = function(state){
	this.namereg = new Object();
	this.nameind = new Object();
	//
	// primary-key, initials form, fullname (with secondary-key stripped of periods)
	var pkey;
	var ikey;
	var skey;
	//
	// keys registered, indexed by ID
	this.itemkeyreg = new Object();

	var _strip_periods = function(str){
		if (!str){
			str = "";
		}
		return str.replace("."," ").replace(/\s+/," ");
	};

	var _set_keys = function(nameobj){
		pkey = _strip_periods(nameobj["primary-key"]);
		skey = _strip_periods(nameobj["secondary-key"]);
		ikey = CSL.Util.Names.initializeWith(skey,"");
	};

	var eval = function(nameobj,namenum,request_base,form,initials){
		// return vals
		var floor;
		var ceiling;

		_set_keys(nameobj);
		//
		// give literals a pass
		if ("undefined" == typeof this.namereg[pkey] || "undefined" == typeof this.namereg[pkey].ikey[ikey]){
			return 2;
		}
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
		var dagopt = state[state.tmp.area].opt["disambiguate-add-givenname"];
		var gdropt = state[state.tmp.area].opt["givenname-disambiguation-rule"];
		//
		// set initial value
		//
		if ("short" == form){
			param = 0;
		} else if ("string" == typeof initials || state.tmp.force_subsequent){
			param = 1;
		};
		//
		// adjust value upward if appropriate
		//
		if (param < request_base){
			param = request_base;
		}
		if (state.tmp.force_subsequent || !dagopt){
			return param;
		};
		if ("string" == typeof gdropt && gdropt.slice(0,12) == "primary-name" && namenum > 0){
			return param;
		};
		//
		// the last composite condition is for backward compatibility
		//
		if (!gdropt || gdropt == "all-names" || gdropt == "primary-name"){
			if (this.namereg[pkey].count > 1){
				param = 1;
			};
			if (this.namereg[pkey].ikey && this.namereg[pkey].ikey[ikey].count > 1){
				param = 2;
			}
		} else if (gdropt == "all-names-with-initials" || gdropt == "primary-name-with-initials"){
			if (this.namereg[pkey].count > 1){
				param = 1;
			}
		} else if (gdropt == "all-names-with-fullname" || gdropt == "primary-name-with-fullname"){
			if (this.namereg[pkey].count > 1){
				param = 2;
			}
		};
		return param;
	};

	var delitems = function(ids){
		//
		// XXXX: Left something out, oops.  This function needs to return
		// the IDs of all items that might be affected by the deletion of a
		// name affected by this invocation.
		//
		if ("string" == typeof ids){
			ids = [ids];
		};
		for (var item in ids){
			var ret = {};
			var key = this.nameind[item].split("::");
			pkey = key[0];
			ikey = key[1];
			skey = key[2];
			var pos = this.namereg[pkey].items.indexOf(item);
			var items = this.namereg[pkey].items;
			if (skey){
				pos = this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf(item);
				if (pos > -1){
					items = this.namereg[pkey].ikey[ikey].skey[skey].items.slice();
					this.namereg[pkey].ikey[ikey].skey[skey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
				};
				if (this.namereg[pkey].ikey[ikey].skey[skey].items.length == 0){
					delete this.namereg[pkey].ikey[ikey].skey[skey];
					this.namereg[pkey].ikey[ikey].count += -1;
					if (this.namereg[pkey].ikey[ikey].count < 2){
						for (var i in this.namereg[pkey].ikey[ikey].items){
							ret[i] = true;
						};
					};
				};
			};
			if (ikey){
				pos = this.namereg[pkey].ikey[ikey].items.indexOf(item);
				if (pos > -1){
					items = this.namereg[pkey].ikey[ikey].items.slice();
					this.namereg[pkey].ikey[ikey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
				};
				if (this.namereg[pkey].ikey[ikey].items.length == 0){
					delete this.namereg[pkey].ikey[ikey];
					this.namereg[pkey].count += -1;
					if (this.namereg[pkey].count < 2){
						for (var i in this.namereg[pkey].items){
							ret[i] = true;
						};
					};
				};
			};
			if (pkey){
				pos = this.namereg[pkey].items.indexOf(item);
				if (pos > -1){
					items = this.namereg[pkey].items.slice();
					this.namereg[pkey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
				};
				if (this.namereg[pkey].items.length == 0){
					delete this.namereg[pkey];
				};
			}
			this.namereg[pkey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
			delete this.nameind[item];
		};
		return ret;
	};
	//
	// Run ALL
	// renderings with disambiguate-add-givenname set to a value
	// with the by-cite behaviour, and then set the names-based
	// expanded form when the final makeCitationCluster rendering
	// is output.  This could be done with a single var set on
	// the state object in the execution wrappers that run the
	// style.
	//
	var addname = function(item_id,nameobj,pos){
		_set_keys(nameobj);
		// pkey, ikey and skey should be stored in separate cascading objects.
		// there should also be a kkey, on each, which holds the item ids using
		// that form of the name.
		if (pkey){
			if ("undefined" == typeof this.namereg[pkey]){
				this.namereg[pkey] = new Object();
				this.namereg[pkey]["count"] = 0;
				this.namereg[pkey]["ikey"] = new Object();
				this.namereg[pkey]["items"] = new Array();
			};
			if (this.namereg[pkey].items.indexOf(item_id) == -1){
				this.namereg[pkey].items.push(item_id);
			};
		};
		if (pkey && ikey){
			if ("undefined" == typeof this.namereg[pkey].ikey[ikey]){
				this.namereg[pkey].ikey[ikey] = new Object();
				this.namereg[pkey].ikey[ikey]["count"] = 0;
				this.namereg[pkey].ikey[ikey]["skey"] = new Object();
				this.namereg[pkey].ikey[ikey]["items"] = new Array();
				this.namereg[pkey]["count"] += 1;
			};
			if (this.namereg[pkey].ikey[ikey].items.indexOf(item_id) == -1){
				this.namereg[pkey].ikey[ikey].items.push(item_id);
			};
		};
		if (pkey && ikey && skey){
			if ("undefined" == typeof this.namereg[pkey].ikey[ikey].skey[skey]){
				this.namereg[pkey].ikey[ikey].skey[skey] = new Object();
				this.namereg[pkey].ikey[ikey].skey[skey]["items"] = new Array();
				this.namereg[pkey].ikey[ikey]["count"] += 1;
			};
			if (this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf(item_id) == -1){
				this.namereg[pkey].ikey[ikey].skey[skey].items.push(item_id);
			};
		};
		if ("undefined" == typeof this.nameind[item_id]){
			this.nameind[item_id] = new Object();
		};
		this.nameind[item_id][pkey+"::"+ikey+"::"+skey] = true;
	};
	this.addname = addname;
	this.delitems = delitems;
	this.eval = eval;
};
