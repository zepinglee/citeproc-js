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
		var debug, func, len, pos, attrname;
		debug = false;

		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			CSL.Util.substituteStart.call(this, state, target);
			state.build.substitute_level.push(1);

			state.fixOpt(this, "names-delimiter", "delimiter");

			// init names
			func = function (state, Item) {
				var namesets, nameset, names, rawlist, after_people_set, pers_seen, in_orgs, last_type, name, len, pos, variable, rawvar, llen, ppos, lllen, pppos, lllst, end, mynameset, tnamesets, frontnames, pair, offset, swaplist;
				state.parallel.StartVariable("names");
				if (state.tmp.value.length === 0) {
					namesets = [];
					len = this.variables.length;
					if (len && state.opt.xclass === "in-text") {
						len = 1;
					}
					for (pos = 0; pos < len; pos += 1) {
						variable = this.variables[pos];
						//SNIP-START
						if (debug) {
							CSL.debug(">>>> variable: " + variable);
						}
						//SNIP-END
						if (Item[variable]) {
							rawvar = Item[variable];
							if ("string" === typeof Item[variable]) {
								rawvar = [{literal: Item[variable]}];
							}
							rawlist = state.getNameSubFields(rawvar);
							names = [];
							//
							// we start with this:
							//
							//  {pers}, {orgs1}, {pers1a}, {pers1b}, {orgs2} ...
							//
							// where any {pers*} may be missing.
							//
							// We want a list of namesets with markers.
							// Namesets are composed of only pers or only
							// org.
							//
							// Markers:
							//
							//   variable (change triggers label and join)
							//   species:pers (triggers et-al join and external rendering)
							//   after_people (set once on 1st org, triggers "with" joiner)
							//   pers_org_start (sets pers-org join)
							//   species:org (triggers external rendering)
							//   pers_org_end (finalizes pers-org join)
							//   organization_start (first person or org of an organization)
							//   organization_end  (totally last organiztion)
							//
							// state vars
							tnamesets = [];
							nameset = {names: []};
							frontnames = [];
							llen = rawlist.length;
							for (ppos = 0; ppos < llen; ppos += 1) {
								name = rawlist[ppos];
								if (name.literal) {
									// org
									nameset.variable = variable;
									nameset.species = "org";
									if (name.literal.slice(0, 1) === '"' && name.literal.slice(-1)) {
										lllst = [name.literal.slice(1, -1)];
									} else {
										lllst = name.literal.split(/,\s+/);
									}
									lllen = lllst.length;
									for (pppos = 0; pppos < lllen; pppos += 1) {
										name = {literal: lllst[pppos]};
										nameset.names.push(name);
									}
									tnamesets.push(nameset);
									nameset = {names: []};
								} else {
									// pers
									nameset.variable = variable;
									nameset.species = "pers";
									nameset.names.push(name);
									if (rawlist.length === (ppos + 1) || rawlist[ppos + 1].literal) {
										tnamesets.push(nameset);
										nameset = {names: []};
									}
								}
								//   * variable (change triggers label and join)
								//   * species:pers (triggers et-al join and external rendering)
								//   after_people (set once on 1st org, triggers "with" joiner)
								//   * organization_first (start of names with orgs)
								//   * species:org (triggers external rendering)
								//   * organization_last (end of names with orgs)
							}

							if (tnamesets.length > 1 && tnamesets.slice(-1)[0].species === "pers") {
								frontnames = tnamesets.slice(-1);
								tnamesets = tnamesets.slice(0, tnamesets.length - 1);
								if (tnamesets.length > 0) {
									tnamesets[0].after_people = true;
								}
							}  else {
								frontnames = [];
							}
							if (tnamesets.length > 0 && tnamesets.slice(-1)[0].species === "org" && !(state.opt.xclass === "in-text" && state.tmp.area.slice(0, 8) === "citation")) {
								tnamesets[0].organization_first = true;
								tnamesets.slice(-1)[0].organization_last = true;
							}
							tnamesets = frontnames.concat(tnamesets);
							namesets = namesets.concat(tnamesets);
						}
					}
					if (state.opt.xclass === "in-text" && state.tmp.area.slice(0, 8) === "citation") {
						namesets = namesets.slice(0, 1);
					}
					len = namesets.length;
					for (pos = 0; pos < len; pos += 1) {
						state.tmp.names_max.push(namesets[pos].names.length);
						state.tmp.names_used.push(namesets[pos]);
					}

					state.tmp.value = namesets.slice();

					//print("CHECK: "+namesets[0].names.length);

					//SNIP-START
					if (debug) {
						len = namesets.length;
						for (pos = 0; pos < len; pos += 1) {
							mynameset = namesets[pos];
							CSL.debug(mynameset.species);
						}
					}
					//SNIP-END
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
				//SNIP-START
				if (debug) {
					CSL.debug("## startTag: names " + this.strings.suffix);
				}
				//SNIP-END
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
				var common_term, nameset, name, local_count, withtoken, namesetIndex, lastones, currentones, compset, display_names, suppress_min, suppress_condition, sane, discretionary_names_length, overlength, et_al, and_term, outer_and_term, use_first, append_last, delim, param, val, s, myform, myinitials, termname, form, namepart, namesets, llen, ppos, label, plural, last_variable;
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
				//SNIP-START
				if (debug) {
					CSL.debug("namesets.length[1]: " + namesets.length);
				}
				//SNIP-END
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

				state.output.addToken("term-join");

				state.output.addToken("space", " ");
				state.output.addToken("sortsep", state.output.getToken("name").strings["sort-separator"]);

				// not yet hooked up; using direct output instead.

				state.output.addToken("with-join");
				state.output.getToken("with-join").strings.delimiter = ", with ";

				outer_and_term = " " + state.output.getToken("name").strings.and + " ";
				state.output.addToken("institution-outer", outer_and_term);

				if (!state.output.getToken("etal")) {
					state.output.addToken("etal-join", ", ");
					state.output.addToken("etal");
				} else {
					state.output.addToken("etal-join", "");
				}
				if ("undefined" === typeof state.output.getToken("etal").strings.et_al_term) {
					state.output.getToken("etal").strings.et_al_term = state.getTerm("et-al", "long", 0);
				}

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

				// open for term join, for any and all names.
				state.output.openLevel("term-join");
				if (label && state.output.getToken("label").strings.label_position === CSL.BEFORE) {
					state.output.append(label, "label");
				}

				len = namesets.length;
				//SNIP-START
				if (debug) {
					CSL.debug("namesets.length[2]: " + namesets.length);
				}
				//SNIP-END
				for  (namesetIndex = 0; namesetIndex < len; namesetIndex += 1) {

					nameset = namesets[namesetIndex];


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
							// lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
							lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
							//lastones = state.tmp.last_names_used;
							currentones = state.tmp.names_used[state.tmp.nameset_counter];
							//currentones = state.tmp.names_used;
							compset = [currentones, lastones];
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

					display_names = nameset.names.slice();

					if ("pers" === nameset.species) {
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
						state.output.formats.value().name.strings.delimiter = and_term;

					} else {
						// org
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


					//SNIP-START
					if (debug) {
						CSL.debug("nameset.names.length[1]: " + nameset.names.length);
					}
					//SNIP-END
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
							// it clicks.  here is where we will put the
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
							termname = nameset.variable;
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

					// markers are:
					//
					//   variable (change triggers label and join)
					//   species:pers (triggers et-al join and external rendering)
					//   after_people (set once on 1st org, triggers "with" joiner)
					//   pers_org_start (sets pers-org join)
					//   species:org (triggers external rendering)
					//   pers_org_end (finalizes pers-org join)
					//

					if (namesetIndex > 0 && nameset.variable !== last_variable) {
						//SNIP-START
						if (debug) {
							CSL.debug("-- blink 'term-join'");
						}
						//SNIP-END
						state.output.closeLevel("term-join");
						state.output.openLevel("term-join");
					}

					if (nameset.after_people) {
						//SNIP-START
						if (debug) {
							CSL.debug("-- reached 'after_people'");
						}
						//SNIP-END
						state.output.append(", with ", "empty");
					}

					if (nameset.organization_first) {
						//SNIP-START
						if (debug) {
							CSL.debug("-- reached 'organization_first'");
						}
						//SNIP-END
						state.output.openLevel("institution-outer");
						state.output.openLevel("inner");
					}

					//if (nameset.pers_org_start) {
					//	if (debug) {
					//		CSL.debug("-- reached 'pers_org_start'");
					//	}
					//	//state.output.openLevel("inner");
					//}


					if (nameset.species === "pers") {
						// pers
						//SNIP-START
						if (debug) {
							CSL.debug("-- reached species 'pers'");
						}
						//SNIP-END
						state.output.openLevel("etal-join"); // join for etal
						CSL.Util.Names.outputNames(state, display_names);
						if (et_al) {
							state.output.append(et_al, "etal");
						}
						state.output.closeLevel("etal-join"); // etal
					} else {
						//org
						CSL.Util.Institutions.outputInstitutions(state, display_names);
						if (nameset.organization_last) {
							//SNIP-START
							if (debug) {
								CSL.debug("-- reached 'organization_last'");
							}
							//SNIP-END
							state.output.closeLevel("inner");
							state.output.closeLevel("institution-outer");
						} else {
							//SNIP-START
							if (debug) {
								CSL.debug("-- reached 'organization_NOT_last'");
							}
							//SNIP-END
							state.output.closeLevel("inner");
							state.output.openLevel("inner");
						}
					}


					//if (nameset.pers_org_end) {
					//	if (debug) {
					//		CSL.debug("-- reached 'pers_org_end'");
					//	}
					//	//state.output.closeLevel("inner");
					//}

					// lookahead
					if (namesets.length === namesetIndex + 1 || namesets[namesetIndex + 1].variable !== namesets[namesetIndex].variable) {
						if (label && state.tmp.name_label_position !== CSL.BEFORE) {
							state.output.append(label, "label");
						}
					}


					state.tmp.nameset_counter += 1;
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
