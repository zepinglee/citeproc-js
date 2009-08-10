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
        var test = new StdRhinoTest("magic_PunctuationInQuoteSuffixTrue");
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
