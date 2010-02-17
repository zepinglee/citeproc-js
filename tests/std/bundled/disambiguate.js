/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 */dojo.provide("std.disambiguate");

doh.register("std.disambiguate", [
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
        var test = new StdRhinoTest("disambiguate_BasedOnSubsequentFormWithLocator");
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
