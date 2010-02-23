dojo.require("doh.runner");
doh.register("std.date_NegativeDateSort", [
    function(){
        var test = new StdRhinoTest("date_NegativeDateSort","std");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();