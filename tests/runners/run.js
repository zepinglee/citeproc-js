dojo.require("doh.runner");
doh.register("run.decorations_NoNormalWithoutDecoration", [
    function(){
        var test = new StdRhinoTest("decorations_NoNormalWithoutDecoration","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();