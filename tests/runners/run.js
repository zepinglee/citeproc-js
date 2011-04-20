dojo.require("doh.runner");
doh.register("run.collapse_TrailingDelimiter", [
    function(){
        var test = new StdRhinoTest("collapse_TrailingDelimiter","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();