dojo.provide("tests.std_date");

dojo.require("csl.csl");

doh.register("tests.std_date", [
    function(){
        var test = CSL.System.Tests.getTest("date_LiteralFailGracefullyIfNoValue");
        doh.assertEqual(test.result, test.run());
    },
]);

var x = [
    function(){
        var test = CSL.System.Tests.getTest("date_LiteralIfOtherwiseNil");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("date_YearSuffixDelimiter");
        doh.assertEqual(test.result, test.run());
    },
]