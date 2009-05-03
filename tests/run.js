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
//dojo.registerModulePath("tests","/home/bennett/src/citeproc-js-fbennett/tests");
dojo.registerModulePath("csl","./src");
dojo.registerModulePath("csl.output","./src/output");
dojo.registerModulePath("doh","./dojo/util/doh");

dojo.require("doh.runner");
dojo.require("csl.csl");

//
// requested tests go here
if(true){
  	dojo.require("tests.std_collapse");
	dojo.require("tests.test_registry");
	dojo.require("tests.test_term");
	dojo.require("tests.test_build");
	dojo.require("tests.test_configure");
  	dojo.require("tests.std_condition");
  	dojo.require("tests.std_name");

	dojo.require("tests.test_dates");
	dojo.require("tests.test_render");
	dojo.require("tests.test_names_import");
	dojo.require("tests.test_formatters");
	dojo.require("tests.test_build_internals");
	dojo.require("tests.test_output");
  	dojo.require("tests.test_range");
	dojo.require("tests.test_build_integration");
	dojo.require("tests.test_csl");
	dojo.require("tests.test_sequence");
	dojo.require("tests.test_factory");
	dojo.require("tests.test_xmljs");
	dojo.require("tests.test_conditions");
	dojo.require("tests.test_locale");
	dojo.require("tests.test_retrieval");
	dojo.require("tests.test_xmle4x");
	dojo.require("tests.test_list");
	dojo.require("tests.test_groups");
	dojo.require("tests.test_failing");
	dojo.require("tests.test_load_styles");
  	dojo.require("tests.std_term");
	dojo.require("tests.test_commands");
  	dojo.require("tests.std_disambiguate");
  	dojo.require("tests.std_date");
	dojo.require("tests.test_util_names");
  	dojo.require("tests.std_sort");
	dojo.require("tests.test_sort");
} else {

	print("Nothing here");
}

tests.run();
