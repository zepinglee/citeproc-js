dojo.require("doh.runner");
doh.register("run.institutions_FirstAndLast", [
    function(){
        var test = new StdRhinoTest("institutions_FirstAndLast","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();