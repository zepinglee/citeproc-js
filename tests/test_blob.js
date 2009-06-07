dojo.provide("tests.test_blob");

doh.register("tests.blob", [

	function testInstantiation() {
		function testme () {
			try {
				var obj = new CSL.Factory.Blob();
				return "Success";
			} catch (e) {
				return e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},
	function testEmptyStringValue() {
		var obj = new CSL.Factory.Blob();
		doh.assertEqual("", obj.strings.prefix);
	},
	function testEmptyBlobsValue() {
		var obj = new CSL.Factory.Blob();
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
		var token = new CSL.Factory.Token("dummy");
		token.strings.prefix = "[X]";
		var obj = new CSL.Factory.Blob(token);
		doh.assertEqual("[X]", obj.strings.prefix);
	},
	function testTokenDecorationsConfig() {
		var token = new CSL.Factory.Token("dummy");
		token.decorations = ["hello"];
		var obj = new CSL.Factory.Blob(token);
		doh.assertEqual(1, obj.decorations.length);
		doh.assertEqual("hello", obj.decorations[0]);
	},
]);
