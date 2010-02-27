/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 */

CSL.Engine = function(sys,style,lang) {
	this.sys = sys;
	this.sys.xml = new CSL.System.Xml.E4X();
	if ("string" != typeof style){
		style = "";
	}
	this.parallel = new CSL.Parallel(this);
	//this.parallel.use_parallels = true;

	this.abbrev = new CSL.Abbrev();

	this.opt = new CSL.Engine.Opt();
	this.tmp = new CSL.Engine.Tmp();
	this.build = new CSL.Engine.Build();
	this.fun = new CSL.Engine.Fun();
	this.configure = new CSL.Engine.Configure();
	this.citation_sort = new CSL.Engine.CitationSort();
	this.bibliography_sort = new CSL.Engine.BibliographySort();
	this.citation = new CSL.Engine.Citation(this);
	this.bibliography = new CSL.Engine.Bibliography();

	this.output = new CSL.Output.Queue(this);
	//
	// This latter queue is used for formatting date chunks
	// before they are folded back into the main queue.
	//
	this.dateput = new CSL.Output.Queue(this);

	this.cslXml = this.sys.xml.makeXml(style);
	//
	// Note for posterity: tried manipulating the XML here to insert
	// a list of the upcoming date-part names.  The object is apparently
	// read-only.  Don't know why, can't find any reference to this
	// problem on the Net (other than casual mentions that it works,
	// which it doesn't, at least in Rhino).  Turning to add this info
	// in the compile phase, in the flattened version of the style,
	// which should be simpler anyway.
	//
	var attrs = this.sys.xml.attributes(this.cslXml);
	if ("undefined" == typeof attrs["@sort-separator"]){
		this.sys.xml.setAttribute(this.cslXml,"sort-separator",", ");
	}
	if ("undefined" == typeof attrs["@name-delimiter"]){
		this.sys.xml.setAttribute(this.cslXml,"name-delimiter",", ");
	}

	this.opt["initialize-with-hyphen"] = true;

	//
	// implicit default, "en"
	//
	// We need to take this in layered functions.  This function goes
	// once, right here, with the lang argument.  It calls a function
	// that resolves the lang argument into a full two-part language
	// entry.  It calls a function that (1) checks to see if
	// the two-part target language is available on the CSL.locale
	// branch, and (2) if not, sets from ultimate default, then (3) from
	// single-term language (if available), then (4) from two-term language.
	// It does this all twice, once for locale files, then for locales inside
	// the style file.
	//
	// So functions needed are ... ?
	//
	// setLocale(rawLang) [top-level]
	//   localeResolve(rawLang)
	//   [function below is not run for external locales
	//   if two-part lang exists in CSL.locale; it is always
	//   run for in-CSL locale data, if it exists.]
	//   localeSetFromXml(lang,localeHandler)
	//
	// (getHandler arg is a function with two methods, one to
	// get XML from disk file, or from CSL, and another to store
	// locale data on CSL.locale or on state.locale, depending
	// on its source.)
	//
	// (note that getLocale must fail gracefully
	// if no locale of the exact lang in the first
	// arg is available.)
	//
	// (note that this will require that the hard-coded locale
	// be recorded on CSL.locale, and that ephemeral locale
	// overlay data bet recorded on state.locale, and that
	// getTerm implement overlay behavior.)
	//

	this.setStyleAttributes();

	lang = this.opt["default-locale"][0];
	var langspec = CSL.localeResolve(lang);
	this.opt.lang = langspec.best;
	if (!CSL.locale[langspec.best]){
		var localexml = sys.xml.makeXml( sys.retrieveLocale(langspec.best) );
		CSL.localeSet.call(CSL,sys,localexml,langspec.best,langspec.best);
	}
	this.locale = new Object();
	var locale = sys.xml.makeXml();
	if (!this.locale[langspec.best]){
		CSL.localeSet.call(this,sys,this.cslXml,"",langspec.best);
		CSL.localeSet.call(this,sys,this.cslXml,langspec.bare,langspec.best);
		CSL.localeSet.call(this,sys,this.cslXml,langspec.best,langspec.best);
	}

	this._buildTokenLists("citation");
	this._buildTokenLists("bibliography");
	this.configureTokenLists();

	this.registry = new CSL.Registry(this);

	this.splice_delimiter = false;

	//
	// flip-flopper for inline markup
	//
	this.fun.flipflopper = new CSL.Util.FlipFlopper(this);
	//
	// utility functions for quotes
	//
	this.setCloseQuotesArray();
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

CSL.Engine.prototype.setCloseQuotesArray = function(){
	var ret = [];
	ret.push(this.getTerm("close-quote"));
	ret.push(this.getTerm("close-inner-quote"));
	ret.push('"');
	ret.push("'");
	this.opt.close_quotes_array = ret;
};

CSL.Engine.prototype._buildTokenLists = function(area){
	var area_nodes = this.sys.xml.getNodesByName(this.cslXml, area);
	if (!this.sys.xml.getNodeValue( area_nodes)){
		return;
	}
	var navi = new this._getNavi( this, area_nodes );
	this.build.area = area;
	CSL.buildStyle.call(this,navi);
};

CSL.Engine.prototype.setStyleAttributes = function(){
	var dummy = new Object();
	dummy["name"] = this.sys.xml.nodename( this.cslXml );
	//
	// Xml: more of it
	//
	for each (var attr in this.sys.xml.attributes( this.cslXml) ){
		CSL.Attributes[("@"+this.sys.xml.getAttributeName(attr))].call(dummy,this,this.sys.xml.getAttributeValue(attr));
	}
}

CSL.buildStyle  = function(navi){
	if (navi.getkids()){
		CSL.buildStyle.call(this,navi);
	} else {
		if (navi.getbro()){
			CSL.buildStyle.call(this,navi);
		} else {
			while (navi.nodeList.length > 1) {
				if (navi.remember()){
					CSL.buildStyle.call(this,navi);
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
	CSL.XmlToToken.call(node,this.state,CSL.END);
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
		CSL.XmlToToken.call(currnode,this.state,CSL.SINGLETON);
		return false;
	} else {
		// if there are children, check for date nodes and
		// convert if appropriate
		for (var pos in sneakpeek){
			var node = sneakpeek[pos];
			if ("date" == this.sys.xml.nodename(node)){
				//
				// This ugly stuff is needed to work around the broken
				// shards of the Rhino E4X implementation.
				//
				default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
				currnode = CSL.Util.fixDateNode.call(this,currnode,pos,node);
				sneakpeek = this.sys.xml.children(currnode);
			}
		}
		//
		// if first node of a span, process it, then descend
		CSL.XmlToToken.call(currnode,this.state,CSL.START);
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
	this.fun.decorate = CSL.Mode(mode);
	if (!this.output[mode]){
		this.output[mode] = new Object();
		this.output[mode].tmp = new Object();
	};
	// Disabled.  See formats.js for code.
	// this.fun.decorate.format_init(this.output[mode].tmp);
};

CSL.Engine.prototype.getTerm = function(term,form,plural){
	var ret = CSL.Engine._getField(CSL.LOOSE,this.locale[this.opt.lang].terms,term,form,plural);
	if (typeof ret == "undefined"){
		ret = CSL.Engine._getField(CSL.STRICT,CSL.locale[this.opt.lang].terms,term,form,plural);
	};
	return ret;
};

CSL.Engine.prototype.getDate = function(form){
	if (this.locale[this.opt.lang].dates[form]){
		return this.locale[this.opt.lang].dates[form];
	} else {
		return CSL.locale[this.opt.lang].dates[form];
	}
};

CSL.Engine.prototype.getOpt = function(arg){
	if ("undefined" != typeof this.locale[this.opt.lang].opts[arg]){
		return this.locale[this.opt.lang].opts[arg];
	} else {
		return CSL.locale[this.opt.lang].opts[arg];
	}
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
	var dateparts_master = ["year","month","day"];
	for each (var area in ["citation","citation_sort","bibliography","bibliography_sort"]){
		for (var pos=(this[area].tokens.length-1); pos>-1; pos--){
			var token = this[area].tokens[pos];
			if ("date" == token.name && CSL.END == token.tokentype){
				var dateparts = [];
			}
			if ("date-part" == token.name && token.strings.name){
				for each (var part in dateparts_master){
					if (part == token.strings.name){
						dateparts.push(token.strings.name);
					};
				};
			};
			if ("date" == token.name && CSL.START == token.tokentype){
				dateparts.reverse();
				token.dateparts = dateparts;
			}
			token["next"] = (pos+1);
			//CSL.debug("setting: "+(pos+1)+" ("+token.name+")");
			if (token.name && CSL.Node[token.name].configure){
				CSL.Node[token.name].configure.call(token,this,pos);
			}
		}
	}
	this.version = CSL.version;
	return this.state;
};

CSL.Engine.prototype.setAbbreviations = function(name){
	if (name){
		this.abbrev.abbreviations = name;
	};
	for each (var vartype in ["journal","series","institution","authority"]){
		this.abbrev[vartype] = this.sys.getAbbreviations(this.abbrev.abbreviations,vartype);
	};
};

CSL.Engine.prototype.getTextSubField = function(value,locale_type,use_default){
	var lst = value.split(/\s*:([-a-zA-Z]+):\s*/);
	value = undefined;
	var opt = this.opt[locale_type];
	for each (var o in opt){
		if (o && lst.indexOf(o) > -1 && lst.indexOf(o) % 2){
			value = lst[(lst.indexOf(o)+1)];
			break;
		}
	}
	if (!value && use_default){
		value = lst[0];
	}
	return value;
};

CSL.Engine.prototype.getNameSubFields = function(names){
	var pos = -1;
	var ret = new Array();
	var mode = "locale-name";
	var use_static_ordering = false;
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
		if (newname.given && !newname.family){
			newname.family = "";
		} else if (newname.family && ! newname.given){
			newname.given = "";
		}
		var addme = true;
		var updateme = false;
		for each (var part in ["literal", "family"]){
			var p = newname[part];
			if (p){
				//
				// Add a static-ordering toggle for non-roman, non-Cyrillic
				// names.  Operate only on primary names (those that do not
				// have a language subtag).
				//
				if (newname[part].length && newname[part][0] != ":"){
					if (newname["static-ordering"]){
						use_static_ordering = true;
					} else if (!newname[part].match(CSL.ROMANESQUE_REGEXP)){
						use_static_ordering = true;
					} else {
						use_static_ordering = false;
					};
				};
				newname["static-ordering"] = use_static_ordering;
				var m = p.match(/^:([-a-zA-Z]+):\s+(.*)/);
				if (m){
					addme = false;
					for each (var o in this.opt[mode]){
						if (m[1] == o){
							updateme = true;
							newname[part] = m[2];
							break;
						};
					};
					if (!updateme){
						if (this.opt.lang){
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
								if (newname[part].match(CSL.ROMANESQUE_REGEXP)){
									newname["static-ordering"] = false;
								};
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


CSL.Engine.prototype.retrieveItems = function(ids){
	var ret = [];
	for each (var id in ids){
		ret.push(this.sys.retrieveItem(id));
	}
	return ret;
};

CSL.Engine.prototype.dateParseArray = function( date_obj ){
	var ret = new Object();
	for (var field in date_obj){
		if (field == "date-parts"){
			var dp = date_obj["date-parts"];
			if ( dp.length > 1 ){
				if ( dp[0].length != dp[1].length){
					print("CSL data error: element mismatch in date range input.");
				}
			}
			var parts = ["year", "month", "day"];
			var exts = ["","_end"];
			for (var dpos in dp){
				for (var ppos in parts){
					ret[(parts[ppos]+exts[dpos])] = dp[dpos][ppos];
				}
			}
		} else {
			ret[field] = date_obj[field];
		}
	}
	return ret;
}

CSL.Engine.prototype.dateParseRaw = function(txt){

	// XXXXX: With all these constants, this parser should really
	// be a separate, standalone module that is instantiated in
	// its own right during build.  This is nuts.

	//
	// Normalize the format and the year if it's a Japanese date
	//
	var years = {};
	years["\u660E\u6CBB"] = 1867;
	years["\u5927\u6B63"] = 1911;
	years["\u662D\u548C"] = 1925;
	years["\u5E73\u6210"] = 1988;
	var m = txt.match(/(\u6708|\u5E74)/g,"-");
	if (m){
		txt = txt.replace(/\u65E5$/,"");
		txt = txt.replace(/(\u6708|\u5E74)/g,"-");
		txt = txt.replace(/〜/g,"/");

		var lst = txt.split(/(\u5E73\u6210|\u662D\u548C|\u5927\u6B63|\u660E\u6CBB)([0-9]+)/);
		var l = lst.length;
		for	(var pos=1; pos<l; pos+=3){
			lst[(pos+1)] = years[lst[(pos)]] + parseInt(lst[(pos+1)]);
			lst[pos] = "";
		}
		txt = lst.join("");
		txt = txt.replace(/\s*-\s*$/,"").replace(/\s*-\s*\//,"/");
	}

	var yearlast = "(?:[?0-9]{1,2}%%NUMD%%){0,2}[?0-9]{4}(?![0-9])";
	var yearfirst = "[?0-9]{4}(?:%%NUMD%%[?0-9]{1,2}){0,2}(?![0-9])";
	var number = "[?0-9]{1,3}";
	var rangesep = "[%%DATED%%]";
	var fuzzychar = "[?~]";
	var chars = "[a-zA-Z]+";
	var rex = "("+yearfirst+"|"+yearlast+"|"+number+"|"+rangesep+"|"+fuzzychar+"|"+chars+")";
	var rexdash = RegExp( rex.replace(/%%NUMD%%/g,"-").replace(/%%DATED%%/g,"-") );
	var rexdashslash = RegExp( rex.replace(/%%NUMD%%/g,"-").replace(/%%DATED%%/g,"\/") );
	var rexslashdash = RegExp( rex.replace(/%%NUMD%%/g,"\/").replace(/%%DATED%%/g,"-") );
	txt = txt.replace(/\.\s*$/,"");
	txt = txt.replace(/\.(?! )/,"");
	var slash = txt.indexOf("/");
	var dash = txt.indexOf("-");
	var seasonstrs = ["spr","sum","fal","win"];
	var seasonrexes = [];
	for each (var seasonstr in seasonstrs){
		seasonrexes.push( RegExp(seasonstr+".*") );
	}
	var datestrs = "jan feb mar apr may jun jul aug sep oct nov dec";
	datestrs = datestrs.split(" ");
	var daterexes = [];
	for each (var datestr in datestrs){
		daterexes.push( RegExp(datestr+".*") );
	}
	var number = "";
	var note = "";
	var thedate = {};
	if (txt.match(/^".*"$/)){
		thedate["literal"] = txt.slice(1,-1);
		return thedate;
	}
	if (slash > -1 && dash > -1){
		var slashcount = txt.split("/");
		if (slashcount.length > 3){
			var range_delim = "-";
			var date_delim = "/";
			var lst = txt.split( rexslashdash );
		} else {
			var range_delim = "/";
			var date_delim = "-";
			var lst = txt.split( rexdashslash );
		}
	} else {
		txt = txt.replace("/","-");
		var range_delim = "-";
		var date_delim = "-";
		var lst = txt.split( rexdash );
	};
	var ret = [];
	for each (item in lst) {
		var m = item.match(/^\s*([-\/]|[a-zA-Z]+|[-~?0-9]+)\s*$/);
	    if (m) {
			ret.push(m[1]);
		}
	}
	//
	// Phase 2
	//
	var delim_pos = ret.indexOf(range_delim);
	var delims = [];
	var isrange = false;
	if (delim_pos > -1){
		delims.push( [0,delim_pos] );
		delims.push( [(delim_pos+1),ret.length] );
		isrange = true;
	} else {
		delims.push([0,ret.length]);
	}
	//
	// For each side of a range divide ...
	//
	var suff = "";
	for each (delim in delims){
		//
		// Process each element ...
		//
		var date = ret.slice(delim[0],delim[1]);
		for each (element in date){
			//
			// If it's a numeric date, process it.
			//
			if (element.indexOf(date_delim) > -1) {
				this.parseNumericDate(thedate,date_delim,suff,element);
				continue;
			}
			//
			// If it's an obvious year, record it.
			//
			if (element.match(/[0-9]{4}/)){
				thedate["year"+suff] = element.replace(/^0*/,"");
				continue;
			}
			//
			// If it's a month, record it.
			//
			var breakme = false;
			for (pos in daterexes){
				if (element.toLocaleLowerCase().match(daterexes[pos])){
					thedate["month"+suff] = ""+(parseInt(pos,10)+1);
					breakme = true;
					break;
				};
			};
			if (breakme){
				continue;
			}
			//
			// If it's a number, make a note of it
			//
			if (element.match(/^[0-9]+$/)){
				number = parseInt(element,10);
			}

			//
			// If it's a BC or AD marker, make a year of
			// any note.  Separate, reverse the sign of the year
			// if it's BC.
			//
			if (element.toLocaleLowerCase().match(/^bc.*/) && number){
				thedate["year"+suff] = ""+(number*-1);
				number = "";
				continue;
			}
			if (element.toLocaleLowerCase().match(/^ad.*/) && number){
				thedate["year"+suff] = ""+number;
				number = "";
				continue;
			}
			//
			// If it's a season, record it.
			//
			breakme = false;
			for (pos in seasonrexes){
				if (element.toLocaleLowerCase().match(seasonrexes[pos])){
					thedate["season"+suff] = ""+(parseInt(pos,10)+1);
					breakme = true;
					break;
				};
			};
			if (breakme){
				continue;
			}
			//
			// If it's a fuzzy marker, record it.
			//
			if (element == "~" || element == "?" || element == "c" || element.match(/cir.*/)){
				thedate.fuzzy = ""+1;
				continue;
			}
			//
			// If it's cruft, make a note of it
			//
			if (element.toLocaleLowerCase().match(/(?:mic|tri|hil|eas)/) && !thedate["season"+suff]){
				note = element;
				continue;
			}

		}
		//
		// If at the end of the string there's still a note
		// hanging around, make a day of it.
		//
		if (number){
			thedate["day"+suff] = number;
			number = "";
		}
		//
		// If at the end of the string there's cruft lying
		// around, and the season field is empty, put the
		// cruft there.
		//
		if (note && !thedate["season"+suff]){
			thedate["season"+suff] = note;
			note = "";
		}
		suff = "_end";
	}
	//
	// update any missing elements on each side of the divide
	// from the other
	//
	if (isrange){
		for each (var item in ["year", "month", "day", "season"]){
			if (thedate[item] && !thedate[item+"_end"]){
				thedate[item+"_end"] = thedate[item];
			} else if (!thedate[item] && thedate[item+"_end"]){
				thedate[item] = thedate[item+"_end"];
			};
		};
	};
	//
	// If there's no year, it's a failure; pass through the literal
	//
	if (!thedate.year){
		thedate = { "literal": txt };
	}
	return thedate;
};


CSL.Engine.prototype.parseNumericDate = function(ret,delim,suff,txt){
	var lst = txt.split(delim);
	for each (var pos in [0,(lst.length-1)]){
		if (lst.length && lst[pos].length == 4){
			ret["year"+suff] = lst[pos].replace(/^0*/,"");
			if (!pos){
				lst = lst.slice(1);
			} else {
				lst = lst.slice(0,pos);
			}
			break;
		}
	}
	// comment
	for (pos in lst){
		lst[pos] = parseInt(lst[pos],10);
	}
	//
	// month and day parse
	//
	if (lst.length == 1){
		ret["month"+suff] = ""+lst[0];
	} else if (lst.length == 2){
		if (lst[0] > 12){
			ret["month"+suff] = ""+lst[1];
			ret["day"+suff] = ""+lst[0];
		} else {
			ret["month"+suff] = ""+lst[0];
			ret["day"+suff] = ""+lst[1];
		};
	};
};


CSL.Engine.prototype.setOpt = function(token, name, value){
	if ( token.name == "style" ){
		this.opt[name] = value;
	} else if ( ["citation","bibliography"].indexOf(token.name) > -1){
		this[token.name].opt[name] = value;
	} else if (["name-form","name-delimiter","names-delimiter"].indexOf(name) == -1){
		token.strings[name] = value;
	}
}

CSL.Engine.prototype.fixOpt = function(token, name, localname){
	if ("citation" == token.name || "bibliography" == token.name){
		if (! this[token.name].opt[name] && "undefined" != this.opt[name]){
			this[token.name].opt[name] = this.opt[name];
		}
	}
	if ("name" == token.name || "names" == token.name){
		if (! token.strings[localname] && "undefined" != typeof this[this.build.area].opt[name]){
			token.strings[localname] = this[this.build.area].opt[name];
		}
	}
}


CSL.Engine.prototype.parseName = function(name){
	if (! name["non-dropping-particle"]){
		var m = name["family"].match(/^([ a-z]+)\s+(.*)/);
		if (m){
			name["non-dropping-particle"] = m[1];
			name["family"] = m[2];
		}
	}
	if (! name["suffix"]){
		var m = name["given"].match(/(.*)\s*,!*\s*(.*)$/);
		if (m){
			name["given"] = m[1];
			name["suffix"] = m[2];
			if (m[2].match(/.*[a-z].*/)){
				name["comma_suffix"] = true;
			}
		}
	}
	if (! name["dropping-particle"]){
		var m = name["given"].match(/^(.*?)\s+([ a-z]+)$/);
		if (m){
			name["given"] = m[1];
			name["dropping-particle"] = m[2];
		}
	}
}

