dojo.provide("tests.std_date");

doh.register("tests.std_date", [
    function(){
        var test = new StdRhinoTest("date_IgnoreNonexistent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_IgnoreNonexistentSort");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_IgnoreNonexistentSortReverse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_KeyVariable");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LiteralFailGracefullyIfNoValue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LiteralIfOtherwiseNil");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericDefault");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericDefaultMissingDay");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericDefaultWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYear");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearMonthMissingMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedNumericYearWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextDefault");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextDefaultMissingDay");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextDefaultWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextMonthFormOverride");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYear");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYearMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYearMonthMissingMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedTextYearWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LongMonth");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_SortEmptyDates");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_YearSuffixDelimiter");
        doh.assertEqual(test.result, test.run());
    },
]);
