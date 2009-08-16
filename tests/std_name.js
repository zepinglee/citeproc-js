/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
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
        var test = new StdRhinoTest("name_CeltsAndToffsCrowdedInitials");
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
