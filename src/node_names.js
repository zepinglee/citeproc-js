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

CSL.Node.names = {
	build: function (state, target) {
		var debug, func, len, pos, attrname;
		debug = false;
		// CSL.debug = print;
		
		var debug = false;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			CSL.Util.substituteStart.call(this, state, target);
			state.build.substitute_level.push(1);
			
			state.fixOpt(this, "names-delimiter", "delimiter");

			// init names
			func = function (state, Item, item) {
				state.parallel.StartVariable("names");
				state.nameOutput.init(this);
			};
			this.execs.push(func);
		}
		
		if (this.tokentype === CSL.START) {
			// init can substitute
			func = function (state, Item) {
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(func);
		};
		
		if (this.tokentype === CSL.END) {

			for (var i = 0, ilen = 3; i < ilen; i += 1) {
				var key = ["family", "given", "et-al"][i];
				this[key] = state.build[key];
				state.build[key] = undefined;
			}
			// Et al. and with terms
			if (this["et-al"] && "string" === typeof this["et-al"].term) {
				var myetal = state.getTerm(this.strings["et-al"]);
				if (!myetal) {
					myetal = this.strings["et-al"]
				}
			} else {
				var myetal = state.getTerm("et-al", "long", 0);
			}
			if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(myetal)) {
				var etal_default_prefix = " ";
				var etal_suffix = " ";
			} else {
				var etal_default_prefix = "";
				var etal_suffix = "";
			}
			print("Setting et-al on names END");
			this["et-al"] = {};
			this["et-al"].single = new CSL.Blob("empty", myetal);
			this["et-al"].single.strings.suffix = etal_suffix;
			this["et-al"].multiple = new CSL.Blob("empty", myetal);
			this["et-al"].multiple.strings.suffix = etal_suffix;
			if (this.strings["delimiter-precedes-et-al"] === "always") {
				this["et-al"].single.strings.prefix = this.strings.delimiter;
				this["et-al"].multiple.strings.prefix = this.strings.delimiter;
			} else if (this.strings["delimiter-precedes-et-al"] === "contextual") {
				this["et-al"].single.strings.prefix = etal_default_prefix;
				this["et-al"].multiple.strings.prefix = this.strings.delimiter;
			} else {
				this["et-al"].single.strings.prefix = etal_default_prefix;
				this["et-al"].multiple.strings.prefix = etal_default_prefix;
			}

			var mywith = "with";
			if (CSL.STARTSWITH_ROMANESQUE_REGEXP.test(mywith)) {
				var with_default_prefix = " ";
				var with_suffix = " ";
			} else {
				var with_default_prefix = "";
				var with_suffix = "";
			}
			this["with"] = {};
			this["with"].single = new CSL.Blob("empty", mywith);
			this["with"].single.strings.suffix = with_suffix;
			this["with"].multiple = new CSL.Blob("empty", mywith);
			this["with"].multiple.strings.suffix = with_suffix;
			if (this.strings["delimiter-precedes-last"] === "always") {
				this["with"].single.strings.prefix = this.strings.delimiter;
				this["with"].multiple.strings.prefix = this.strings.delimiter;
			} else if (this.strings["delimiter-precedes-last"] === "contextual") {
				this["with"].single.strings.prefix = with_default_prefix;
				this["with"].multiple.strings.prefix = this.strings.delimiter;
			} else {
				this["with"].single.strings.prefix = with_default_prefix;
				this["with"].multiple.strings.prefix = with_default_prefix;
			}

			// "and" and "ellipsis" are set in node_name.js

			func = function (state, Item, item) {
				print("ALRIGHT: "+this["et-al"].multiple.blobs);
				state.nameOutput["et-al"] = this["et-al"];
				print("this et-al: "+this["et-al"]);
				state.nameOutput["with"] = this["with"];
				state.nameOutput.outputNames();
			};
			this.execs.push(func);

			// unsets
			func = function (state, Item) {
				if (!state.tmp.can_substitute.pop()) {
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				
				state.parallel.CloseVariable("names");

				state.tmp.can_block_substitute = false;
			};
			this.execs.push(func);
		}
		target.push(this);

		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			state.build.substitute_level.pop();
			CSL.Util.substituteEnd.call(this, state, target);
		}
	}
};
