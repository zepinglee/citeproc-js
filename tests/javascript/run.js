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
dojo.require("doh.runner");
//
// requested tests go here
if(true){
	dojo.require("tests.std_institutions");
	dojo.require("tests.std_bluebook");
	dojo.require("tests.std_abbrevs");
	dojo.require("tests.std_eclac");
	dojo.require("tests.test_sys_stdrhino_locale");
	dojo.require("tests.test_queue");
	dojo.require("tests.std_parallel");
	dojo.require("tests.std_locale");
	dojo.require("tests.std_flipflop");
    dojo.require("tests.test_sys_rhino_locale");

	// (will run nonetheless under test.py)
	dojo.require("tests.test_dateparse");

	dojo.require("tests.std_number");
	dojo.require("tests.std_condition");
	dojo.require("tests.test_util_names");
	dojo.require("tests.std_magic");
	dojo.require("tests.std_name");
	dojo.require("tests.std_date");
	dojo.require("tests.std_bibsection");
	dojo.require("tests.std_disambiguate");
	dojo.require("tests.std_nameattr");
	dojo.require("tests.std_fullstyles");
	dojo.require("tests.std_multilingual");
	dojo.require("tests.std_sort");
	dojo.require("tests.std_textcase");
	dojo.require("tests.std_page");
	dojo.require("tests.std_decorations");
	dojo.require("tests.std_quotes");
	dojo.require("tests.std_position");
	dojo.require("tests.test_registry");
	dojo.require("tests.test_load_styles");
	dojo.require("tests.std_class");
	dojo.require("tests.std_plural");
	dojo.require("tests.std_collapse");
	dojo.require("tests.std_namespaces");
	dojo.require("tests.std_affix");
	dojo.require("tests.test_flipflopper");

	dojo.require("tests.std_api");
	dojo.require("tests.std_variables");

	dojo.require("tests.test_conditions");
	dojo.require("tests.std_discretionary");
	dojo.require("tests.test_build");
	dojo.require("tests.test_sys_rhino_load");
	dojo.require("tests.test_sys_stdrhino_load");
	dojo.require("tests.test_opt");
	dojo.require("tests.test_stack");
	dojo.require("tests.test_ambigconfig");
	dojo.require("tests.test_tmp");
	dojo.require("tests.test_suffixator");
	dojo.require("tests.test_romanizer");
	dojo.require("tests.test_blob");
	dojo.require("tests.test_fun");
	dojo.require("tests.test_formatters");
	dojo.require("tests.test_formats");
	dojo.require("tests.test_output");
	dojo.require("tests.std_locators");

} else {

	//SNIP-START


	//dojo.require("tests.test_load_all_styles");
	//dojo.require("tests.test_speed");

	CSL.debug("Nothing here");
}

tests.run();
