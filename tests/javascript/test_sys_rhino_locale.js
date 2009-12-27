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
dojo.provide("tests.test_sys_rhino_locale");

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