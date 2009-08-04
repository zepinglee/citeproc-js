dojo.provide("tests.std_class");

doh.register("tests.std_class", [
    function(){
        var test = new StdRhinoTest("class_AaaSample");
        doh.assertEqual(test.result, test.run());
    },
]);
