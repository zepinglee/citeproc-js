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
dojo.provide("tests.test_dates");


doh.register("tests.dates", [
	function testThatItWorksAtAll(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"year\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("1965",res);
	},
	function testYearFormShort(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"year\" form=\"short\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("65",res);
	},
	function testMonthFormNumeric(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"numeric\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("6",res);
	},
	function testMonthFormNumericLeadingZeros(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"numeric-leading-zeros\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("06",res);
	},
	function testMonthFormShort(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"short\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("Jun",res);
	},
	function testMonthFormLong(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"month\" form=\"long\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("June",res);
	},
	function testDayFormNumeric(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"numeric\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("1",res);
	},
	function testDayFormNumericLeadingZeros(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"numeric-leading-zeros\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("01",res);
	},
	function testDayFormOrdinalOne(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("1st",res);
	},
	function testDayFormOrdinalTwo(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-2"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("2nd",res);
	},
	function testDayFormOrdinalThree(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-western-name-3"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("3rd",res);
	},
	function testDayFormOrdinalFour(){
		var xml = "<style>"
					  + "<layout>"
						  + "<date variable=\"issued\">"
							  + "<date-part name=\"day\" form=\"ordinal\"/>"
						  + "</date>"
					  + "</layout>"
			+ "</style>";
		var sys = new RhinoTest(["simple-mongolian-name-1"]);
		var builder = new CSL.Core.Build(xml);
		var raw = builder.build(sys);
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		var res = style.makeCitationCluster(sys.citations);
		doh.assertEqual("4th",res);
	},

]);



