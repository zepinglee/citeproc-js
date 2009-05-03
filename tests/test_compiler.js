dojo.provide("tests.test_compiler");


doh.register("tests.compiler", [

	function testInstantiateCompiler() {
		function testme () {
			try {
				var fmt = CSL.Compiler("html");
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);
