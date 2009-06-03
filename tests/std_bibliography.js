dojo.provide("tests.std_bibliography");

doh.register("tests.std_bibliography", [
    function(){
        var test = new StdRhinoTest("bibliography_SubsequentAuthorSubstitute");
        doh.assertEqual(test.result, test.run());
    },
]);
