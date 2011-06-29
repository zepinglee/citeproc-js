dojo.require("doh.runner");
doh.register("run.punctuation_DefaultRangeDelimiter", [
    function(){
        var test = new StdRhinoTest("punctuation_DefaultRangeDelimiter","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();