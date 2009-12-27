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
dojo.provide("tests.test_stack");

doh.register("tests.stack", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Stack();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testInitEmpty(){
		var obj = new CSL.Stack();
		doh.assertEqual(0, obj.mystack.length);
	},
	function testInitValue(){
		var obj = new CSL.Stack("hello");
		doh.assertEqual("hello", obj.mystack[0]);
	},
	function testInitUndefinedLiteral(){
		var obj = new CSL.Stack(undefined,true);
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("undefined", typeof obj.mystack[0]);
	},
	function testPushValue(){
		var obj = new CSL.Stack();
		obj.push("hello");
		doh.assertEqual("hello",obj.mystack[0]);
	},
	function testPushUndefinedValue(){
		var obj = new CSL.Stack();
		obj.push(undefined);
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("", obj.mystack[0]);
	},
	function testPushUndefinedLiteral(){
		var obj = new CSL.Stack();
		obj.push(undefined,true);
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("undefined", typeof obj.mystack[0]);
	},
	function testClear(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		doh.assertEqual(2, obj.mystack.length);
		obj.clear();
		doh.assertEqual(0, obj.mystack.length);
	},
	function testErrorOnEmptyStackReplace(){
		var obj = new CSL.Stack();
		try {
			obj.replace("hello");
			var res = "Ooops, this should raise an error";
		} catch (e){
			var res = e;
		}
		doh.assertEqual("Internal CSL processor error: attempt to replace nonexistent stack item with hello", res);
		CSL.debug(res + " (this error is correct)");
	},
	function testReplaceWithValue(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		obj.replace("two-and-a-half");
		doh.assertEqual("two-and-a-half", obj.mystack[1]);
	},
	function testReplaceNoValue(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		obj.replace();
		doh.assertEqual("", obj.mystack[1]);
	},
	function testPop(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		obj.pop();
		doh.assertEqual(1, obj.mystack.length);
		doh.assertEqual("undefined", typeof obj.mystack[1]);
		doh.assertEqual("one", obj.mystack[0]);
	},
	function testValue(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		doh.assertEqual("two", obj.value());
	},
	function testLength(){
		var obj = new CSL.Stack();
		obj.push("one");
		obj.push("two");
		doh.assertEqual(2, obj.length());
	}

]);
