dojo.provide("tests.test_names_import");


doh.register("tests.names_import", [
	function testSimpleWesternName(){
		var source = ["simple-western-name-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Doe", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("John", input[0]["author"][0]["secondary-key"]);
	},
	function testTwoSimpleWesternNames(){
		var source = ["two-simple-western-names-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Doe", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("John", input[0]["author"][0]["secondary-key"]);
		doh.assertEqual("Roe", input[0]["author"][1]["primary-key"]);
		doh.assertEqual("Jane", input[0]["author"][1]["secondary-key"]);
	},
	function testWesternNameWithArticular(){
		var source = ["western-name-with-articular-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Doe", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("Jacques", input[0]["author"][0]["secondary-key"]);
		doh.assertEqual("van", input[0]["author"][0].prefix);
	},
	function testWesternNameWithSuffix(){
		var source = ["western-name-with-space-suffix-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Doe", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("James", input[0]["author"][0]["secondary-key"]);
		doh.assertEqual("III", input[0]["author"][0].suffix);
	},
	function testWesternNameWithPeriodSuffix(){
		var source = ["western-name-with-space-suffix-2"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Doe", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("Jeffrey", input[0]["author"][0]["secondary-key"]);
		doh.assertEqual("Jr.", input[0]["author"][0].suffix);
	},
	function testSimpleAsianName(){
		var source = ["simple-sticky-name-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Miyamoto", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("Musashi", input[0]["author"][0]["secondary-key"]);
	},
	function testSimpleMongolianName(){
		var source = ["simple-mongolian-name-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Tserendorj", input[0]["author"][0]["primary-key"]);
		doh.assertEqual("Balingiin", input[0]["author"][0]["secondary-key"]);
	},
	function testInstitutionalName(){
		var source = ["institution-name-1"];
		var getter = new CSL.System.Retrieval.GetInput();
		var input = getter.getInput(source);
		doh.assertEqual("Ministry of Education, Sports, Culture, Science and Technology", input[0]["author"][0].literal);
	}
]);
