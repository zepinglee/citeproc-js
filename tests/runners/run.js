dojo.require("doh.runner");
doh.register("run.disambiguate_ByCiteDisambiguateCondition", [
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteDisambiguateCondition","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();