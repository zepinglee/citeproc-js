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
dojo.provide("tests.test_sys_rhino_load");

var myitem = {
   "id":"simple-western-name-1",
   "type": "book",
   "author": [
        { "name":"Doe, John", "uri":"http://people.org/doej" }
   ],
   "issued": {"year": "1965", "month":"6", "day":"1"},
   "title": "His Anonymous Life"
};


doh.register("tests.sys_rhino_load", [

	function testInstantiationRhinoTestEmpty() {
		function testme () {
			try {
				var obj = new RhinoTest();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testInstantiationRhinoTestLoad() {
		function testme () {
			try {
				var obj = new RhinoTest(myitem);
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

]);
