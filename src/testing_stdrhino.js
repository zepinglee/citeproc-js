dojo.provide("csl.testing_stdrhino");

/**
 * Retrieval methods for standard tests.
 */
var StdRhinoTest = function(myname){
	//print("Test: "+myname);
	this.xml = new CSL.System.Xml.E4X();
	this.myname = myname;
	this._cache = {};
	this._ids = [];
	//
	// Normalize input and build style.
	//
	if (myname){
		var test = readFile("./std/machines/" + myname + ".json", "UTF-8");
		eval( "this.test = "+test);
		this.result = this.test.result;
		//this._fixAllNames();
		this._setCache();
		//this._fixInputSets();
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
	var ret = readFile( "./locale/"+this.localeRegistry()[lang], "UTF-8");
	ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	return ret;
};


StdRhinoTest.prototype.makeXml = function(str){
	// this is where this should happen
	//ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	var ret = new XML(str);
	return ret;
};


StdRhinoTest.prototype.setLocaleXml = function(arg,lang){
	if ("undefined" == typeof this.locale_terms){
		this.locale_terms = new Object();
	}
	if ("undefined" == typeof this.locale_opt){
		this.locale_opt = new Object();
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
	if (myxml.localName().toString() == "terms"){
		locale = myxml.locale;
	} else {
		for each (var blob in myxml..locale){
			if (blob.@xml::lang == lang){
				locale = blob;
				break;
			}
		}
	}
	for each (var term in locale.term){
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
	for each (var option in locale.option){
		var optionname = option.@name.toString();
		var optionvalue = option.@value.toString();
		//
		// Only one of these so far, and it's a boolean.
		//
		//print("locale option value: "+optionvalue);
		if ("true" == optionvalue){
			this.locale_opt[optionname] = true;
		}
		if ("false" == optionvalue){
			this.locale_opt[optionname] = false;
		}
	}
};


StdRhinoTest.prototype.localeRegistry =	function (){
	return {
		"af":"locales-af-AZ.xml",
		"af":"locales-af-ZA.xml",
		"ar":"locales-ar-AR.xml",
		"bg":"locales-bg-BG.xml",
		"ca":"locales-ca-AD.xml",
		"cs":"locales-cs-CZ.xml",
		"da":"locales-da-DK.xml",
		"de":"locales-de-AT.xml",
		"de":"locales-de-CH.xml",
		"de":"locales-de-DE.xml",
		"el":"locales-el-GR.xml",
		"en":"locales-en-US.xml",
		"es":"locales-es-ES.xml",
		"et":"locales-et-EE.xml",
		"fr":"locales-fr-FR.xml",
		"he":"locales-he-IL.xml",
		"hu":"locales-hu-HU.xml",
		"is":"locales-is-IS.xml",
		"it":"locales-it-IT.xml",
		"ja":"locales-ja-JP.xml",
		"ko":"locales-ko-KR.xml",
		"mn":"locales-mn-MN.xml",
		"nb":"locales-nb-NO.xml",
		"nl":"locales-nl-NL.xml",
		"pl":"locales-pl-PL.xml",
		"pt":"locales-pt-BR.xml",
		"pt":"locales-pt-PT.xml",
		"ro":"locales-ro-RO.xml",
		"ru":"locales-ru-RU.xml",
		"sk":"locales-sk-SK.xml",
		"sl":"locales-sl-SI.xml",
		"sr":"locales-sr-RS.xml",
		"sv":"locales-sv-SE.xml",
		"th":"locales-th-TH.xml",
		"tr":"locales-tr-TR.xml",
		"uk":"locales-uk-UA.xml",
		"vi":"locales-vi-VN.xml",
		"zh":"locales-zh-CN.xml",
		"zh":"locales-zh-TW.xml"
	};
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


StdRhinoTest.prototype._fixAllNames = function(){
	for each (obj in this.test.input){
		if (!obj.id){
			throw "No id for object in test: "+this.myname;
		}
		for each (key in CSL.CREATORS){
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

StdRhinoTest.prototype._readTest = function(){
	var test;
	var filename = "std/machines/" + this.myname + ".json";
	//
	// Half of the fix for encoding problem encountered by Sean
	// under OSX.  External strings are _read_ correctly, but an
	// explicit encoding declaration on readFile is needed if
	// they are to be fed to eval.  This may set the implicit
	// UTF-8 binary identifier on the stream, as defined in the
	// ECMAscript specification.  See http://www.ietf.org/rfc/rfc4329.txt
	//
	// Python it's not.  :)
	//
	var teststring = readFile(filename, "UTF-8");
	//
	// Grab test data in an object.
	//
	try {
		eval( "test = "+teststring );
	} catch(e){
		throw e + teststring;
	}
	this.test = test;
};


StdRhinoTest.prototype._buildStyle = function(){
	this.style = new CSL.Engine(this,this.test.csl);
	//var raw = builder.build(this);
	//var configurator = new CSL.Core.Configure(raw);
	//this.style = configurator.configure();
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
		var ret = this.style.makeBibliography()[1].join("");
        ret = "<div class=\"csl-bib-body\">\n" + ret + "</div>";
	} else {
		throw "Invalid mode in test file "+this.myname+": "+this.test.mode;
	}
	return ret;
};
