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
dojo.provide("tests.std_magic");

doh.register("tests.std_magic", [
    function(){
        var test = new StdRhinoTest("magic_AllowRepeatDateRenderings");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_DisplayBlock");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_EntrySpacingDouble");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_HangingIndent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_LineSpacingDouble");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_LineSpacingTripleStretch");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_MagicCapitalization");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_NameParticle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_NameSuffixNoComma");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_NameSuffixWithComma");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteDefaultEnglishDelimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteDefaultEnglishSuffix");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteDelimiterTrue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteFalse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteFalseSuppressExtra");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteSuffixTrue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_PunctuationInQuoteTrueSuppressExtra");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SecondFieldAlign");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_StripPeriodsFalse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_StripPeriodsTrue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SubsequentAuthorSubstitute");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SubsequentAuthorSubstituteNotFooled");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SuppressDuplicateVariableRendering");
        doh.assertEqual(test.result, test.run());
    },
]);
