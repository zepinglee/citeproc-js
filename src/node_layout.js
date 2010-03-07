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

CSL.Node.layout = {
	build: function (state, target) {
		var func, prefix_token, suffix_token;
		if (this.tokentype === CSL.START) {
			state.build.layout_flag = true;
			//
			// save out decorations for flipflop processing
			//
			state[state.tmp.area].opt.topdecor = [this.decorations];
			state[(state.tmp.area + "_sort")].opt.topdecor = [this.decorations];
			//
			// done_vars is used to prevent the repeated
			// rendering of variables
			//
			// initalize done vars
			func = function (state, Item) {
				state.tmp.done_vars = [];
				//CSL.debug(" === init rendered_name === ");
				state.tmp.rendered_name = false;
			};
			this.execs.push(func);

			// set opt delimiter
			func = function (state, Item) {
				// just in case
				state.tmp.sort_key_flag = false;
				state[state.tmp.area].opt.delimiter = "";
				if (this.strings.delimiter) {
					state[state.tmp.area].opt.delimiter = this.strings.delimiter;
				}
			};
			this.execs.push(func);

			// reset nameset counter
			func = function (state, Item) {
				state.tmp.nameset_counter = 0;
			};
			this.execs.push(func);

			state[state.build.area].opt.layout_prefix = this.strings.prefix;
			state[state.build.area].opt.layout_suffix = this.strings.suffix;
			state[state.build.area].opt.layout_delimiter = this.strings.delimiter;
			state[state.build.area].opt.layout_decorations = this.decorations;

			// declare thyself
			func = function (state, Item) {
				state.tmp.term_predecessor = false;
				state.output.openLevel("empty");
			};
			this.execs.push(func);
			target.push(this);
			if (state.build.area === "citation") {
				prefix_token = new CSL.Token("text", CSL.SINGLETON);
				func = function (state, Item, item) {
					var sp;
					if (item && item.prefix) {
						sp = "";
						if (item.prefix.match(CSL.ROMANESQUE_REGEXP)) {
							sp = " ";
						}
						state.output.append((item.prefix + sp), this);
					}
				};
				prefix_token.execs.push(func);
				target.push(prefix_token);
			}
		}
		if (this.tokentype === CSL.END) {
			state.build.layout_flag = false;
			if (state.build.area === "citation") {
				suffix_token = new CSL.Token("text", CSL.SINGLETON);
				func = function (state, Item, item) {
					var sp;
					if (item && item.suffix) {
						sp = "";
						if (item.suffix.match(CSL.ROMANESQUE_REGEXP)) {
							sp = " ";
						}
						state.output.append((sp + item.suffix), this);
					}
				};
				suffix_token.execs.push(func);
				target.push(suffix_token);
			}
			// mergeoutput
			func = function (state, Item) {
				if (state.tmp.area === "bibliography") {
					if (state.bibliography.opt["second-field-align"]) {
						// closes bib_other
						state.output.endTag();
					}
				}
				state.output.closeLevel();
			};
			this.execs.push(func);
			target.push(this);
		}
	}
};
