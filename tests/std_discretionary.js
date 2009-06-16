dojo.provide("tests.std_discretionary");

doh.register("tests.std_discretionary", [
    function(){
        var test = new StdRhinoTest("discretionary_SuppressAuthorSolo");
        doh.assertEqual(test.result, test.run());
    },
]);
