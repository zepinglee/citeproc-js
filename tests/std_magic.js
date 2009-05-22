dojo.provide("tests.std_magic");

dojo.require("csl.csl");

doh.register("tests.std_magic", [
    function(){
        var test = CSL.System.Tests.getTest("magic_MagicCapitalization");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = CSL.System.Tests.getTest("magic_SuppressDuplicateVariableRendering");
        doh.assertEqual(test.result, test.run());
    },
]);
