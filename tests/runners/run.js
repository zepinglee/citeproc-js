dojo.require("doh.runner");
doh.register("run.multilingual_RightToLeft", [
    function(){
        var test = new StdRhinoTest("multilingual_RightToLeft","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();