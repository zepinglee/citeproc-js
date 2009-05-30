dojo.provide("tests.std_number");

doh.register("tests.std_number", [
    function(){
        var test = new StdRhinoTest("number_SimpleNumberArabic");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("number_SimpleNumberRoman");
        doh.assertEqual(test.result, test.run());
    },
]);
