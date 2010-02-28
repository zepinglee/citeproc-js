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

CSL.localeResolve = function (langstr) {
	var ret, langlst;
	ret = {};
	if ("undefined" === typeof langstr) {
		langstr = "en_US";
	}
	langlst = langstr.split(/[\-_]/);
	ret.base = CSL.LANG_BASES[langlst[0]];
	if (langlst.length === 1 || langlst[1] === "x") {
		ret.best = ret.base.replace("_", "-");
	} else {
		ret.best = langlst.slice(0, 2).join("-");
	}
	ret.bare = langlst[0];
	return ret;
};

//
// XXXXX: Got it.  The locales objects need to be reorganized,
// with a top-level local specifier, and terms, opts, dates
// below.
//
CSL.localeSet = function (sys, myxml, lang_in, lang_out) {
	var blob, locale;

	lang_in = lang_in.replace("_", "-");
	lang_out = lang_out.replace("_", "-");

	if (!this.locale[lang_out]) {
		this.locale[lang_out] = {};
		this.locale[lang_out].terms = {};
		this.locale[lang_out].opts = {};
		this.locale[lang_out].dates = {};
	}
	//
	// Xml: Test if node is "locale" (nb: ns declarations need to be invoked
	// on every access to the xml object; bundle this with the functions
	//
	locale = sys.xml.makeXml();
	if (sys.xml.nodeNameIs(myxml, 'locale')) {
		locale = myxml;
	} else {
		//
		// Xml: get a list of all "locale" nodes
		//
		for each (blob in sys.xml.getNodesByName(myxml, "locale")) {
			//
			// Xml: get locale xml:lang
			//
			if (sys.xml.getAttributeValue(blob,'lang', 'xml') === lang_in) {
				locale = blob;
				break;
			}
		}
	}
	//
	// Xml: get a list of term nodes within locale
	//

	for each (var term in sys.xml.getNodesByName(locale, 'term')) {
		//
		// Xml: get string value of attribute
		//
		var termname = sys.xml.getAttributeValue(term, 'name');
		if ("undefined" === typeof this.locale[lang_out].terms[termname]) {
			this.locale[lang_out].terms[termname] = new Object();
		};
		var form = "long";
		//
		// Xml: get string value of attribute
		//
		if (sys.xml.getAttributeValue(term, 'form')) {
			form = sys.xml.getAttributeValue(term, 'form');
		}
		//
		// Xml: test of existence of node
		//
		if (sys.xml.getNodesByName(term, 'multiple').length()) {
			this.locale[lang_out].terms[termname][form] = new Array();
			//
			// Xml: get string value of attribute, plus
			// Xml: get string value of node content
			//
			this.locale[lang_out].terms[sys.xml.getAttributeValue(term, 'name')][form][0] = sys.xml.getNodeValue(term, 'single');
			//
			// Xml: get string value of attribute, plus
			// Xml: get string value of node content
			//
			this.locale[lang_out].terms[sys.xml.getAttributeValue(term,'name')][form][1] = sys.xml.getNodeValue(term,'multiple');
		} else {
			//
			// Xml: get string value of attribute, plus
			// Xml: get string value of node content
			//
			this.locale[lang_out].terms[sys.xml.getAttributeValue(term, 'name')][form] = sys.xml.getNodeValue(term);
		}
	}
	//
	// Xml: get list of nodes by node type
	//
	for each (var styleopts in sys.xml.getNodesByName(locale, 'style-options')) {
		//
		// Xml: get list of attributes on a node
		//
		for each (var attr in sys.xml.attributes(styleopts) ) {
			//
			// Xml: get string value of attribute
			//
			if (sys.xml.getNodeValue(attr) === "true") {
				//
				// Xml:	get local name of attribute
				//
				this.locale[lang_out].opts[sys.xml.nodename(attr)] = true;
			} else {
				this.locale[lang_out].opts[sys.xml.nodename(attr)] = false;
			};
		};
	};
	//
	// Xml: get list of nodes by type
	//
	for each (var date in sys.xml.getNodesByName(locale,'date')) {
		//
		// Xml: get string value of attribute
		//
		this.locale[lang_out].dates[ sys.xml.getAttributeValue( date, "form") ] = date;
	};
};

