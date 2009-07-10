dojo.provide("tests.std_variables");

doh.register("tests.std_variables", [
    function(){
        var test = new StdRhinoTest("variables_ShortForm");
        doh.assertEqual(test.result, test.run());
    },
]);
