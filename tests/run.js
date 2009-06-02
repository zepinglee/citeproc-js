dojo.require("doh.runner");
//
// requested tests go here
if(true){
	dojo.require("tests.std_name");
	dojo.require("tests.std_affix");
	dojo.require("tests.std_date");
	dojo.require("tests.std_disambiguate");
	dojo.require("tests.std_position");
	dojo.require("tests.std_collapse");
	dojo.require("tests.test_build_internals");
	dojo.require("tests.std_fullstyles");

	dojo.require("tests.std_locators");
	dojo.require("tests.std_condition");
	dojo.require("tests.std_magic");
	dojo.require("tests.std_number");
	dojo.require("tests.std_sort");
	dojo.require("tests.test_build_integration");
	dojo.require("tests.test_build");
	dojo.require("tests.test_commands");
	dojo.require("tests.test_conditions");
	dojo.require("tests.test_configure");
	dojo.require("tests.test_csl");
	dojo.require("tests.test_dates");
	dojo.require("tests.test_factory");
	dojo.require("tests.test_failing");
	dojo.require("tests.test_flipflop");
	dojo.require("tests.test_formatters");
	dojo.require("tests.test_groups");
	dojo.require("tests.test_list");
	dojo.require("tests.test_load_styles");
	dojo.require("tests.test_locale");
	dojo.require("tests.test_names_import");
	dojo.require("tests.test_output");
	dojo.require("tests.test_range");
	dojo.require("tests.test_registry");
	dojo.require("tests.test_render");
	dojo.require("tests.test_retrieval");
	dojo.require("tests.test_sequence");
	dojo.require("tests.test_sort");
	dojo.require("tests.test_term");
	dojo.require("tests.test_util_names");
	dojo.require("tests.test_xmle4x");
	dojo.require("tests.test_xmljs");
} else {

	dojo.require("tests.test_load_all_styles");
	dojo.require("tests.std_decorations");
	dojo.require("tests.test_speed");

	print("Nothing here");
}

tests.run();
