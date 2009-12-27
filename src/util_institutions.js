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
CSL.Util.Institutions = new function(){};

/**
 * Build a set of names, less any label or et al. tag
 */
CSL.Util.Institutions.outputInstitutions = function(state,display_names){

	state.output.openLevel("institution");
	for each (var name in display_names){
		var institution = state.output.getToken("institution");
		var value = name.literal;
		if (state.abbrev.institution[value]){
			var token_long = state.output.mergeTokenStrings("institution-long","institution-if-short");
		} else {
			var token_long = state.output.getToken("institution-long");
		}
		var token_short = state.output.getToken("institution-short");
		var parts = institution.strings["institution-parts"];
		if ("short" == parts){
			state.abbrev.output(state,value,token_short,token_long,true);
		} else if ("short-long" == parts) {
			state.abbrev.output(state,value,token_short);
			state.output.append(value,token_long);
		} else if ("long-short" == parts){
			state.output.append(value,token_long);
			state.abbrev.output(state,value,token_short);
		} else {
			state.output.append(value,token_long);
		};
	};
	state.output.closeLevel(); // institution
};
