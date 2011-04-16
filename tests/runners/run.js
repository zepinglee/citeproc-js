dojo.require("doh.runner");
doh.register("run.decorations_SimpleFlipFlop", [
    function(){
        var test = new StdRhinoTest("decorations_SimpleFlipFlop","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();