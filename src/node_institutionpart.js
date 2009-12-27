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
CSL.Node["institution-part"] = new function(){
	this.build = build;
	function build(state,target){
		if ("long" == this.strings.name){
			if (this.strings["if-short"]){
				var func = function(state,Item){
					state.output.addToken("institution-if-short",false,this);
				};
			} else {
				var func = function(state,Item){
					state.output.addToken("institution-long",false,this);
				};
			};
		} else if ("short" == this.strings.name){
			var func = function(state,Item){
				state.output.addToken("institution-short",false,this);
			};
		};
		this["execs"].push(func);
		target.push(this);
	};
};
