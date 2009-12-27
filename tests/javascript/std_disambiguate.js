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
dojo.provide("tests.std_disambiguate");

doh.register("tests.std_disambiguate", [
    function(){
        var test = new StdRhinoTest("disambiguate_AllNamesBaseNameCountOnFailureIfYearSuffixAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_AllNamesGenerally");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_BasedOnEtAlSubsequent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_BasedOnSubsequentFormWithBackref");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteBaseNameCountOnFailureIfYearSuffixAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteDisambiguateCondition");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameExpandCrossNestedNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameNoShortFormInitializeWith");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameShortFormInitializeWith");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameShortFormNoInitializeWith");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteMinimalGivennameExpandMinimalNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteRetainNamesOnFailureIfYearSuffixNotAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteTwoAuthorsSameFamilyName");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_CitationLabelDefault");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_CitationLabelInData");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_NoTextElementUsesYearSuffixVariable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_PrimaryNameGenerally");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_YearSuffixAndSort");
        doh.assertEqual(test.result, test.run());
    },
]);
