//This file is the command-line entry point for running the tests in
//Rhino

/*=====
dojo.tests = {
	// summary: D.O.H. Test files for Dojo unit testing.
};
=====*/

load("./dojo/dojo/dojo.js");
dojo.registerModulePath("dojo","./dojo/dojo");
dojo.registerModulePath("dojox","./dojo/dojox");
dojo.registerModulePath("tests","./tests");
dojo.registerModulePath("csl","./src");
dojo.registerModulePath("csl.output","./src/output");
dojo.registerModulePath("doh","./dojo/util/doh");

//
// XXXXX rhino specific
//
print("#####");
print("Rhino file.encoding: "+environment["file.encoding"]);
if ("UTF-8" != environment["file.encoding"]){
	environment["file.encoding"] = "UTF-8";
	print("Reset Rhino file.encoding to UTF-8");
}
print("#####");

dojo.require("csl.csl");
dojo.require("csl.testing_rhino");
dojo.require("csl.testing_stdrhino");

load("./tests/run.js");