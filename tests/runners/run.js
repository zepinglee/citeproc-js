dojo.require("doh.runner");
doh.register("run.bugreports_NoFormattingOnInstitution", [
    function(){
        var test = new StdRhinoTest("bugreports_NoFormattingOnInstitution","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();