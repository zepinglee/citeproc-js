dojo.provide("tests.test_factory");


doh.register("tests.factory", [

	function testIfItWorksAtAll() {
		function testme () {
			try {
				var fmt = CSL.Factory.substituteOne;
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testFactoryStack (){
		doh.assertEqual( "bogus", new CSL.Factory.State("bogus").build.xmlCommandInterface );
	},
	function testSubstituteOne() {
		var template = "<b>%%STRING%%</b>";
		var func = CSL.Factory.substituteOne(template);
		doh.assertEqual( "<b>My Aunt Sally</b>", func("My Aunt Sally"));
	},

	function testSubstituteTwo() {
		var template = "<span style=\"font-family:%%PARAM%%\">%%STRING%%</span>";
		var func = CSL.Factory.substituteTwo(template);
		var func2 = func("courier");
		doh.assertEqual( "<span style=\"font-family:courier\">My Aunt Sally</span>", func2("My Aunt Sally"));
	},

	function testOutputModeCompilerAttribute(){
		var res = CSL.Factory.Mode("html");
		doh.assertTrue( res["@font-style"] );
	},
	function testOutputModeCompilerValue(){
		var res = CSL.Factory.Mode("html");
		doh.assertTrue( res["@font-style"]["italic"] );
	},
	function testOutputModeCompilerFunction(){
		var res = CSL.Factory.Mode("html");
		doh.assertEqual( "function", typeof res["@font-style"]["italic"] );
	},
	function testOutputModeCompilerAction(){
		var res = CSL.Factory.Mode("html");
		doh.assertEqual( "<i>My Aunt Sally</i>", res["@font-style"]["italic"]("My Aunt Sally") );
	}
]);
