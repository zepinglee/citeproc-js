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
CSL.Node.layout = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			state.build.layout_flag = true;
			//
			// done_vars is used to prevent the repeated
			// rendering of variables
			var initialize_done_vars = function(state,Item){
				state.tmp.done_vars = new Array();
				//CSL.debug("== init rendered_name ==");
				state.tmp.rendered_name = false;
			};
			this.execs.push(initialize_done_vars);

			var set_opt_delimiter = function(state,Item){
				// just in case
				state.tmp.sort_key_flag = false;
				state[state.tmp.area].opt.delimiter = "";
				if (this.strings.delimiter){
					state[state.tmp.area].opt.delimiter = this.strings.delimiter;
				};
			};
			this["execs"].push(set_opt_delimiter);

			var reset_nameset_counter = function(state,Item){
				state.tmp.nameset_counter = 0;
			};
			this["execs"].push(reset_nameset_counter);

			state[state.build.area].opt.layout_prefix = this.strings.prefix;
			state[state.build.area].opt.layout_suffix = this.strings.suffix;
			state[state.build.area].opt.layout_delimiter = this.strings.delimiter;
			state[state.build.area].opt.layout_decorations = this.decorations;

			var declare_thyself = function(state,Item){
				state.tmp.term_predecessor = false;
				state.output.openLevel("empty");
			};
			this["execs"].push(declare_thyself);
			target.push(this);
			if (state.build.area == "citation"){
				var prefix_token = new CSL.Token("text",CSL.SINGLETON);
				var func = function(state,Item){
					if (Item["prefix"]){
						var sp = "";
						if (Item["prefix"].match(CSL.ROMANESQUE_REGEXP)){
							var sp = " ";
						}
						state.output.append((Item["prefix"]+sp),this);
					};
				};
				prefix_token["execs"].push(func);
				target.push(prefix_token);
			}
		};
		if (this.tokentype == CSL.END){
			state.build.layout_flag = false;
			if (state.build.area == "citation"){
				var suffix_token = new CSL.Token("text",CSL.SINGLETON);
				var func = function(state,Item){
					if (Item["suffix"]){
						var sp = "";
						if (Item["suffix"].match(CSL.ROMANESQUE_REGEXP)){
							var sp = " ";
						}
						state.output.append((sp+Item["suffix"]),this);
					};
				};
				suffix_token["execs"].push(func);
				target.push(suffix_token);
			}
			var mergeoutput = function(state,Item){
				if (state.tmp.area == "bibliography"){
					if (state.bibliography.opt["second-field-align"]){
						state.output.endTag();  // closes bib_other
					};
				};
				state.output.closeLevel();
			};
			this["execs"].push(mergeoutput);
			target.push(this);
		}
	};
};


