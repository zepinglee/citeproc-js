dojo.provide("tests.test_formats");

doh.register("tests.formats", [

	function testStringyDefs() {
		doh.assertEqual( '<b>%%STRING%%</b>', CSL.Output.Formats.html["@font-weight/bold"] );
	},

	function testFunctionDefs() {
		doh.assertEqual( "function", typeof CSL.Output.Formats.html["@text-case/lowercase"] );
	},

]);
