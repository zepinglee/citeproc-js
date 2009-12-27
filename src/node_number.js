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
CSL.Node.number = new function(){
	this.build = build;
	function build(state,target){
		CSL.Util.substituteStart.call(this,state,target);
		//
		// This should push a rangeable object to the queue.
		//
		if (this.strings.form == "roman"){
			this.formatter = state.fun.romanizer;
		} else if (this.strings.form == "ordinal"){
			this.formatter = state.fun.ordinalizer;
		} else if (this.strings.form == "long-ordinal"){
			this.formatter = state.fun.long_ordinalizer;
		}
		//
		// Whether we actually stick a number object on
		// the output queue depends on whether the field
		// contains a pure number.
		//
		var push_number_or_text = function(state,Item){
			var varname = this.variables[0];
			state.parallel.StartVariable(this.variables[0]);
			state.parallel.AppendToVariable(Item[this.variables[0]]);

			if (varname == "page-range" || varname == "page-first"){
				varname = "page";
			};
			var num = Item[varname];
			if ("undefined" != typeof num) {
				if (this.variables[0] == "page-first"){
					var m = num.split(/\s*(&|,|-)\s*/);
					num = m[0];
				}
				var m = num.match(/\s*([0-9]+).*/);
				if (m){
					num = parseInt( m[1], 10);
					var number = new CSL.NumericBlob( num, this );
					state.output.append(number,"literal");
				} else {
					state.output.append(num, this);
				};
			};
			state.parallel.CloseVariable();
		};
		this["execs"].push(push_number_or_text);

		target.push(this);
		CSL.Util.substituteEnd.call(this,state,target);
	};
};


