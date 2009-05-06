dojo.provide("tests.std_decorations");

dojo.require("csl.csl");

doh.register("tests.std_decorations", [
    function(){
        var test = CSL.System.Tests.getTest("decorations_NestedQuotesInnerReverse");
        doh.assertEqual(test.result, test.run());
    },
]);

var x = [
    function(){
        var test = CSL.System.Tests.getTest("decorations_NestedQuotes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("decorations_SimpleFlipFlop");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("decorations_SimpleQuotes");
        doh.assertEqual(test.result, test.run());
    },
]