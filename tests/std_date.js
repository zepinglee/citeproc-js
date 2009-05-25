dojo.provide("tests.std_date");

dojo.require("csl.csl");

doh.register("tests.std_date", [
    function(){
        var test = new StdTest("date_KeyVariable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("date_LiteralFailGracefullyIfNoValue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("date_LiteralIfOtherwiseNil");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("date_YearSuffixDelimiter");
        doh.assertEqual(test.result, test.run());
    },
]);
