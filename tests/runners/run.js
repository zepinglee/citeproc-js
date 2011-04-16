dojo.require("doh.runner");
doh.register("run.disambiguate_AndreaEg4", [
    function(){
        var test = new StdRhinoTest("disambiguate_AndreaEg4","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();