dojo.provide("tests.std_position");

doh.register("tests.std_position", [
    function(){
        var test = new StdRhinoTest("position_IbidWithLocator");
        doh.assertEqual(test.result, test.run());
    },
]);
