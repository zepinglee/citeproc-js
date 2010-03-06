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

CSL.Node.names = {
	build: function (state, target) {
		var pos, len, variable, func, rawvar, filtered_names, namesets, names, people, mynames, llen, ppos, n, nn, nnn, lllen, pppos, attrname, label, plural;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			CSL.Util.substituteStart.call(this, state, target);
			state.build.substitute_level.push(1);

			state.fixOpt(this, "names-delimiter", "delimiter");

			// init names
			func = function (state, Item) {
				state.parallel.StartVariable("names");
				if (state.tmp.value.length === 0) {
					len = this.variables.length;
					for (pos = 0; pos < len; pos += 1) {
						variable = this.variables[pos];
						if (Item[variable]) {
							rawvar = Item[variable];
							if ("string" === typeof Item[variable]) {
								rawvar = [{literal: Item[variable]}];
							}
							filtered_names = state.getNameSubFields(rawvar);
							if (this.strings["has-institution"]) {
								state.tmp["has-institution"] = true;
								//
								// Divide a nameset into a set of people-only and
								// people+organization groupings, ordered for
								// rendering.
								//
								namesets = [];
								names = [];
								people = false;
								//
								// there are always two pairs, even
								// if empty.  ordering is [organization,people,
								// organization,people].  for first pair,
								// organization is always empty.
								//
								llen = filtered_names.length;
								for (ppos = 0; ppos < llen; ppos += 1) {
									n = filtered_names[ppos];
									if (!n.literal) {
										names.push(n);
										people = true;
									} else {
										namesets.push(names);
										names = [];
										nn = n.literal.split(/,\s+/);
										lllen = nn.length;
										for (pppos = 0; pppos < lllen; pppos += 1) {
											nnn = nn[pppos];
											names.push({"literal": nnn});
										}
										namesets.push(names);
										names = [];
										people = false;
									}
								}
								if (people) {
									namesets.push(names);
									names = [];
									namesets.push(names);
								}
								namesets = [[]].concat(namesets);
								if (!namesets.slice(-1)[0].length) {
									namesets = namesets.slice(0, -1);
								}
								while (namesets.length < 4 || namesets.length % 2) {
									namesets = namesets.concat([[]]);
								}
								llen = namesets.length;
								for (ppos = 0; ppos < llen; ppos += 2) {
									mynames = {};
									mynames.type = variable;
									mynames.species = "people";
									if (ppos === 0) {
										mynames.grouping = "first-person";
										if (namesets[(ppos + 1)].length) {
											state.tmp["has-first-person"] = true;
										}
									} else if (ppos === 2) {
										mynames.grouping = "first-organization";
									} else if (ppos === (namesets.length - 2)) {
										mynames.grouping = "last-organization";
									}
									mynames.names = namesets[(ppos + 1)];
									state.tmp.names_max.push(mynames.names.length);
									state.tmp.value.push(mynames);
									state.tmp.names_used.push(state.tmp.value.slice());

									mynames = {};
									mynames.type = variable;
									mynames.species = "organizations";
									if (ppos === (namesets.length - 2)) {
										mynames.grouping = "last";
									}
									mynames.names = namesets[ppos];
									state.tmp.names_max.push(mynames.names.length);
									state.tmp.value.push(mynames);
									state.tmp.names_used.push(state.tmp.value.slice());
								}
							} else {  // end if institution
								mynames = {};
								mynames.type = variable;
								mynames.species = "people";
								mynames.names = filtered_names;
								state.tmp.names_max.push(mynames.names.length);
								state.tmp.value.push(mynames);
								state.tmp.names_used.push(state.tmp.value.slice());
							}
						}
					}
				}
			};
			this.execs.push(func);
		}

		if (this.tokentype === CSL.START) {

			state.build.names_flag = true;

			// init can substitute
			func = function (state, Item) {
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(func);

			// init names
			func = function (state, Item) {
				state.output.startTag("names", this);
				state.tmp.name_node = state.output.current.value();
			};
			this.execs.push(func);

		}

		if (this.tokentype === CSL.END) {

			len = CSL.NAME_ATTRIBUTES.length;
			for (pos = 0; pos < len; pos += 1) {
				attrname = CSL.NAME_ATTRIBUTES[pos];
				if (attrname.slice(0, 5) === "et-al") {
					continue;
				}
				if ("undefined" !== typeof state.build.nameattrs[attrname]) {
					this.strings[attrname] = state.build.nameattrs[attrname];
					delete state.build.nameattrs[attrname];
				}
			}

			// handle names
			func = function (state, Item) {
				var common_term, nameset, name, local_count, withtoken, namesetIndex, lastones, currentones, compset, display_names, suppress_min, suppress_condition, sane, discretionary_names_length, overlength, et_al, and_term, outer_and_term, use_first, append_last, delim, param, val, s, myform, myinitials, termname, form, namepart;
				namesets = [];
				common_term = CSL.Util.Names.getCommonTerm(state, state.tmp.value);
				if (common_term) {
					namesets = state.tmp.value.slice(0, 1);
				} else {
					namesets = state.tmp.value;
				}
				//
				// Normalize names for which it is requested
				//
				len = namesets.length;
				for (pos = 0; pos < len; pos += 1) {
					nameset = namesets[pos];
					if ("organizations" === nameset.species) {
						if (state.output.getToken("institution").strings["reverse-order"]) {
							nameset.names.reverse();
						}
					}
					llen = nameset.names.length;
					for (ppos = 0; ppos < llen; ppos += 1) {
						name = nameset.names[ppos];
						if (name["parse-names"]) {
							state.parseName(name);
						}
					}
				}
				local_count = 0;
				nameset = {};

				state.output.addToken("space", " ");
				state.output.addToken("sortsep", state.output.getToken("name").strings["sort-separator"]);

				if (!state.output.getToken("etal")) {
					state.output.addToken("etal-join", ", ");
					state.output.addToken("etal");
				} else {
					state.output.addToken("etal-join", "");
				}
				if (!state.output.getToken("with")) {
					withtoken = new CSL.Token("with", CSL.SINGLETON);
					withtoken.strings.prefix = " ";
					withtoken.strings.suffix = " ";
					state.output.addToken("with", withtoken);
				}
				if (!state.output.getToken("label")) {
					state.output.addToken("label");
				}
				if ("undefined" === typeof state.output.getToken("etal").strings.et_al_term) {
					state.output.getToken("etal").strings.et_al_term = state.getTerm("et-al", "long", 0);
				}
				//
				// Locale term not yet available.
				//
				// if ("undefined" === typeof state.output.getToken("with").strings.with_term){
				// state.output.getToken("with").strings.with_term = state.getTerm("with","long",0);
				// }
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
				len = namesets.length;
				for  (namesetIndex = 0; namesetIndex < len; namesetIndex += 1) {
					nameset = namesets[namesetIndex];
					//
					// XXXXX: this buggers up the nesting mimicry for
					// institutional names support
					//
					//if (!nameset.names.length){
					//	continue;
					//}
					if (!state.tmp.suppress_decorations && (state[state.tmp.area].opt.collapse === "year" || state[state.tmp.area].opt.collapse === "year-suffix" || state[state.tmp.area].opt.collapse === "year-suffix-ranged")) {
						//
						// This is fine, but the naming of the comparison
						// function is confusing.  This is just checking whether the
						// current name is the same as the last name rendered
						// in the last cite, and it works.  Set a toggle if the
						// test fails, so we can avoid further suppression in the
						// cite.
						//
						if (state.tmp.last_names_used.length === state.tmp.names_used.length) {
							lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
							currentones = state.tmp.names_used[state.tmp.nameset_counter];
							compset = currentones.concat(lastones);
							if (CSL.Util.Names.getCommonTerm(state, compset)) {
								continue;
							} else {
								state.tmp.have_collapsed = false;
							}
						}
					}
					if (!state.tmp.disambig_request) {
						state.tmp.disambig_settings.givens[state.tmp.nameset_counter] = [];
					}
					//
					// Here is where we maybe truncate the list of
					// names, to satisfy name-count and et-al constraints.
					display_names = nameset.names.slice();
					if ("people" === nameset.species) {
						sane = state.tmp["et-al-min"] >= state.tmp["et-al-use-first"];
						//
						// if there is anything on name request, we assume that
						// it was configured correctly via state.names_request
						// by the function calling the renderer.
						discretionary_names_length = state.tmp["et-al-min"];

						//
						// the names constraint
						//
						suppress_min = state.output.getToken("name").strings["suppress-min"];
						suppress_condition = suppress_min && display_names.length >= suppress_min;
						if (suppress_condition) {
							continue;
						}

						//
						// if rendering for display, do not honor a disambig_request
						// to set names length below et-al-use-first
						//
						if (state.tmp.suppress_decorations) {
							if (state.tmp.disambig_request) {
								discretionary_names_length = state.tmp.disambig_request.names[state.tmp.nameset_counter];
							} else if (display_names.length >= state.tmp["et-al-min"]) {
								discretionary_names_length = state.tmp["et-al-use-first"];
							}
						} else {
							if (state.tmp.disambig_request && state.tmp["et-al-use-first"] < state.tmp.disambig_request.names[state.tmp.nameset_counter]) {
								discretionary_names_length = state.tmp.disambig_request.names[state.tmp.nameset_counter];
							} else if (display_names.length >= state.tmp["et-al-min"]) {
								discretionary_names_length = state.tmp["et-al-use-first"];
							}
						}
						overlength = display_names.length > discretionary_names_length;
						et_al = false;
						and_term = "";
						outer_and_term = " " + state.output.getToken("name").strings.and + " ";

						if (sane && overlength) {
							if (! state.tmp.sort_key_flag) {
								et_al = state.output.getToken("etal").strings.et_al_term;
							}
							display_names = display_names.slice(0, discretionary_names_length);
						} else {
							if (state.output.getToken("name").strings.and && ! state.tmp.sort_key_flag && display_names.length > 1) {
								and_term = state.output.getToken("name").strings.and;
							}
						}
					} else {
						// not if ("people" === nameset.species), must be "organizations"
						use_first = state.output.getToken("institution").strings["use-first"];
						if (!use_first && namesetIndex === 0) {
							use_first = state.output.getToken("institution").strings["substitute-use-first"];
						}
						if (!use_first) {
							use_first = 0;
						}
						append_last = state.output.getToken("institution").strings["use-last"];
						if (use_first || append_last) {
							s = display_names.slice();
							display_names = [];
							display_names = s.slice(0, use_first);
							s = s.slice(use_first);
							if (append_last) {
								if (append_last > s.length) {
									append_last = s.length;
								}
								if (append_last) {
									display_names = display_names.concat(s.slice((s.length - append_last)));
								}
							}
						}
					}
					state.tmp.disambig_settings.names[state.tmp.nameset_counter] = display_names.length;
					local_count += display_names.length;

					//
					// "name" is the format for the outermost nesting of a nameset
					// "inner" is a format consisting only of a delimiter, used for
					// joining all but the last name in the set together.
					delim = state.output.getToken("name").strings.delimiter;
					if (!state.output.getToken("inner")) {
						state.output.addToken("inner", delim);
					}
					//state.tmp.tokenstore["and"] = new CSL.Token("and");

					state.output.formats.value().name.strings.delimiter = and_term;
					state.output.addToken("outer-and", outer_and_term);

					llen = nameset.names.length;
					for (ppos = 0; ppos < llen; ppos += 1) {
						//
						// register the name in the global names disambiguation
						// registry
						state.registry.namereg.addname(Item.id, nameset.names[ppos], ppos);
						//
						// set the display mode default for givennames if required
						if (state.tmp.sort_key_flag) {
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos] = 2;
						} else if (state.tmp.disambig_request) {
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							val = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos];
							if (val === 1 && "undefined" === typeof this.strings["initialize-with"]) {
								val = 2;
							}
							param = val;
//							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
							if (state[state.tmp.area].opt["disambiguate-add-givenname"]) {
								param = state.registry.namereg.evalname(Item.id, nameset.names[ppos], ppos, param, state.output.getToken("name").strings.form, this.strings["initialize-with"]);
							}
						} else {
							//
							// ZZZZZ: it clicks.  here is where we will put the
							// call to the names register, to get the floor value
							// for an individual name.
							//
							myform = state.output.getToken("name").strings.form;
							myinitials = this.strings["initialize-with"];
							param = state.registry.namereg.evalname(Item.id, nameset.names[ppos], ppos, 0, myform, myinitials);
						}
						state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos] = param;
					}
					//
					// configure label if poss
					label = false;
					if (state.output.getToken("label").strings.label_position) {
						if (common_term) {
							termname = common_term;
						} else {
							termname = nameset.type;
						}
						//
						// XXXXX: quick hack.  This should be fixed earlier.
						//
						if (!state.output.getToken("label").strings.form) {
							form = "long";
						} else {
							form = state.output.getToken("label").strings.form;
						}
						if ("number" === typeof state.output.getToken("label").strings.plural) {
							plural = state.output.getToken("label").strings.plural;
						} else if (nameset.names.length > 1) {
							plural = 1;
						} else {
							plural = 0;
						}
						label = state.getTerm(termname, form, plural);
					}
					//
					// Nesting levels are opened to control joins with
					// content at the end of the names block
					//

					// Gotcha.  Don't want to use startTag here, it pushes
					// a fresh format token namespace, and we lose our pointer.]
					// Use openLevel (and possibly addToken) instead.

					// XXXXX: careful with this; with institutional
					// sub-nesting, this is going to give you multiple
					// terms.  Should only happen once.
					// This code really wants to be factored out, so we
					// can see the nesting structure more easily.

					// temporary: preserve existing structure
					if (!state.tmp["has-institution"]) {
						state.output.openLevel("empty"); // for term join
						if (label && state.output.getToken("label").strings.label_position === CSL.BEFORE) {
							state.output.append(label, "label");
						}
					} else if (nameset.grouping === "first-person") {
						state.output.openLevel("empty"); // for term join
						if (label && state.output.getToken("label").strings.label_position === CSL.BEFORE) {
							state.output.append(label, "label");
						}
						// QQQ
						// XXXX: well, here's where the joins will be manipulated
						//state.output.openLevel("name");
						state.output.openLevel("with");
					} else if (nameset.grouping === "first-organization") {
						if (state.tmp["has-first-person"]) {
							state.output.append(" with ", "empty");
						}
						state.output.openLevel("outer-and");
						state.output.openLevel("inner");
					} else if (nameset.grouping === "last-organization") {
						state.output.closeLevel(); // closes inner
						state.output.openLevel("inner"); // open fresh inner
					}
					if ("people" === nameset.species) {
						state.output.openLevel("etal-join"); // join for etal
						CSL.Util.Names.outputNames(state, display_names);
						if (et_al) {
							state.output.append(et_al, "etal");
						}
						state.output.closeLevel(); // etal
					} else {
						CSL.Util.Institutions.outputInstitutions(state, display_names);
					}

					if (!state.tmp["has-institution"]) {
						if (label && state.tmp.name_label_position !== CSL.BEFORE) {
							state.output.append(label, "label");
						}
						// term
						state.output.closeLevel();
					} else if (nameset.grouping === "last") {
						// trial token (inner)
						state.output.closeLevel();
						// trial token (inner)
						state.output.closeLevel();
						// trial token (with)
						state.output.closeLevel();
						if (label && state.tmp.name_label_position !== CSL.BEFORE) {
							state.output.append(label, "label");
						}
						// term
						state.output.closeLevel();
					}

					state.tmp.nameset_counter += 1;
					// end of nameset loop
				}
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
				state.output.endTag();

				state.parallel.CloseVariable();

				state.tmp["has-institution"] = false;
				state.tmp["has-first-person"] = false;

				state.tmp["et-al-min"] = false;
				state.tmp["et-al-use-first"] = false;

				state.tmp.can_block_substitute = false;
			};
			this.execs.push(func);

			state.build.names_flag = false;
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
