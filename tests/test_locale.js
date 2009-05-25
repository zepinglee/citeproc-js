dojo.provide("tests.test_locale");

var sys = new RhinoTest();

doh.register("tests.locale",
	[
		function testManualLoad(){
			var xml = readFile("./locale/locales-en-US.xml");
			var builder = new CSL.Core.Build(xml);
			var tokens = builder.build(sys);
			doh.assertEqual("¶",builder.state.opt.term["paragraph"]["symbol"][0]);
		},
		function testImplicitLoad(){
			var xml = "<style xml:lang=\"ja\"><text/></style>";
			var builder = new CSL.Core.Build(xml);
			builder.build(sys);
			doh.assertEqual("段落", builder.state.opt.term["paragraph"]["verb"][0]);
		},

		function testFailedOverload(){
			var xml = "<style xml:lang=\"ja\">"
					  + "<locale lang=\"en\">"
					  + "<terms><term name=\"paragraph\">parrie</term></terms>"
					  + "</locale>"
					  + "</style>";
			var builder = new CSL.Core.Build(xml);
			builder.build(sys);
			doh.assertEqual("段落", builder.state.opt.term["paragraph"]["verb"][0]);
		},


		function testOverloadNotGreedy(){
			var xml = "<style xml:lang=\"ja\">"
					  + "<locale lang=\"ja\">"
					  + "<terms><term name=\"paragraph\">parrie</term></terms>"
					  + "</locale>"
					  + "</style>";
			var builder = new CSL.Core.Build(xml);
			builder.build(sys);
			doh.assertEqual("段落", builder.state.opt.term["paragraph"]["verb"][0]);
		},
		function testOverloadTakesEffect(){
			var xml = "<style xml:lang=\"ja\">"
					  + "<locale lang=\"ja\">"
					  + "<terms><term name=\"paragraph\">parrie</term></terms>"
					  + "</locale>"
					  + "</style>";
			var builder = new CSL.Core.Build(xml);
			builder.build(sys);
			doh.assertEqual("parrie", builder.state.opt.term["paragraph"]["long"][0]);
		}
		// add a test for default locale loading sometime.

	]
);
