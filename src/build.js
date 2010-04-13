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

CSL.Engine = function (sys, style, lang, xmlmode) {
	var attrs, langspec, localexml, locale;
	this.sys = sys;
	if (xmlmode) {
		this.sys.xml = new CSL.System.Xml[xmlmode]();
	} else {
		this.sys.xml = new CSL.System.Xml.E4X();
	}
	if ("string" !== typeof style) {
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

	//this.render = new CSL.Render(this);
	//
	// This latter queue is used for formatting date chunks
	// before they are folded back into the main queue.
	//
	this.dateput = new CSL.Output.Queue(this);

	this.cslXml = this.sys.xml.makeXml(style);
	this.sys.xml.addInstitutionNodes(this.cslXml);
	//
	// Note for posterity: tried manipulating the XML here to insert
	// a list of the upcoming date-part names.  The object is apparently
	// read-only.  Don't know why, can't find any reference to this
	// problem on the Net (other than casual mentions that it works,
	// which it doesn't, at least in Rhino).  Turning to add this info
	// in the compile phase, in the flattened version of the style,
	// which should be simpler anyway.
	//
	attrs = this.sys.xml.attributes(this.cslXml);
	if ("undefined" === typeof attrs["@sort-separator"]) {
		this.sys.xml.setAttribute(this.cslXml, "sort-separator", ", ");
	}
	if ("undefined" === typeof attrs["@name-delimiter"]) {
		this.sys.xml.setAttribute(this.cslXml, "name-delimiter", ", ");
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

	CSL.Util.Names.initNameSlices(this);

	this.opt.xclass = sys.xml.getAttributeValue(this.cslXml, "class");

	lang = this.opt["default-locale"][0];
	langspec = CSL.localeResolve(lang);
	this.opt.lang = langspec.best;
	if (!CSL.locale[langspec.best]) {
		localexml = sys.xml.makeXml(sys.retrieveLocale(langspec.best));
		CSL.localeSet.call(CSL, sys, localexml, langspec.best, langspec.best);
	}
	this.locale = {};
	locale = sys.xml.makeXml();
	if (!this.locale[langspec.best]) {
		CSL.localeSet.call(this, sys, this.cslXml, "", langspec.best);
		CSL.localeSet.call(this, sys, this.cslXml, langspec.bare, langspec.best);
		CSL.localeSet.call(this, sys, this.cslXml, langspec.best, langspec.best);
	}

	this.buildTokenLists("citation");
	this.buildTokenLists("bibliography");
	this.configureTokenLists();

	this.registry = new CSL.Registry(this);

	this.splice_delimiter = false;

	//
	// date parser
	//
	this.fun.dateparser = new CSL.dateParser();
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

CSL.Engine.prototype.setCloseQuotesArray = function () {
	var ret;
	ret = [];
	ret.push(this.getTerm("close-quote"));
	ret.push(this.getTerm("close-inner-quote"));
	ret.push('"');
	ret.push("'");
	this.opt.close_quotes_array = ret;
};

CSL.Engine.prototype.buildTokenLists = function (area) {
	var area_nodes, navi;
	area_nodes = this.sys.xml.getNodesByName(this.cslXml, area);
	if (!this.sys.xml.getNodeValue(area_nodes)) {
		return;
	}
	navi = new this.getNavi(this, area_nodes);
	this.build.area = area;
	CSL.buildStyle.call(this, navi);
};

CSL.Engine.prototype.setStyleAttributes = function () {
	var dummy, attr, key, attributes, attrname;
	dummy = {};
	dummy.name = this.sys.xml.nodename(this.cslXml);
	//
	// Xml: more of it
	//
	attributes = this.sys.xml.attributes(this.cslXml);
	for (attrname in attributes) {
		if (attributes.hasOwnProperty(attrname)) {
			// attr = attributes[key];
			CSL.Attributes[attrname].call(dummy, this, attributes[attrname]);
		}
	}
};

CSL.buildStyle  = function (navi) {
	if (navi.getkids()) {
		CSL.buildStyle.call(this, navi);
	} else {
		if (navi.getbro()) {
			CSL.buildStyle.call(this, navi);
		} else {
			while (navi.nodeList.length > 1) {
				if (navi.remember()) {
					CSL.buildStyle.call(this, navi);
				}
			}
		}
	}
};


CSL.Engine.prototype.getNavi = function (state, myxml) {
	this.sys = state.sys;
	this.state = state;
	this.nodeList = [];
	this.nodeList.push([0, myxml]);
	this.depth = 0;
};


CSL.Engine.prototype.getNavi.prototype.remember = function () {
	var node;
	this.depth += -1;
	this.nodeList.pop();
	// closing node, process result of children
	node = this.nodeList[this.depth][1][(this.nodeList[this.depth][0])];
	CSL.XmlToToken.call(node, this.state, CSL.END);
	return this.getbro();
};


CSL.Engine.prototype.getNavi.prototype.getbro = function () {
	var sneakpeek;
	sneakpeek = this.nodeList[this.depth][1][(this.nodeList[this.depth][0] + 1)];
	if (sneakpeek) {
		this.nodeList[this.depth][0] += 1;
		return true;
	} else {
		return false;
	}
};


CSL.Engine.prototype.getNavi.prototype.getkids = function () {
	var currnode, sneakpeek, pos, node;
	currnode = this.nodeList[this.depth][1][this.nodeList[this.depth][0]];
	sneakpeek = this.sys.xml.children(currnode);
	//var sneakpeek = currnode.children();
	if (this.sys.xml.numberofnodes(sneakpeek) === 0) {
		// singleton, process immediately
		CSL.XmlToToken.call(currnode, this.state, CSL.SINGLETON);
		return false;
	} else {
		// if there are children, check for date nodes and
		// convert if appropriate
		for (pos in sneakpeek) {
			if ("xml" === typeof sneakpeek[pos]) {
				node = sneakpeek[pos];
				if ("date" === this.sys.xml.nodename(node)) {
					currnode = CSL.Util.fixDateNode.call(this, currnode, pos, node);
					sneakpeek = this.sys.xml.children(currnode);
				}
			}
		}
		//
		// if first node of a span, process it, then descend
		CSL.XmlToToken.call(currnode, this.state, CSL.START);
		this.depth += 1;
		this.nodeList.push([0, sneakpeek]);
		return true;
	}
};


CSL.Engine.prototype.getNavi.prototype.getNodeListValue = function () {
	return this.nodeList[this.depth][1];
};

CSL.Engine.prototype.setOutputFormat = function (mode) {
	this.opt.mode = mode;
	this.fun.decorate = CSL.Mode(mode);
	if (!this.output[mode]) {
		this.output[mode] = {};
		this.output[mode].tmp = {};
	}
	// Disabled.  See formats.js for code.
	// this.fun.decorate.format_init(this.output[mode].tmp);
};

CSL.Engine.prototype.getTerm = function (term, form, plural) {
	var ret = CSL.Engine.getField(CSL.LOOSE, this.locale[this.opt.lang].terms, term, form, plural);
	if (typeof ret === "undefined") {
		ret = CSL.Engine.getField(CSL.STRICT, CSL.locale[this.opt.lang].terms, term, form, plural);
	}
	return ret;
};

CSL.Engine.prototype.getDate = function (form) {
	if (this.locale[this.opt.lang].dates[form]) {
		return this.locale[this.opt.lang].dates[form];
	} else {
		return CSL.locale[this.opt.lang].dates[form];
	}
};

CSL.Engine.prototype.getOpt = function (arg) {
	if ("undefined" !== typeof this.locale[this.opt.lang].opts[arg]) {
		return this.locale[this.opt.lang].opts[arg];
	} else {
		return CSL.locale[this.opt.lang].opts[arg];
	}
};



CSL.Engine.prototype.getVariable = function (Item, varname, form, plural) {
	return CSL.Engine.getField(CSL.LOOSE, Item, varname, form, plural);
};

CSL.Engine.prototype.getDateNum = function (ItemField, partname) {
	if ("undefined" === typeof ItemField) {
		return 0;
	} else {
		return ItemField[partname];
	}
};

CSL.Engine.getField = function (mode, hash, term, form, plural) {
	var ret, forms, f, pos, len;
	ret = "";
	if (!hash[term]) {
		if (mode === CSL.STRICT) {
			throw "Error in getField: term\"" + term + "\" does not exist.";
		} else {
			return undefined;
		}
	}
	forms = [];
	if (form === "symbol") {
		forms = ["symbol", "short"];
	} else if (form === "verb-short") {
		forms = ["verb-short", "verb"];
	} else if (form !== "long") {
		forms = [form];
	}
	forms = forms.concat(["long"]);
	len = forms.length;
	for (pos = 0; pos < len; pos += 1) {
		f = forms[pos];
		if ("string" === typeof hash[term] || "number" === typeof hash[term]) {
			ret = hash[term];
		} else if ("undefined" !== typeof hash[term][f]) {
			if ("string" === typeof hash[term][f] || "number" === typeof hash[term][f]) {
				ret = hash[term][f];
			} else {
				if ("number" === typeof plural) {
					ret = hash[term][f][plural];
				} else {
					ret = hash[term][f][0];
				}
			}
			break;
		}
	}
	return ret;
};

CSL.Engine.prototype.configureTokenLists = function () {
	var dateparts_master, area, pos, token, dateparts, part, ppos, pppos, len, llen, lllen;
	//for each (var area in ["citation", "citation_sort", "bibliography","bibliography_sort"]) {
	dateparts_master = ["year", "month", "day"];
	len = CSL.AREAS.length;
	for (pos = 0; pos < len; pos += 1) {
		area = CSL.AREAS[pos];
		llen = this[area].tokens.length - 1;
		for (ppos = llen; ppos > -1; ppos += -1) {
			token = this[area].tokens[ppos];
			if ("date" === token.name && CSL.END === token.tokentype) {
				dateparts = [];
			}
			if ("date-part" === token.name && token.strings.name) {
				lllen = dateparts_master.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					part = dateparts_master[pppos];
					if (part === token.strings.name) {
						dateparts.push(token.strings.name);
					}
				}
			}
			if ("date" === token.name && CSL.START === token.tokentype) {
				dateparts.reverse();
				token.dateparts = dateparts;
			}
			token.next = (ppos + 1);
			//CSL.debug("setting: "+(pos+1)+" ("+token.name+")");
			if (token.name && CSL.Node[token.name].configure) {
				CSL.Node[token.name].configure.call(token, this, ppos);
			}
		}
	}
	this.version = CSL.version;
	return this.state;
};

CSL.Engine.prototype.setAbbreviations = function (name) {
	var vartype, pos, len;
	if (name) {
		this.abbrev.abbreviations = name;
	}
	len = CSL.ABBREVIATE_FIELDS.length;
	for (pos = 0; pos < len; pos += 1) {
		vartype = CSL.ABBREVIATE_FIELDS[pos];
		this.abbrev[vartype] = this.sys.getAbbreviations(this.abbrev.abbreviations, vartype);
	}
};

CSL.Engine.prototype.getTextSubField = function (value, locale_type, use_default) {
	var lst, opt, o, pos, key, ret;
	if (!value) {
		return "";
	}
	ret = "";
	lst = value.split(/\s*:([\-a-zA-Z0-9]+):\s*/);
	opt = this.opt[locale_type];
	for (key in opt) {
		if (opt.hasOwnProperty(key)) {
			o = opt[key];
			if (o && lst.indexOf(o) > -1 && lst.indexOf(o) % 2) {
				ret = lst[(lst.indexOf(o) + 1)];
				break;
			}
		}
	}
	if (!ret && use_default) {
		ret = lst[0];
	}
	return ret;
};

CSL.Engine.prototype.getNameSubFields = function (names) {
	var pos, ppos, pppos, count, ret, mode, use_static_ordering, name, newname, addme, updateme, part, o, p, m, newopt, len, llen, lllen, i, key, str, lang;
	count = -1;
	ret = [];
	mode = "locale-name";
	use_static_ordering = false;
	if (this.tmp.area.slice(-5) === "_sort") {
		mode = "locale-sort";
	}
	len = names.length;
	for (pos = 0; pos < len; pos += 1) {
		//
		// clone the name object so we can trample on the content.
		//
		newname = {};
		for (key in names[pos]) {
			if (names[pos].hasOwnProperty(key)) {
				newname[key] = names[pos][key];
			}
		}
		if (newname.given && !newname.family) {
			newname.family = "";
		} else if (newname.family && ! newname.given) {
			newname.given = "";
		}
		addme = true;
		updateme = false;
		llen = CSL.MINIMAL_NAME_FIELDS;
		for (ppos = 0; ppos < len; ppos += 1) {
			part = CSL.MINIMAL_NAME_FIELDS[ppos];
			p = newname[part];
			if (p) {
				//
				// Add a static-ordering toggle for non-roman, non-Cyrillic
				// names.  Operate only on primary names (those that do not
				// have a language subtag).
				//
				if (newname[part].length && newname[part][0] !== ":") {
					if (newname["static-ordering"]) {
						use_static_ordering = true;
					} else if (!newname[part].match(CSL.ROMANESQUE_REGEXP)) {
						use_static_ordering = true;
					} else {
						use_static_ordering = false;
					}
				}
				newname["static-ordering"] = use_static_ordering;
				m = p.match(/^(:[\-a-zA-Z0-9]+:\s+)/);
				if (m) {
					str = p.slice(m[1].length);
					lang = m[1].slice(1).replace(/:\s+$/, "");
					addme = false;
					lllen = this.opt[mode].length;
					for (pppos = 0; pppos < len; pppos += 1) {
						o = this.opt[mode][pppos];
						if (lang === o) {
							updateme = true;
							newname[part] = str;
							break;
						}
					}
					if (!updateme) {
						if (this.opt.lang) {
							//
							// Fallback to style default language.
							//
							if (this.opt.lang.indexOf("-") > -1) {
								newopt = this.opt.lang.slice(0, this.opt.lang.indexOf("-"));
							} else {
								newopt = this.opt.lang;
							}
							if (lang === newopt) {
								updateme = true;
								newname[part] = str;
								if (newname[part].match(CSL.ROMANESQUE_REGEXP)) {
									newname["static-ordering"] = false;
								}
							}
						}
					}
				}
			}
		}
		if (addme) {
			ret.push(newname);
			count += 1;
		} else if (updateme) {
			//
			// A true update rather than an overwrite
			// of the pointer.
			//
			for (key in newname) {
				if (newname.hasOwnProperty(key)) {
					ret[count][key] = newname[key];
				}
			}
		}
	}
	return ret;
};


CSL.Engine.prototype.retrieveItems = function (ids) {
	var ret, pos, len;
	ret = [];
	len = ids.length;
	for (pos = 0; pos < len; pos += 1) {
		ret.push(this.sys.retrieveItem(ids[pos]));
	}
	return ret;
};

CSL.Engine.prototype.dateParseArray = function (date_obj) {
	var ret, field, dpos, ppos, dp, exts, llen, pos, len, pppos, lllen;
	ret = {};
	for (field in date_obj) {
		if (field === "date-parts") {
			dp = date_obj["date-parts"];
			if (dp.length > 1) {
				if (dp[0].length !== dp[1].length) {
					CSL.error("CSL data error: element mismatch in date range input.");
				}
			}
			exts = ["", "_end"];
			llen = dp.length;
			for (ppos = 0; ppos < llen; ppos += 1) {
				lllen = CSL.DATE_PARTS.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					ret[(CSL.DATE_PARTS[pppos] + exts[ppos])] = dp[ppos][pppos];
				}
			}
		} else if (date_obj.hasOwnProperty(field)) {
			ret[field] = date_obj[field];
		}
	}
	return ret;
};

CSL.Engine.prototype.parseNumericDate = function (ret, delim, suff, txt) {
	var lst, pos, len;
	lst = txt.split(delim);
	len = lst.length;
	for (pos = 0; pos < len; pos += 1) {
		if (lst[pos].length === 4) {
			ret[("year" + suff)] = lst[pos].replace(/^0*/, "");
			if (!pos) {
				lst = lst.slice(1);
			} else {
				lst = lst.slice(0, pos);
			}
			break;
		}
	}
	// comment
	len = lst.length;
	for (pos = 0; pos < len; pos += 1) {
		lst[pos] = parseInt(lst[pos], 10);
	}
	//
	// month and day parse
	//
	if (lst.length === 1) {
		ret[("month" + suff)] = "" + lst[0];
	} else if (lst.length === 2) {
		if (lst[0] > 12) {
			ret[("month" + suff)] = "" + lst[1];
			ret[("day" + suff)] = "" + lst[0];
		} else {
			ret[("month" + suff)] = "" + lst[0];
			ret[("day" + suff)] = "" + lst[1];
		}
	}
};


CSL.Engine.prototype.setOpt = function (token, name, value) {
	if (token.name === "style") {
		this.opt[name] = value;
	} else if (["citation", "bibliography"].indexOf(token.name) > -1) {
		this[token.name].opt[name] = value;
	} else if (["name-form", "name-delimiter", "names-delimiter"].indexOf(name) === -1) {
		token.strings[name] = value;
	}
};

CSL.Engine.prototype.fixOpt = function (token, name, localname) {
	if ("citation" === token.name || "bibliography" === token.name) {
		if (! this[token.name].opt[name] && "undefined" !== this.opt[name]) {
			this[token.name].opt[name] = this.opt[name];
		}
	}
	if ("name" === token.name || "names" === token.name) {
		if (! token.strings[localname] && "undefined" !== typeof this[this.build.area].opt[name]) {
			token.strings[localname] = this[this.build.area].opt[name];
		}
	}
};


CSL.Engine.prototype.parseName = function (name) {
	var m, idx;
	if (! name["non-dropping-particle"]) {
		m = name.family.match(/^([ a-z]+\s+)/);
		if (m) {
			name.family = name.family.slice(m[1].length);
			name["non-dropping-particle"] = m[1].replace(/\s+$/, "");

		}
	}
	if (! name.suffix) {
		m = name.given.match(/(\s*,!*\s*)/);
		if (m) {
			idx = name.given.indexOf(m[1]);
			name.suffix = name.given.slice(idx + m[1].length);
			name.given = name.given.slice(0, idx);
			if (name.suffix.match(/[a-z]/)) {
				name.comma_suffix = true;
			}
		}
	}
	if (! name["dropping-particle"]) {
		m = name.given.match(/^(\s+[ a-z]*[a-z])$/);
		if (m) {
			name.given = name.given.slice(0, m[1].length * -1);
			name["dropping-particle"] = m[2].replace(/^\s+/, "");
		}
	}
};

