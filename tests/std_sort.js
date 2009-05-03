dojo.provide("tests.std_sort");

dojo.require("csl.csl");

doh.register("tests.std_sort", [
    function(){
        var test = CSL.System.Tests.getTest("sort_AguStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("sort_AguStyleReverseGroups");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("sort_Citation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("sort_NumberOfAuthorsAsKey");
        doh.assertEqual(test.result, test.run());
    },
]);
