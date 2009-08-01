dojo.provide("tests.test_flipflopper");

doh.register("tests.flipflopper", [
	function testProcessTagsOpenEnded(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>ITALIC \"quote -- <i>important");
		ff.processTags();
		doh.assertEqual(5,ff.blob.blobs.length);
		doh.assertEqual("hello ",ff.blob.blobs[0].blobs);
		doh.assertEqual("italic ",ff.blob.blobs[1].blobs[0].blobs);
		doh.assertEqual("bold+italic",ff.blob.blobs[1].blobs[1].blobs[0].blobs);
		doh.assertEqual(" YY ",ff.blob.blobs[1].blobs[2].blobs);
		doh.assertEqual("ITALIC ",ff.blob.blobs[2].blobs);
		doh.assertEqual("“quote -- <i>",ff.blob.blobs[3].blobs);
		doh.assertEqual("important",ff.blob.blobs[4].blobs);
	},
	function testImmediateClosingSingleQuote(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("O’Malley");
		ff.processTags();
		doh.assertEqual(2,ff.blob.blobs.length);
		doh.assertEqual("O’",ff.blob.blobs[0].blobs);
		doh.assertEqual("Malley",ff.blob.blobs[1].blobs);
	},
	function testProcessTagsUnopenedCloseTags(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("head<i>italic</b>bold's");
		ff.processTags();
		doh.assertEqual(4,ff.blob.blobs.length);
		doh.assertEqual("head",ff.blob.blobs[0].blobs);
		doh.assertEqual("<i>italic</b>",ff.blob.blobs[1].blobs);
		doh.assertEqual("bold’",ff.blob.blobs[2].blobs);
		doh.assertEqual("s",ff.blob.blobs[3].blobs);
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
	function testProcessTagsCrossNesting(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>italic \"quote <b>XXhello</b>ZZ");
		ff.processTags();
		doh.assertEqual(6,ff.blob.blobs.length);
		doh.assertEqual("“quote ",ff.blob.blobs[3].blobs);
		doh.assertEqual("ZZ",ff.blob.blobs[5].blobs);

		//doh.assertEqual("ZZ",ff.blob.blobs[2].blobs);
		//doh.assertEqual("hello</b>",ff.blob.blobs[4].blobs);
		//
		// i.e. [<blob.blobs:"italic ">,<blob>,<blob.blobs:" YY ">]
		//
		//doh.assertEqual(3, ff.blob.blobs[1].blobs.length);
	},
]);

var x = [
]