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
dojo.provide("tests.test_configure");


var nestedsingleton = "<style><text/></style>";
var xmlif = "<style>"
			+ "<choose>"
				+ "<if>"
					+ "<text value=\"one\"/>"
				+ "</if>"
				+ "<else-if>"
					+ "<text value=\"two\"/>"
				+ "</else-if>"
				+ "<else>"
					+ "<text value=\"three\"/>"
				+ "</else>"
			+ "</choose>"
		+ "</style>";
var xmlifnested = "<style>"
					  + "<choose>"
						  + "<if>"
							  + "<text value=\"one\"/>"
							  + "<choose>"
								  + "<if>"
									  + "<text value=\"ten\"/>"
								  + "</if>"
								  + "<else-if>"
									  + "<text value=\"five\"/>"
								  + "</else-if>"
							  + "</choose>"
						  + "</if>"
						  + "<else-if>"
							  + "<text value=\"two\"/>"
						  + "</else-if>"
						  + "<else>"
							  + "<text value=\"three\"/>"
						  + "</else>"
					  + "</choose>"
				  + "</style>";

var build = false;
var obj = false;
var conf = false;
var newobj = false;

doh.registerGroup("tests.conditions_build",
	[
		function testBuildLength(){
			doh.assertEqual(1, obj["citation"]["tokens"].length);
		}

	],
	function(){ // setup
		var sys = new RhinoTest();
		build = new CSL.Core.Build(nestedsingleton);
		obj = build.build(sys);
	},
	function(){ // teardown
		build = false;
		obj = false;
	}
);


doh.registerGroup("tests.conditions_simple_jumps",
	[
		function testConfigureReturnsSomething(){
			doh.assertEqual(11, newobj["citation"]["tokens"].length);
		},

		function testConfigureJumpHasValue(){
			doh.assertEqual( 10, newobj["citation"]["tokens"][3]["succeed"]);
		}
	],
	function(){ // setup
		var sys = new RhinoTest();
		build = new CSL.Core.Build(xmlif);
		obj = build.build(sys);
		conf = new CSL.Core.Configure(obj);
		newobj = conf.configure();
	},
	function(){ // teardown
		build = false;
		obj = false;
		conf = false;
		newobj = false;
	}
);

doh.registerGroup("tests.conditions_complex_jumps",
	[
		function testConfigureReturnsSomething(){
			doh.assertEqual(19, newobj["citation"]["tokens"].length);
		},

		function testConfigureJumpHasValue(){
			doh.assertEqual( 12, newobj["citation"]["tokens"][1]["fail"]);
		}
	],
	function(){ // setup
		var sys = new RhinoTest();
		build = new CSL.Core.Build(xmlifnested);
		obj = build.build(sys);
		conf = new CSL.Core.Configure(obj);
		newobj = conf.configure();

	},
	function(){ // teardown
		build = false;
		obj = false;
		conf = false;
		newobj = false;
	}
);
