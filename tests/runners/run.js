dojo.require("doh.runner");
doh.register("run.bugreports_OldMhraDisambiguationFailure", [
    function(){
        var test = new StdRhinoTest("bugreports_OldMhraDisambiguationFailure","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();