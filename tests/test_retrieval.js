dojo.provide("tests.test_retrieval");


doh.register("tests.retrieval",
	[
		function testLocaleReturnSomething(t){
			t.assertTrue( CSL.System.Retrieval.getLocaleObjects("en"));
		},
		function testItemGetFile(){
			var Source = ["simple-western-name-1"];
			var getter = new CSL.System.Retrieval.GetInput();
			var res = getter.getInput(Source);
			doh.assertEqual("His Anonymous Life", res[0].title);
		},
		function testItemGetListOfFiles(){
			var Source = ["simple-western-name-1", "simple-western-name-2"];
			var getter = new CSL.System.Retrieval.GetInput();
			var res = getter.getInput(Source);
			doh.assertEqual("His Anonymous Life", res[0].title);
			doh.assertEqual("Her Anonymous Life", res[1].title);
		},
		function testLocaleReturnCorrectLength(t){
			var count = 0;
			for (var i in CSL.System.Retrieval.getLocaleObjects("en")){
				count += 1;
			}
			t.assertEqual(80, count);
		},
	]
);

