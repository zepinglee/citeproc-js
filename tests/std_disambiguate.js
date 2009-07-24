dojo.provide("tests.std_disambiguate");

doh.register("tests.std_disambiguate", [
    function(){
        var test = new StdRhinoTest("disambiguate_YearSuffixAndSort");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteMinimalGivennameExpandMinimalNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameExpandCrossNestedNames");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteRetainNamesOnFailureIfYearSuffixNotAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_AllNamesGenerally");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_AllNamesBaseNameCountOnFailureIfYearSuffixAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_BasedOnEtAlSubsequent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_BasedOnSubsequentFormWithBackref");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteBaseNameCountOnFailureIfYearSuffixAvailable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteDisambiguateCondition");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameNoShortFormInitializeWith");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameShortFormInitializeWith");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_ByCiteGivennameShortFormNoInitializeWith");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("disambiguate_PrimaryNameGenerally");
        doh.assertEqual(test.result, test.run());
    },
]);

var x = [
]