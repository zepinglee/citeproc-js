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
dojo.provide("tests.test_term");

doh.registerGroup("tests.term",
	[
		function testTermGroupRender(){
			var xml = "<style xml:lang=\"en\">"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<group>"
					  + "<text value=\"My Name\" suffix=\" \"/>"
					  + "<text term=\"and\" suffix=\" \"/>"
					  + "<text variable=\"title\"/>"
					  + "</group>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = [{"title":"My Title"}];
			var cite = tests.test_term.makeCite(xml,Item);
			doh.assertEqual("My Name and My Title",cite);
		},
		function testTermGroupSuppressOnNull(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<text term=\"and\" suffix=\" \"/>"
					  + "<text variable=\"title\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = [{}];
			var cite = tests.test_term.makeCite(xml,Item);
			doh.assertEqual("",cite);
		},
		function testTermGroupSuppressOnEmpty(){
			var xml = "<style>"
					  + "<citation>"
					  + "<layout>"
					  + "<group>"
					  + "<text term=\"and\" suffix=\" \"/>"
					  + "<text variable=\"title\"/>"
					  + "</group>"
					  + "</layout>"
					  + "</citation>"
				+ "</style>";

			var Item = [{"title":""}];
			var cite = tests.test_term.makeCite(xml,Item);
			doh.assertEqual("",cite);
		},
	],
	function(){  //setup
		tests.test_term.makeCite = function(xml,Item){
			var sys = new RhinoTest();
			sys.fixData(Item);
			var builder = new CSL.Core.Build(xml);
			var raw = builder.build(sys);
			var configurator = new CSL.Core.Configure(raw);
			var style = configurator.configure();
			return style.makeCitationCluster(sys.citations);
		};
	},
	function(){	// teardown
	}

);

