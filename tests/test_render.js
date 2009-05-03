dojo.provide("tests.test_render");

doh.registerGroup("tests.render",
	[
		function testHello(){
			var xml = "<style><citation><layout><text font-style=\"italic\" value=\"Hello world!\"/></layout></citation></style>";
			var cite = tests.test_render.makeCite(xml);
			doh.assertEqual("<i>Hello world!</i>",cite);
		}
	],
	function(){ //setup
		tests.test_render.makeCite = function (xml){
			var builder = new CSL.Core.Build(xml);
			var raw = builder.build();
			var configurator = new CSL.Core.Configure(raw);
			var style = configurator.configure();
			var Item = [{}];
			var ret = style.makeCitationCluster(Item);
			return ret;
		};
	},
	function(){ //teardown

	}
);
