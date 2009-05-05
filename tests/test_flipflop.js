dojo.provide("tests.test_flipflop");

doh.register("tests.flipflop", [
	function testCrossNestedTagsFailWikiStyle(){
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[A]", "[B]", "dummyfunc1", []);
		ff.register( "[X]", "[Y]", "dummyfunc2", []);
		try {
			var res = ff.compose( "One [A] two [X] three [B] four [Y] five" );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( 3, res.length);
		doh.assertEqual( "One ", res[0]["str"]);
		doh.assertEqual( " two [X] three ", res[1]["str"]);
		doh.assertEqual( " four [Y] five", res[2]["str"]);
		doh.assertEqual( 0, res[0]["funcs"].length);
		doh.assertEqual( 1, res[1]["funcs"].length);
		doh.assertEqual( 0, res[2]["funcs"].length);
		doh.assertEqual( "dummyfunc1", res[1]["funcs"][0]);
	},
	function testNestedCompositionObjectContentReverseFunctionOrder() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", "dummyfunc2", []);
		ff.register( "[A]", "[B]", "dummyfunc1", []);
		try {
			var res = ff.compose( "One [A] two [X] three [Y]  four [B] five" );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( 5, res.length);
		doh.assertEqual( " three ", res[2].str );
		doh.assertEqual( "dummyfunc1", res[2].funcs[0] );
		doh.assertEqual( "dummyfunc2", res[2].funcs[1] );
	},
	function testNestedCompositionObjectContent() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[A]", "[B]", "dummyfunc1", []);
		ff.register( "[X]", "[Y]", "dummyfunc2", []);
		try {
			var res = ff.compose( "One [A] two [X] three [Y]  four [B] five" );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( 5, res.length);
		doh.assertEqual( " three ", res[2].str );
		doh.assertEqual( "dummyfunc1", res[2].funcs[0] );
		doh.assertEqual( "dummyfunc2", res[2].funcs[1] );
	},
	function testSimpleCompositionObjectContent() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", "dummyfunc", []);
		try {
			var res = ff.compose( "One two [X] three [Y] four" );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( 3, res.length);
	},
	function testSimpleCompositionWorksAtAll() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", "dummyfunc", []);
		try {
			ff.compose( "One two [X] three [Y] four" );
			var res = "Success";
		} catch (e) {
			var res = "Oops: "+e;
		}
		doh.assertEqual( res, "Success" );
	},
	function testInstantiation() {
		try {
			var dummyfunc = "dummyfunc";
			var ff = new CSL.Util.FlipFlopper();
			var ret = "Success";
		} catch (e) {
			var ret = "Oops: "+e;
		}

		doh.assertEqual( "Success", ret );
	},
	function testCompleteNonsenseFailsGracefully(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two [Y] three [X] four five [X]" );
		doh.assertEqual( 1, res.length );
		doh.assertEqual( "One two [Y] three [X] four five [X]", res[0] );
	},
	function testStartAndEndMarkersIdenticalOk(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "*", "*", dummyfunc, []);
		var res = ff.split( 0, "One two *three* four five six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two ", res[0] );
		doh.assertEqual( "three", res[1] );
		doh.assertEqual( " four five six", res[2] );
	},
	function testMismatchIdenticalStartAndEndMarkersFailsGracefully(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "*", "*", dummyfunc, []);
		var res = ff.split( 0, "One two *three* four *five six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two ", res[0] );
		doh.assertEqual( "three", res[1] );
		doh.assertEqual( " four *five six", res[2] );
	},
	function testMismatchExtraStartTagBreaksParseSubsequently(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One [X] two [Y] three [X] four [X] five [Y] six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One ", res[0] );
		doh.assertEqual( " two ", res[1] );
		doh.assertEqual( " three [X] four [X] five [Y] six", res[2] );
	},
	function testMismatchExtraStartTagBreaksParse(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two [X] three [X] four five [Y] six" );
		doh.assertEqual( 1, res.length );
		doh.assertEqual( "One two [X] three [X] four five [Y] six", res[0] );
	},
	function testMismatchDoubleEndTagsIgnored(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two [X] three [Y] four five [Y] six [Y]" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two ", res[0] );
		doh.assertEqual( " three ", res[1] );
		doh.assertEqual( " four five [Y] six [Y]", res[2] );
	},
	function testRegister() {
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "X", "Y", dummyfunc, ["preserve"]);
		try {
			var res = ff.flipflops[0].func;
		} catch (e) {
			var res = "Oops: "+e;
		}
		doh.assertEqual( "dummyfunc", res );
	},
	function testSplitSimpleOk(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two three [X] four five [Y] six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two three ", res[0] );
		doh.assertEqual( " four five ", res[1] );
		doh.assertEqual( " six", res[2] );
	},
	function testSplitStartAtStartOk(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "[X] four five [Y] six" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "", res[0] );
		doh.assertEqual( " four five ", res[1] );
		doh.assertEqual( " six", res[2] );
	},
	function testSplitEndAtEndOk(){
		var dummyfunc = "dummyfunc";
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", dummyfunc, []);
		var res = ff.split( 0, "One two three [X] four five [Y]" );
		doh.assertEqual( 3, res.length );
		doh.assertEqual( "One two three ", res[0] );
		doh.assertEqual( " four five ", res[1] );
		doh.assertEqual( "", res[2] );
	},
	function testSplitMultipleOk(){
		var dummyfunc = "dummyfunc";
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
