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
dojo.provide("tests.test_range");

var test = new Object();

doh.registerGroup("tests.range", [
	function testCheckNextEndOnEOL() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		// range_prefix can be set on all objects in the series
		number2.range_prefix = "-";
		var number3 = new CSL.Output.Number(3);
		var numlist = [number1,number2,number3];
		numlist[0].checkNext(numlist[1]);
		numlist[1].checkNext(numlist[2]);
		numlist[2].checkNext(numlist[3]);
		doh.assertEqual( CSL.END, numlist[2].status );
	},
	function testCheckNextSuppress() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		// range_prefix can be set on all objects in the series
		number2.range_prefix = "-";
		var number3 = new CSL.Output.Number(3);
		var numlist = [number1,number2,number3];
		numlist[0].checkNext(numlist[1]);
		numlist[1].checkNext(numlist[2]);
		doh.assertEqual( CSL.SUPPRESS, numlist[1].status );
	},
	function testYearSuffixFormatter() {
		var token = new CSL.Factory.Token("bogus",CSL.START);
		token.formatter = test.fun.suffixator;
		var number = new CSL.Output.Number(0,token);
		doh.assertEqual( "object", typeof number.formatter );
		doh.assertEqual( "function", typeof number.formatter.format );
		doh.assertEqual( "k", number.formatter.format(10) );
	},
	function testThatItWorksAtAll() {
		try {
			CSL.Output.Number(2);
			var res = true;
		} catch (e){
			CSL.debug(e);
			var res = false;
		}
		doh.assertTrue( res );
	},
	function testRomanFormatter() {
		var token = new CSL.Factory.Token("bogus",CSL.START);
		token.formatter = test.fun.romanizer;
		var number = new CSL.Output.Number(0,token);
		doh.assertEqual( "object", typeof number.formatter );
		doh.assertEqual( "function", typeof number.formatter.format );
		doh.assertEqual( "x", number.formatter.format(10) );
	},
	function testDefaultFormatter() {
		var number = new CSL.Output.Number(0);
		doh.assertEqual( "object", typeof number.formatter );
		doh.assertEqual( "function", typeof number.formatter.format );
		doh.assertEqual( "10", number.formatter.format(10) );
	},
	function testType() {
		var token = new CSL.Factory.Token("bogus",CSL.START);
		token.formatter = test.fun.suffixator;
		var number = new CSL.Output.Number(10,token);
		doh.assertEqual( "b", number.type );
	},
	function testNum() {
		var number = new CSL.Output.Number(2);
		doh.assertEqual( 2, number.num );
	},
	function testCheckNextSuccessor() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		var numlist = [number1,number2];
		numlist[0].checkNext(numlist[1]);
		doh.assertEqual( CSL.SUCCESSOR, numlist[1].status );
	},
	function testCheckNextEndOnText() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		// range_prefix can be set on all objects in the series
		number2.range_prefix = "-";
		var number3 = new CSL.Output.Number(3);
		var numlist = [number1,number2,number3,"Text"];
		numlist[0].checkNext(numlist[1]);
		numlist[1].checkNext(numlist[2]);
		numlist[2].checkNext(numlist[3]);
		doh.assertEqual( CSL.END, numlist[2].status );
	},
	],
	function(){
		var xml = "<style></style>";
		var builder = new CSL.Core.Build(xml);
		test.fun = builder.build().fun;
	},
	function(){
		test = new Object();
	}
);
