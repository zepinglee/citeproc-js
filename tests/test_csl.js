dojo.provide("tests.test_csl");
dojo.require("doh.runner");


doh.register("tests.csl", [


	function testInstantiateCsl() {
		function testme () {
			try {
				// CSL is pre-instantiated
				var csl = CSL;
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);
