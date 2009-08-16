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
dojo.provide("tests.test_xmljs");

doh.registerGroup("tests.xml", [

	function testNestingEndPoint(){
		var tag = '<style value="mystyle">'
				+ '<macro value="mymacro">'
					+ '<text value="one"/>'
					+ '<text value="three"/>'
				+ '</macro>'
				+ '<text value="two"/>'
				+ '<text value="boo"/>'
			+ '</style>';
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		// [[]]
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( "mymacro", res[0][0].attributes["@value"] );
		doh.assertEqual( "one", res[0][0][0].attributes["@value"] );
		doh.assertEqual( "three", res[0][0][1].attributes["@value"] );
		doh.assertEqual( "two", res[0][1].attributes["@value"] );
		doh.assertEqual( "boo", res[0][2].attributes["@value"] );
	},
	function testAttributes(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( 2, cmd.children.call(res[0]).length );
		doh.assertEqual( "text", cmd.children.call(res[0])[0].name );
		doh.assertEqual( "other thing", cmd.children.call(res[0])[1].text );
	},

	function testChildren(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( 2, cmd.children.call(res[0]).length );
	},


	function testGetTextString(){
		var tag = "<style><text value=\"hello\"/>and some text here</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("and some text here", res[0][1].text );
	},

	function testParseWithTextNode(){
		var tag = "<style><text value=\"hello\"/>and some text here</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual(null, res[0][1].name );
	},

	function testParseHasAttributes(){
		var tag = "<style><text value=\"hello\"/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("hello", res[0][0].attributes["@value"] );
	},

	function testParseHasContent(){
		var tag = "<style><text/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("style", res[0].name );
		doh.assertEqual("text", res[0][0].name );
	},

	function testParseReturnsCorrectLength(){
		var tag = "<style><text/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual(1, res[0].length );
	},

	function testParseReturnsSomething(){
		var tag = "<style><text/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertTrue( res[0] );
	},

	function testParseSuccess(){
		var tag = "<tag><tag/></tag>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return "Success";
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("Success", res);
	},

	function testNodename(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( "text", cmd.nodename.call(res[0][0]) );
	},

	function testContent(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( "other thing", cmd.content.call(res[0][1]) );
	},

]);
