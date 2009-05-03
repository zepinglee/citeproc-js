dojo.provide("tests.test_commands");


doh.register("tests.commands", [
	function testMakeStyle() {
		try {
			var ret = CSL.makeStyle("<style><citation></citation></style>");
		} catch (e) {
			print(e);
			var ret = false;
		};
		doh.assertTrue(ret);
	}
]);
