dojo.provide("tests.test_configure");


var nestedsingleton = "<style><text/></style>";
var xmlif = "<style>"
			+ "<choose>"
				+ "<if>"
					+ "<text value=\"one\"/>"
				+ "</if>"
				+ "<else-if>"
					+ "<text value=\"two\"/>"
				+ "</else-if>"
				+ "<else>"
					+ "<text value=\"three\"/>"
				+ "</else>"
			+ "</choose>"
		+ "</style>";
var xmlifnested = "<style>"
					  + "<choose>"
						  + "<if>"
							  + "<text value=\"one\"/>"
							  + "<choose>"
								  + "<if>"
									  + "<text value=\"ten\"/>"
								  + "</if>"
								  + "<else-if>"
									  + "<text value=\"five\"/>"
								  + "</else-if>"
							  + "</choose>"
						  + "</if>"
						  + "<else-if>"
							  + "<text value=\"two\"/>"
						  + "</else-if>"
						  + "<else>"
							  + "<text value=\"three\"/>"
						  + "</else>"
					  + "</choose>"
				  + "</style>";

var build = false;
var obj = false;
var conf = false;
var newobj = false;

doh.registerGroup("tests.conditions_build",
	[
		function testBuildLength(){
			doh.assertEqual(1, obj["citation"]["tokens"].length);
		}

	],
	function(){ // setup
		var sys = new RhinoTest();
		build = new CSL.Core.Build(nestedsingleton);
		obj = build.build(sys);
	},
	function(){ // teardown
		build = false;
		obj = false;
	}
);


doh.registerGroup("tests.conditions_simple_jumps",
	[
		function testConfigureReturnsSomething(){
			doh.assertEqual(11, newobj["citation"]["tokens"].length);
		},

		function testConfigureJumpHasValue(){
			doh.assertEqual( 11, newobj["citation"]["tokens"][3]["succeed"]);
		}
	],
	function(){ // setup
		var sys = new RhinoTest();
		build = new CSL.Core.Build(xmlif);
		obj = build.build(sys);
		conf = new CSL.Core.Configure(obj);
		newobj = conf.configure();
	},
	function(){ // teardown
		build = false;
		obj = false;
		conf = false;
		newobj = false;
	}
);

doh.registerGroup("tests.conditions_complex_jumps",
	[
		function testConfigureReturnsSomething(){
			doh.assertEqual(19, newobj["citation"]["tokens"].length);
		},

		function testConfigureJumpHasValue(){
			doh.assertEqual( 12, newobj["citation"]["tokens"][1]["fail"]);
		}
	],
	function(){ // setup
		var sys = new RhinoTest();
		build = new CSL.Core.Build(xmlifnested);
		obj = build.build(sys);
		conf = new CSL.Core.Configure(obj);
		newobj = conf.configure();

	},
	function(){ // teardown
		build = false;
		obj = false;
		conf = false;
		newobj = false;
	}
);
