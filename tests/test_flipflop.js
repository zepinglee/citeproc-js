dojo.provide("tests.test_flipflop");

doh.register("tests.flipflop", [
	function testCrossNestedTagsFailWikiStyle(){
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[A]", "[B]", "dummyfunc1", []);
		ff.register( "[X]", "[Y]", "dummyfunc2", []);
		try {
			var blob = new CSL.Factory.Blob( false, "One [A] two [X] three [B] four [Y] five" );
			var res = ff.compose( blob );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( "One ", res.blobs[0].blobs);
		//
		// too deep!
		doh.assertEqual( " two [X] three ", res.blobs[1].blobs);
		doh.assertEqual( " four [Y] five", res.blobs[2].blobs);
		doh.assertEqual( 0, res.blobs[0].decorations.length);
		doh.assertEqual( 1, res.blobs[1].decorations.length);
		doh.assertEqual( 0, res.blobs[2].decorations.length);
		doh.assertEqual( "dummyfunc1", res.blobs[1].decorations[0]);
	},
	function testNestedCompositionObjectContent() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[A]", "[B]", ["fkey1","fattr1"], ["altkey1","altattr1"]);
		ff.register( "[X]", "[Y]", ["fkey2","fattr2"], ["altkey2","altattr2"]);

		try {
			var blob = new CSL.Factory.Blob( false, "One [A] two [X] three [Y]  four [B] five" );
			var res = ff.compose( blob );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( " three ", res.blobs[1].blobs[1].blobs );
		doh.assertEqual( "fkey1", res.blobs[1].decorations[0][0] );
		doh.assertEqual( "fattr1", res.blobs[1].decorations[0][1] );
		doh.assertEqual( "fkey2", res.blobs[1].blobs[1].decorations[0][0] );
		doh.assertEqual( "fattr2", res.blobs[1].blobs[1].decorations[0][1] );
	},
	function testSimpleCompositionEscape() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", "dummyfunc", []);
		try {
			var blob = new CSL.Factory.Blob( false, "One two \\[X] three [Y] four" );
			var res = ff.compose( blob );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( 1, res.length);
		doh.assertEqual( "One two \\[X] three [Y] four", res[0].blobs);
	},
	function testSimpleCompositionWorksAtAll() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", "dummyfunc", []);
		try {
			var blob = new CSL.Factory.Blob( false, "One two [X] three [Y] four" );
			ff.compose( blob );
			var res = "Success";
		} catch (e) {
			var res = "Oops: "+e;
		}
		doh.assertEqual( res, "Success" );
	},
	function testNestedCompositionObjectContentReverseFunctionOrder() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", ["fkey2","fattr2"], ["altkey2","altattr2"]);
		ff.register( "[A]", "[B]", ["fkey1","fattr1"], ["altkey1","altattr1"]);
		try {
			var blob = new CSL.Factory.Blob( false, "One [A] two [X] three [Y]  four [B] five" );
			var res = ff.compose( blob );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( " three ", res.blobs[1].blobs[1].blobs );
		doh.assertEqual( "fkey1", res.blobs[1].decorations[0][0] );
		doh.assertEqual( "fattr1", res.blobs[1].decorations[0][1] );
		doh.assertEqual( "fkey2", res.blobs[1].blobs[1].decorations[0][0] );
		doh.assertEqual( "fattr2", res.blobs[1].blobs[1].decorations[0][1] );
	},
	function testSimpleCompositionObjectContent() {
		var ff = new CSL.Util.FlipFlopper();
		ff.register( "[X]", "[Y]", "dummyfunc", []);
		try {
			var blob = new CSL.Factory.Blob( false, "One two [X] three [Y] four" );
			var res = ff.compose( blob );
			var ok = "Success";
		} catch (e) {
			var ok = "Oops: "+e;
		}
		doh.assertEqual( "Success", ok );
		doh.assertEqual( "object", typeof res.blobs);
		doh.assertEqual( 3, res.blobs.length);
		doh.assertEqual( "string", typeof res.blobs[1].blobs);
		doh.assertEqual( " three ", res.blobs[1].blobs);
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
