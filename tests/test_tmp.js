dojo.provide("tests.test_tmp");

doh.register("tests.tmp", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Engine.Tmp();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);
