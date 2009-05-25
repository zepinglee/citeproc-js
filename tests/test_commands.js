dojo.provide("tests.test_commands");


doh.register("tests.commands", [
	function testMakeStyle() {
		try {
			var sys = new RhinoTest();
			var ret = CSL.makeStyle(sys,"<style><citation></citation></style>");
		} catch (e) {
			print(e);
			var ret = false;
		};
		doh.assertTrue(ret);
	}
]);
