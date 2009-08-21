/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
dojo.require("doh.runner");
//
// requested tests go here
if(true){
	dojo.require("tests.std_quotes");
	dojo.require("tests.std_magic");
	dojo.require("tests.std_position");
	dojo.require("tests.std_date");
    dojo.require("tests.test_sys_rhino_locale");
	dojo.require("tests.test_registry");
	dojo.require("tests.test_load_styles");
	dojo.require("tests.test_sys_stdrhino_locale");
	dojo.require("tests.std_class");
	dojo.require("tests.test_queue");
	dojo.require("tests.std_plural");
	dojo.require("tests.std_collapse");
	dojo.require("tests.std_namespaces");
	dojo.require("tests.std_affix");
	dojo.require("tests.test_flipflopper");
	dojo.require("tests.std_number");
	dojo.require("tests.std_name");
	dojo.require("tests.std_flipflop");
	dojo.require("tests.std_condition");

	dojo.require("tests.std_api");
	dojo.require("tests.std_disambiguate");
	dojo.require("tests.std_variables");

	dojo.require("tests.test_conditions");
	//dojo.require("tests.std_terms");
	dojo.require("tests.std_discretionary");
	dojo.require("tests.std_fullstyles");
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
	dojo.require("tests.std_sort");

} else {


	// most of this stuff now needs to be refactored
	dojo.require("tests.test_build_internals");
	dojo.require("tests.test_build_integration");
	dojo.require("tests.test_build");
	dojo.require("tests.test_commands");
	dojo.require("tests.test_configure");
	dojo.require("tests.test_csl");
	dojo.require("tests.test_dates");
	dojo.require("tests.test_factory");
	dojo.require("tests.test_failing");
	dojo.require("tests.test_groups");
	dojo.require("tests.test_list");
	dojo.require("tests.test_locale");
	dojo.require("tests.test_names_import");
	dojo.require("tests.test_range");
	dojo.require("tests.test_render");
	dojo.require("tests.test_retrieval");
	dojo.require("tests.test_sequence");
	dojo.require("tests.test_sort");
	dojo.require("tests.test_term");
	dojo.require("tests.test_util_names");
	dojo.require("tests.test_xmle4x");
	dojo.require("tests.test_xmljs");

	// the final challenge

	// this stuff is either burdensome or broken
	dojo.require("tests.test_load_all_styles");
	dojo.require("tests.std_decorations");
	dojo.require("tests.test_speed");

	CSL.debug("Nothing here");
}

tests.run();
