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
dojo.provide("tests.test_names_import");


doh.register("tests.names_import", [
	function testSimpleWesternName(){
		var sys = new RhinoTest(["simple-western-name-1"]);
		var input = sys.items;
		doh.assertEqual("Doe", input[0]["author"][0]["family"]);
		doh.assertEqual("John", input[0]["author"][0]["given"]);
	},
	function testTwoSimpleWesternNames(){
		var sys = new RhinoTest(["two-simple-western-names-1"]);
		var input = sys.items;
		doh.assertEqual("Doe", input[0]["author"][0]["family"]);
		doh.assertEqual("John", input[0]["author"][0]["given"]);
		doh.assertEqual("Roe", input[0]["author"][1]["family"]);
		doh.assertEqual("Jane", input[0]["author"][1]["given"]);
	},
	function testWesternNameWithArticular(){
		var sys = new RhinoTest(["western-name-with-articular-1"]);
		var input = sys.items;
		doh.assertEqual("Doe", input[0]["author"][0]["family"]);
		doh.assertEqual("Jacques", input[0]["author"][0]["given"]);
		doh.assertEqual("van", input[0]["author"][0].prefix);
	},
	function testWesternNameWithSuffix(){
		var sys = new RhinoTest(["western-name-with-space-suffix-1"]);
		var input = sys.items;
		doh.assertEqual("Doe", input[0]["author"][0]["family"]);
		doh.assertEqual("James", input[0]["author"][0]["given"]);
		doh.assertEqual("III", input[0]["author"][0].suffix);
	},
	function testWesternNameWithPeriodSuffix(){
		var sys = new RhinoTest(["western-name-with-space-suffix-2"]);
		var input = sys.items;
		doh.assertEqual("Doe", input[0]["author"][0]["family"]);
		doh.assertEqual("Jeffrey", input[0]["author"][0]["given"]);
		doh.assertEqual("Jr.", input[0]["author"][0].suffix);
	},
	function testSimpleAsianName(){
		var sys = new RhinoTest(["simple-sticky-name-1"]);
		var input = sys.items;
		doh.assertEqual("Miyamoto", input[0]["author"][0]["family"]);
		doh.assertEqual("Musashi", input[0]["author"][0]["given"]);
	},
	function testSimpleMongolianName(){
		var sys = new RhinoTest(["simple-mongolian-name-1"]);
		var input = sys.items;
		doh.assertEqual("Tserendorj", input[0]["author"][0]["family"]);
		doh.assertEqual("Balingiin", input[0]["author"][0]["given"]);
	},
	function testInstitutionalName(){
		var sys = new RhinoTest(["institution-name-1"]);
		var input = sys.items;
		doh.assertEqual("Ministry of Education, Sports, Culture, Science and Technology", input[0]["author"][0].literal);
	}
]);
