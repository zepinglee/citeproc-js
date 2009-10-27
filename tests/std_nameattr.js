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
dojo.provide("tests.std_nameattr");

doh.register("tests.std_nameattr", [
    function(){
        var test = new StdRhinoTest("nameattr_AndOnBibliographyInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnBibliographyInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnCitationInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnCitationInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnNamesInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnNamesInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnStyleInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_AndOnStyleInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnBibliographyInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnBibliographyInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnCitationInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnCitationInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnNamesInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnNamesInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnStyleInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_DelimiterPrecedesLastOnStyleInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnBibliographyInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnBibliographyInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnCitationInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnCitationInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnNamesInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnNamesInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnStyleInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_InitializeWithOnStyleInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnBibliographyInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnBibliographyInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnCitationInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnCitationInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnNamesInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnNamesInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnStyleInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameDelimiterOnStyleInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnBibliographyInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnBibliographyInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnCitationInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnCitationInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnNamesInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnNamesInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnStyleInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NameFormOnStyleInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnBibliographyInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnBibliographyInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnCitationInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnCitationInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnNamesInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnNamesInCitation");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnStyleInBibliography");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnStyleInCitation");
        doh.assertEqual(test.result, test.run());
    },
]);
