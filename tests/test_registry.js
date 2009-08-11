dojo.provide("tests.test_registry");

doh.register("tests.registry", [
	function testInstantiation(){
		try {
			var sys = new RhinoTest();
			var engine = new CSL.Engine(sys,"<style></style>");
			var obj = new CSL.Factory.Registry(engine);
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual( "Success", res);
	},
	function testItemReshuffle(){
		var sys = new RhinoTest();
		var engine = new CSL.Engine(sys,"<style></style>");
		//var registry = new CSL.Factory.Registry(engine);
		sys._cache["ITEM-1"] = { id:"ITEM-1", title:"Book A"};
		sys._cache["ITEM-2"] = { id:"ITEM-1", title:"Book B"};
		sys._cache["ITEM-3"] = { id:"ITEM-1", title:"Book C"};
		sys._cache["ITEM-4"] = { id:"ITEM-1", title:"Book D"};
		sys._cache["ITEM-5"] = { id:"ITEM-1", title:"Book E"};
		var res = engine.updateItems(["ITEM-1","ITEM-2","ITEM-3","ITEM-4","ITEM-5"]);
		doh.assertEqual("ITEM-1|ITEM-2|ITEM-3|ITEM-4|ITEM-5",res.join("|"));
		var res = engine.updateItems(["ITEM-1","ITEM-4","ITEM-5","ITEM-2","ITEM-3"]);
		doh.assertEqual("ITEM-1|ITEM-4|ITEM-5|ITEM-2|ITEM-3",res.join("|"));
	},
]);

var x = [
]