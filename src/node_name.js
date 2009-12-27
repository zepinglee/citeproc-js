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
CSL.Node.name = new function(){
	this.build = build;
	function build(state,target){

		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1){
			state.fixOpt(this,"name-delimiter","delimiter");
			state.fixOpt(this,"name-form","form");
			//
			// Okay, there's a problem with these.  Each of these is set
			// on the name object, but must be accessible at the closing of
			// the enclosing names object.  How did I do this before?
			//
			// Boosting to tmp seems to be the current strategy, and although
			// that's very messy, it does work.  It would be simple enough
			// to extend the function applied to initialize-with below (which
			// tests okay) to the others.  Probably that's the best short-term
			// solution.
			//
			// The boost to tmp could be a boost to build, instead.  That would
			// limit the jiggery-pokery and overhead to the compile phase.
			// Might save a few trees, in aggregate.
			//
			state.fixOpt(this,"and","and");
			state.fixOpt(this,"delimiter-precedes-last","delimiter-precedes-last");
			state.fixOpt(this,"initialize-with","initialize-with");
			state.fixOpt(this,"name-as-sort-order","name-as-sort-order");
			state.fixOpt(this,"sort-separator","sort-separator");

			state.fixOpt(this,"et-al-min","et-al-min");
			state.fixOpt(this,"et-al-use-first","et-al-use-first");
			state.fixOpt(this,"et-al-subsequent-min","et-al-subsequent-min");
			state.fixOpt(this,"et-al-subsequent-use-first","et-al-subsequent-use-first");

			state.build.nameattrs = new Object();
			for each (attrname in CSL.NAME_ATTRIBUTES){
				state.build.nameattrs[attrname] = this.strings[attrname];
			}

			state.build.form = this.strings.form;
			state.build.name_flag = true;

			var set_et_al_params = function(state,Item){
				if (Item.position || state.tmp.force_subsequent){
					if (! state.tmp["et-al-min"]){
						if (this.strings["et-al-subsequent-min"]){
							state.tmp["et-al-min"] = this.strings["et-al-subsequent-min"];
						} else {
							state.tmp["et-al-min"] = this.strings["et-al-min"];
						}
					}
					if (! state.tmp["et-al-use-first"]){
						if (this.strings["et-al-subsequent-use-first"]){
							state.tmp["et-al-use-first"] = this.strings["et-al-subsequent-use-first"];
						} else {
							state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
						}
					}
				} else {
					if (! state.tmp["et-al-min"]){
						state.tmp["et-al-min"] = this.strings["et-al-min"];
					}
					if (! state.tmp["et-al-use-first"]){
						state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
					}
				}
			};
			this["execs"].push(set_et_al_params);

			var func = function(state,Item){
				state.output.addToken("name",false,this);
			};
			this["execs"].push(func);

			//var set_initialize_with = function(state,Item){
			//	state.tmp["initialize-with"] = this.strings["initialize-with"];
			//};
			//this["execs"].push(set_initialize_with);

		}

		target.push(this);
	};
};


