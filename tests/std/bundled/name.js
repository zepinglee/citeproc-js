dojo.provide("std.name");
doh.register("std.name", [
    function(){
        var test = new StdRhinoTest("name_Asian");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_WesternArticularLowercase");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnMacroGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteName");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_ImplicitInstitution");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_HyphenatedFirstName");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_ArticularShortForm");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_MixedFormatsInitialSortOrderFirstWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_TwoRolesSameRenderingSeparateRoleLabels");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSpanGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_InheritAttributesEtAlStyle");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_LabelAfterPluralDecorations");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_AuthorCount");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_ParseNames");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNumberGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_CeltsAndToffsCrowdedInitials");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnDateGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SplitInitials");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_AsianGlyphs");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_MixedFormatsInitialsWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteMacroInheritDecorations");
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
        var test = new StdRhinoTest("name_HierarchicalDelimiter");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_LongAbbreviation");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_LabelAfterPlural");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_ArticularWithComma");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_CeltsAndToffsSpacedInitials");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_CeltsAndToffsNoHyphens");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_WesternPrimaryFontStyleTwoAuthors");
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
        var test = new StdRhinoTest("name_OverridingHierarchicalDelimiter");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnGroupSpanGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_OnlyFamilyname");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_AuthorEditorCount");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteInheritLabel");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSpanNamesSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubsequentSliceTwoNamesInstitution");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_AuthorCountWithMultipleVariables");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_ArticularPlain");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_SubstituteOnNamesSingletonGroupSpanFail");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_AuthorCountWithSameVarContentAndCombinedTerm");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_ParticleFormatting");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_WesternSimple");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_Institution");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_WesternTwoAuthors");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_StartAndJustOneMoreThanEtAlUseFirst");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_WesternPrimaryFontStyle");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_StartAndLessThanMax");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_MixedFormatsInitialSortOrderAllWithDecorationsEtAl");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_MixedFormatsWithDecorationsPlusAlternateEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_OnlyGivenname");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_MixedFormatsWithDecorationsPlusEtAlDecorations");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_StartAndAtOrMoreThanMax");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("name_FormattingOfParticles");
        doh.assertEqual(test.result, test.run());
    }, 
]);
