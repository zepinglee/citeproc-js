dojo.provide("csl.testing_rhino");

RhinoTest = function(name){
	this.xml = new CSL.System.Xml.E4X();
	this.dummy = [["dummy",{}]];
	this.citations = [];
	this.input = name;
	this.items = [];
	this._ids = [];
	this._cache = {};
	if (name){
		if ("string" == typeof name[0]){
			var input = this._getInput(name);
		} else {
			var input = name;
		}
		this.fixData(input);
	} else {
		this._ids.push("dummy");
		this._cache["dummy"] = {"id":"dummy"};
		this.citations.push(["dummy",{}]);
		this.items.push({"id":"dummy"});
	}
};

RhinoTest.prototype.fixData = function(Item){
	//
	// Item isn't really an item, it's a list of items.
	// And they need to be remangled to conform to the
	// processor API.
	//
	if (Item){
		var seqno = 100;
		this._ids = [];
		this._cache = {};
		this.citations = [];
		for (var i in Item){
			var realitem = Item[i];
			if (!realitem.id){
				realitem.id = "ITEM-"+seqno.toString();
				seqno += 1;
			}
			this._ids.push(realitem.id);
			this._cache[realitem.id] = realitem;
			this.citations.push([realitem.id,{}]);
			this.items.push(realitem);
		}
	}
};


RhinoTest.prototype.retrieveItem = function(id){
	return this._cache[id];
};


RhinoTest.prototype.retrieveItems = function(ids){
	var ret = [];
	for each (var id in ids){
		ret.push(this.retrieveItem(id));
	}
	return ret;
};


RhinoTest.prototype.getLang = function(lang){
	var ret = readFile( "./locale/"+this.localeRegistry()[lang], "UTF-8");
	ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	return ret;
};


RhinoTest.prototype.makeXml = function(str){
	str = str.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	return XML(str);
};


RhinoTest.prototype.setLocaleXml = function(arg,lang){
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


RhinoTest.prototype._getInput = function(name){
	this.myname = name;
	var ret = new Array();
	if ("object" == typeof name && name.length){
		for each (filename in name){
			if (this.input[filename]){
				ret.push(this.input[filename]);
			} else {
				var datastring = readFile("data/" + filename + ".txt", "UTF-8");
				eval( "obj = " + datastring );
				this._fixAllNames([obj]);
				this.input[filename] = obj;
				ret.push(obj);
			}
		}
	} else if ("object" == typeof name){
		if (this.input[filename]){
			ret.push(this.input[filename]);
		} else {
			var datastring = readFile("data/" + filename + ".txt", "UTF-8");
			this.input[filename] = obj;
			eval( "obj = " + datastring );
			this._fixAllNames([obj]);
			ret.push(obj);
		}
	} else {
		throw "Failure reading test data file, WTF?";
	}
	return ret;
}

RhinoTest.prototype.localeRegistry =	function (){
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

RhinoTest.prototype._fixAllNames = function(input){
	for each (obj in input){
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

