dojo.provide("tests.test_xmle4x");


var str = readFile("./style/apa.csl");



doh.registerGroup("tests.xml", [

	function testClean(){
		var tag = "<?tag?>\n<tag/>";
		var res = CSL.System.Xml.E4X.clean(tag);
		doh.assertEqual("<tag/>", res);
	},

	function testParse(){
		var tag = "<tag><tag/></tag>";
		function tryme (){
			try {
				var res = CSL.System.Xml.E4X.parse(tag);
				return "Success";
			} catch(e) {
				return e;
			}
		}
		var res = tryme();
		doh.assertEqual("Success", res);
	}

]);
