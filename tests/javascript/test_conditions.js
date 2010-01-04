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
dojo.provide("tests.test_conditions");


doh.registerGroup("tests.conditions",
	[
		function testNone(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"none\">"
					  + "<text value=\"Omote\"/>"
					  + "</if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Omote",cite);
		},
		function testMultipleElseIfFirstIsTrue(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"none\">"
					  + "<text value=\"Mikake\"/>"
					  + "</else-if>"
					  + "<else-if variable=\"title\" match=\"any\">"
					  + "<text value=\"Omote\"/>"
					  + "</else-if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Mikake",cite);
		},
		function testElseIf(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"none\">"
					  + "<text value=\"Omote\"/>"
					  + "</else-if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Omote",cite);
		},
		function testMultipleElseIfSecondIsTrue(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"any\">"
					  + "<text value=\"Mikake\"/>"
					  + "</else-if>"
					  + "<else-if variable=\"title\" match=\"none\">"
					  + "<text value=\"Omote\"/>"
					  + "</else-if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Omote",cite);
		},
		function testNested(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">" //false
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"any\">" //false
					  + "<text value=\"Mikake\"/>"
					  + "</else-if>"
					  + "<else-if variable=\"title\" match=\"none\">" //true
						  + "<choose>"
						  + "<if variable=\"title\" match=\"any\">" //false
						  + "<text value=\"Omote\"/>"
						  + "</if>"
						  + "<else-if variable=\"title\" match=\"none\">" //true
						  + "<text value=\"Ura\"/>"
						  + "</else-if>"
						  + "<else>" //should be skipped
						  + "<text value=\"Shiranumono\"/>"
						  + "</else>"
						  + "</choose>"
					  + "</else-if>"
					  + "<else>" //should be skipped
					  + "<text value=\"Sonota\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Ura",cite);
		},
		function testAny(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Omote\"/>"
					  + "</if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = { "id": "Item-1", "title":"Some value" };
			var cite = tests.test_conditions.makeCite(xml,Item);
			doh.assertEqual("Omote",cite);
		},
	],
	function(){  //setup
		tests.test_conditions.makeCite = function(myxml,Item){
			if ("undefined" == typeof Item){
				Item = {"id": "Item-1"};
			}
			var sys = new RhinoTest([Item]);
			var style = new CSL.Engine(sys,myxml);
			return style.makeCitationCluster(sys.citations);
		};
	},
	function(){	// teardown
	}

);


var x = [
]