/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
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