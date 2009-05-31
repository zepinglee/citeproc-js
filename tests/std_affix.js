dojo.provide("tests.std_affix");

doh.register("tests.std_affix", [
    function(){
        var test = new StdRhinoTest("affix_PrefixFullCitationTextOnly");
        doh.assertEqual(test.result, test.run());
    },
]);
