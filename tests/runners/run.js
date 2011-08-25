dojo.require("doh.runner");
doh.register("run.sort_NameVariable", [
    function(){
        var test = new StdRhinoTest("sort_NameVariable","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();