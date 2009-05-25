dojo.provide("tests.test_groups");


var style = false;
var Item = false;

doh.registerGroup("tests.groups",
	[
		function testGroupSiblingDecoration(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout prefix=\"@\" suffix=\"@\">"
					  + "<group font-style=\"italic\">"
					  + "<text value=\"Hello\"/>"
					  + "<text value=\"Goodbye\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_groups.makeCite(xml);
			for (i in cite[0]){
				print(i+":"+cite[0][i]);
			}
			doh.assertEqual("@<i>HelloGoodbye</i>@",cite);
		},
		function testGroup(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<text value=\"Hello\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_groups.makeCite(xml);
			doh.assertEqual("Hello",cite);
		},
		function testGroupDecoration(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group font-style=\"italic\">"
					  + "<text value=\"Hello\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_groups.makeCite(xml);
			doh.assertEqual("<i>Hello</i>",cite);
		},
		function testGroupDelimiters(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group prefix=\"(\" suffix=\")\">"
					  + "<text value=\"one\" suffix=\"[y]\"/>"
					  + "<group prefix=\" =\" suffix=\"=\" delimiter=\"[x]\">"
					  + "<text value=\"two\"/>"
					  + "<text value=\"three\" prefix=\" \"/>"
					  + "</group>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";
			var cite = tests.test_groups.makeCite(xml);
			doh.assertEqual("(one[y] =two[x] three=)", cite);
		}

	],
	function(){
		tests.test_groups.makeCite = function(xml){
			var sys = new RhinoTest();
			var builder = new CSL.Core.Build(xml);
			var raw = builder.build(sys);
			var configurator = new CSL.Core.Configure(raw);
			style = configurator.configure();
			return style.makeCitationCluster(sys.citations);
		};
	},
	function(){
	}
);
