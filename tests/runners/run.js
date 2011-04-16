dojo.require("doh.runner");
doh.register("run.name_Institution", [
    function(){
        var test = new StdRhinoTest("name_Institution","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();