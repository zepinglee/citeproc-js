dojo.require("doh.runner");
doh.register("run.oscola_ConferencePaperHasUrl", [
    function(){
        var test = new StdRhinoTest("oscola_ConferencePaperHasUrl","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();