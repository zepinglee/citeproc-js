dojo.provide("tests.test_range");

var test = new Object();

doh.registerGroup("tests.range", [
	function testYearSuffixFormatter() {
		var token = new CSL.Factory.Token("bogus",CSL.START);
		token.formatter = test.fun.suffixator;
		var number = new CSL.Output.Number(0,token);
		doh.assertEqual( "object", typeof number.formatter );
		doh.assertEqual( "function", typeof number.formatter.format );
		doh.assertEqual( "k", number.formatter.format(10) );
	},
	function testThatItWorksAtAll() {
		try {
			CSL.Output.Number(2);
			var res = true;
		} catch (e){
			print(e);
			var res = false;
		}
		doh.assertTrue( res );
	},
	function testRomanFormatter() {
		var token = new CSL.Factory.Token("bogus",CSL.START);
		token.formatter = test.fun.romanizer;
		var number = new CSL.Output.Number(0,token);
		doh.assertEqual( "object", typeof number.formatter );
		doh.assertEqual( "function", typeof number.formatter.format );
		doh.assertEqual( "x", number.formatter.format(10) );
	},
	function testDefaultFormatter() {
		var number = new CSL.Output.Number(0);
		doh.assertEqual( "object", typeof number.formatter );
		doh.assertEqual( "function", typeof number.formatter.format );
		doh.assertEqual( "10", number.formatter.format(10) );
	},
	function testType() {
		var token = new CSL.Factory.Token("bogus",CSL.START);
		token.formatter = test.fun.suffixator;
		var number = new CSL.Output.Number(10,token);
		doh.assertEqual( "b", number.type );
	},
	function testNum() {
		var number = new CSL.Output.Number(2);
		doh.assertEqual( 2, number.num );
	},
	function testCheckNextSuccessor() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		var numlist = [number1,number2];
		numlist[0].checkNext(numlist[1]);
		doh.assertEqual( CSL.SUCCESSOR, numlist[1].status );
	},
	function testCheckNextSuppress() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		var number3 = new CSL.Output.Number(3);
		var numlist = [number1,number2,number3];
		numlist[0].checkNext(numlist[1]);
		numlist[1].checkNext(numlist[2]);
		doh.assertEqual( CSL.SUPPRESS, numlist[1].status );
	},
	function testCheckNextEndOnText() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		var number3 = new CSL.Output.Number(3);
		var numlist = [number1,number2,number3,"Text"];
		numlist[0].checkNext(numlist[1]);
		numlist[1].checkNext(numlist[2]);
		numlist[2].checkNext(numlist[3]);
		doh.assertEqual( CSL.END, numlist[2].status );
	},
	function testCheckNextEndOnEOL() {
		var number1 = new CSL.Output.Number(1);
		var number2 = new CSL.Output.Number(2);
		var number3 = new CSL.Output.Number(3);
		var numlist = [number1,number2,number3];
		numlist[0].checkNext(numlist[1]);
		numlist[1].checkNext(numlist[2]);
		numlist[2].checkNext(numlist[3]);
		doh.assertEqual( CSL.END, numlist[2].status );
	},
	],
	function(){
		var xml = "<style></style>";
		var builder = new CSL.Core.Build(xml);
		test.fun = builder.build().fun;
	},
	function(){
		test = new Object();
	}
);

