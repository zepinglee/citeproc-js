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
dojo.provide("tests.test_sys_rhino_locale");

dojo.require("csl.testing_rhino");


doh.register("tests.sys_rhino_locale", [

	function testGetTermSymbolFallbackToShort(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"edition","symbol");
		doh.assertEqual("ed.",res);
	},
	function testGetTermNoPluralSpecifiedFallbackToSingular(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long");
		doh.assertEqual("book",res);
	},
	function testGetTermSingularExists(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",0);
		doh.assertEqual("book",res);
	},
	function testGetTermPluralExists(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",1);
		doh.assertEqual("books",res);
	},
	function testSetAccess(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("af-ZA") );
		CSL.localeSet.call(obj,sys,myxml,"af-ZA","af-ZA");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		CSL.localeSet.call(obj,sys,myxml,"de-DE","de-DE");
		doh.assertEqual("und", obj.locale["de-DE"].terms["and"]["long"]);
	},
	function testSetLocaleEmptyValue(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		doh.assertEqual("books", CSL.locale["en-US"].terms["book"]["long"][1]);
	},
	function testLocalSetLocaleWorksAtAll(){
		try {
			var sys = new RhinoTest();
			var obj = new CSL.Engine(sys,"<style></style>");
			var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
			CSL.localeSet.call(obj,sys,myxml,"de-DE","de-DE");
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertEqual("object", typeof obj.locale["de-DE"].terms);
	},
	function testGlobalSetLocaleWorksAtAll(){
		try {
			var sys = new RhinoTest();
			var obj = new CSL.Engine(sys,"<style></style>");
			var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
			CSL.localeSet.call(CSL,sys,myxml,"de-DE","de-DE");
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertEqual("object", typeof CSL.locale["de-DE"].terms);
	},
	function testSetGlobalLocaleStringValue(){
		var sys = new RhinoTest();
		var citeproc = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		CSL.localeSet.call(CSL,sys,myxml,"de-DE","de-DE");
		doh.assertEqual("und", CSL.locale["de-DE"].terms["and"]["long"]);
	},
]);

var x = [

]