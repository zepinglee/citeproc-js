dojo.require("doh.runner");
doh.register("run.name_SuppressPersons", [
    function(){
        var test = new StdRhinoTest("name_SuppressPersons","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();