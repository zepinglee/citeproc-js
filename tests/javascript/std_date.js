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
dojo.provide("tests.std_date");

doh.register("tests.std_date", [
    function(){
        var test = new StdRhinoTest("date_DateAD");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_DateBC");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_IgnoreNonexistentSort");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_KeyVariable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LiteralFailGracefullyIfNoValue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericDefault");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericDefaultMissingDay");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericDefaultWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYear");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearMonthMissingMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextDefault");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextDefaultMissingDay");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextDefaultWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextMonthFormOverride");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYear");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYearMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYearMonthMissingMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYearWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedWithInStyleFormatting");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LongMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_MaskNonexistentWithCondition");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_NoDate");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_NonexistentSortReverse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_OtherAlone");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_OtherWithDate");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_RawParseSimpleDate");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_SortEmptyDates");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormFulldateDayRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormFulldateMonthRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormFulldateYearRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormMonthdateMonthRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormMonthdateYearRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormYeardateYearRange");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_TextFormYeardateYearRangeOpen");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_Uncertain");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_YearSuffixDelimiter");
        doh.assertEqual(test.result, test.run());
    },
]);
