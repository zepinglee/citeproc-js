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
dojo.provide("tests.std_magic");

doh.register("tests.std_magic", [
    function(){
        var test = new StdRhinoTest("magic_SecondFieldAlign");
        doh.assertEqual(test.result, test.run());
    },
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
        var test = new StdRhinoTest("magic_PunctuationInQuoteSuffixTrue");
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
