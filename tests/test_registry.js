dojo.provide("tests.test_registry");

doh.register("tests.registry", [
	function testInstantiation(){
		try {
			var sys = new RhinoTest();
			var engine = new CSL.Engine(sys);
			var obj = new CSL.Factory.Registry(engine);
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual( "Success", res);
	},

]);

