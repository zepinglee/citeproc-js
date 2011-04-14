dojo.require("doh.runner");
doh.register("run.abbrevs_JournalMissingFromListButHasJournalAbbreviationField", [
    function(){
        var test = new StdRhinoTest("abbrevs_JournalMissingFromListButHasJournalAbbreviationField","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();