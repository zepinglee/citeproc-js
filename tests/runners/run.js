dojo.require("doh.runner");
doh.register("run.parallel_TrailingIbid", [
    function(){
        var test = new StdRhinoTest("parallel_TrailingIbid","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();