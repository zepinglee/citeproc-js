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

CSL.Node.names = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START || this.tokentype == CSL.SINGLETON){
			CSL.Util.substituteStart.call(this,state,target);
			state.build.substitute_level.push(1);

			state.fixOpt(this,"names-delimiter","delimiter");

			var init_names = function(state,Item){
				state.parallel.StartVariable("names");
				if (state.tmp.value.length == 0){
					for each (var variable in this.variables){
						if (Item[variable]){
							var rawvar = Item[variable];
							if ("string" == typeof Item[variable]){
								rawvar = [{"literal":Item[variable]}];
							}
							var filtered_names = state.getNameSubFields(rawvar);
							if (this.strings["has-institution"]){
								state.tmp["has-institution"] = true;
								//
								// Divide a nameset into a set of people-only and
								// people+organization groupings, ordered for
								// rendering.
								//
								var namesets = new Array();
								var names = new Array();
								var people = false;
								//
								// there are always two pairs, even
								// if empty.  ordering is [organization,people,
								// organization,people].  for first pair,
								// organization is always empty.
								//
								for each (var n in filtered_names){
									if (!n.literal){
										names.push(n);
										people = true;
									} else {
										namesets.push(names);
										names = new Array();
										var nn = n.literal.split(/,\s+/);
										for each (n in nn){
											names.push({"literal":n});
										}
										namesets.push(names);
										names = new Array();
										people = false;
									};
								};
								if (people){
									namesets.push(names);
									names = new Array();
									namesets.push(names);
								};
								namesets = [[]].concat(namesets);
								if (!namesets.slice(-1)[0].length){
									namesets = namesets.slice(0,-1);
								}
								while (namesets.length < 4 || namesets.length % 2){
									namesets = namesets.concat([[]]);
								}
								for (var i=0; i<namesets.length; i+=2){
									var mynames = new Object();
									mynames.type = variable;
									mynames.species = "people";
									if (i == 0){
										mynames.grouping = "first-person";
										if (namesets[(i+1)].length){
											state.tmp["has-first-person"] = true;
										}
									} else if (i == 2){
										mynames.grouping = "first-organization";
									} else if (i == (namesets.length-2)){
										mynames.grouping = "last-organization";
									};
									mynames.names = namesets[(i+1)];
									state.tmp.names_max.push(mynames.names.length);
									state.tmp.value.push(mynames);
									state.tmp.names_used.push(state.tmp.value.slice());

									var mynames = new Object();
									mynames.type = variable;
									mynames.species = "organizations";
									if (i == (namesets.length-2)){
										mynames.grouping = "last";
									}
									mynames.names = namesets[i];
									state.tmp.names_max.push(mynames.names.length);
									state.tmp.value.push(mynames);
									state.tmp.names_used.push(state.tmp.value.slice());
								};
							} else {  // end if institution
								var mynames = new Object();
								mynames.type = variable;
								mynames.species = "people";
								mynames.names = filtered_names;
								state.tmp.names_max.push(mynames.names.length);
								state.tmp.value.push(mynames);
								state.tmp.names_used.push(state.tmp.value.slice());
							};
						};
					};
				};
			};
			this["execs"].push(init_names);
		};

		if (this.tokentype == CSL.START){

			state.build.names_flag = true;

			var init_can_substitute = function(state,Item){
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(init_can_substitute);

			var init_names = function(state,Item){
				state.output.startTag("names",this);
				state.tmp.name_node = state.output.current.value();
			};
			this["execs"].push(init_names);

		};

		if (this.tokentype == CSL.END){

			for each (attrname in CSL.NAME_ATTRIBUTES){
				if (attrname.slice(0,5) == "et-al"){
					continue;
				}
				if ("undefined" != typeof state.build.nameattrs[attrname]){
					this.strings[attrname] = state.build.nameattrs[attrname];
					delete state.build.nameattrs[attrname];
				}
			}

			var handle_names = function(state,Item){
				var namesets = new Array();
				var common_term = CSL.Util.Names.getCommonTerm(state,state.tmp.value);
				if (common_term){
					namesets = state.tmp.value.slice(0,1);
				} else {
					namesets = state.tmp.value;
				}
				//
				// Normalize names for which it is requested
				//
				for each (var nameset in namesets){
					if ("organizations" == nameset.species){
						if (state.output.getToken("institution").strings["reverse-order"]){
							nameset.names.reverse();
						};
					};
					for each (var name in nameset.names){
						if (name["parse-names"]){
							state.parseName(name);
						};
					};
				};
				var local_count = 0;
				nameset = new Object();

				state.output.addToken("space"," ");
				state.output.addToken("sortsep",state.output.getToken("name").strings["sort-separator"]);

				if (!state.output.getToken("etal")){
					state.output.addToken("etal-join",", ");
					state.output.addToken("etal");
				} else {
					state.output.addToken("etal-join","");
				}
				if (!state.output.getToken("with")){
					var withtoken = new CSL.Token("with",CSL.SINGLETON);
					withtoken.strings.prefix = " ";
					withtoken.strings.suffix = " ";
					state.output.addToken("with",withtoken);
				}
				if (!state.output.getToken("label")){
					state.output.addToken("label");
				}
				if ("undefined" == typeof state.output.getToken("etal").strings.et_al_term){
					state.output.getToken("etal").strings.et_al_term = state.getTerm("et-al","long",0);
				}
				//
				// Locale term not yet available.
				//
				// if ("undefined" == typeof state.output.getToken("with").strings.with_term){
				// 	state.output.getToken("with").strings.with_term = state.getTerm("with","long",0);
				// }
				state.output.addToken("commasep",", ");
				for each (namepart in ["given","family","suffix"]){
					if (!state.output.getToken(namepart)){
						state.output.addToken(namepart);
					}
				}
				state.output.addToken("dropping-particle",false,state.output.getToken("family"));
				state.output.addToken("non-dropping-particle",false,state.output.getToken("family"));
				for  (var namesetIndex in namesets){
					nameset = namesets[namesetIndex];
					//
					// XXXXX: this buggers up the nesting mimicry for
					// institutional names support
					//
					//if (!nameset.names.length){
					//	continue;
					//};
					if (!state.tmp.suppress_decorations && (state[state.tmp.area].opt.collapse == "year" || state[state.tmp.area].opt.collapse == "year-suffix" || state[state.tmp.area].opt.collapse == "year-suffix-ranged")){
						//
						// This is fine, but the naming of the comparison
						// function is confusing.  This is just checking whether the
						// current name is the same as the last name rendered
						// in the last cite, and it works.  Set a toggle if the
						// test fails, so we can avoid further suppression in the
						// cite.
						//
						if (state.tmp.last_names_used.length == state.tmp.names_used.length){
							var lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
							var currentones = state.tmp.names_used[state.tmp.nameset_counter];
							var compset = currentones.concat(lastones);
							if (CSL.Util.Names.getCommonTerm(state,compset)){
								continue;
							} else {
								state.tmp.have_collapsed = false;
							}
						}
					}
					if (!state.tmp.disambig_request){
						state.tmp.disambig_settings["givens"][state.tmp.nameset_counter] = new Array();
					}
					//
					// Here is where we maybe truncate the list of
					// names, to satisfy name-count and et-al constraints.
					var display_names = nameset.names.slice();
					if ("people" == nameset.species){
						var sane = state.tmp["et-al-min"] >= state.tmp["et-al-use-first"];
						//
						// if there is anything on name request, we assume that
						// it was configured correctly via state.names_request
						// by the function calling the renderer.
						var discretionary_names_length = state.tmp["et-al-min"];

						//
						// the names constraint
						//
						var suppress_min = state.output.getToken("name").strings["suppress-min"];
						var suppress_condition = suppress_min && display_names.length >= suppress_min;
						if (suppress_condition){
							continue;
						};

						//
						// if rendering for display, do not honor a disambig_request
						// to set names length below et-al-use-first
						//
						if (state.tmp.suppress_decorations){
							if (state.tmp.disambig_request){
								discretionary_names_length = state.tmp.disambig_request["names"][state.tmp.nameset_counter];
							} else if (display_names.length >= state.tmp["et-al-min"]){
								discretionary_names_length = state.tmp["et-al-use-first"];
							};
						} else {
							if (state.tmp.disambig_request && state.tmp["et-al-use-first"] < state.tmp.disambig_request["names"][state.tmp.nameset_counter]){
								discretionary_names_length = state.tmp.disambig_request["names"][state.tmp.nameset_counter];
							} else if (display_names.length >= state.tmp["et-al-min"]){
								discretionary_names_length = state.tmp["et-al-use-first"];
							};
						};
						var overlength = display_names.length > discretionary_names_length;
						var et_al = false;
						var and_term = "";
						var outer_and_term = " "+state.output.getToken("name").strings["and"]+" ";

						if (sane && overlength){
							if (! state.tmp.sort_key_flag){
								et_al = state.output.getToken("etal").strings.et_al_term;
							};
							display_names = display_names.slice(0,discretionary_names_length);
						} else {
							if (state.output.getToken("name").strings["and"] && ! state.tmp.sort_key_flag && display_names.length > 1){
								and_term = state.output.getToken("name").strings["and"];
							};
						};
					} else { // not if ("people" == nameset.species), must be "organizations"
						var use_first = state.output.getToken("institution").strings["use-first"];
						if (!use_first && namesetIndex == 0){
							use_first = state.output.getToken("institution").strings["substitute-use-first"];
						};
						if (!use_first){
							use_first = 0;
						}
						var append_last = state.output.getToken("institution").strings["use-last"];
						if (use_first || append_last){
							var s = display_names.slice();
							display_names = new Array();
							display_names = s.slice(0,use_first);
							s = s.slice(use_first);
							if (append_last){
								if (append_last > s.length){
									append_last = s.length;
								};
								if (append_last){
									display_names = display_names.concat(s.slice((s.length-append_last)));
								};
							};
						};
					};
					state.tmp.disambig_settings["names"][state.tmp.nameset_counter] = display_names.length;
					local_count += display_names.length;

					//
					// "name" is the format for the outermost nesting of a nameset
					// "inner" is a format consisting only of a delimiter, used for
					// joining all but the last name in the set together.
					var delim = state.output.getToken("name").strings.delimiter;
					if (!state.output.getToken("inner")){
						state.output.addToken("inner",delim);
					}
					//state.tmp.tokenstore["and"] = new CSL.Token("and");

					state.output.formats.value()["name"].strings.delimiter = and_term;
					state.output.addToken("outer-and",outer_and_term);

					for (var i in nameset.names){
						//
						// register the name in the global names disambiguation
						// registry
						state.registry.namereg.addname(Item.id,nameset.names[i],i);
						//
						// set the display mode default for givennames if required
						if (state.tmp.sort_key_flag){
							state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i] = 2;
						} else if (state.tmp.disambig_request){
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							var val = state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i];
							if (val == 1 && "undefined" == typeof this.strings["initialize-with"]){
								val = 2;
							}
							var param = val;
//							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
							if (state[state.tmp.area].opt["disambiguate-add-givenname"]){
								var param = state.registry.namereg.evalname(Item.id,nameset.names[i],i,param,state.output.getToken("name").strings.form,this.strings["initialize-with"]);
							};
						} else {
							//
							// ZZZZZ: it clicks.  here is where we will put the
							// call to the names register, to get the floor value
							// for an individual name.
							//
							var myform = state.output.getToken("name").strings.form;
							var myinitials = this.strings["initialize-with"];
							var param = state.registry.namereg.evalname(Item.id,nameset.names[i],i,0,myform,myinitials);
						};
						state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i] = param;
					}
					//
					// configure label if poss
					var label = false;
					if (state.output.getToken("label").strings.label_position){
						var termname;
						if (common_term){
							termname = common_term;
						} else {
							termname = nameset.type;
						}
						//
						// XXXXX: quick hack.  This should be fixed earlier.
						//
						if (!state.output.getToken("label").strings.form){
							var form = "long";
						} else {
							var form = state.output.getToken("label").strings.form;
						}
						if ("number" == typeof state.output.getToken("label").strings.plural){
							var plural = state.output.getToken("label").strings.plural;
						} else if (nameset.names.length > 1){
							var plural = 1;
						} else {
							var plural = 0;
						}
						label = state.getTerm(termname,form,plural);
					};
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
					if (!state.tmp["has-institution"]){
						state.output.openLevel("empty"); // for term join
						if (label && state.output.getToken("label").strings.label_position == CSL.BEFORE){
							state.output.append(label,"label");
						}
					} else if (nameset.grouping == "first-person"){
						state.output.openLevel("empty"); // for term join
						if (label && state.output.getToken("label").strings.label_position == CSL.BEFORE){
							state.output.append(label,"label");
						}
						// QQQ
						// XXXX: well, here's where the joins will be manipulated
						//state.output.openLevel("name");
						state.output.openLevel("with");
					} else if (nameset.grouping == "first-organization"){
						if (state.tmp["has-first-person"]){
							state.output.append(" with ","empty");
						}
						state.output.openLevel("outer-and");
						state.output.openLevel("inner");
					} else if (nameset.grouping == "last-organization"){
						state.output.closeLevel(); // closes inner
						state.output.openLevel("inner"); // open fresh inner
					}
					if ("people" == nameset.species){
						state.output.openLevel("etal-join"); // join for etal
						CSL.Util.Names.outputNames(state,display_names);
						if (et_al){
							state.output.append(et_al,"etal");
						}
						state.output.closeLevel(); // etal
					} else {
						CSL.Util.Institutions.outputInstitutions(state,display_names);
					}

					if (!state.tmp["has-institution"]){
						if (label && state.tmp.name_label_position != CSL.BEFORE){
							state.output.append(label,"label");
						}
						state.output.closeLevel(); // term
					} else if (nameset.grouping == "last"){
						state.output.closeLevel(); // trial token (inner)
						state.output.closeLevel(); // trial token (inner)
						state.output.closeLevel(); // trial token (with)
						if (label && state.tmp.name_label_position != CSL.BEFORE){
							state.output.append(label,"label");
						}
						state.output.closeLevel(); // term
					}

					state.tmp.nameset_counter += 1;
				}; // end of nameset loop
				if (state.output.getToken("name").strings.form == "count"){
					state.output.clearlevel();
					state.output.append(local_count.toString());
					state.tmp["et-al-min"] = false;
					state.tmp["et-al-use-first"] = false;
				};
			};
			this["execs"].push(handle_names);
		};

		//
		// Looks disabled.  Delete, I guess.
		//
		if (this.tokentype == CSL.END && state.build.form == "count" && false){
			state.build.form = false;

			var output_name_count = function(state,Item){
				var name_count = 0;
				for each (var v in this.variables){
					if(Item[v] && Item[v].length){
						name_count += Item[v].length;
					}
				}
				state.output.append(name_count.toString());
			};
			this["execs"].push(output_name_count);
		};

		if (this.tokentype == CSL.END){
			var unsets = function(state,Item){
				if (!state.tmp.can_substitute.pop()){
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				CSL.Util.Names.reinit(state,Item);
				state.output.endTag(); // names

				state.parallel.CloseVariable();

				state.tmp["has-institution"] = false;
				state.tmp["has-first-person"] = false;

				state.tmp["et-al-min"] = false;
				state.tmp["et-al-use-first"] = false;

				state.tmp.can_block_substitute = false;
			};
			this["execs"].push(unsets);

			state.build.names_flag = false;
			state.build.name_flag = false;

		}
		target.push(this);

		if (this.tokentype == CSL.END || this.tokentype == CSL.SINGLETON){
			state.build.substitute_level.pop();
			CSL.Util.substituteEnd.call(this,state,target);

		}
	}

	//
	// XXXXX: in configure phase, set a flag if this node contains an
	// institution node.  If it does, then each nameset will be filtered into an
	 // array containing two lists, to be run separately and joined
	// in the end.  If we don't, the array will contain only one list.
	//
	this.configure = configure;
	function configure(state,pos){
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1){
			if (state.build.has_institution){
				this.strings["has-institution"] = true;
				state.build.has_institution = false;
			};
		};
	};
};
