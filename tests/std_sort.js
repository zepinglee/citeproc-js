dojo.provide("tests.std_sort");

dojo.require("csl.csl");

doh.register("tests.std_sort", [
    function(){
        var test = new Test("sort_AguStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("sort_AguStyleReverseGroups");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("sort_Citation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("sort_NumberOfAuthorsAsKey");
        doh.assertEqual(test.result, test.run());
    },
]);
