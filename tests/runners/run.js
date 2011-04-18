dojo.require("doh.runner");
doh.register("run.name_EtAlUseLast", [
    function(){
        var test = new StdRhinoTest("name_EtAlUseLast","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();