dojo.provide("tests.std_number");

dojo.require("csl.csl");

doh.register("tests.std_number", [
    function(){
        var test = new StdTest("number_SimpleNumberArabic");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdTest("number_SimpleNumberRoman");
        doh.assertEqual(test.result, test.run());
    },
]);
