dojo.provide("tests.test_fun");

doh.register("tests.fun", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Engine.Fun();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
]);
