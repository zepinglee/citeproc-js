dojo.provide("tests.test_sequence");

doh.register("tests.sequence", [

	function testIfItWorksAtAll() {
		function testme () {
			try {
				var fmt = CSL.FORMAT_KEY_SEQUENCE;
				return "Success";
			} catch (e) {
				return  e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testContents() {
		var key = CSL.FORMAT_KEY_SEQUENCE[0];
		doh.assertEqual( "@text-case", key);
	},

]);
