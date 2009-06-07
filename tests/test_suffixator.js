dojo.provide("tests.test_suffixator");


doh.register("tests.suffixator", [
	function testSuffixize(){

		var list = "a,b,c,d";
		var suffixator = new CSL.Util.Suffixator(list);

		var res = suffixator.get_suffixes(34,list);
		doh.assertEqual("adc", res[(res.length-1)]);

		var res = suffixator.get_suffixes(350,list);
		doh.assertEqual("acbbd", res[(res.length-1)]);

		var res = suffixator.get_suffixes(351,list);
		doh.assertEqual("acbca", res[(res.length-1)]);
	},
	function testGetSuffix(){
		var list = "a,b,c,d";
		var suffixator = new CSL.Util.Suffixator(list);
		doh.assertEqual("c",suffixator.format(2));
	},
]);
