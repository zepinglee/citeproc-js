dojo.provide("tests.std_disambiguate");

dojo.require("csl.csl");

doh.register("tests.std_disambiguate", [
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_BaseNameCountOnFailureIfYearSuffixAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_BasedOnEtAlSubsequent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_DisambiguateCondition");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_GivennameExpandCrossNestedNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_MinimalGivennameExpandMinimalNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_RetainNamesOnFailureIfYearSuffixNotAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("disambiguate_YearSuffixAndSort");
        doh.assertEqual(test.result, test.run());
    },
]);
