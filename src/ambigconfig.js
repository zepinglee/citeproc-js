dojo.provide("csl.ambigconfig");
if (!CSL) {
   load("./src/csl.js");
}

/**
 * Ambiguous Cite Configuration Object
 * @class
 */
CSL.Factory.AmbigConfig = function(){
	this.maxvals = new Array();
	this.minval = 1;
	this.names = new Array();
	this.givens = new Array();
	this.year_suffix = 0;
	this.disambiguate = 0;
};
