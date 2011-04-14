dojo.require("doh.runner");
doh.register("run.name_MixedFormatsWithDecorationsPlusEtAlDecorations", [
    function(){
        var test = new StdRhinoTest("name_MixedFormatsWithDecorationsPlusEtAlDecorations","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();