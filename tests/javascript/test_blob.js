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
 */
dojo.provide("tests.test_blob");

doh.register("tests.blob", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Blob();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testEmptyStringValue() {
		var obj = new CSL.Blob();
		doh.assertEqual("", obj.strings.prefix);
	},
	function testEmptyBlobsValue() {
		var obj = new CSL.Blob();
		doh.assertEqual("object", typeof obj.blobs);
		doh.assertEqual(0, obj.blobs.length);
		try {
			obj.blobs.push("hello");
			var res = "Success";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Success", res);
	},
	function testTokenStringsConfig() {
		var token = new CSL.Token("dummy");
		token.strings.prefix = "[X]";
		var obj = new CSL.Blob(token);
		doh.assertEqual("[X]", obj.strings.prefix);
	},
	function testTokenDecorationsConfig() {
		var token = new CSL.Token("dummy");
		token.decorations = ["hello"];
		var obj = new CSL.Blob(token);
		doh.assertEqual(1, obj.decorations.length);
		doh.assertEqual("hello", obj.decorations[0]);
	},
]);
