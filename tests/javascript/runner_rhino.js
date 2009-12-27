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
//This file is the command-line entry point for running the tests in
//Rhino

/*=====
dojo.tests = {
	// summary: D.O.H. Test files for Dojo unit testing.
};
=====*/

//
// XXXXX rhino specific
//
load("./dojo/dojo/dojo.js");
dojo.registerModulePath("dojo","./dojo/dojo");
dojo.registerModulePath("dojox","./dojo/dojox");
dojo.registerModulePath("tests","./tests/javascript");
dojo.registerModulePath("csl","./src");
dojo.registerModulePath("csl.output","./src/output");
dojo.registerModulePath("doh","./dojo/util/doh");

load("./src/load.js");

CSL.debug("#####");
CSL.debug("Rhino file.encoding: "+environment["file.encoding"]);
if ("UTF-8" != environment["file.encoding"]){
	environment["file.encoding"] = "UTF-8";
	environment["sun.jnu.encoding"] = "UTF-8";
	CSL.debug("Reset Rhino file.encoding to UTF-8");
}
CSL.debug("#####");

load("./src/testing_rhino.js");
load("./src/testing_stdrhino.js");

load("./tests/javascript/run.js");
