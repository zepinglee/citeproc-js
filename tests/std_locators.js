dojo.provide("tests.std_locators");

dojo.require("csl.csl");

doh.register("tests.std_locators", [
    function(){
        var test = new StdTest("locators_SimpleLocators");
        doh.assertEqual(test.result, test.run());
    },
]);
