dojo.provide("tests.test_formats");

doh.register("tests.formats", [

	function testStringyDefs() {
		doh.assertEqual( '&ldquo;%%STRING%%&rdquo;', CSL.Output.Formats.html["@quotes/true"] );
	},

	function testFunctionDefs() {
		doh.assertEqual( "function", typeof CSL.Output.Formats.html["@text-case/lowercase"] );
	},

]);
