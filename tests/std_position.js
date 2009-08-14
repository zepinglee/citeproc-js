dojo.provide("tests.std_position");

doh.register("tests.std_position", [
    function(){
        var test = new StdRhinoTest("position_NearNoteOptionMakesFalse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("position_IbidWithLocator");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("position_NearNoteFalse");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("position_NearNoteTrue");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("position_NearNoteUnsupported");
        doh.assertEqual(test.result, test.run());
    },
]);
