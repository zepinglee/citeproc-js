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
	var key = nameobj["primary-key"];
	if ("undefined" == typeof this.names_dat[key]){
		this.names_dat[key] = new Array();
	};

}