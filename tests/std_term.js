dojo.provide("tests.std_term");

dojo.require("csl.csl");

doh.register("tests.std_term", [
    function(){
        var test = CSL.System.Tests.getTest("term_MagicCapitalization");
        doh.assertEqual(test.result, test.run());
    },
]);
