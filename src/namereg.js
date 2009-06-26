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
	this.state = state;
	this.namereg = new Object();
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
		skey = pkey+"::"+secondary.replace("."," ").replace(/\s+/," ");
	};

	var eval = function(nameobj,form,initials){
		// return vals
		var floor;
		var ceiling;

		_set_keys(nameobj);
		// keys
		var pkey_is_unique = this.namereg[pkey] == 1;
		var ikey_is_unique = this.namereg[ikey] == 1;
		var skey_is_unique = this.namereg[skey] == 1;
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
		//print("OPT: "+opt+", OPT type: "+typeof opt);
		if ("short" == form){
			param = 0;
		} else if ("string" == typeof initials){
			param = 1;
		};
		//
		// this is a noop; this option has effect only in libnames itself
		// (it turns on the old "givens" option in the disambiguation
		// routines)
		//
		// The other options need to be covered here, though.
		//
		//if ("by-cite" == opt || "true" == opt || true == opt){
		//};
		return param;
							//var param = 2;
							//if (state.output.getToken("name").strings.form == "short"){
							//	param = 0;
							//} else if ("string" == typeof state.tmp["initialize-with"]){
							//	param = 1;
							//};
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

	var add = function(nameobj){
		_set_keys(nameobj);
		if (pkey){
			if ("undefined" == typeof this.namereg[pkey]){
				this.namereg[pkey] = 0;
			};
			if ("undefined" == typeof this.namereg[skey]){
				this.namereg[skey] = 0;
				if ("undefined" == typeof this.namereg[ikey]){
					this.namereg[ikey] = 0;
				};
				this.namereg[pkey] += 1;
				this.namereg[ikey] += 1;
			};
			this.namereg[skey] += 1;
		};
	};
	this.add = add;
	this.del = del;
	this.eval = eval;
};
