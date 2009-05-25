dojo.provide("tests.std_sort");

dojo.require("csl.csl");

doh.register("tests.std_sort", [
    function(){
        var test = new StdTest("sort_AguStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("sort_AguStyleReverseGroups");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("sort_Citation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("sort_NumberOfAuthorsAsKey");
        doh.assertEqual(test.result, test.run());
    },
]);
