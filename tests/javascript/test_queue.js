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
dojo.provide("tests.test_queue");

doh.registerGroup("tests.queue",
	[
		function testListMerge () {
			var token = tests.test_queue.token();

			var myxml = "<style></style>";
			var sys = new RhinoTest();
			var state = new CSL.Engine(sys,myxml);

			var res = new CSL.Output.Queue(state);

			state.parallel.use_parallels = false;

			res.addToken("newlevel",false,token);
			res.append("one");
			res.openLevel("newlevel");
			res.append("two");
			res.append("three");
			doh.assertEqual("two", res.current.value().blobs[0].blobs );
			res.closeLevel();
			doh.assertEqual("one", res.current.value()[0].blobs );
		},
		function testListAppend () {

			var myxml = "<style></style>";
			var sys = new RhinoTest();
			var state = new CSL.Engine(sys,myxml);

			var res = new CSL.Output.Queue(state);

			var token = CSL.Token("someelement",CSL.START);

			res.append("one",token);
			doh.assertEqual("one", res.queue[0].blobs );
		},

		function testListNewlevel () {

			var myxml = "<style></style>";
			var sys = new RhinoTest();
			var state = new CSL.Engine(sys,myxml);

			var res = new CSL.Output.Queue(state);
			var token = CSL.Token("someelement",CSL.START);

			state.parallel.use_parallels = false;

			res.addToken("myformatbundle",false,token);
			res.openLevel("myformatbundle");
			res.append("one");
			doh.assertEqual("one", res.queue[0].blobs[0].blobs );
		},

		function testString () {
			var myxml = "<style></style>";
			var sys = new RhinoTest();
			var state = new CSL.Engine(sys,myxml);
			var res = state.output;

			var token1 = new CSL.Token("sometype",CSL.START);
			token1.strings.delimiter = " [X] ";

			var token2 = new CSL.Token("someothertype",CSL.START);
			token2.strings.delimiter = " [Y] ";

			res.addToken("withtokenone",false,token1);
			res.addToken("withtokentwo",false,token2);

			state.parallel.use_parallels = false;

			res.openLevel("withtokenone"); // provides delimiter for group
			res.append("one");
			res.openLevel("withtokentwo"); // provides delimiter for subgroup
			res.append("two");
			res.append("three");
			res.closeLevel();
			res.closeLevel();

			doh.assertEqual("one [X] two [Y] three", res.string(state,res.queue) );
		},
	],
	function(){
		tests.test_queue.token = function(){
			return {
				"decorations": new Array(),
				"strings":{
					"prefix":"",
					"suffix":"",
					"delimiter":""
				}
			};
		};
		tests.test_queue.state = function(){
			this.tmp = new Object();
			this.tmp.delimiter = new CSL.Stack();
			this.tmp.prefix = new CSL.Stack();
			this.tmp.suffix = new CSL.Stack();
			this.tmp.decorations = new CSL.Stack();
		};
	},
	function(){

	}
);

var x = [
]