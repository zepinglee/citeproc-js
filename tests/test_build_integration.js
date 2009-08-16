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
dojo.provide("tests.test_build_integration");



doh.registerGroup("tests.build_integration",
	[
		function testBuildObject(t){
			var textwithvalue = '<style><text value="My Aunt Sally" font-style="italic"/></style>';
			var sys = new RhinoTest();
			var build = new CSL.Core.Build(textwithvalue);
			var obj = build.build(sys);
			t.assertEqual("object", typeof obj );
		},
		function testBuildLength(t){
			var textwithvalue = '<style><text value="My Aunt Sally" font-style="italic"/></style>';
			var sys = new RhinoTest();
			var build = new CSL.Core.Build(textwithvalue);
			var obj = build.build(sys);
			t.assertEqual(1, obj.citation.tokens.length );
		},
		function testBuild(t){
			var textwithvalue = '<style><text value="My Aunt Sally" font-style="italic"/></style>';
			var sys = new RhinoTest();
			var build = new CSL.Core.Build(textwithvalue);
			var obj = build.build(sys);
			t.assertEqual("italic", obj.citation.tokens[0].decorations[0][1] );
		}
	]
);

