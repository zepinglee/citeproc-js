dojo.provide("csl.configure");
if (!CSL) {
	load("./src/csl.js");
}


/**
 * Second-stage compiler.
 * <p>Instantiates with the raw style object returned by
 * {@link CSL.Core.Build#build}, and	provides a method that
 * returns a copy of the object stripped of its build
 * and configure areas, and complete with token jump
 * points for conditional branching, output rendering
 * functions, and methods for processing data items.</p>
 * @namespace Style configuration
 * @param {Object} builderobject The object output
 * by {@link CSL.Core.Build#build}.
 * @param {String} mode Optional.  Default is "html".
 * @example
 * builder = CSL.Core.Build(myxml)
 * raw_engine = builder.build()
 * configurator = CSL.Core.Configure(raw_engine,"rtf")
 * style_engine = configurator.configure()
 */
CSL.Core.Configure = function(state,mode) {
	this.state = state;
	if (!mode){
	    mode = "html";
	}

	if (this.state.build){
		delete this.state.build;
	}
	this.state.fun.decorate = CSL.Factory.Mode(mode);
	this.state.opt.mode = mode;
};


/**
 * Configure the citation style.
 * <p>In a single back-to-front pass over the token list, this sets
 * jump positions on conditional tokens (<code>if</code>,
 * <code>else-if</code>, <code>else</code>), installs rendering
 * functions used to generate output,
 * deletes the <code>build</code> and
 * <code>configure</code> areas, and attaches the iterface methods
 * from {@link CSL.Core.Render} that are needed for processing data
 * items.</p>
 */
CSL.Core.Configure.prototype.configure = function(){
	for each (var area in ["citation", "citation_sort", "bibliography","bibliography_sort"]){
		for (var pos=(this.state[area].tokens.length-1); pos>-1; pos--){
			var token = this.state[area].tokens[pos];
			token["next"] = (pos+1);
			if (token.name && CSL.Lib.Elements[token.name].configure){
				CSL.Lib.Elements[token.name].configure.call(token,this.state,pos);
			}
		}
	}
	this.state["version"] = CSL.Factory.version;
	return this.state;
};
