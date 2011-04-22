dojo.require("doh.runner");
doh.register("run.citeprocjs_SubsequentSliceTwoNamesInstitution", [
    function(){
        var test = new StdRhinoTest("citeprocjs_SubsequentSliceTwoNamesInstitution","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();