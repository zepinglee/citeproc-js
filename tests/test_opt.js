dojo.provide("tests.test_opt");

doh.register("tests.opt", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Engine.Opt();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testValue() {
		var obj = new CSL.Engine.Opt();
		doh.assertNotEqual( "undefined", typeof obj.has_disambiguate );
	},

]);
