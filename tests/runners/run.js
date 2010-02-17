/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 */
dojo.require("doh.runner");
//
// requested tests go here
if ("undefined" != typeof CSL_OPTIONS){
   print(CSL_OPTIONS);
	print("Do custom test");
} else if(true){
	dojo.require("std.magic");
	dojo.require("std.sort");
	dojo.require("std.name");
	dojo.require("std.collapse");
	dojo.require("std.date");
	dojo.require("std.group");
	dojo.require("std.label");
	dojo.require("std.parallel");
	dojo.require("std.unicode");
	dojo.require("std.display");
	dojo.require("std.integration");
	dojo.require("std.bugreports");
	dojo.require("std.affix");
	dojo.require("std.abbrevs");
	dojo.require("std.institutions");
	dojo.require("citeproc_js.conditions");
	dojo.require("std.condition");
	dojo.require("std.bluebook");
	dojo.require("std.disambiguate");
	dojo.require("std.eclac");
	dojo.require("citeproc_js.sys_stdrhino_locale");
	dojo.require("citeproc_js.queue");
	dojo.require("std.locale");
	dojo.require("std.flipflop");
    dojo.require("citeproc_js.sys_rhino_locale");

	// (will run nonetheless under test.py)
	dojo.require("citeproc_js.dateparse");

	dojo.require("std.number");
	dojo.require("citeproc_js.util_names");
	dojo.require("std.bibsection");
	dojo.require("std.nameattr");
	dojo.require("std.fullstyles");
	dojo.require("std.multilingual");
	dojo.require("std.textcase");
	dojo.require("std.page");
	dojo.require("std.decorations");
	dojo.require("std.quotes");
	dojo.require("std.position");
	dojo.require("citeproc_js.registry");
	dojo.require("citeproc_js.load_styles");
	dojo.require("std.plural");
	dojo.require("std.namespaces");
	dojo.require("citeproc_js.flipflopper");

	dojo.require("std.api");
	dojo.require("std.variables");

	dojo.require("std.discretionary");
	dojo.require("citeproc_js.build");
	dojo.require("citeproc_js.sys_rhino_load");
	dojo.require("citeproc_js.sys_stdrhino_load");
	dojo.require("citeproc_js.opt");
	dojo.require("citeproc_js.stack");
	dojo.require("citeproc_js.ambigconfig");
	dojo.require("citeproc_js.tmp");
	dojo.require("citeproc_js.suffixator");
	dojo.require("citeproc_js.romanizer");
	dojo.require("citeproc_js.blob");
	dojo.require("citeproc_js.fun");
	dojo.require("citeproc_js.formatters");
	dojo.require("citeproc_js.formats");
	dojo.require("citeproc_js.output");
	dojo.require("std.locators");

} else {

	//SNIP-START


	// FAILS, needs refactoring of group output tracking stuff


	//dojo.require("citeproc_js.load_all_styles");
	//dojo.require("citeproc_js.speed");

	CSL.debug("Nothing here");
}

tests.run();
