/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
dojo.provide("tests.std_collapse");

doh.register("tests.std_collapse", [
    function(){
        var test = new StdRhinoTest("collapse_CitationNumberRangesWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_CitationNumberRangesWithAffixesNoCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_TrailingDelimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_YearSuffixCollapse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("collapse_YearSuffixCollapseNoRange");
        doh.assertEqual(test.result, test.run());
    },
]);
