dojo.require("doh.runner");
doh.register("run.eclac_BookFromImf", [
    function(){
        var test = new StdRhinoTest("eclac_BookFromImf","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();