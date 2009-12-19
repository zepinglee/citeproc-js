/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
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
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
CSL.Node.text = new function(){
	this.build = build;
	function build (state,target){
		CSL.Util.substituteStart.call(this,state,target);
		if (this.postponed_macro){
			CSL.expandMacro.call(state,this);
		} else {
			// ...
			//
			// Do non-macro stuff
			var variable = this.variables[0];
			if (variable){
				var func = function(state,Item){
					// XXXXX: needs to be fixed.
					// we need a single blob that encloses the entire output of
					// the node, apart from its affixes.  The names node uses
					// a startTag() declaration to get that.  Is only one
					// node possible for text?  If it will never produce more
					// than one below, better off without a tag, it might mess
					// up collapsing.
					CSL.parallel.StartVariable(this.variables[0]);
				};
				this["execs"].push(func);
			};
			var form = "long";
			var plural = 0;
			if (this.strings.form){
				form = this.strings.form;
			}
			if (this.strings.plural){
				plural = this.strings.plural;
			}
			if ("citation-number" == variable || "year-suffix" == variable || "citation-label" == variable){
				//
				// citation-number and year-suffix are super special,
				// because they are rangeables, and require a completely
				// different set of formatting parameters on the output
				// queue.
				if (variable == "citation-number"){
					//this.strings.is_rangeable = true;
					if ("citation-number" == state[state.tmp.area].opt["collapse"]){
						this.range_prefix = "-";
					}
					this.successor_prefix = state[state.build.area].opt.layout_delimiter;
					var func = function(state,Item){
						var id = Item["id"];
						if (!state.tmp.force_subsequent){
							if (Item["author-only"]){
								state.tmp.element_trace.replace("do-not-suppress-me");
								var term = CSL.Output.Formatters["capitalize-first"](state,state.getTerm("references","long","singular"));
								state.output.append(term+" ");
								state.tmp.last_element_trace = true;
							};
							if (Item["suppress-author"]){
								if (state.tmp.last_element_trace){
									state.tmp.element_trace.replace("suppress-me");
								};
								state.tmp.last_element_trace = false;
							};
							var num = state.registry.registry[id].seq;
							var number = new CSL.NumericBlob(num,this);
							state.output.append(number,"literal");
						};
					};
					this["execs"].push(func);
				} else if (variable == "year-suffix"){

					state.opt.has_year_suffix = true;

					if (state[state.tmp.area].opt.collapse == "year-suffix-ranged"){
						this.range_prefix = "-";
					}
					if (state[state.tmp.area].opt["year-suffix-delimiter"]){
						this.successor_prefix = state[state.build.area].opt["year-suffix-delimiter"];
					}
					var func = function(state,Item){
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
							//state.output.append(state.registry.registry[Item.id].disambig[2],this);
							var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
							var number = new CSL.NumericBlob(num,this);
							var formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
							number.setFormatter(formatter);
							state.output.append(number,"literal");
							//
							// don't ask :)
							// obviously the variable naming scheme needs
							// a little touching up
							var firstoutput = state.tmp.term_sibling.mystack.indexOf(true) == -1;
							var specialdelimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							if (firstoutput && specialdelimiter && !state.tmp.sort_key_flag){
								state.tmp.splice_delimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							}
						}
					};
					this["execs"].push(func);
				} else if (variable == "citation-label"){
					state.opt.has_year_suffix = true;
					var func = function(state,Item){
						var label = Item["citation-label"];
						if (!label){
							//
							// A shot in the dark
							//
							var myname = state.getTerm("references","short",0);
							for each (var n in CSL.CREATORS){
								if (Item[n]){
									var names = Item[n];
									if (names && names.length){
										var name = names[0];
									}
									if (name && name.family){
										myname = name.family.replace(/\s+/,"");
									} else if (name && name.literal){
										myname = name.literal;
										var m = myname.toLowerCase().match(/^(a|the|an)(.*)/,"");
										if (m){
											myname = m[2];
										}
									}
								}
							}
							var year = "0000";
							if (Item.issued){
								var dp = Item.issued["date-parts"];
								if (dp && dp[0] && dp[0][0]){
									year = ""+dp[0][0];
								}
							}
							label = myname + year;
						};
						var suffix = "";
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
							var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
							suffix = state.fun.suffixator.format(num);
						};
						label += suffix;
						state.output.append(label,this);
					};
					this["execs"].push(func);
				};
			} else {
				if (state.build.term){
					var term = state.build.term;
					term = state.getTerm(term,form,plural);
					if (this.strings["strip-periods"]){
						term = term.replace(/\./g,"");
					};
					var printterm = function(state,Item){
						// capitalize the first letter of a term, if it is the
						// first thing rendered in a citation (or if it is
						// being rendered immediately after terminal punctuation,
						// I guess, actually).
						if (!state.tmp.term_predecessor){
							//CSL.debug("Capitalize");
							term = CSL.Output.Formatters["capitalize-first"](state,term);
							state.tmp.term_predecessor = true;
						};
						state.output.append(term,this);
					};
					this["execs"].push(printterm);
					state.build.term = false;
					state.build.form = false;
					state.build.plural = false;
				} else if (this.variables.length){
					if (this.variables[0] == "container-title" && form == "short"){
						// Define function to check container title
						var func = function(state,Item){
							var defaultval = state.getVariable(Item,this.variables[0],form);
							var value = "";
							if (state.opt["container-title-abbreviations"]){
								value = state.opt["container-title-abbreviations"][defaultval];
							};
							if (!value){
								value = Item["journalAbbreviation"];
							}
							if (!value){
								value = defaultval;
							}
							state.output.append(value,this);
						};
					} else if (this.variables[0] == "title"){
						if (state.build.area.slice(-5) == "_sort"){
							var func = function(state,Item){
								var value = Item[this.variables[0]];
								if (value){
									value = state.getTextSubField(value,"locale-sort",true);
									state.output.append(value,this);
								};
							};
						} else {
							var func = function(state,Item){
								var value = Item[this.variables[0]];
								if (value){
									var primary = state.getTextSubField(value,"locale-pri",true);
									var secondary = state.getTextSubField(value,"locale-sec");

									if (secondary){
										var primary_tok = new CSL.Token("text",CSL.SINGLETON);
										var secondary_tok = new CSL.Token("text",CSL.SINGLETON);
										for (var i in this.strings){
											secondary_tok.strings[i] = this.strings[i];
											if (i == "suffix"){
												secondary_tok.strings.suffix = "]"+secondary_tok.strings.suffix;
												continue;
											} else if (i == "prefix"){
												secondary_tok.strings.prefix = " ["+secondary_tok.strings.prefix;
											}
											primary_tok.strings[i] = this.strings[i];
										}
										state.output.append(primary,primary_tok);
										state.output.append(secondary,secondary_tok);
									} else {
										state.output.append(primary,this);
									}
								};
							};
						};
					} else if (this.variables[0] == "page-first"){
						var func = function(state,Item){
							var value = state.getVariable(Item,"page",form);
							value = value.replace(/-.*/,"");
							state.output.append(value,this);
						};
					} else if (this.variables[0] == "page"){
						var func = function(state,Item){
							var value = state.getVariable(Item,"page",form);
							value = state.fun.page_mangler(value);
							state.output.append(value,this);
						};
					} else {
						var func = function(state,Item){
							var value = state.getVariable(Item,this.variables[0],form);
							state.output.append(value,this);
						};
					};
					this["execs"].push(func);
				} else if (this.strings.value){
					var func = function(state,Item){
						state.output.append(this.strings.value,this);
					};
					this["execs"].push(func);
				} else {
					var weird_output_function = function(state,Item){
						if (state.tmp.value.length){
							CSL.debug("Weird output pattern.  Can this be revised?");
							for each (var val in state.tmp.value){
								state.output.append(val,this);
							}
							state.tmp.value = new Array();
						}
					};
					this["execs"].push(weird_output_function);
				}
			}
			var func = function(state,Item){
				// XXXXX: needs to be fixed.
				CSL.parallel.CloseVariable();
			};
			this["execs"].push(func);
			target.push(this);
		};
		CSL.Util.substituteEnd.call(this,state,target);
	};
};


