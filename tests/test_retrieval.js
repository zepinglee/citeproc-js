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
dojo.provide("tests.test_retrieval");


doh.register("tests.retrieval",
	[
		function testStdLocaleReturnSomething(t){
			var sys = new RhinoTest();
			var res = sys.getLang("en");
			t.assertEqual( "string", typeof res );
			t.assertNotEqual( "", res );
		},
		function testRhinoLocaleReturnSomething(t){
			var sys = new RhinoTest();
			var res = sys.getLang("en");
			t.assertEqual( "string", typeof res );
			t.assertNotEqual( "", res );
		},
		function testItemGetFile(){
			var sys = new RhinoTest(["simple-western-name-1"]);
			var res = sys.items;
			doh.assertEqual("His Anonymous Life", res[0].title);
		},
		function testItemGetListOfFiles(){
			var sys = new RhinoTest(["simple-western-name-1", "simple-western-name-2"]);
			var res = sys.items;
			doh.assertEqual("His Anonymous Life", res[0].title);
			doh.assertEqual("Her Anonymous Life", res[1].title);
		},
		function testLocaleReturnCorrectLength(t){
			var sys = new RhinoTest();
			var state = new Object();
			state["opt"] = new Object();
			state["sys"] = sys;
			state.opt.lang = "en";
			var count = 0;
			var res = CSL.System.Retrieval.getLocaleObjects(state);
			for (var i in res){
				count += 1;
			}
			t.assertEqual(80, count);
		},
	]
);
