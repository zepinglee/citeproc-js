dojo.provide("tests.std_collapse");

dojo.require("csl.csl");

doh.register("tests.std_collapse", [
    function(){
        var test = new Test("collapse_CitationNumberRangesWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("collapse_CitationNumberRangesWithAffixesNoCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("collapse_YearSuffixCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new Test("collapse_YearSuffixCollapseNoRange");
        doh.assertEqual(test.result, test.run());
    },
]);
