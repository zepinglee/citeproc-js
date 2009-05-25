dojo.provide("csl.csl");


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
 * wrapper methods available on the
 * {@link CSL.Core.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
CSL = new function () {
	this.START = 0;
	this.END = 1;
	this.SINGLETON = 2;

	this.SUCCESSOR = 3;
	this.SUCCESSOR_OF_SUCCESSOR = 4;
	this.SUPPRESS = 5;

	this.SINGULAR = 0;
	this.PLURAL = 1;

	this.LITERAL = true;

	this.BEFORE = 1;
	this.AFTER = 2;

	this.DESCENDING = 1;
	this.ASCENDING = 2;

	this.FINISH = 1;

	this.POSITION_FIRST = 0;
	this.POSITION_SUBSEQUENT = 1;
	this.POSITION_IBID = 2;
	this.POSITION_IBID_WITH_LOCATOR = 3;

	this.COLLAPSE_VALUES = ["citation-number","year","year-suffix"];

	this.ET_AL_NAMES = ["et-al-min","et-al-use-first"];
	this.ET_AL_NAMES = this.ET_AL_NAMES.concat( ["et-al-subsequent-min","et-al-subsequent-use-first"] );

	this.DISAMBIGUATE_OPTIONS = ["disambiguate-add-names","disambiguate-add-givenname"];
	this.DISAMBIGUATE_OPTIONS.push("disambiguate-add-year-suffix");

	this.PREFIX_PUNCTUATION = /.*[.;:]\s*$/;
	this.SUFFIX_PUNCTUATION = /^\s*[.;:,\(\)].*/;

	this.NUMBER_REGEXP = /(?:^\d+|\d+$|\d{3,})/; // avoid evaluating "F.2d" as numeric
	this.QUOTED_REGEXP = /^".+"$/;
	//
	// \u0400-\u042f are cyrillic and extended cyrillic capitals
	this.NAME_INITIAL_REGEXP = /^([A-Z\u0400-\u042f])([A-Z\u0400-\u042f])*.*$/;

	var x = new Array();
	x = x.concat(["edition","volume","number-of-volumes","number"]);
	x = x.concat(["issue","title","container-title","issued","page"]);
	x = x.concat(["locator","collection-number","original-date"]);
	x = x.concat(["reporting-date","decision-date","filing-date"]);
	x = x.concat(["revision-date"]);
	this.NUMERIC_VARIABLES = x.slice();
	this.DATE_VARIABLES = ["issued","event","accessed","container","original-date"];

	var x = new Array();
	x = x.concat(["@text-case","@font-family","@font-style","@font-variant"]);
	x = x.concat(["@font-weight","@text-decoration","@vertical-align"]);
	x = x.concat(["@display","@quotes"]);
	this.FORMAT_KEY_SEQUENCE = x.slice();
	this.SUFFIX_CHARS = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
	this.ROMAN_NUMERALS = [
		[ "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ],
		[ "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc" ],
		[ "", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm" ],
		[ "", "m", "mm", "mmm", "mmmm", "mmmmm"]
	];
	this.CREATORS = ["author","editor","translator","recipient","interviewer"];
	this.CREATORS = this.CREATORS.concat(["publisher","composer"]);
	this.CREATORS = this.CREATORS.concat(["original-publisher","original-author"]);
	this.CREATORS = this.CREATORS.concat(["container-author","collection-editor"]);
};

//SNIP-START

if (!CSL.Core){
	load("./src/core.js");
}
if (!CSL.Core.Engine){
	load("./src/state.js");
}
if (!CSL.Core.Engine.prototype.makeBibliography){
	load("./src/render.js");
}
if (!CSL.Core.Build){
	load("./src/build.js");
}
if (!CSL.Core.Configure){
	load("./src/configure.js");
}
if (!CSL.Util){
	load("./src/util.js");
}
if (!CSL.Util.TokenFactory){
	load("./src/util_token.js");
}
if (!CSL.Util.Dates){
	load("./src/util_dates.js");
}
if (!CSL.Util.Disambiguate){
	load("./src/util_disambiguate.js");
}
if (!CSL.Util.FlipFlop){
	load("./src/util_flipflop.js");
}
if (!CSL.Util.Names){
	load("./src/util_names.js");
}
if (!CSL.Util.Sort){
	load("./src/util_sort.js");
}
if (!CSL.Util.substituteStart){
	load("./src/util_substitute.js");
}
if (!CSL.Factory){
	load("./src/factory.js");
}
if (!CSL.makeStyle){
	load("./src/commands.js")
	;}
if (!CSL.Factory.Blob){
	load("./src/blob.js");
}
if (!CSL.Factory.Token){
	load("./src/token.js");
}
if (!CSL.Factory.Stack){
	load("./src/stack.js");
}
if (!CSL.Factory.AmbigConfig){
	load("./src/ambigconfig.js");
}
if (!CSL.Factory.Registry){
	load("./src/registry.js");
}
if (!CSL.Factory.Registry.prototype.disambiguateCites){
	load("./src/disambiguate.js");
}
if (!CSL.Lib) {
    load("./src/lib.js");
}
if (!CSL.Lib.Elements) {
    load("./src/elements.js");
}
if (!CSL.Lib.Elements.Names){
	load("./src/libnames.js");
}
if (!CSL.Lib.Attributes) {
    load("./src/attributes.js");
}
if (!CSL.Output){
	load("./src/output.js");
}
if (!CSL.Output.Queue){
	load("./src/queue.js");
}
if (!CSL.Output.Formatters) {
	load("./src/formatters.js");
}
if (!CSL.Output.Formats){
	load("./src/formats.js");
}
if (!CSL.Output.Range){
	load("./src/range.js");
}
if (!CSL.System){
	load("./src/system.js");
}
if (!CSL.System.Xml) {
	load("./src/xml.js");
}
if (!CSL.System.Xml.E4X) {
	load("./src/xmle4x.js");
}
if (!CSL.System.Xml.JunkyardJavascript) {
	load("./src/xmljs.js");
}
if (!CSL.System.Retrieval) {
    load("./src/retrieval.js");
}
if (!CSL.System.Tests) {
    load("./src/tests.js");
}

//SNIP-END
