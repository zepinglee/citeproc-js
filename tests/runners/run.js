dojo.require("doh.runner");
doh.register("run.bugreports_FourAndFour", [
    function(){
        var test = new StdRhinoTest("bugreports_FourAndFour","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();