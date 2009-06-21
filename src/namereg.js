dojo.provide("csl.namereg");

CSL.Factory.Registry.prototype.Names = function(){
	this.names_dat = new Object();
	this.names_inf = new Object();
};

/**
 * The idea here will be to store names in a nested hierarchy
 * of declining ambiguity (surname, initial, given name), with
 * a query mechanism to return the correct disambig value for
 * the surname.  Each time a name is added or deleted, the query
 * mechanism is run, and the result is stored in names_inf for
 * rapid delivery via an external query method.
 */
CSL.Factory.Registry.prototype.Names.prototype.add = function(nameobj){
	var pkey = nameobj["primary-key"];
	var ikey = CSL.Util.Names.initializeWith(nameobj["secondary-key"],"");
	var skey = nameobj["secondary-key"].replace(".","");
	if (pkey){
		if ("undefined" == typeof this.names_dat[pkey]){
			this.names_dat[pkey] = new Object();
		};
		if (ikey){
			if ("undefined" == typeof this.names_dat[pkey][ikey]){
				this.names_dat[pkey][ikey] = new Object();
			};
			if (skey){
				if ("undefined" == typeof this.names_dat[pkey][ikey][skey]){
					this.names_dat[pkey][ikey][skey] = 1;
				};
			};
		};
	};
	var num = 0;
	for (var i in this.names_dat[pkey]){
		num += 1;
	};
	//
	// dammit, how is this supposed to work?
	//
	if (num == 1){
		this.names_inf[pkey]["primary"];
	};
	num = 0;
	for (var i in nameobj[pkey][ikey]){
		num += 1;
	}
	if (num == 1){
		initial_uniq = true;
	}
	if (primary_uniq){

	}
};
