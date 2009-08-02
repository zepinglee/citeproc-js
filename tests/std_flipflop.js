dojo.provide("tests.std_flipflop");

doh.register("tests.std_flipflop", [
    function(){
        var test = new StdRhinoTest("flipflop_ItalicsFlipped");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("flipflop_ItalicsSimple");
        doh.assertEqual(test.result, test.run());
    },
]);
