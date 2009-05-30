dojo.provide("tests.std_condition");

doh.register("tests.std_condition", [
    function(){
        var test = new StdRhinoTest("condition_RefTypeBranching");
        doh.assertEqual(test.result, test.run());
    },
]);
