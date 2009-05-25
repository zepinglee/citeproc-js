dojo.provide("tests.test_build");


var nestedsingleton = "<style><text/></style>";
var complex = "<style><textA/><textB/><choose><if><textC/></if><else><textD/><textE/></else></choose></style>";

var Item = {
	"title":"My Aunt Sally"
};

doh.register("tests.build", [

	function testBuild(){
		var builder = new CSL.Core.Build(nestedsingleton);
		function testme(){
			try {
				var sys = new RhinoTest();
				builder.build(sys);
				return "Success";
			} catch(e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual("Success", res);
	},
	function testExistence() {
		function testme () {
			try {
				var obj = CSL.Core.Build;
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Core.Build(nestedsingleton);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testXmlParseOkJS(){
		var obj = new CSL.Core.Build(nestedsingleton,"JunkyardJavascript");
		var cmd = CSL.System.Xml.JunkyardJavascript.commandInterface;
		function testme (){
			try {
				var name = cmd.nodename.call(cmd.children.call(obj.showXml())[0][0]);
				return name;
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual("text", res);
	},

	function testOptGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.opt );
	},
	function testCitationGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.citation );
	},
	function testBibliographyGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.bibliography );
	},
	function testCitationOptGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.citation.opt );
	},
	function testCitationTokensGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.citation.tokens );
	},
	function testBibliographyOptGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.bibliography.opt );
	},
	function testBibliographyTokensGetsCreated (){
		var sys = new RhinoTest();
		var builder = new CSL.Core.Build(nestedsingleton);
		var obj = builder.build(sys);
		doh.assertTrue( obj.bibliography.tokens );
	},


	function testSetXmlInstantiation (){
		var obj = new CSL.Core.Build(nestedsingleton);
		function proc(){}
		function testme (){
			try {
				var setxml = new obj._getNavi(obj.showXml(),proc,true);
				return "Success";
			} catch (e){
				return e;
			}
		}
		var res = testme();
		doh.assertEqual("Success", res);
	},

	function testRunnerInstantiation (){
		var obj = new CSL.Core.Build(nestedsingleton);
		var state = obj.state;
		function testme (){
			try {
				var build = new obj._builder(state);
				return "Success";
			} catch (e){
				return e;
			}
		}
		var res = testme();
		doh.assertEqual("Success", res);
	},

]);
