dojo.require("doh.runner");
doh.register("run.bugreports_wanted_term-join", [
    function(){
        var test = new StdRhinoTest("bugreports_wanted_term-join","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();