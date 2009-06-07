dojo.provide("tests.test_romanizer");


doh.register("tests.romanizer", [
	function testRomanize(){
		var romanizer = new CSL.Util.Romanizer();
		doh.assertEqual("xiv", romanizer.format(14));
	},
]);
