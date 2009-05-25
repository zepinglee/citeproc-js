dojo.provide("tests.std_collapse");

dojo.require("csl.csl");

doh.register("tests.std_collapse", [
    function(){
        var test = new StdTest("collapse_CitationNumberRangesWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("collapse_CitationNumberRangesWithAffixesNoCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("collapse_TrailingDelimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("collapse_YearSuffixCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("collapse_YearSuffixCollapseNoRange");
        doh.assertEqual(test.result, test.run());
    },
]);
