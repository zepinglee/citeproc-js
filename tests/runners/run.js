dojo.require("doh.runner");
doh.register("run.api_SuppressAuthor", [
    function(){
        var test = new StdRhinoTest("api_SuppressAuthor","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();