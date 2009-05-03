dojo.provide("tests.std_condition");

dojo.require("csl.csl");

doh.register("tests.std_condition", [
    function(){
        var test = CSL.System.Tests.getTest("condition_RefTypeBranching");
        doh.assertEqual(test.result, test.run());
    },
]);
