dojo.provide("tests.std_terms");

doh.register("tests.std_terms", [
    function(){
        var test = new StdRhinoTest("terms_EmptyOverload");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("terms_Missing");
        doh.assertEqual(test.result, test.run());
    },
]);
