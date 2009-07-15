dojo.provide("tests.test_conditions");


doh.registerGroup("tests.conditions",
	[
		function testNone(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"none\">"
					  + "<text value=\"Omote\"/>"
					  + "</if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Omote",cite);
		},
		function testMultipleElseIfFirstIsTrue(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"none\">"
					  + "<text value=\"Mikake\"/>"
					  + "</else-if>"
					  + "<else-if variable=\"title\" match=\"any\">"
					  + "<text value=\"Omote\"/>"
					  + "</else-if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Mikake",cite);
		},
		function testElseIf(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"none\">"
					  + "<text value=\"Omote\"/>"
					  + "</else-if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Omote",cite);
		},
		function testMultipleElseIfSecondIsTrue(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"any\">"
					  + "<text value=\"Mikake\"/>"
					  + "</else-if>"
					  + "<else-if variable=\"title\" match=\"none\">"
					  + "<text value=\"Omote\"/>"
					  + "</else-if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Omote",cite);
		},
		function testNested(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">" //false
					  + "<text value=\"Hyoumen\"/>"
					  + "</if>"
					  + "<else-if variable=\"title\" match=\"any\">" //false
					  + "<text value=\"Mikake\"/>"
					  + "</else-if>"
					  + "<else-if variable=\"title\" match=\"none\">" //true
						  + "<choose>"
						  + "<if variable=\"title\" match=\"any\">" //false
						  + "<text value=\"Omote\"/>"
						  + "</if>"
						  + "<else-if variable=\"title\" match=\"none\">" //true
						  + "<text value=\"Ura\"/>"
						  + "</else-if>"
						  + "<else>" //should be skipped
						  + "<text value=\"Shiranumono\"/>"
						  + "</else>"
						  + "</choose>"
					  + "</else-if>"
					  + "<else>" //should be skipped
					  + "<text value=\"Sonota\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_conditions.makeCite(xml);
			doh.assertEqual("Ura",cite);
		},
		function testAny(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<choose>"
					  + "<if variable=\"title\" match=\"any\">"
					  + "<text value=\"Omote\"/>"
					  + "</if>"
					  + "<else>"
					  + "<text value=\"Ura\"/>"
					  + "</else>"
					  + "</choose>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = { "id": "Item-1", "title":"Some value" };
			var cite = tests.test_conditions.makeCite(xml,Item);
			doh.assertEqual("Omote",cite);
		},
	],
	function(){  //setup
		tests.test_conditions.makeCite = function(myxml,Item){
			if ("undefined" == typeof Item){
				Item = {"id": "Item-1"};
			}
			var sys = new RhinoTest([Item]);
			var style = new CSL.Engine(sys,myxml);
			return style.makeCitationCluster(sys.citations);
		};
	},
	function(){	// teardown
	}

);


var x = [
]