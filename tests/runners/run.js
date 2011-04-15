dojo.require("doh.runner");
doh.register("run.name_SubstituteOnNamesSingletonGroupSpanFail", [
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSingletonGroupSpanFail","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();