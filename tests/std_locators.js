dojo.provide("tests.std_locators");

doh.register("tests.std_locators", [
    function(){
        var test = new StdRhinoTest("locators_SimpleLocators");
        doh.assertEqual(test.result, test.run());
    },
]);
