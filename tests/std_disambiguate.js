dojo.provide("tests.std_disambiguate");

dojo.require("csl.csl");

doh.register("tests.std_disambiguate", [
    function(){
        var test = new StdTest("disambiguate_BasedOnSubsequentFormWithBackref");
        doh.assertEqual(test.result, test.run());
    },
]);

var x = [

    function(){
        var test = new StdTest("disambiguate_BasedOnEtAlSubsequent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("disambiguate_BaseNameCountOnFailureIfYearSuffixAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("disambiguate_DisambiguateCondition");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("disambiguate_GivennameExpandCrossNestedNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("disambiguate_MinimalGivennameExpandMinimalNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("disambiguate_RetainNamesOnFailureIfYearSuffixNotAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("disambiguate_YearSuffixAndSort");
        doh.assertEqual(test.result, test.run());
    },
]