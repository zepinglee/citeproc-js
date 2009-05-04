dojo.provide("tests.test_flipflop");

doh.register("tests.flipflop", [
//		var res = ff.split( 0, "One two [Y] three [X] four five [X]" );
	function testCompleteNonsenseFailsGracefully(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two [Y] three [X] four five [X]" );
		doh.assertEqual( 1, res.length );
		doh.assertEqual( "One two [Y] three [X] four five [X]", res[0] );
	},
	function testStartAndEndMarkersIdenticalOk(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "*", "*", dummyfunc, []);
		var res = ff.split( 0, "One two *three* four five six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two ", res[0] );
		doh.assertEqual( "three", res[1] );
		doh.assertEqual( " four five six", res[2] );
	},
	function testMismatchIdenticalStartAndEndMarkersFailsGracefully(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "*", "*", dummyfunc, []);
		var res = ff.split( 0, "One two *three* four *five six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two ", res[0] );
		doh.assertEqual( "three", res[1] );
		doh.assertEqual( " four *five six", res[2] );
	},
	function testMismatchExtraStartTagBreaksParseSubsequently(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One [X] two [Y] three [X] four [X] five [Y] six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One ", res[0] );
		doh.assertEqual( " two ", res[1] );
		doh.assertEqual( " three [X] four [X] five [Y] six", res[2] );
	},
	function testMismatchExtraStartTagBreaksParse(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two [X] three [X] four five [Y] six" );
		doh.assertEqual( 1, res.length );
		doh.assertEqual( "One two [X] three [X] four five [Y] six", res[0] );
	},
	function testMismatchDoubleEndTagsIgnored(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two [X] three [Y] four five [Y] six [Y]" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two ", res[0] );
		doh.assertEqual( " three ", res[1] );
		doh.assertEqual( " four five [Y] six [Y]", res[2] );
	},
	function testInstantiation() {
		try {
			var dummyfunc = function(){};
			var ff = new CSL.Util.FlipFlopper();
			var ret = "Success";
		} catch (e) {
			var ret = "Oops: "+e;
		}

		doh.assertEqual( "Success", ret );
	},
	function testRegister() {
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "X", "Y", dummyfunc, ["preserve"]);
		try {
			var res = typeof ff.flipflops[0].func;
		} catch (e) {
			var res = "Oops: "+e;
		}
		doh.assertEqual( "function", res );
	},
	function testSplitSimpleOk(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two three [X] four five [Y] six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two three ", res[0] );
		doh.assertEqual( " four five ", res[1] );
		doh.assertEqual( " six", res[2] );
	},
	function testSplitStartAtStartOk(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "[X] four five [Y] six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "", res[0] );
		doh.assertEqual( " four five ", res[1] );
		doh.assertEqual( " six", res[2] );
	},
	function testSplitEndAtEndOk(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two three [X] four five [Y]" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two three ", res[0] );
		doh.assertEqual( " four five ", res[1] );
		doh.assertEqual( "", res[2] );
	},
	function testSplitMultipleOk(){
		var dummyfunc = function(){};
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One [X] two [Y] three [X] four five [Y]" );
		doh.assertEqual( 5, res.length );
		doh.assertEqual( "One ", res[0] );
		doh.assertEqual( " two ", res[1] );
		doh.assertEqual( " three ", res[2] );
		doh.assertEqual( " four five ", res[3] );
		doh.assertEqual( "", res[4] );
	},
]);
