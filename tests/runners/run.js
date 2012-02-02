dojo.require("doh.runner");
doh.register("run.number_AffixesWithMultiple", [
    function(){
        var test = new StdRhinoTest("number_AffixesWithMultiple","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();