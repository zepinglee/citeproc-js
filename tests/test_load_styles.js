dojo.provide("tests.test_load_styles");


var tryStyle = function(style){
	try {
		var sty = readFile("style/"+style+".csl", "utf8");
		if (!sty){
			throw "Did not find style file: style/"+style+".csl";
		}
		var builder = new CSL.Core.Build(sty);
		var res = builder.build();
	} catch(e) {
		print("oops: "+e);
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
