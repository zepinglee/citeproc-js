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

CSL.Node.name = {
	build: function (state, target) {
		var func, pos, len, attrname;
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
			//state.fixOpt(this, "names-delimiter", "delimiter");
			state.fixOpt(this, "name-delimiter", "delimiter");
			state.fixOpt(this, "name-form", "form");
			
			state.fixOpt(this, "and", "and");
			state.fixOpt(this, "delimiter-precedes-last", "delimiter-precedes-last");
			state.fixOpt(this, "delimiter-precedes-et-al", "delimiter-precedes-et-al");
			state.fixOpt(this, "initialize-with", "initialize-with");
			state.fixOpt(this, "name-as-sort-order", "name-as-sort-order");
			state.fixOpt(this, "sort-separator", "sort-separator");
			state.fixOpt(this, "and", "and");

			state.fixOpt(this, "et-al-min", "et-al-min");
			state.fixOpt(this, "et-al-use-first", "et-al-use-first");
			state.fixOpt(this, "et-al-use-last", "et-al-use-last");
			state.fixOpt(this, "et-al-subsequent-min", "et-al-subsequent-min");
			state.fixOpt(this, "et-al-subsequent-use-first", "et-al-subsequent-use-first");
			
			// The three terms "et-al", "and" and "ellipsis" are stored
			// as strings here, and styled into blobs within nameOutput().
			// (specifically, in util_names_config.js)
			this.strings.et_al = state.getTerm("et-al", "long", 0);
			// We use the dedicated Unicode ellipsis character because
			// it is recommended by some editors, and can be more easily
			// identified for find and replace operations.
			// Source: http://en.wikipedia.org/wiki/Ellipsis#Computer_representations
			//
			// Eventually, this should be localized as a term in CSL, with some
			// mechanism for triggering appropriate punctuation handling around
			// the ellipsis placeholder (Polish is a particularly tough case for that).
			var myellipsis = "\u2026";
			if ("text" === this.strings["and"]) {
				var myand = state.getTerm("and", "long", 0);
			} else if ("symbol" === this.strings["and"]) {
				var myand = "&";
			}
			if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(myand)) {
				var and_default_prefix = " ";
				var and_suffix = " ";
			} else {
				var and_default_prefix = "";
				var and_suffix = "";
			}
			this["and"] = {};
			this["and"].single = new CSL.Blob(myand, "empty");
			this["and"].single.strings.suffix = and_suffix;
			this["and"].multiple = new CSL.Blob(myand, "empty");
			this["and"].multiple.strings.suffix = and_suffix;
			if (this.strings["delimiter-precedes-last"] === "always") {
				this["and"].single.strings.prefix = this.strings.delimiter;
				this["and"].multiple.strings.prefix = this.strings.delimiter;
			} else if (this.strings["delimiter-precedes-last"] === "contextual") {
				this["and"].single.strings.prefix = and_default_prefix;
				this["and"].multiple.strings.prefix = this.strings.delimiter;
			} else {
				this["and"].single.strings.prefix = and_default_prefix;
				this["and"].multiple.strings.prefix = and_default_prefix;
			}

			this["ellipsis"] = {};
			this["ellipsis"].single = new CSL.Blob(myellipsis, "empty");
			this["ellipsis"].multiple = new CSL.Blob(myellipsis, "empty");
			this["ellipsis"].single.strings.prefix = " ";
			this["ellipsis"].single.strings.suffix = " ";
			this["ellipsis"].multiple.strings.prefix = " ";
			this["ellipsis"].multiple.strings.suffix = " ";

			func = function (state, Item) {
				state.nameOutput.name = this;
			};
			this.execs.push(func);
		}
		target.push(this);
	}
};


