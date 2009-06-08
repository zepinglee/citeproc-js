dojo.provide("tests.test_build");

var myxml = '<style><citation><text/></citation></style>';

dojo.require("csl.testing_rhino");

doh.register("tests.build", [

	function testInstantiation() {
		function testme () {
			try {
				var sys = new RhinoTest();
				var obj = new CSL.Engine(sys,myxml);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
]);

var x = [
	function testValue() {
		var sys = new RhinoTest();
		var obj = new CSL.Engine(sys,myxml);
		doh.assertEqual("object", typeof obj.build.macro_stack);
	}
]
