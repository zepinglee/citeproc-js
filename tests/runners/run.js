dojo.require("doh.runner");
doh.register("run.bugreports_lotOfAuthors", [
    function(){
        var test = new StdRhinoTest("bugreports_lotOfAuthors","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();