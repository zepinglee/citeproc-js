dojo.provide("csl.csl");


/**
 * A Javascript implementation of the CSL citation formatting language.
 * <p>This project aims to produce an upgrade to the citation formatter
 * used by
 * <a href="http://www.zotero.org/">Zotero</a>, the popular bibliographic
 * management plugin for Firefox.  Like the current processor, this
 * will be controlled by the Citation Style Language (CSL) authored
 * by Bruce D'Arcus, beginning with a design concept that began
 * taking shape in the <a href="http://community.muohio.edu/blogs/darcusb/archives/2004/08/13/processing-citations">Summer of 2004</a>, leading to a draft schema that emerged
 * in <a href="http://community.muohio.edu/blogs/darcusb/archives/2004/10/05/citation-style-language">October of the same year</a>.  Bruce's work became the basis for
 * citation formatting in Zotero (early on, when it was a GMU in-house product
 * known as Scholar) in the <a href="http://community.muohio.edu/blogs/darcusb/archives/2006/07/29/csl-progress">Summer of 2006</a>.
 *
 * The immediate trigger for the work here was a
 * <a href="http://groups.google.com/group/zotero-dev/browse_thread/thread/ef62506f54fd66de">discussion
 * on the <code>zotero-dev</code> list</a>, in which
 * several people signalled that a remake of the existing processor
 * on functional lines would be welcome.
 * The catalyst of temptation was
 * <a href="http://groups.google.com/group/zotero-dev/msg/2eea3cbc67b8e83d">a
 * post by Erik Hetzner</a>, offering example code for a more modular
 * implementation of the Zotero CSL processor.</p>
 *
 * <p>The only strict principle in this project is that additions or changes
 * to the code must be accompanied by tests proving that they work as intended
 * and don't break anything.  Apart from that, it's mostly about
 * common sense and what works.  Here's a short overview of how things fit
 * together at the moment.</p>
 *
 * <p>Processing takes place in three phases, by {@link CSL.Core.Build},
 * {@link CSL.Core.Configure} and {@link CSL.Core.Render}.  The {@link CSL.Core.Build}
 * module imports the CSL format file to be applied to the citations, and
 * transforms it into a one-dimensional token list, flattening all macros,
 * registering functions and parameters on each token as appropriate,
 * and converting locale terms to a hash for reference during rendering.
 * The {@link CSL.Core.Configure}
 * module sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * It also sets up a hash containing functions for generating output
 * in a particular format (with a default of <code>HTML</code>).
 * The first two phases
 * yield a token list that can be executed front-to-back by
 * {@link CSL.Core.Render} using a simple execution wrapper that takes a set of
 * Item objects (a "citation") as argument, and returns a string in the
 * requested output format.</p>
 *
 * <p>The initial development has been done under Rhino, using E4X for the
 * initial parsing of XML style information, but the engine is not anchored
 * to E4X.  The small number of DOM instantiation and navigation functions
 * required by the engine are encased in a wrapper (see {@link CSL.System.Xml}).
 * For those who which to use the engine in environments where E4X is
 * not available, the <code>JunkyardJavascript</code> parser, written in
 * pure Javascript, demonstrates what is needed to implement of an alternative
 * XML parser -- <code>JunkyardJavascript</code> itself is not meant for
 * production use, although it does seem to work).</p>
 *
 * <p>(In passing, I should perhaps mention that the
 * <a href="http://wso2.org/project/mashup/1.5.1/docs/e4xquickstart.html">E4X
 * Quick Start Guide</a> is an enormously helpful a starting point
 * for learning how to manipulate the XML tree using E4X.)</p>
 *
 * <p>If there are things that the style engine will not do, or things
 * that it does incorrectly, or not as well as it might, code contributions
 * are very welcome.  The only requirement, as noted above, is that code
 * be accompanied by tests.  The test suites and the <a href="">online code
 * commentary</a> should provide sufficient guidance on
 * what happens where.  If you have any questions, feel free to
 * <a href="mailto:biercenator@gmail.com">write me direct</a>.  Zotero
 * is a core tool in the writing programs of the faculty where I work,
 * so I'll be sticking with this item for the foreseeable future.</p>
 *
 * <p>Finally, about this top-level {@link CSL} object itself, this is
 * the place to define any constants that are needed during processing.</p>
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
};

//SNIP-START

//if (!CSL.Lib){
//	load("./src/lib.js");
//}
if (!CSL.Core){
	load("./src/core.js");
}
if (!CSL.Core.Render){
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
if (!CSL.Util.Positioner){
	load("./src/position.js");
}
if (!CSL.Factory){
	load("./src/factory.js");
}
if (!CSL.Factory.State){
	load("./src/state.js");
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
