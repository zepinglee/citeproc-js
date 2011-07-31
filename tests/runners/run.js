dojo.require("doh.runner");
doh.register("run.eclac_BookWithUnSalesNumber", [
    function(){
        var test = new StdRhinoTest("eclac_BookWithUnSalesNumber","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();