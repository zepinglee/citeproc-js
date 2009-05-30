dojo.provide("tests.std_decorations");

doh.register("tests.std_decorations", [
    function(){
        var test = new StdRhinoTest("decorations_NestedQuotesInnerReverse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("decorations_NestedQuotes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("decorations_SimpleFlipFlop");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("decorations_SimpleQuotes");
        doh.assertEqual(test.result, test.run());
    },
]);
