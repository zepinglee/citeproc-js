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
dojo.provide("citeproc_js.sys_stdrhino_locale");

doh.register("citeproc_js.sys_stdrhino_locale", [
	function testMakeXmlFromPlainXml(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,'<style></style>');
		var alreadyxml = new XML('<style><citation><text/></citation></style>');
		var res = obj.sys.xml.makeXml(alreadyxml);
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		doh.assertEqual("text", res..text.localName());
	},
	function testMakeXml(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,'<style></style>');
		var res = obj.sys.xml.makeXml('<style><citation><text/></citation></style>');
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		doh.assertEqual("text", res..text.localName());
	},
	function testSetAccess(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("af-ZA") );
		CSL.localeSet.call(obj,sys,myxml,"af-ZA","af-ZA");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		CSL.localeSet.call(obj,sys,myxml,"de-DE","de-DE");
		doh.assertEqual("und", obj.locale["de-DE"].terms["and"]["long"]);
	},
	function testSetLocaleStringValue(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		var myxml = sys.xml.makeXml( sys.retrieveLocale("de-DE") );
		CSL.localeSet.call(CSL,sys,myxml,"de-DE","de-DE");
		doh.assertEqual("und", CSL.locale["de-DE"].terms["and"]["long"]);
	},
	function testSetLocaleEmptyValue(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		doh.assertEqual("and", CSL.locale["en-US"].terms["and"]["long"]);
	},
	function testLocaleGlobalWorksAtAll(){
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
		doh.assertNotEqual("undefined", typeof CSL.locale["de-DE"].terms);
	},
]);


var x = [
]