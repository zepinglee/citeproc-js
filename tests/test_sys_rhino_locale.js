dojo.provide("tests.test_sys_rhino_locale");

dojo.require("csl.testing_rhino");


doh.register("tests.sys_rhino_locale", [

	function testSetLocaleWorksAtAll(){
		try {
			var obj = new RhinoTest();
			obj.setLocaleXml();
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertEqual("object", typeof obj.locale_terms);
	},
	function testSetLocaleEmptyValue(){
		var obj = new RhinoTest();
		obj.setLocaleXml();
		doh.assertEqual("books", obj.locale_terms["book"]["long"][1]);
	},
	function testSetLocaleStringValue(){
		var obj = new RhinoTest();
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testSetAccess(){
		var obj = new RhinoTest();
		obj.setLocaleXml();
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testGetTermPluralExists(){
		var obj = new RhinoTest();
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",1);
		doh.assertEqual("books",res);
	},
	function testGetTermSingularExists(){
		var obj = new RhinoTest();
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long",0);
		doh.assertEqual("book",res);
	},
	function testGetTermNoPluralSpecifiedFallbackToSingular(){
		var obj = new RhinoTest();
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"book","long");
		doh.assertEqual("book",res);
	},
	function testGetTermSymbolFallbackToShort(){
		var obj = new RhinoTest();
		obj.setLocaleXml();
		var res = CSL.Engine.prototype.getTerm.call(obj,"edition","symbol");
		doh.assertEqual("ed",res);
	}
]);
