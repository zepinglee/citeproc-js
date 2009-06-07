dojo.provide("tests.test_queue");


doh.registerGroup("tests.queue",
	[
		function testListMerge () {
			var token = tests.test_queue.token();
			var state = new tests.test_queue.state();
			state.fun = {};
			state.fun.flipflopper = new CSL.Util.FlipFlopper();
			var res = new CSL.Output.Queue(state);

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
			var state = new tests.test_queue.state();
			state.fun = {};
			state.fun.flipflopper = new CSL.Util.FlipFlopper();
			var res = new CSL.Output.Queue(state);

			var token = CSL.Factory.Token("someelement",CSL.START);

			res.append("one",token);
			doh.assertEqual("one", res.queue[0].blobs );
		},

		function testListNewlevel () {
			var state = new tests.test_queue.state();
			state.fun = {};
			state.fun.flipflopper = new CSL.Util.FlipFlopper();
			var res = new CSL.Output.Queue(state);
			var token = CSL.Factory.Token("someelement",CSL.START);

			res.addToken("myformatbundle",false,token);
			res.openLevel("myformatbundle");
			res.append("one");
			doh.assertEqual("one", res.queue[0].blobs[0].blobs );
		},

		function testString () {
			var state = new tests.test_queue.state();
			state.fun = {};
			state.fun.flipflopper = new CSL.Util.FlipFlopper();
			var res = new CSL.Output.Queue(state);

			var token1 = new CSL.Factory.Token("sometype",CSL.START);
			token1.strings.delimiter = " [X] ";

			var token2 = new CSL.Factory.Token("someothertype",CSL.START);
			token2.strings.delimiter = " [Y] ";

			res.addToken("withtokenone",false,token1);
			res.addToken("withtokentwo",false,token2);

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
			this.tmp.delimiter = new CSL.Factory.Stack();
			this.tmp.prefix = new CSL.Factory.Stack();
			this.tmp.suffix = new CSL.Factory.Stack();
			this.tmp.decorations = new CSL.Factory.Stack();
		};
	},
	function(){

	}
);
