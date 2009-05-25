dojo.provide("tests.std_condition");

dojo.require("csl.csl");

doh.register("tests.std_condition", [
    function(){
        var test = new Test("condition_RefTypeBranching");
        doh.assertEqual(test.result, test.run());
    },
]);
