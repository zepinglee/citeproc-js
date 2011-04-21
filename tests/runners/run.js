dojo.require("doh.runner");
doh.register("run.institutions_ItalicInstitutionHarvard", [
    function(){
        var test = new StdRhinoTest("institutions_ItalicInstitutionHarvard","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();