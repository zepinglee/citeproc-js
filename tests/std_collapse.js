dojo.provide("tests.std_collapse");

doh.register("tests.std_collapse", [
    function(){
        var test = new StdRhinoTest("collapse_TrailingDelimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_YearSuffixCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_CitationNumberRangesWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_CitationNumberRangesWithAffixesNoCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_YearSuffixCollapseNoRange");
        doh.assertEqual(test.result, test.run());
    },
]);

var x = [
]