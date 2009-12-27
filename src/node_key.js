/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
CSL.Node.key = new function(){
	this.build = build;
	function build(state,target){
		var start_key = new CSL.Token("key",CSL.START);
		start_key.strings["et-al-min"] = this.strings["et-al-min"];
		start_key.strings["et-al-use-first"] = this.strings["et-al-use-first"];
		var initialize_done_vars = function(state,Item){
			state.tmp.done_vars = new Array();
		};
		start_key.execs.push(initialize_done_vars);

		var sort_direction = new Array();
		if (this.strings.sort_direction == CSL.DESCENDING){
			sort_direction.push(1);
			sort_direction.push(-1);
		} else {
			sort_direction.push(-1);
			sort_direction.push(1);
		}
		state[state.build.area].opt.sort_directions.push(sort_direction);

		var et_al_init = function(state,Item){
			state.tmp.sort_key_flag = true;
			if (this.strings["et-al-min"]){
				state.tmp["et-al-min"] = this.strings["et-al-min"];
			}
			if (this.strings["et-al-use-first"]){
				state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
			}
		};
		start_key["execs"].push(et_al_init);
		target.push(start_key);
		//
		// ops to initialize the key's output structures
		if (this.variables.length){
			var variable = this.variables[0];
			if (CSL.CREATORS.indexOf(variable) > -1) {
				//
				// Start tag
				var names_start_token = new CSL.Token("names",CSL.START);
				names_start_token.tokentype = CSL.START;
				names_start_token.variables = this.variables;
				CSL.Node.names.build.call(names_start_token,state,target);
				//
				// Middle tag
				var name_token = new CSL.Token("name",CSL.SINGLETON);
				name_token.tokentype = CSL.SINGLETON;
				name_token.strings["name-as-sort-order"] = "all";
				CSL.Node.name.build.call(name_token,state,target);
				//
				// End tag
				var names_end_token = new CSL.Token("names",CSL.END);
				names_end_token.tokentype = CSL.END;
				CSL.Node.names.build.call(names_end_token,state,target);
			} else {
				var single_text = new CSL.Token("text",CSL.SINGLETON);
				if (variable == "citation-number"){
					var output_func = function(state,Item){
						state.output.append(state.registry.registry[Item["id"]].seq.toString(),"empty");
					};
				} else if (CSL.DATE_VARIABLES.indexOf(variable) > -1) {
					var output_func = function(state,Item){
						if (Item[variable]){
							var dp = Item[variable]["date-parts"];
							if (dp && dp[0]){
								if (dp[0].length >0){
									state.output.append(CSL.Util.Dates.year["long"](state,dp[0][0]));
								}
								if (dp[0].length >1){
									state.output.append(CSL.Util.Dates.month["numeric-leading-zeros"](state,dp[0][1]));
								}
								if (dp[0].length >2){
									state.output.append(CSL.Util.Dates.day["numeric-leading-zeros"](state,dp[0][2]));
								}
							}

						};
					};
				} else if ("title" == variable) {
					var output_func = function(state,Item){
						var value = Item[variable];
						if (value){
							value = state.getTextSubField(value,"locale-sort",true);
							state.output.append(value,"empty");
						};
					};
				} else {
					var output_func = function(state,Item){
						state.output.append(Item[variable],"empty");
					};
				};
				single_text["execs"].push(output_func);
				target.push(single_text);
			};
		} else {
			//
			// if it's not a variable, it's a macro
			var token = new CSL.Token("text",CSL.SINGLETON);
			token.postponed_macro = this.postponed_macro;
			CSL.expandMacro.call(state,token);
		}
		//
		// ops to output the key string result to an array go
		// on the closing "key" tag before it is pushed.
		// Do not close the level.
		var end_key = new CSL.Token("key",CSL.END);
		var store_key_for_use = function(state,Item){
			var keystring = state.output.string(state,state.output.queue);
			if (false){
				CSL.debug("keystring: "+keystring+" "+typeof keystring);
			}
			if ("string" != typeof keystring){
				keystring = undefined;
			}
			state[state.tmp.area].keys.push(keystring);
			state.tmp.value = new Array();
		};
		end_key["execs"].push(store_key_for_use);
		var reset_key_params = function(state,Item){
			// state.tmp.name_quash = new Object();
			state.tmp["et-al-min"] = false;
			state.tmp["et-al-use-first"] = false;
			state.tmp.sort_key_flag = false;
		};
		end_key["execs"].push(reset_key_params);
		target.push(end_key);
	};
};
