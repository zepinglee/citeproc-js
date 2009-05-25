dojo.provide("tests.test_term");

doh.registerGroup("tests.term",
	[
		function testTermGroupRender(){
			var xml = "<style xml:lang=\"en\">"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<group>"
					  + "<text value=\"My Name\" suffix=\" \"/>"
					  + "<text term=\"and\" suffix=\" \"/>"
					  + "<text variable=\"title\"/>"
					  + "</group>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = [{"title":"My Title"}];
			var cite = tests.test_term.makeCite(xml,Item);
			doh.assertEqual("My Name and My Title",cite);
		},
		function testTermGroupSuppressOnNull(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<text term=\"and\" suffix=\" \"/>"
					  + "<text variable=\"title\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = [{}];
			var cite = tests.test_term.makeCite(xml,Item);
			doh.assertEqual("",cite);
		},
		function testTermGroupSuppressOnEmpty(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<text term=\"and\" suffix=\" \"/>"
					  + "<text variable=\"title\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = [{"title":""}];
			var cite = tests.test_term.makeCite(xml,Item);
			doh.assertEqual("",cite);
		},
	],
	function(){  //setup
		tests.test_term.makeCite = function(xml,Item){
			var sys = new RhinoTest();
			sys.fixData(Item);
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

