dojo.provide("tests.test_formatters");


doh.register("tests.formatters", [
	function testGetSuffix(){
		var list = "a,b,c,d";
		var suffixator = new CSL.Util.Disambiguate.Suffixator(list);
		doh.assertEqual("c",suffixator.format(2));
	},
	function testSuffixize(){

		var list = "a,b,c,d";
		var suffixator = new CSL.Util.Disambiguate.Suffixator(list);

		var res = suffixator.get_suffixes(34,list);
		doh.assertEqual("adc", res[(res.length-1)]);

		var res = suffixator.get_suffixes(350,list);
		doh.assertEqual("acbbd", res[(res.length-1)]);

		var res = suffixator.get_suffixes(351,list);
		doh.assertEqual("acbca", res[(res.length-1)]);
	},
	function testIfItWorksAtAll() {
		function testme () {
			try {
				var fmt = CSL.Utilities;
				return "Success";
			} catch (e) {
				return "Instantiation failure: " + e;
			}
		}
		var res = testme();
		doh.assertEqual( "Success", res );
	},

	function testCaps() {
		doh.assertEqual( 'CAPS', CSL.Output.Formatters.uppercase("caps") );
	},

]);

