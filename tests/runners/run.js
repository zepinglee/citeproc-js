dojo.require("doh.runner");
doh.register("run.hhkk_Book", [
    function(){
        var test = new StdRhinoTest("hhkk_Book","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();