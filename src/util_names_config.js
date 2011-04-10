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

CSL.NameOutput.prototype.getConfigs = function () {
	var item = this.item;
	// ??? from node_names.js
	// (2) Set et al value to true or false
	if ("undefined" === typeof item) {
		item = {};
	}
	this.etal_use_last = this.name.strings["et-al-use-last"];
	if (item.position) {
		if (this.name.strings["et-al-subsequent-min"]) {
			this.etal_min = this.name.strings["et-al-subsequent-min"];
		} else {
			this.etal_min = this.name.strings["et-al-min"];
		}
		if (this.name.strings["et-al-subsequent-use-first"]) {
			this.etal_use_first = this.name.strings["et-al-subsequent-use-first"];
		} else {
			this.etal_use_first = this.name.strings["et-al-use-first"];
		}
	} else {
		this.etal_min = this.name.strings["et-al-min"];
		this.etal_use_first = this.name.strings["et-al-use-first"];
	}
	// Provided for use as the starting level for disambiguation.
	if (!this.state.tmp["et-al-min"]) {
		this.state.tmp["et-al-min"] = this.etal_min;
	}
};

/*
				var namesetcount = 0;

				if (nametok.strings["delimiter-precedes-et-al"] === "always") {
					state.output.getToken("et-al-pers").strings["prefix-single"] = nametok.strings.delimiter;
					state.output.getToken("et-al-pers").strings["prefix-multiple"] = nametok.strings.delimiter;
				} else if (nametok.strings["delimiter-precedes-et-al"] === "never") {
					state.output.getToken("et-al-pers").strings["prefix-single"] = " ";
					state.output.getToken("et-al-pers").strings["prefix-multiple"] = " ";
				} else {
					state.output.getToken("et-al-pers").strings["prefix-single"] = " ";
					state.output.getToken("et-al-pers").strings["prefix-multiple"] = nametok.strings.delimiter;
				}
				et_al_pers = state.getTerm("et-al", "long", 0);
				if ("undefined" !== typeof state.output.getToken("et-al-pers").strings.term) {
					et_al_pers = state.output.getToken("et-al-pers").strings.term;
				}

				// Style token for et-al element with institutional names.
				// The prefix of this element will be overwritten by the -single
				// and -multiple variants on the fly.
				// XXX: Not yet hooked up, institutional et al. untested
				// XXX: needs same handling of delimiter-precedes-et-al as above?
				if (!state.output.getToken("et-al-org")) {
					state.output.addToken("et-al-org");
				}
				state.output.getToken("et-al-org").strings["prefix-single"] = " ";
				state.output.getToken("et-al-org").strings["prefix-multiple"] = ", ";
				et_al_org = state.getTerm("et-al", "long", 0);

				// Style token for and element with personal names.
				// The prefix of this element will be overwritten by the -single
				// and -multiple variants on the fly, if the and attribute
				// is set on cs:name.  Otherwise prefix is set to nil, and
				// and_pers is set to the value of the cs:name delimiter
				// attribute.
				// XXX: Not yet hooked up
				if (!state.output.getToken("and-pers")) {
					state.output.addToken("and-pers");
					// Conditional goes here
				}
				state.output.getToken("and-pers").strings["prefix-single"] = " ";
				state.output.getToken("and-pers").strings["prefix-multiple"] = ", ";
				// Conditional goes here
				and_pers = state.getTerm("and", "long", 0);

				state.output.addToken("with");
				state.output.getToken("with").strings.prefix = ", ";
				state.output.getToken("with").strings.suffix = " ";
				with_term = "with";

				state.output.addToken("trailing-names");

				outer_and_term = " " + state.output.getToken("name").strings.and + " ";
				state.output.addToken("institution-outer", outer_and_term);

				//if ("undefined" === typeof state.output.getToken("etal").strings.et_al_term) {
				//	state.output.getToken("etal").strings.et_al_term = state.getTerm("et-al", "long", 0);
				//}

				if (!state.output.getToken("label")) {
					state.output.addToken("label");
				}

				delim = state.output.getToken("name").strings.delimiter;
				state.output.addToken("inner", delim);

				//
				// Locale term not yet available. (this approach didn't make sense
				// anyway.  with is handled further down below.)
				//
				// if ("undefined" === typeof state.output.getToken("with").strings.with_term){
				// state.output.getToken("with").strings.with_term = state.getTerm("with","long",0);
				// }
				//if ("undefined" === typeof state.output.getToken("with").strings.with_term){
				//	state.output.getToken("with").strings.with_term = "with";
				//}
				state.output.addToken("commasep", ", ");

				len = CSL.DECORABLE_NAME_PARTS.length;
				for (pos = 0; pos < len; pos += 1) {
					namepart = CSL.DECORABLE_NAME_PARTS[pos];
					if (!state.output.getToken(namepart)) {
						state.output.addToken(namepart);
					}
				}
				state.output.addToken("dropping-particle", false, state.output.getToken("family"));
				state.output.addToken("non-dropping-particle", false, state.output.getToken("family"));
				state.output.addToken("suffix", false, state.output.getToken("family"));
				state.output.getToken("suffix").decorations = [];

				// open for term join, for any and all names.
				state.output.openLevel("term-join");

				var set_nameset_delimiter = false;

				len = namesets.length;
				//SNIP-START
				if (debug) {
					CSL.debug("namesets.length[2]: " + namesets.length);
				}
				//SNIP-END
*/
