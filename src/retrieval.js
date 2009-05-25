dojo.provide("csl.retrieval");
if (!CSL){
	load("./src/csl.js");
}

/**
 * Static functions for retrieving field content.
 * <p>What goes here will depend on the environment
 * in which this is deployed.  Functions take an item
 * and a fieldname as argument.</p>
 * @namespace Retrieval
 */
CSL.System.Retrieval = function(){};

/**
 * Get locale data for a specific language and return
 * as a token list.
 */
CSL.System.Retrieval.getLocaleObjects = function(state){
	var locale = state.opt.locale;
	//
	// we're a static function, so this refers to the
	// global object
	if ( ! locale ){
		try {
			locale = state.sys.getLang(state.opt.lang);
		} catch (e){
			throw "Unable to load locale for "+state.opt.lang+": "+e;
		}
	}
	var builder = new CSL.Core.Build(locale);
	builder.build();
	return builder.state.opt.term;

};

