dojo.provide("tests.test_flipflop");

doh.register("tests.flipflop", [
	function testRegister() {
		try {
			var dummyfunc = function(){};
			var ff = new CSL.Util.FlipFlop( ['X',dummyfunc], ['X',dummyfunc] );
			var ret = "Success";
		} catch (e) {
			var ret = "Oops: "+e;
		}

		doh.assertEqual( "Success", ret );
	},
]);
