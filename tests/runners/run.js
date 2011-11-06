dojo.require("doh.runner");
doh.register("run.position_IbidWithLocator", [
    function(){
        var test = new StdRhinoTest("position_IbidWithLocator","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();