dojo.provide("tests.test_sys_rhino_load");

dojo.require("csl.testing_rhino");

doh.register("tests.sys_rhino_load", [

	function testInstantiationRhinoTestEmpty() {
		function testme () {
			try {
				var obj = new RhinoTest();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiationRhinoTestLoad() {
		function testme () {
			try {
				var obj = new RhinoTest(["simple-western-name-1"]);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);
