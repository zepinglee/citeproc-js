dojo.require("doh.runner");
doh.register("run.nameattr_NamesDelimiterOnBibliographyInBibliography", [
    function(){
        var test = new StdRhinoTest("nameattr_NamesDelimiterOnBibliographyInBibliography","run");
        doh.assertEqual(test.result, test.run());
    },
])
tests.run();