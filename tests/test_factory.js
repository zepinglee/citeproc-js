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
dojo.provide("tests.test_factory");


doh.register("tests.factory", [

	function testIfItWorksAtAll() {
		function testme () {
			try {
				var fmt = CSL.Factory.substituteOne;
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testFactoryStack (){
		doh.assertEqual( "bogus", new CSL.Engine("bogus").build.xmlCommandInterface );
	},
	function testSubstituteOne() {
		var template = "<b>%%STRING%%</b>";
		var func = CSL.Factory.substituteOne(template);
		doh.assertEqual( "<b>My Aunt Sally</b>", func("My Aunt Sally"));
	},

	function testSubstituteTwo() {
		var template = "<span style=\"font-fantastic:%%PARAM%%\">%%STRING%%</span>";
		var func = CSL.Factory.substituteTwo(template);
		var func2 = func("courier");
		doh.assertEqual( "<span style=\"font-fantastic:courier\">My Aunt Sally</span>", func2("My Aunt Sally"));
	},

	function testOutputModeCompilerAttribute(){
		var res = CSL.Factory.Mode("html");
		doh.assertTrue( res["@font-style"] );
	},
	function testOutputModeCompilerValue(){
		var res = CSL.Factory.Mode("html");
		doh.assertTrue( res["@font-style"]["italic"] );
	},
	function testOutputModeCompilerFunction(){
		var res = CSL.Factory.Mode("html");
		doh.assertEqual( "function", typeof res["@font-style"]["italic"] );
	},
	function testOutputModeCompilerAction(){
		var res = CSL.Factory.Mode("html");
		doh.assertEqual( "<i>My Aunt Sally</i>", res["@font-style"]["italic"]("My Aunt Sally") );
	}
]);
