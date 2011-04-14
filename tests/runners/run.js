dojo.require("doh.runner");
doh.register("run.name_EditorTranslatorSameWithTerm", [
    function(){
        var test = new StdRhinoTest("name_EditorTranslatorSameWithTerm","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();