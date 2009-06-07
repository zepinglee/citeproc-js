dojo.provide("tests.test_sys_stdrhino_locale");

dojo.require("csl.testing_stdrhino");

doh.register("tests.sys_stdrhino_locale", [

	function testLocaleGlobalWorksAtAll(){
		try {
			var obj = new StdRhinoTest();
			obj.setLocaleXml();
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertNotEqual("undefined", typeof obj.locale_terms);
	},
	function testMakeXml(){
		var obj = new StdRhinoTest();
		var res = obj.makeXml('<style><citation><text/></citation></style>');
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		doh.assertEqual("text", res..text.localName());
	},
	function testSetLocaleEmptyValue(){
		var obj = new StdRhinoTest();
		obj.setLocaleXml();
		doh.assertEqual("and", obj.locale_terms["and"]["long"]);
	},
	function testSetLocaleStringValue(){
		var obj = new StdRhinoTest();
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testSetAccess(){
		var obj = new StdRhinoTest();
		obj.setLocaleXml();
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	}
]);

