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
        var test = new StdRhinoTest("date_LocalizedFull");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedFullWithAffixes");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedMonthDay");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedMonthDayMissingDay");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedYear");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("date_LocalizedYearWithAffixes");
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
