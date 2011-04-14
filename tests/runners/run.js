dojo.require("doh.runner");
doh.register("run.integration_YearSuffixOnOffOn", [
    function(){
        var test = new StdRhinoTest("integration_YearSuffixOnOffOn","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();