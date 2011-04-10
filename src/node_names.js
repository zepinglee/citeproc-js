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
				state.nameOutput = new CSL.NameOutput(state, Item, item, this.variables);
				state.nameOutput.names = this;
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
			// init names
			func = function (state, Item) {
				state.output.startTag("names", "empty");
				state.tmp.name_node = state.output.current.value();
			};
			this.execs.push(func);
			
			// handle names
			func = function (state, Item, item) {

				// Confusion starts from here ...



				for  (namesetIndex = 0; namesetIndex < len; namesetIndex += 1) {


					nameset = namesets[namesetIndex];
					//
					// configure label if poss
					label = false;
					var labelnode = state.output.getToken("label");
					if (state.output.getToken("label").strings.label_position) {
						if (common_term) {
							termname = common_term;
						} else {
							termname = nameset.variable;
						}
						label = CSL.evaluateLabel(labelnode, state, Item, item, termname, nameset.variable);
					}


					// ZZZZZ Need to include labels, from namesout.js
					if (label && state.output.getToken("label").strings.label_position === CSL.BEFORE) {
						state.output.append(label, "label");
					}

					if (!state.tmp.disambig_request) {
						state.tmp.disambig_settings.givens[state.tmp.nameset_counter] = [];
					}

					display_names = nameset.names.slice();

					if ("pers" === nameset.species) {
						//
						// the names constraint (experimental)
						//
						suppress_min = state.output.getToken("name").strings["suppress-min"];

					} else {
					}
					state.tmp.disambig_settings.names[state.tmp.nameset_counter] = display_names.length;
					local_count += display_names.length;

					state.tmp.names_used.push({names:display_names,etal:et_al});

					if (!state.tmp.suppress_decorations
						&& state.tmp.last_names_used.length === state.tmp.names_used.length
						&& state.tmp.area === "citation") {
						// lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
						lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
						//lastones = state.tmp.last_names_used;
						currentones = state.tmp.names_used[state.tmp.nameset_counter];
						//currentones = state.tmp.names_used;
						compset = [currentones, lastones];
						if (CSL.Util.Names.compareNamesets(lastones,currentones)) {
							state.tmp.same_author_as_previous_cite = true;
						}
					}

					if (!state.tmp.suppress_decorations && (state[state.tmp.area].opt.collapse === "year" || state[state.tmp.area].opt.collapse === "year-suffix" || state[state.tmp.area].opt.collapse === "year-suffix-ranged")) {
						//
						// This is fine, but the naming of the comparison
						// function is confusing.  This is just checking whether the
						// current name is the same as the last name rendered
						// in the last cite, and it works.  Set a toggle if the
						// test fails, so we can avoid further suppression in the
						// cite.
						//

						//if (state.tmp.last_names_used.length === state.tmp.names_used.length) {
						if (state.tmp.same_author_as_previous_cite) {
							continue;
						} else {
							state.tmp.have_collapsed = false;
						}
					} else {
						state.tmp.have_collapsed = false;
					}

					//
					// "name" is the format for the outermost nesting of a nameset
					// "inner" is a format consisting only of a delimiter, used for
					// joining all but the last name in the set together.

					//SNIP-START
					if (debug) {
						CSL.debug("nameset.names.length[1]: " + nameset.names.length);
					}
					//SNIP-END
					// DON'T DO THIS IF NO NAMES IN SUBSEQUENT FORM
					llen = nameset.names.length;
					for (ppos = 0; ppos < llen; ppos += 1) {
						//
						// register the name in the global names disambiguation
						// registry
						state.registry.namereg.addname("" + Item.id, nameset.names[ppos], ppos);
						chk = state.tmp.disambig_settings.givens[state.tmp.nameset_counter];
						if ("undefined" === typeof chk) {
							state.tmp.disambig_settings.givens.push([]);
						}
						chk = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos];
						if ("undefined" === typeof chk) {
							myform = state.output.getToken("name").strings.form;
							myinitials = this.strings["initialize-with"];
							param = state.registry.namereg.evalname("" + Item.id, nameset.names[ppos], ppos, 0, myform, myinitials);
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter].push(param);
						}
						//
						// set the display mode default for givennames if required
						myform = state.output.getToken("name").strings.form;
						myinitials = this.strings["initialize-with"];
						paramx = state.registry.namereg.evalname("" + Item.id, nameset.names[ppos], ppos, 0, myform, myinitials);
						if (state.tmp.sort_key_flag) {
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos] = 2;
							param = 2;
						} else if (state.tmp.disambig_request) {
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							val = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos];
							// This is limited to by-cite disambiguation.
							if (val === 1 && 
								state.opt["givenname-disambiguation-rule"] === "by-cite" && 
								"undefined" === typeof this.strings["initialize-with"]) {
								val = 2;
							}
							param = val;
//							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
							if (state.opt["disambiguate-add-givenname"]) {
								param = state.registry.namereg.evalname("" + Item.id, nameset.names[ppos], ppos, param, state.output.getToken("name").strings.form, this.strings["initialize-with"]);
							}
						} else {
							//
							// it clicks.  here is where we will put the
							// call to the names register, to get the floor value
							// for an individual name.
							//
							param = paramx;
						}
						// Need to save off the settings based on subsequent
						// form, when first cites are rendered.  Otherwise you
						// get full form names everywhere.
						if (!state.tmp.just_looking && item && item.position === CSL.POSITION_FIRST) {
							param = paramx;
						}
						if (!state.tmp.sort_key_flag) {
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos] = param;
						}
					}

					// lookahead
					if (namesets.length === namesetIndex + 1 || namesets[namesetIndex + 1].variable !== namesets[namesetIndex].variable) {
						if (label && state.output.getToken("label").strings.label_position !== CSL.BEFORE) {
							state.output.append(label, "label");
						}
					}

					state.tmp.nameset_counter += 1;

					set_nameset_delimiter = false;
					if (last_variable && last_variable === nameset.variable) {
						set_nameset_delimiter = true;
					}
					last_variable = nameset.variable;
				}

				state.output.closeLevel("term-join");

				if (state.output.getToken("name").strings.form === "count") {
					state.output.clearlevel();
					state.output.append(local_count.toString());
					state.tmp["et-al-min"] = false;
					state.tmp["et-al-use-first"] = false;
				}
			};
			// handle names
			this.execs.push(func);
		}

		if (this.tokentype === CSL.END) {
			// unsets
			func = function (state, Item) {
				if (!state.tmp.can_substitute.pop()) {
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				CSL.Util.Names.reinit(state, Item);
				// names
				//SNIP-START
				if (debug) {
					CSL.debug("## endTag: names");
				}
				//SNIP-END
				state.output.endTag();

				state.parallel.CloseVariable("names");

				state.tmp["has-institution"] = false;
				state.tmp["has-first-person"] = false;

				state.tmp["et-al-min"] = false;
				state.tmp["et-al-use-first"] = false;
				if (!state.tmp["et-al-use-last"]) {
					state.tmp["et-al-use-last"] = false;
				}
				state.tmp.use_ellipsis = false;

				state.tmp.can_block_substitute = false;
				
				state.tmp.forceEtAl = false;

			};
			this.execs.push(func);

			state.build.name_flag = false;

		}
		target.push(this);

		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			state.build.substitute_level.pop();
			CSL.Util.substituteEnd.call(this, state, target);
		}
	},

	//
	// XXXXX: in configure phase, set a flag if this node contains an
	// institution node.  If it does, then each nameset will be filtered into an
	 // array containing two lists, to be run separately and joined
	// in the end.  If we don't, the array will contain only one list.
	//
	configure: function (state, pos) {
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
			if (state.build.has_institution) {
				this.strings["has-institution"] = true;
				state.build.has_institution = false;
			}
		}
	}
};
