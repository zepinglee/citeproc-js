dojo.provide("tests.test_retrieval");


doh.register("tests.retrieval",
	[
		function testStdLocaleReturnSomething(t){
			var sys = new RhinoTest();
			var res = sys.getLang("en");
			t.assertEqual( "string", typeof res );
			t.assertNotEqual( "", res );
		},
		function testRhinoLocaleReturnSomething(t){
			var sys = new RhinoTest();
			var res = sys.getLang("en");
			t.assertEqual( "string", typeof res );
			t.assertNotEqual( "", res );
		},
		function testItemGetFile(){
			var sys = new RhinoTest(["simple-western-name-1"]);
			var res = sys.items;
			doh.assertEqual("His Anonymous Life", res[0].title);
		},
		function testItemGetListOfFiles(){
			var sys = new RhinoTest(["simple-western-name-1", "simple-western-name-2"]);
			var res = sys.items;
			doh.assertEqual("His Anonymous Life", res[0].title);
			doh.assertEqual("Her Anonymous Life", res[1].title);
		},
		function testLocaleReturnCorrectLength(t){
			var sys = new RhinoTest();
			var state = new Object();
			state["opt"] = new Object();
			state["sys"] = sys;
			state.opt.lang = "en";
			var count = 0;
			var res = CSL.System.Retrieval.getLocaleObjects(state);
			for (var i in res){
				count += 1;
			}
			t.assertEqual(80, count);
		},
	]
);
