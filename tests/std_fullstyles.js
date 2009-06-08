dojo.provide("tests.std_fullstyles");

doh.register("tests.std_fullstyles", [
    function(){
        var test = new StdRhinoTest("fullstyles_ChicagoAuthorDateSimple");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("fullstyles_ChicagoNoteWithBibliographyWithPublisher");
        doh.assertEqual(test.result, test.run());
    },
]);
