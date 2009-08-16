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

	function testSetLocaleWorksAtAll(){
		try {
			var sys = new RhinoTest();
			var obj = new CSL.Engine(sys,"<style></style>");
			obj.setLocaleXml();
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertEqual("object", typeof obj.locale_terms);
	},
	function testSetLocaleEmptyValue(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		doh.assertEqual("books", obj.locale_terms["book"]["long"][1]);
	},
	function testSetLocaleStringValue(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testSetAccess(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testGetTermPluralExists(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",1);
		doh.assertEqual("books",res);
	},
	function testGetTermSingularExists(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",0);
		doh.assertEqual("book",res);
	},
	function testGetTermNoPluralSpecifiedFallbackToSingular(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long");
		doh.assertEqual("book",res);
	},
	function testGetTermSymbolFallbackToShort(){
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"edition","symbol");
		doh.assertEqual("ed.",res);
	}
]);
