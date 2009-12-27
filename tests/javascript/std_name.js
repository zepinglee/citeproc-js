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
dojo.provide("tests.std_name");

doh.register("tests.std_name", [
    function(){
        var test = new StdRhinoTest("name_ArticularPlain");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_ArticularWithComma");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_AsianGlyphs");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_Asian");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_AuthorCount");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_AuthorCountWithMultipleVariables");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_AuthorCountWithSameVarContentAndCombinedTerm");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_CeltsAndToffsCrowdedInitials");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_CeltsAndToffsNoHyphens");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_CeltsAndToffsSpacedInitials");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_CollapseRoleLabels");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_Delimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_HyphenatedFirstName");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_InheritAttributesEtAlStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_Institution");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_LabelAfterPluralDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_LabelAfterPlural");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_LongAbbreviation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsInitialSortOrderAllWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsInitialSortOrderFirstWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsInitialsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsPrimaryDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsWithDecorationsPlusAlternateEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_MixedFormatsWithDecorationsPlusEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_ParseNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SplitInitials");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_StartAndAtOrMoreThanMax");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_StartAndJustOneMoreThanEtAlUseFirst");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_StartAndLessThanMax");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteInheritLabel");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteMacroInheritDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteName");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnDateGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnGroupSpanGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnMacroGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSingletonGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSpanGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSpanNamesSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNumberGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_TwoRolesSameRenderingSeparateRoleLabels");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_WesternArticularLowercase");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_WesternPrimaryFontStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_WesternPrimaryFontStyleTwoAuthors");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_WesternSimple");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("name_WesternTwoAuthors");
        doh.assertEqual(test.result, test.run());
    },
]);
