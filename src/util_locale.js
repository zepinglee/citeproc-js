/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights
 * Reserved.
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
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
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
	var blob, locale, nodes, attributes, pos, ppos, term, form, termname, styleopts, attr, date, attrname, len;

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
		nodes = sys.xml.getNodesByName(myxml, "locale");
		for (pos = 0, len = sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
			if (true) {
				blob = nodes[pos];
				//
				// Xml: get locale xml:lang
				//
				if (sys.xml.getAttributeValue(blob, 'lang', 'xml') === lang_in) {
					locale = blob;
					break;
				}
			}
		}
	}
	//
	// Xml: get a list of term nodes within locale
	//
	nodes = sys.xml.getNodesByName(locale, 'term');
	for (pos = 0, len = sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
		if (true) {
			term = nodes[pos];
			//
			// Xml: get string value of attribute
			//
			termname = sys.xml.getAttributeValue(term, 'name');
			if ("undefined" === typeof this.locale[lang_out].terms[termname]) {
				this.locale[lang_out].terms[termname] = {};
			}
			form = "long";
			//
			// Xml: get string value of attribute
			//
			if (sys.xml.getAttributeValue(term, 'form')) {
				form = sys.xml.getAttributeValue(term, 'form');
			}
			//
			// Xml: test of existence of node
			//
			if (sys.xml.numberofnodes(sys.xml.getNodesByName(term, 'multiple'))) {
				this.locale[lang_out].terms[termname][form] = [];
				//
				// Xml: get string value of attribute, plus
				// Xml: get string value of node content
				//
				this.locale[lang_out].terms[sys.xml.getAttributeValue(term, 'name')][form][0] = sys.xml.getNodeValue(term, 'single');
				//
				// Xml: get string value of attribute, plus
				// Xml: get string value of node content
				//
				this.locale[lang_out].terms[sys.xml.getAttributeValue(term, 'name')][form][1] = sys.xml.getNodeValue(term, 'multiple');
			} else {
				//
				// Xml: get string value of attribute, plus
				// Xml: get string value of node content
				//
				this.locale[lang_out].terms[sys.xml.getAttributeValue(term, 'name')][form] = sys.xml.getNodeValue(term);
			}
		}
	}
	//
	// Xml: get list of nodes by node type
	//
	nodes = sys.xml.getNodesByName(locale, 'style-options');
	for (pos = 0, len = sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
		if (true) {
			styleopts = nodes[pos];
			//
			// Xml: get list of attributes on a node
			//
			attributes = sys.xml.attributes(styleopts);
			for (attrname in attributes) {
				if (attributes.hasOwnProperty(attrname)) {
					if (attributes[attrname] === "true") {
						// trim off leading @
						this.locale[lang_out].opts[attrname.slice(1)] = true;
					} else {
						// trim off leading @
						this.locale[lang_out].opts[attrname.slice(1)] = false;
					}
				}
			}
		}
	}
	//
	// Xml: get list of nodes by type
	//
	nodes = sys.xml.getNodesByName(locale, 'date');
	for (pos = 0, len = sys.xml.numberofnodes(nodes); pos < len; pos += 1) {
		if (true) {
			date = nodes[pos];
			//
			// Xml: get string value of attribute
			//
			this.locale[lang_out].dates[sys.xml.getAttributeValue(date, "form")] = date;
		}
	}
};

