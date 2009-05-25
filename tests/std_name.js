dojo.provide("tests.std_name");

dojo.require("csl.csl");

doh.register("tests.std_name", [
    function(){
        var test = new StdTest("name_ArticularPlain");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_ArticularWithComma");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_AsianGlyphs");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_Asian");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_AuthorCount");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_CollapseRoleLabels");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_Delimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_Institution");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_LabelAfterPluralDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_LabelAfterPlural");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_LongAbbreviation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsInitialSortOrderAllWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsInitialSortOrderFirstWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsInitialsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsPrimaryDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsWithDecorationsPlusAlternateEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_MixedFormatsWithDecorationsPlusEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteInheritLabel");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteMacroInheritDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteName");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnDateGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnGroupSpanGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnMacroGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnNamesSingletonGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnNamesSpanGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnNamesSpanNamesSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_SubstituteOnNumberGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_TwoRolesSameRenderingSeparateRoleLabels");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_WesternArticularLowercase");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_WesternPrimaryFontStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_WesternPrimaryFontStyleTwoAuthors");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_WesternSimple");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("name_WesternTwoAuthors");
        doh.assertEqual(test.result, test.run());
    },
]);
