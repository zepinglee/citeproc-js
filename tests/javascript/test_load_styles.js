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
dojo.provide("tests.test_load_styles");


var tryStyle = function(style){
	try {
		var sty = readFile("style/"+style+".csl");
		if (!sty){
			throw "Did not find style file: style/"+style+".csl";
		}
		var sys = new RhinoTest();
		var res = new CSL.Engine(sys,sty);
	} catch(e) {
		CSL.debug("oops: "+e);
	}
	return res;
}

doh.register("tests.load_styles", [
	function(){
		var res = tryStyle("mhra");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("ama");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("apa");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("apsa");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("asa");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("chicago-author-date");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("chicago-fullnote-bibliography");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("chicago-note-bibliography");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("chicago-note");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("harvard1");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("ieee");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("mhra_note_without_bibliography");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("mla");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("nature");
		doh.assertTrue( res );
	},
	function(){
		var res = tryStyle("nlm");
		doh.assertTrue( res );
	},
]);
