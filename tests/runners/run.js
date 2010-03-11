dojo.require("doh.runner");
doh.register("custom.date_LocalizedDateFormats-en-US", [
    function(){
        var test = new StdRhinoTest("date_LocalizedDateFormats-en-US","custom");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();