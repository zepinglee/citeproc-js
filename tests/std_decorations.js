dojo.provide("tests.std_decorations");

dojo.require("csl.csl");

doh.register("tests.std_decorations", [
    function(){
        var test = CSL.System.Tests.getTest("decorations_SimpleQuotes");
        doh.assertEqual(test.result, test.run());
    },
]);
