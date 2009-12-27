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
