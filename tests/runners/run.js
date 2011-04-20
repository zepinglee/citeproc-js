dojo.require("doh.runner");
doh.register("run.name_EtAlAsSuffixInCitationShort", [
    function(){
        var test = new StdRhinoTest("name_EtAlAsSuffixInCitationShort","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();