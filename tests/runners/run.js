dojo.require("doh.runner");
doh.register("run.statute_Backref", [
    function(){
        var test = new StdRhinoTest("statute_Backref","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();