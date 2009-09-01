/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
dojo.provide("csl.build");


CSL.Engine = function(sys,style,lang) {
	this.sys = sys;
				   if ("string" != typeof style){
		style = "";
	}
	this.opt = new CSL.Engine.Opt();
	this.tmp = new CSL.Engine.Tmp();
	this.build = new CSL.Engine.Build();
	this.fun = new CSL.Engine.Fun();
	this.configure = new CSL.Engine.Configure();
	this.citation = new CSL.Engine.Citation();
	this.citation_sort = new CSL.Engine.CitationSort();
	this.bibliography = new CSL.Engine.Bibliography();
	this.bibliography_sort = new CSL.Engine.BibliographySort();

	this.output = new CSL.Output.Queue(this);

	this.cslXml = this.sys.xml.makeXml(style);
	if (this.cslXml["@page-range-format"].toString()){
		this.opt["page-range-format"] = this.cslXml["@page-range-format"].toString();
	}
	if (this.cslXml["@default-locale"].toString()){
		var lst = this.cslXml["@default-locale"].toString();
		lst = lst.split(/-(sort|primary|secondary|name)-/);
		var pos = lst.indexOf("sort");
		if (pos > -1){
			this.opt["locale-sort"] = lst[(pos+1)];
		}
		var pos = lst.indexOf("primary");
		if (pos > -1){
			this.opt["locale-primary"] = lst[(pos+1)];
		}
		var pos = lst.indexOf("secondary");
		if (pos > -1){
			this.opt["locale-secondary"] = lst[(pos+1)];
		}
		var pos = lst.indexOf("name");
		if (pos > -1){
			this.opt["locale-name"] = lst[(pos+1)];
		}
	}
	//
	// implicit default, "en"
	this.setLocaleXml();
	if (lang){
		this.setLocaleXml(lang);
	} else {
		lang = "en";
	}
	this.opt.lang = lang;
	this.setLocaleXml( this.cslXml, lang );
	this._buildTokenLists("citation");
	this._buildTokenLists("bibliography");

	this.configureTokenLists();

	this.registry = new CSL.Factory.Registry(this);

	this.splice_delimiter = false;

	//
	// flip-flopper for inline markup
	//
	this.fun.flipflopper = new CSL.Util.FlipFlopper(this);
	//
	// utility functions for quotes
	//
	this.opt.close_quotes_array = this.getCloseQuotesArray();
	//
	// configure ordinal numbers generator
	//
	this.fun.ordinalizer.init(this);
	//
	// configure long ordinal numbers generator
	//
	this.fun.long_ordinalizer.init(this);
	//
	// set up page mangler
	//
	this.fun.page_mangler = CSL.Util.PageRangeMangler.getFunction(this);

	this.setOutputFormat("html");
};

CSL.Engine.prototype.getCloseQuotesArray = function(){
	var ret = [];
	ret.push(this.getTerm("close-quote"));
	ret.push(this.getTerm("close-inner-quote"));
	ret.push('"');
	ret.push("'");
	return ret;
};

CSL.Engine.prototype._buildTokenLists = function(area){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	var area_nodes = this.cslXml[area];
	if (!area_nodes.toString()){
		//CSL.debug("NO AREA NODES");
		return;
	};
	var navi = new this._getNavi( this, area_nodes );
	this.build.area = area;
	this._build(navi);
};


CSL.Engine.prototype._build  = function(navi){
	if (navi.getkids()){
		this._build(navi);
	} else {
		if (navi.getbro()){
			this._build(navi);
		} else {
			while (navi.nodeList.length > 1) {
				if (navi.remember()){
					this._build(navi);
				}
			}
		}
	}
};


CSL.Engine.prototype._getNavi = function(state,myxml){
	this.sys = state.sys;
	this.state = state;
	this.nodeList = new Array();
	this.nodeList.push([0, myxml]);
	this.depth = 0;
};


CSL.Engine.prototype._getNavi.prototype.remember = function(){
	this.depth += -1;
	this.nodeList.pop();
	// closing node, process result of children
	var node = this.nodeList[this.depth][1][(this.nodeList[this.depth][0])];
	CSL.Factory.XmlToToken.call(node,this.state,CSL.END);
	return this.getbro();
};


CSL.Engine.prototype._getNavi.prototype.getbro = function(){
	var sneakpeek = this.nodeList[this.depth][1][(this.nodeList[this.depth][0]+1)];
	if (sneakpeek){
		this.nodeList[this.depth][0] += 1;
		return true;
	} else {
		return false;
	}
};


CSL.Engine.prototype._getNavi.prototype.getkids = function(){
	var currnode = this.nodeList[this.depth][1][this.nodeList[this.depth][0]];
	var sneakpeek = this.sys.xml.children(currnode);
	//var sneakpeek = currnode.children();
	if (this.sys.xml.numberofnodes(sneakpeek) == 0){
		// singleton, process immediately
		CSL.Factory.XmlToToken.call(currnode,this.state,CSL.SINGLETON);
		return false;
	} else {
		// if first node of a span, process it, then descend
		CSL.Factory.XmlToToken.call(currnode,this.state,CSL.START);
		this.depth += 1;
		this.nodeList.push([0,sneakpeek]);
		return true;
	}
};


CSL.Engine.prototype._getNavi.prototype.getNodeListValue = function(){
	return this.nodeList[this.depth][1];
};

CSL.Engine.prototype.setOutputFormat = function(mode){
	this.opt.mode = mode;
	this.fun.decorate = CSL.Factory.Mode(mode);
	if (!this.output[mode]){
		this.output[mode] = new Object();
		this.output[mode].tmp = new Object();
	};
	this.fun.decorate.format_init(this.output[mode].tmp);
};

CSL.Engine.prototype.getTerm = function(term,form,plural){
	return CSL.Engine._getField(CSL.STRICT,this.locale_terms,term,form,plural);
};

CSL.Engine.prototype.getVariable = function(Item,varname,form,plural){
	return CSL.Engine._getField(CSL.LOOSE,Item,varname,form,plural);
};

CSL.Engine.prototype.getDateNum = function(ItemField,partname){
	if ("undefined" == typeof ItemField){
		return 0;
	} else {
		return ItemField[partname];
	};
};

CSL.Engine._getField = function(mode,hash,term,form,plural){
	var ret = "";
	if (!hash[term]){
		if (mode == CSL.STRICT){
			throw "Error in _getField: term\""+term+"\" does not exist.";
		} else {
			return undefined;
		}
	}
	//if (!form){
	//	form = "long";
	//}
	var forms = [];
	if (form == "symbol"){
		forms = ["symbol","short"];
	} else if (form == "verb-short"){
		forms = ["verb-short","verb"];
	} else if (form != "long"){
		forms = [form];
	}
	forms = forms.concat(["long"]);
	for each (var f in forms){
		if ("string" == typeof hash[term]){
			ret = hash[term];
		} else if ("undefined" != typeof hash[term][f]){
			if ("string" == typeof hash[term][f]){
				ret = hash[term][f];
			} else {
				if ("number" == typeof plural){
					ret = hash[term][f][plural];
				} else {
					ret = hash[term][f][0];
				}
			}
			break;
		}
	}
	return ret;
}

CSL.Engine.prototype.configureTokenLists = function(){
	//for each (var area in ["citation", "citation_sort", "bibliography","bibliography_sort"]){
	for each (var area in ["citation","citation_sort","bibliography","bibliography_sort"]){
		for (var pos=(this[area].tokens.length-1); pos>-1; pos--){
			var token = this[area].tokens[pos];
			token["next"] = (pos+1);
			//CSL.debug("setting: "+(pos+1)+" ("+token.name+")");
			if (token.name && CSL.Lib.Elements[token.name].configure){
				CSL.Lib.Elements[token.name].configure.call(token,this,pos);
			}
		}
	}
	this.version = CSL.Factory.version;
	return this.state;
};


CSL.Engine.prototype.setLocaleXml = function(arg,lang){

	if ("undefined" == typeof this.locale_terms){
		this.locale_terms = new Object();
	}
	if ("undefined" == typeof this.locale_opt){
		this.locale_opt = new Object();
	}
	if ("undefined" == typeof arg){
		var myxml = new XML( this.sys.getLang("en") );
		lang = "en";
	} else if ("string" == typeof arg){
		var myxml = new XML( this.sys.getLang(arg) );
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
	if (myxml.localName().toString() == "locale"){
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
	for each (var styleopts in locale["style-options"]){
		for each (var attr in styleopts.attributes()) {
			if (attr.toString() == "true"){
				this.opt[attr.localName()] = true;
			} else {
				this.opt[attr.localName()] = false;
			};
		};
	};
	for each (var date in locale.date){
		this.opt.dates[ date["@form"] ] = date;
	};
};

CSL.Engine.prototype.getTextSubField = function(value,locale_type,use_default){
	var lst = value.split(/\s*:([-a-zA-Z]+):\s*/);
	var opt = this.opt[locale_type];
	if (opt && lst.indexOf(opt) > -1 && lst.indexOf(opt) % 2){
		value = lst[(lst.indexOf(opt)+1)];
	} else if (use_default){
		value = lst[0];
	} else {
		value = undefined;
	};
	return value;
};

CSL.Engine.prototype.getNameSubFields = function(names){
	var pos = -1;
	var ret = new Array();
	var mode = "locale-name";
	if (this.tmp.area.slice(-5) == "_sort"){
		mode = "locale-sort";
	}
	for (var name in names){
		//
		// clone the name object so we can trample on the content.
		//
		var newname = new Object();
		for (var i in names[name]){
			newname[i] = names[name][i];
		}
		var addme = true;
		var updateme = false;
		for each (var part in ["literal", "family"]){
			var p = newname[part];
			if (p){
				//
				// Add a sticky toggle for non-roman, non-Cyrillic
				// names.
				//
				if (!newname[part].match(/^[&a-zA-Z\u0400-\u052f].*/)){
					newname["sticky"] = true;
				}
				var m = p.match(/^:([-a-zA-Z]+):\s+(.*)/);
				if (m){
					addme = false;
					if (m[1] == this.opt[mode]){
						updateme = true;
						newname[part] = m[2];
					} else if (this.opt.lang){
						//
						// Fallback to style default language.
						//
						if (this.opt.lang.indexOf("-") > -1) {
							var newopt = this.opt.lang.slice(0,this.opt.lang.indexOf("-"));
						} else {
							var newopt = this.opt.lang;
						}
						if (m[1] == newopt){
							updateme = true;
							newname[part] = m[2];
							if (newname[part].match(/^[&a-zA-Z\u0400-\u052f].*/)){
								newname["sticky"] = false;
							};
						};
					};
				};
			};
		};
		if (addme){
			ret.push(newname);
			pos += 1;
		} else if (updateme){
			//
			// A true update rather than an overwrite
			// of the pointer.
			//
			for (var i in newname){
				ret[pos][i] = newname[i];
			}
		}
	};
	return ret;
};
