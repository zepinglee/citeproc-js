dojo.provide("tests.std_quotes");

doh.register("tests.std_quotes", [
    function(){
        var test = new StdRhinoTest("quotes_Punctuation");
        doh.assertEqual(test.result, test.run());
    },
]);
