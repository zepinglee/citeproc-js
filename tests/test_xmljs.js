dojo.provide("tests.test_xmljs");

doh.registerGroup("tests.xml", [

	function testNestingEndPoint(){
		var tag = '<style value="mystyle">'
				+ '<macro value="mymacro">'
					+ '<text value="one"/>'
					+ '<text value="three"/>'
				+ '</macro>'
				+ '<text value="two"/>'
				+ '<text value="boo"/>'
			+ '</style>';
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		// [[]]
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( "mymacro", res[0][0].attributes["@value"] );
		doh.assertEqual( "one", res[0][0][0].attributes["@value"] );
		doh.assertEqual( "three", res[0][0][1].attributes["@value"] );
		doh.assertEqual( "two", res[0][1].attributes["@value"] );
		doh.assertEqual( "boo", res[0][2].attributes["@value"] );
	},
	function testAttributes(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( 2, cmd.children.call(res[0]).length );
		doh.assertEqual( "text", cmd.children.call(res[0])[0].name );
		doh.assertEqual( "other thing", cmd.children.call(res[0])[1].text );
	},

	function testChildren(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( 2, cmd.children.call(res[0]).length );
	},


	function testGetTextString(){
		var tag = "<style><text value=\"hello\"/>and some text here</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("and some text here", res[0][1].text );
	},

	function testParseWithTextNode(){
		var tag = "<style><text value=\"hello\"/>and some text here</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual(null, res[0][1].name );
	},

	function testParseHasAttributes(){
		var tag = "<style><text value=\"hello\"/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("hello", res[0][0].attributes["@value"] );
	},

	function testParseHasContent(){
		var tag = "<style><text/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("style", res[0].name );
		doh.assertEqual("text", res[0][0].name );
	},

	function testParseReturnsCorrectLength(){
		var tag = "<style><text/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual(1, res[0].length );
	},

	function testParseReturnsSomething(){
		var tag = "<style><text/></style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertTrue( res[0] );
	},

	function testParseSuccess(){
		var tag = "<tag><tag/></tag>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return "Success";
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("Success", res);
	},

	function testNodename(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( "text", cmd.nodename.call(res[0][0]) );
	},

	function testContent(){
		var tag = "<style><text value=\"hello\"/>other thing</style>";
		function tryme (){
			try {
				var res = CSL.System.Xml.JunkyardJavascript.parse(tag);
				return res;
			} catch(e) {
				print (e);
				return e;
			}
		}
		var res = tryme();
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		doh.assertEqual( "other thing", cmd.content.call(res[0][1]) );
	},

]);
