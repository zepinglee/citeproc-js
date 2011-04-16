dojo.require("doh.runner");
doh.register("run.discretionary_SuppressMultipleAuthors", [
    function(){
        var test = new StdRhinoTest("discretionary_SuppressMultipleAuthors","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();