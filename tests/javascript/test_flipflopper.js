/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
dojo.provide("tests.test_flipflopper");

doh.register("tests.flipflopper", [
	function testProcessTagsUnopenedCloseTags(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("head<i>italic</b>bold's");
		ff.processTags();
		doh.assertEqual(35,ff.blob.blobs.length);
		doh.assertEqual("head&lt;i&gt;italic&lt;/b&gt;bold\u2019s",ff.blob.blobs);
	},
	function testImmediateClosingSingleQuote(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("O\u2019Malley");
		ff.processTags();
		doh.assertEqual(8,ff.blob.blobs.length);
		doh.assertEqual("O\u2019Malley",ff.blob.blobs);
	},
	function testGetSplitStringsTwo(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello\\<b>hello\\</b>again<i>ok</i>now");
		doh.assertEqual(5, ff.strs.length);
		doh.assertEqual("hello&lt;b&gt;hello&lt;/b&gt;again", ff.strs[0]);
		doh.assertEqual("ok", ff.strs[2]);
		doh.assertEqual("</i>",ff.strs[3]);
	},
	function testGetSplitStringsOne(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello\\<b>hello");
		doh.assertEqual(1, ff.strs.length);
		doh.assertEqual(19, ff.strs[0].length);
		doh.assertEqual("hello&lt;b&gt;hello",ff.strs[0]);
	},
	function testProcessTagsOpenEnded(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>ITALIC \"quote -- <i>important");
		ff.processTags();
		doh.assertEqual(3,ff.blob.blobs.length);
		doh.assertEqual("hello ",ff.blob.blobs[0].blobs);
		doh.assertEqual("italic ",ff.blob.blobs[1].blobs[0].blobs);
		doh.assertEqual("bold+italic",ff.blob.blobs[1].blobs[1].blobs[0].blobs);
		doh.assertEqual(" YY ",ff.blob.blobs[1].blobs[2].blobs);
		doh.assertEqual("ITALIC \u201cquote -- &lt;i&gt;important",ff.blob.blobs[2].blobs);
	},
	function testProcessTagsCrossNesting(){
		var myxml = "<style></style>";
		var sys = new RhinoTest();
		var state = new CSL.Engine(sys,myxml);
		var ff = new CSL.Util.FlipFlopper(state);
		ff.init("hello <i>italic <b>bold+italic</b> YY </i>italic \"quote <b>XXhello</b>ZZ");
		ff.processTags();
		doh.assertEqual(5,ff.blob.blobs.length);
		doh.assertEqual("italic \u201cquote ",ff.blob.blobs[2].blobs);
		doh.assertEqual("XXhello",ff.blob.blobs[3].blobs[0].blobs);
		doh.assertEqual("ZZ",ff.blob.blobs[4].blobs);

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
