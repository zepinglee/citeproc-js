/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
dojo.provide("tests.test_sys_stdrhino_locale");

doh.register("tests.sys_stdrhino_locale", [
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