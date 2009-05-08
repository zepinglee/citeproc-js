dojo.provide("tests.std_name");

dojo.require("csl.csl");

doh.register("tests.std_name", [
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_ArticularPlain");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_ArticularWithComma");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_AsianGlyphs");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_Asian");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_AuthorCount");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_CollapseRoleLabels");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_Delimiter");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_Institution");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_LabelAfterPluralDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_LabelAfterPlural");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_LongAbbreviation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsInitialSortOrderAllWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsInitialSortOrderFirstWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsInitialsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsPrimaryDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsWithDecorationsPlusAlternateEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_MixedFormatsWithDecorationsPlusEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_SubsituteName");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_SubstituteInheritLabel");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_SubstituteMacroInheritDecorations");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_TwoRolesSameRenderingSeparateRoleLabels");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_WesternArticularLowercase");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_WesternPrimaryFontStyle");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_WesternPrimaryFontStyleTwoAuthors");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_WesternSimple");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("name_WesternTwoAuthors");
        doh.assertEqual(test.result, test.run());
    },
]);
