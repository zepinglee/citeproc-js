dojo.provide("tests.std_magic");

doh.register("tests.std_magic", [
    function(){
        var test = new StdRhinoTest("magic_AllowRepeatDateRenderings");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_DisplayBlock");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_EntrySpacingDouble");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_HangingIndent");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_LineSpacingDouble");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_LineSpacingFiftyPercentStretch");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_MagicCapitalization");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SecondFieldAlign");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SubsequentAuthorSubstitute");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SubsequentAuthorSubstituteNotFooled");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("magic_SuppressDuplicateVariableRendering");
        doh.assertEqual(test.result, test.run());
    },
]);
