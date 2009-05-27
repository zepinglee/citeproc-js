dojo.provide("tests.std_position");

dojo.require("csl.csl");

doh.register("tests.std_position", [
    function(){
        var test = new StdTest("position_IbidWithLocator");
        doh.assertEqual(test.result, test.run());
    },
]);
