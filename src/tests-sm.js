/**
 * Retrieval methods for standard tests.
 */
var StdRhinoTest = function(myname){
	this.myname = myname;
	eval( "this.test = "+testobjects[myname]);
	this._cache = {};
	this._ids = [];
	//
	// Normalize input and build style.
	//
	if (this.test){
		//this._readTest();
		this.result = this.test.result;
		this._fixAllNames();
		this._setCache();
		this._fixInputSets();
	}
};

//
// Retrieve properly composed item from phoney database.
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.retrieveItem = function(id){
	return this._cache[id];
};

//
// Retrieve properly composed items from phoney database.
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.retrieveItems = function(ids){
	var ret = [];
	for each (var id in ids){
		ret.push(this.retrieveItem(id));
	}
	return ret;
};

//
// Retrieve locale object from filesystem
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.getLang = function(lang){
	return locale[lang];
};

//
// Build phoney database.
//
StdRhinoTest.prototype._setCache = function(){
	for each (item in this.test.input){
		this._cache[item.id] = item;
		this._ids.push(item.id);
	}
};


StdRhinoTest.prototype._fixInputSets = function(){
	if (this.test.mode == "citation"){
		if (!this.test.citations){
			var citation = [];
			for each (var item in this.test.input){
				citation.push([item.id,{}]);
			}
			this.test.citations = [citation];
		}
	}
};


StdRhinoTest.prototype._fixAllNames = function(){
	for each (var obj in this.test.input){
		if (!obj.id){
			throw "No id for object in test: "+this.myname;
		}
		for each (var key in CSL.CREATORS){
			if (obj[key]){
				for each (var entry in obj[key]){
					var one_char = entry.name.length-1;
					var two_chars = one_char-1;
					entry.sticky = false;
					if ("!!" == entry.name.substr(two_chars)){
						entry.literal = entry.name.substr(0,two_chars).replace(/\s+$/,"");
					} else {
						var parsed = entry.name;
						if ("!" == entry.name.substr(one_char)){
							entry.sticky = true;
							parsed = entry.name.substr(0,one_char).replace(/\s+$/,"");
						}
						parsed = parsed.split(/\s*,\s*/);

						if (parsed.length > 0){
							var m = parsed[0].match(/^\s*([a-z]+)\s+(.*)/);
							if (m){
								entry.prefix = m[1];
								entry["primary-key"] = m[2];
							} else {
								entry["primary-key"] = parsed[0];
							}
						}
						if (parsed.length > 1){
							entry["secondary-key"] = parsed[1];
						}
						if (parsed.length > 2){
							var m = parsed[2].match(/\!\s*(.*)/);
							if (m){
								entry.suffix = m[1];
								entry.comma_suffix = true;
							} else {
								entry.suffix = parsed[2];
							}
						}
					}
				}
			}
		}
	}
};


StdRhinoTest.prototype._buildStyle = function(){
	var mybuilder = new CSL.Core.Build(this.test.csl);
	var myraw = mybuilder.build(this);
	var myconfigurator = new CSL.Core.Configure(myraw);
	this.style = myconfigurator.configure();
};


StdRhinoTest.prototype.run = function(){
	this._buildStyle(this);
	this.style.insertItems(this._ids);
	if (this.test.mode == "citation"){
		var citations = [];
		for each (var citation in this.test.citations){
			citations.push(this.style.makeCitationCluster(citation));
		}
		var ret = citations.join("\n");
	} else if (this.test.mode == "bibliography"){
		var ret = this.style.makeBibliography();
	} else {
		throw "Invalid mode in test file "+this.myname+": "+this.test.mode;
	}
	return ret;
};
