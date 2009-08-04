dojo.provide("csl.libnames");
if (!CSL) {
   load("./src/csl.js");
}

/**
 * The names node, start and end.
 * <p>Name handling happens here.  It's ... complicated.</p>
 * @name CSL.Lib.Elements.names
 * @function
 */
CSL.Lib.Elements.names = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START || this.tokentype == CSL.SINGLETON){
			CSL.Util.substituteStart.call(this,state,target);
			state.build.substitute_level.push(1);

			var init_names = function(state,Item){
				//
				// XXXXX: could be wrong here
				if (state.tmp.value.length == 0){
					for each (var variable in this.variables){
						//
						// If the item has been marked for quashing, skip it.
						//
						// XXXXX: name_quash superceded.
						//
						// if (Item[variable] && ! state.tmp.name_quash[variable]){
						if (Item[variable]){
							state.tmp.names_max.push(Item[variable].length);
							state.tmp.value.push({"type":variable,"names":Item[variable]});
							// saving relevant names separately, for reference
							// in splice collapse and in subsequent-author-substitute
							state.tmp.names_used.push(state.tmp.value.slice());
						}
					};
				}
			};
			this["execs"].push(init_names);
		};

		if (this.tokentype == CSL.START){

			state.build.names_flag = true;

			var init_can_substitute = function(state,Item){
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(init_can_substitute);

			var set_et_al_params = function(state,Item){
				state.output.startTag("names",this);
				state.tmp.name_node = state.output.current.value();
				// No value or zero means a first reference,
				// anything else is a subsequent reference.
				if (Item.position || state.tmp.force_subsequent){
						if (! state.tmp["et-al-min"]){
							if (state[state.tmp.area].opt["et-al-subsequent-min"]){
								state.tmp["et-al-min"] = state[state.tmp.area].opt["et-al-subsequent-min"];
							} else {
								state.tmp["et-al-min"] = state[state.tmp.area].opt["et-al-min"];
							}
						}
						if (! state.tmp["et-al-use-first"]){
							if (state[state.tmp.area].opt["et-al-subsequent-use-first"]){
								state.tmp["et-al-use-first"] = state[state.tmp.area].opt["et-al-subsequent-use-first"];
							} else {
								state.tmp["et-al-use-first"] = state[state.tmp.area].opt["et-al-use-first"];
							}
						}
				} else {
						if (! state.tmp["et-al-min"]){
							state.tmp["et-al-min"] = state[state.tmp.area].opt["et-al-min"];
						}
						if (! state.tmp["et-al-use-first"]){
							state.tmp["et-al-use-first"] = state[state.tmp.area].opt["et-al-use-first"];
						}
				}
			};
			this["execs"].push(set_et_al_params);
		};

		if (this.tokentype == CSL.END){

			var handle_names = function(state,Item){
				var namesets = new Array();
				var common_term = CSL.Util.Names.getCommonTerm(state,state.tmp.value);
				if (common_term){
					namesets = state.tmp.value.slice(0,1);
				} else {
					namesets = state.tmp.value;
				}
				var local_count = 0;
				var nameset = new Object();

				state.output.addToken("space"," ");
				state.output.addToken("sortsep",state.output.getToken("name").strings["sort-separator"]);

				if (!state.output.getToken("etal")){
					state.output.addToken("etal-join",", ");
					state.output.addToken("etal");
				} else {
					state.output.addToken("etal-join","");
				}
				if (!state.output.getToken("label")){
					state.output.addToken("label");
				}
				if (!state.output.getToken("etal").strings.et_al_term){
					state.output.getToken("etal").strings.et_al_term = state.getTerm("et-al","long",0);
				}
				state.output.addToken("commasep",", ");
				for each (namepart in ["secondary-key","primary-key","prefix","suffix"]){
					if (!state.output.getToken(namepart)){
						state.output.addToken(namepart);
					}
				}
				for  (var namesetIndex in namesets){
					nameset = namesets[namesetIndex];
					if (!state.tmp.suppress_decorations && (state[state.tmp.area].opt.collapse == "year" || state[state.tmp.area].opt.collapse == "year-suffix")){
						//
						// XXXX: This looks all messed up.  Apparently I'm using
						// last_names_used for two purposes -- to compare namesets
						// in a listing of nameset variables (which is what the code
						// below does), and to compare the actual name rendered
						// between cites (which is why the var gets reset before
						// _unit_of_reference is called from makeCitationCluster.
						//
						// Or so it seems on a quick look.  Might not need to touch
						// this, though; for bug #12, it will be enough to check
						// whether something has been rendered in the current cite.
						//
						// Ah, no.  This is fine, but the naming of the comparison
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
					// names, to satisfy the et-al constraints.
					var display_names = nameset.names.slice();
					var sane = state.tmp["et-al-min"] >= state.tmp["et-al-use-first"];
					//
					// if there is anything on name request, we assume that
					// it was configured correctly via state.names_request
					// by the function calling the renderer.
					var discretionary_names_length = state.tmp["et-al-min"];

					//
					// if rendering for display, do not honor a disambig_request
					// to set names length below et-al-use-first
					//
					if (state.tmp.suppress_decorations){
						if (state.tmp.disambig_request){
							discretionary_names_length = state.tmp.disambig_request["names"][state.tmp.nameset_counter];
						} else if (display_names.length >= state.tmp["et-al-min"]){
							discretionary_names_length = state.tmp["et-al-use-first"];
						}
					} else {
						if (state.tmp.disambig_request && state.tmp["et-al-use-first"] < state.tmp.disambig_request["names"][state.tmp.nameset_counter]){
							discretionary_names_length = state.tmp.disambig_request["names"][state.tmp.nameset_counter];
						} else if (display_names.length >= state.tmp["et-al-min"]){
							discretionary_names_length = state.tmp["et-al-use-first"];
						}
					}
					var overlength = display_names.length > discretionary_names_length;
					var et_al = false;
					var and_term = "";
					if (sane && overlength){
						if (! state.tmp.sort_key_flag){
							et_al = state.output.getToken("etal").strings.et_al_term;
						}
						display_names = display_names.slice(0,discretionary_names_length);
					} else {
						if (state.output.getToken("name").strings["and"] && ! state.tmp.sort_key_flag && display_names.length > 1){
							and_term = state.output.getToken("name").strings["and"];
						}
					}
					state.tmp.disambig_settings["names"][state.tmp.nameset_counter] = display_names.length;
					local_count += display_names.length;

					//
					// "name" is the format for the outermost nesting of a nameset
					// "inner" is a format consisting only of a delimiter, used for
					// joining all but the last name in the set together.
					var delim = state.output.getToken("name").strings.delimiter;
					state.output.addToken("inner",delim);
					//state.tmp.tokenstore["and"] = new CSL.Factory.Token("and");
					state.output.formats.value()["name"].strings.delimiter = and_term;
					for (var i in nameset.names){
						//
						// register the name in the global names disambiguation
						// registry
						state.registry.namereg.addname(Item.id,nameset.names[i],i);
						//
						// set the display mode default for givennames if required
						if (state.tmp.disambig_request){
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							var val = state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i];
							if (val == 1 && "undefined" == typeof state.tmp["initialize-with"]){
								val = 2;
							}
							var param = val;
							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
								var param = state.registry.namereg.eval(nameset.names[i],i,param,state.output.getToken("name").strings.form,state.tmp["initialize-with"]);
							};
						} else {
							//
							// ZZZZZ: it clicks.  here is where we will put the
							// call to the names register, to get the floor value
							// for an individual name.
							//
							var myform = state.output.getToken("name").strings.form;
							var myinitials = state.tmp["initialize-with"];
							var param = state.registry.namereg.eval(nameset.names[i],i,0,myform,myinitials);
							//print("MYFORM: "+myform+", PARAM: "+param);
							//var param = 2;
							//if (state.output.getToken("name").strings.form == "short"){
							//	param = 0;
							//} else if ("string" == typeof state.tmp["initialize-with"]){
							//	param = 1;
							//};
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

					state.output.openLevel("empty"); // for term join

					if (label && state.output.getToken("label").strings.label_position == CSL.BEFORE){
						state.output.append(label,"label");
					}


					state.output.openLevel("etal-join"); // join for etal

					CSL.Util.Names.outputNames(state,display_names);

					if (et_al){
						state.output.append(et_al,"etal");
					}

					state.output.closeLevel(); // etal

					if (label && state.tmp.name_label_position != CSL.BEFORE){
						state.output.append(label,"label");
					}

					state.output.closeLevel(); // term

					state.tmp.nameset_counter += 1;
				};
				if (state.output.getToken("name").strings.form == "count"){
					state.output.clearlevel();
					state.output.append(local_count.toString());
					state.tmp["et-al-min"] = false;
					state.tmp["et-al-use-first"] = false;
				}
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
				//
				// XXXXX: why not just use a simple var for can_substitute,
				// and set it to true when we reach the top level again?
				//
				if (!state.tmp.can_substitute.pop()){
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				CSL.Util.Names.reinit(state,Item);
				state.output.endTag(); // names
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
};
