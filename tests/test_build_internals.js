dojo.provide("tests.test_build_internals");

var nestedsingleton = "<style><text/></style>";
var decoratedtags = "<style>"
					+ "<text font-style=\"italic\"/>"
				+ "</style>";
var textwithvalue = "<style>"
					+ "<text value=\"My Aunt Sally\"/>"
				+ "</style>";

var Item = {
	"title":"My Aunt Sally"
};

doh.register("tests.builder_internals", [
	function testNestedMacro(){
		var t = '<style>'
				+ '<macro name="hoo">'
					+ '<text value="two"/>'
				+ '</macro>'
				+ '<macro name="boo">'
					+ '<text macro="hoo"/>'
				+ '</macro>'
				+ '<citation>'
					+ '<layout>'
						+ '<text macro="boo"/>'
					+ '</layout>'
				+ '</citation>'
			+ '</style>';
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(t);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		doh.assertEqual("layout", res.citation.tokens[0].name);
		doh.assertEqual("text", res.citation.tokens[1].name);
		doh.assertEqual("group", res.citation.tokens[2].name);
		doh.assertEqual("group", res.citation.tokens[3].name);
		doh.assertEqual("text", res.citation.tokens[4].name);
		doh.assertEqual("group", res.citation.tokens[5].name);
		doh.assertEqual("group", res.citation.tokens[6].name);
		doh.assertEqual("text", res.citation.tokens[7].name);
		doh.assertEqual("layout", res.citation.tokens[8].name);
	},
	function testMacro(){
		var t = '<style>'
				+ '<macro name="boo">'
					+ '<text value="one"/>'
					+ '<text value=\"three\"/>'
				+ '</macro>'
				+ '<layout>'
				+ '<text value="two"/>'
				+ '<text macro="boo"/>'
				+ '</layout>'
			+ '</style>';
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(t);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		doh.assertEqual(9, res.citation.tokens.length );
		doh.assertEqual("function", typeof res.citation.tokens[4].execs[0]);
		doh.assertEqual("function", typeof res.citation.tokens[5].execs[0]);

	},
	function testValueAttributeAction(){
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(textwithvalue);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		var res = res.citation.tokens[0].strings.value;
		doh.assertEqual( "My Aunt Sally" , res);
	},
	function testMacroLoop(){
		var t = '<style>'
				+ '<macro name="herring">'
					+ '<text value="red"/>'
				+ '</macro>'
				+ '<macro name="boo">'
					+ '<text value="one"/>'
					+ '<text macro="hoo"/>'
				+ '</macro>'
				+ '<macro name="hoo">'
					+ '<text value="two"/>'
					+ '<text macro="boo"/>'
				+ '</macro>'
				+ '<layout>'
				+ '<text value="two"/>'
				+ '<text macro="boo"/>'
				+ '</layout>'
			+ '</style>';
		try {
			var sys = new RhinoTest();
			var builder = new CSL.Core.Build(t);
			var res = builder.build(sys);
		} catch(e){
			print(e+" (this error is correct)");
		}
		doh.assertFalse( res );
	},
	function testInit(){
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(nestedsingleton);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		//
		// note that the style tag is stripped by Build
		doh.assertEqual( 1, res.citation.tokens.length);
	},
	function testDecorationLength(){
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(decoratedtags);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		doh.assertEqual( 1, res.citation.tokens[0].decorations.length );
	},
	function testDecorationValue(){
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(decoratedtags);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		doh.assertEqual( "italic", res.citation.tokens[0].decorations[0][1]);
		doh.assertEqual( "@font-style", res.citation.tokens[0].decorations[0][0]);
	},
	function testValueAttributeType(){
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(textwithvalue);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		doh.assertEqual( "function" , typeof res.citation.tokens[0].execs[0]);
	},
	function testBadTag(){
		var sys = new RhinoTest();
		var t = '<style><badtagname/></style>';
		var obj = new CSL.Core.Build(t);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		function tryme() {
			try {
				builder._build(obj.showXml());
				return "Succeeded wrongly";
			} catch (e) {
				if ("Unknown tag name \"badtagname\" encountered while attempting to process CSL file"){
					return "Failed correctly";
				} else {
					return "Failed wrongly";
				}
			}
		}
		var res = tryme();
		doh.assertEqual("Failed correctly", res );
	},
	function testBadAttribute(){
		var sys = new RhinoTest();
		var t = '<style><text badattribute="sucks"/></style>';
		var obj = new CSL.Core.Build(t);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		function tryme() {
			try {
				builder._build(obj.showXml());
				return "Succeeded wrongly";
			} catch (e) {
				if ("Unknown attribute \"@badattribute\" in node \"text\" while processing CSL file"){
					return "Failed correctly";
				} else {
					return "Failed wrongly";
				}
			}
		}
		var res = tryme();
		doh.assertEqual("Failed correctly", res );
	},
	function testGroup(){
		var t = '<style>'
				+ '<group>'
					+ '<text value="hello"/>'
				+ '</group>'
			+ '</style>';
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(t);
		obj.state.sys = sys;
		var builder = new obj._builder(obj.state,true);
		var res = builder._build(obj.showXml());
		doh.assertEqual(3, res.citation.tokens.length );
		doh.assertEqual("function", typeof res.citation.tokens[1].execs[0]);
		var dummy = {};
		res.citation.tokens[1].execs[0].call(res.citation.tokens[1],obj.state,dummy);
		doh.assertEqual("hello", obj.state.citation.tokens[1].strings.value);
	},
	function testConditional(){
		var t = '<style>'
				+ '<choose>'
					+ '<if>'
						+ '<text value="one"/>'
					+ '</if>'
					+ '<else-if>'
						+ '<text value="two"/>'
					+ '</else-if>'
					+ '<else>'
						+ '<text value="three"/>'
					+ '</else>'
				+ '</choose>'
			+ '</style>';
		var sys = new RhinoTest();
		var obj = new CSL.Core.Build(t);
		var build = new obj._builder(obj.state,true);
		obj.state.sys = sys;
		var res = build._build(obj.showXml());
		doh.assertEqual(11, res.citation.tokens.length );
		doh.assertEqual("function", typeof res.citation.tokens[8].execs[0]);
		var dummy = {};
		res.citation.tokens[8].execs[0].call(res.citation.tokens[8],obj.state,dummy);
		doh.assertEqual("three", obj.state.citation.tokens[8].strings.value);
	},


]);

var x = [




]
