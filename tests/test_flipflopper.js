dojo.provide("tests.test_flipflopper");

doh.register("tests.flipflopper", [
	function testProcessTagsOpenEnded(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>italic \"quote -- <i>important");
		ff.processTags();
		doh.assertEqual(5,ff.blob.blobs.length);
		//
		// i.e. [<blob.blobs:"italic ">,<blob>,<blob.blobs:" YY ">]
		//
		doh.assertEqual(3, ff.blob.blobs[1].blobs.length);
		doh.assertEqual("“quote -- <i>important",ff.blob.blobs[4].blobs);
	},
]);

var x = [
	function testProcessTagsCrossNesting(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>italic \"quote <b>XX\"hello</b>ZZ");
		ff.processTags();
		doh.assertEqual(6,ff.blob.blobs.length);
		doh.assertEqual("ZZ",ff.blob.blobs[5].blobs);
		doh.assertEqual("hello</b>",ff.blob.blobs[4].blobs);
		//
		// i.e. [<blob.blobs:"italic ">,<blob>,<blob.blobs:" YY ">]
		//
		doh.assertEqual(3, ff.blob.blobs[1].blobs.length);
	},
	function testGetSplitStringsOne(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello\\<b>hello");
		doh.assertEqual(1, ff.strs.length);
		doh.assertEqual(14, ff.strs[0].length);
		doh.assertEqual("hello\\<b>hello",ff.strs[0]);
	},
	function testGetSplitStringsTwo(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello\\<b>hello\\</b>again<i>ok</i>now");
		doh.assertEqual(5, ff.strs.length);
		doh.assertEqual("hello\\<b>hello\\</b>again", ff.strs[0]);
		doh.assertEqual("ok", ff.strs[2]);
		doh.assertEqual("</i>",ff.strs[3]);
	},
]