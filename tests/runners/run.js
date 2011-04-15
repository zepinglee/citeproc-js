dojo.require("doh.runner");
doh.register("run.name_AuthorCountWithMultipleVariables", [
    function(){
        var test = new StdRhinoTest("name_AuthorCountWithMultipleVariables","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();