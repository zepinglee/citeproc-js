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

			var Item = [{ "title":"Some value" }];
			var cite = tests.test_conditions.makeCite(xml,Item);
			doh.assertEqual("Omote",cite);
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
		}
	],
	function(){  //setup
		tests.test_conditions.makeCite = function(xml,Item){
			var sys = new RhinoTest(Item);
			var builder = new CSL.Core.Build(xml);
			var raw = builder.build(sys);
			var configurator = new CSL.Core.Configure(raw);
			var style = configurator.configure();
			return style.makeCitationCluster(sys.citations);
		};
	},
	function(){	// teardown
	}

);


