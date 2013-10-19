dojo.require("doh.runner");
doh.register("run.flipflop_StartingApostrophe", [
    function(){
        var test = new StdRhinoTest("flipflop_StartingApostrophe","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();