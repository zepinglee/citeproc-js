dojo.provide("tests.std_sort");

doh.register("tests.std_sort", [
    function(){
        var test = new StdRhinoTest("sort_AguStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("sort_AguStyleReverseGroups");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("sort_Citation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("sort_NumberOfAuthorsAsKey");
        doh.assertEqual(test.result, test.run());
    },
]);
