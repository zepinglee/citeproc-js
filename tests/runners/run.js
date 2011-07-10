dojo.require("doh.runner");
doh.register("run.sort_LosAngelesPoliceDepartment2", [
    function(){
        var test = new StdRhinoTest("sort_LosAngelesPoliceDepartment2","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();