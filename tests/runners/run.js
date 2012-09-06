dojo.require("doh.runner");
doh.register("run.initials_InitializeFalseToPeriod", [
    function(){
        var test = new StdRhinoTest("initials_InitializeFalseToPeriod","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();