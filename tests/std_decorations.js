dojo.provide("tests.std_decorations");

dojo.require("csl.csl");

doh.register("tests.std_decorations", [
    function(){
        var test = new Test("decorations_NestedQuotesInnerReverse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("decorations_NestedQuotes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("decorations_SimpleFlipFlop");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("decorations_SimpleQuotes");
        doh.assertEqual(test.result, test.run());
    },
]);
