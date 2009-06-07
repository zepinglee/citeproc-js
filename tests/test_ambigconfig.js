dojo.provide("tests.test_ambigconfig");

doh.register("tests.ambigconfig", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Factory.AmbigConfig();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testValues() {
		var obj = new CSL.Factory.AmbigConfig();
		doh.assertEqual("object", typeof obj.maxvals);
		doh.assertEqual(0, obj.maxvals.length);
		doh.assertEqual("object", typeof obj.names);
		doh.assertEqual(0, obj.names.length);
	}
]);
