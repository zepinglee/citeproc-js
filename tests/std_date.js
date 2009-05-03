dojo.provide("tests.std_date");

dojo.require("csl.csl");

doh.register("tests.std_date", [
    function(){
        var test = CSL.System.Tests.getTest("date_YearSuffixDelimiter");
        doh.assertEqual(test.result, test.run());
    },
]);
