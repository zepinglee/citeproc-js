dojo.require("doh.runner");
doh.register("run.name_WesternSimple", [
    function(){
        var test = new StdRhinoTest("name_WesternSimple","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();