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
CSL.Abbrev = function(){
	this.journal = new Object();
	this.series = new Object();
	this.institution = new Object();
	this.authority = new Object();
	this.hereinafter = new Object();
	this.abbreviations = "default";
};

CSL.Abbrev.prototype.output = function(state,value,token_short,token_long,use_fallback){
	var basevalue = state.getTextSubField( value,"default-locale",true);
	var shortvalue = state.abbrev.institution[value];
	if (shortvalue){
		state.output.append(shortvalue,token_short);
	} else {
		if (use_fallback){
			state.output.append(value,token_long);
		};
		print("UNKNOWN ABBREVIATION FOR: "+value);
	};
};

CSL.Abbrev.prototype.getOutputFunc = function(token,varname,vartype,altvar){

	return function(state,Item){
		var basevalue = state.getTextSubField( Item[varname],"default-locale",true);
		var value = "";
		if (state.abbrev[vartype]){
			if (state.abbrev[vartype][basevalue]){
				value = state.abbrev[vartype][ basevalue ];
			} else {
				print("UNKNOWN ABBREVIATION FOR ... "+basevalue );		}
		};
		if (!value && Item[altvar]){
			value = Item[altvar];
		};
		if (!value){
			value = basevalue;
		};
		state.output.append(value,token);
	};
};
