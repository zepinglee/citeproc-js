dojo.require("doh.runner");
doh.register("run.name_OnlyGivenname", [
    function(){
        var test = new StdRhinoTest("name_OnlyGivenname","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();