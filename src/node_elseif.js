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
CSL.Node["else-if"] = new function(){
	this.build = build;
	this.configure = configure;
	//
	// these function are the same as those in if, might just clone
	function build (state,target){
		if (this.tokentype == CSL.START){
			//for each (var variable in this.variables){
			//	var func = function(state,Item){
			//		if (Item[variable]){
			//			return true;
			//		}
			//		return false;
			//	};
			//	this["tests"].push(func);
			//};
			if (this.strings.position){
				var tryposition = this.strings.position;
				var func = function(state,Item,item){
					if (state.tmp.force_subsequent && tryposition < 2){
						return true;
					} else if (item && item.position && item.position >= tryposition){
						return true;
					};
					return false;
				};
				this.tests.push(func);
			}
			if (! this.evaluator){
				//
				// cut and paste of "any"
				this.evaluator = state.fun.match.any;
			};
		}
		if (this.tokentype == CSL.END){
			var closingjump = function(state,Item){
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this["execs"].push(closingjump);
		};
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			// jump index on failure
			this["fail"] = state.configure["fail"].slice(-1)[0];
			this["succeed"] = this["next"];
			state.configure["fail"][(state.configure["fail"].length-1)] = pos;
		} else {
			// jump index on success
			this["succeed"] = state.configure["succeed"].slice(-1)[0];
			this["fail"] = this["next"];
		}
	}
};

