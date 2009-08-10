/**
 * Retrieval methods for standard tests.
 */
var StdRhinoTest = function(myname){
	this.xml = new CSL.System.Xml.E4X();
	this.myname = myname;
	//eval( "this.test = "+testobjects[myname]);
	//this.test = testobjects[myname];
	this._cache = {};
	this._ids = [];
	//
	// Normalize input and build style.
	//
	if (myname){
		var test = testobjects[myname];
		//eval( "this.test = "+test);
		this.test = test;
		this.result = this.test.result;
		//this._fixAllNames();
		this._setCache();
		//this._fixInputSets();
	}
};

StdRhinoTest.prototype.makeXml = function(str){
	str = str.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	var ret = new XML(str);
	return ret;
};


StdRhinoTest.prototype.setLocaleXml = function(arg,lang){
	if ("undefined" == typeof this.locale_terms){
		this.locale_terms = new Object();
	}
	if ("undefined" == typeof arg){
		var myxml = new XML( this.getLang("en") );
		lang = "en";
	} else if ("string" == typeof arg){
		var myxml = new XML( this.getLang(arg) );
		lang = arg;
	} else if ("xml" != typeof arg){
		throw "Argument to setLocaleXml must nil, a lang string, or an XML object";
	} else if ("string" != typeof lang) {
		throw "Error in setLocaleXml: Must provide lang string with XML locale object";
	} else {
		var myxml = arg;
	}
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	var xml = new Namespace("http://www.w3.org/XML/1998/namespace");
	var locale = new XML();
	if (myxml.localName() && myxml.localName().toString() == "locale"){
		locale = myxml;
	} else {
		for each (var blob in myxml..locale){
			if (blob.@xml::lang == lang){
				locale = blob;
				break;
			}
		}
	}
	for each (var term in locale.terms.term){
		var termname = term.@name.toString();
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		//default xml namespace = "http://purl.org/net/xbiblio/csl";
		if ("undefined" == typeof this.locale_terms[termname]){
			this.locale_terms[termname] = new Object();
		};
		var form = "long";
		if (term.@form.toString()){
			form = term.@form.toString();
		}
		if (term.multiple.length()){
			this.locale_terms[termname][form] = new Array();
			this.locale_terms[term.@name.toString()][form][0] = term.single.toString();
			this.locale_terms[term.@name.toString()][form][1] = term.multiple.toString();
		} else {
			this.locale_terms[term.@name.toString()][form] = term.toString();
		}
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
	return locale[lang].replace(/\s*<\?[^>]*\?>\s*\n/g, "");
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
								entry["family"] = m[2];
							} else {
								entry["family"] = parsed[0];
							}
						}
						if (parsed.length > 1){
							entry["given"] = parsed[1];
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
	this.style = new CSL.Engine(this,this.test.csl);
};


StdRhinoTest.prototype.run = function(){
	this._buildStyle();
	if (this.test.bibentries){
		for each (var id_set in this.test.bibentries){
			this.style.updateItems(id_set);
		}
	} else {
		this.style.updateItems(this._ids);
	}
	if (this.test.mode == "citation"){
		if (!this.test.citations){
			var citation = [];
			for each (item in this.style.registry.reflist){
				citation.push([item.id,{}]);
			}
			this.test.citations = [citation];
		}
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
