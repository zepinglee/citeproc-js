dojo.provide("tests.test_build_integration");



doh.registerGroup("tests.build_integration",
	[
		function testBuildObject(t){
			var textwithvalue = '<style><text value="My Aunt Sally" font-style="italic"/></style>';
			var build = new CSL.Core.Build(textwithvalue);
			var obj = build.build();
			t.assertEqual("object", typeof obj );
		},
		function testBuildLength(t){
			var textwithvalue = '<style><text value="My Aunt Sally" font-style="italic"/></style>';
			var build = new CSL.Core.Build(textwithvalue);
			var obj = build.build();
			t.assertEqual(1, obj.citation.tokens.length );
		},
		function testBuild(t){
			var textwithvalue = '<style><text value="My Aunt Sally" font-style="italic"/></style>';
			var build = new CSL.Core.Build(textwithvalue);
			var obj = build.build();
			t.assertEqual("italic", obj.citation.tokens[0].decorations[0][1] );
		}
	]
);

