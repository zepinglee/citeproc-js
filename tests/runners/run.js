dojo.require("doh.runner");
doh.register("run.magic_ImplicitYearSuffixDelimiter", [
    function(){
        var test = new StdRhinoTest("magic_ImplicitYearSuffixDelimiter","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();