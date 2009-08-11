dojo.provide("tests.test_sys_stdrhino_locale");

dojo.require("csl.testing_stdrhino");

doh.register("tests.sys_stdrhino_locale", [
	function testSetAccess(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testSetLocaleStringValue(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml("de");
		doh.assertEqual("und", obj.locale_terms["and"]["long"]);
	},
	function testSetLocaleEmptyValue(){
		var sys = new StdRhinoTest();
		var obj = new CSL.Engine(sys,"<style></style>");
		obj.setLocaleXml();
		doh.assertEqual("and", obj.locale_terms["and"]["long"]);
	},
	function testMakeXml(){
		var obj = new StdRhinoTest();
		var res = obj.xml.makeXml('<style><citation><text/></citation></style>');
		default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
		doh.assertEqual("text", res..text.localName());
	},
	function testLocaleGlobalWorksAtAll(){
		try {
			var sys = new RhinoTest();
			var obj = new CSL.Engine(sys,"<style></style>");
			obj.setLocaleXml();
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
		doh.assertNotEqual("undefined", typeof obj.locale_terms);
	},
]);


var x = [
]