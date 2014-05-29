dojo.require("doh.runner");
doh.register("run.number_WithDelimiter", [
    function(){
        var test = new StdRhinoTest("number_WithDelimiter","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();