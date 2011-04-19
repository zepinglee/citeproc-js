dojo.require("doh.runner");
doh.register("run.magic_SuppressDuplicateVariableRendering", [
    function(){
        var test = new StdRhinoTest("magic_SuppressDuplicateVariableRendering","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();