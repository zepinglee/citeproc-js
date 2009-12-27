/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
dojo.provide("tests.test_registry");

doh.register("tests.registry", [
	function testInstantiation(){
		try {
			var sys = new RhinoTest();
			var engine = new CSL.Engine(sys,"<style></style>");
			var obj = new CSL.Registry(engine);
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual( "Success", res);
	},
	function testItemReshuffle(){
		var sys = new RhinoTest();
		var engine = new CSL.Engine(sys,"<style></style>");
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