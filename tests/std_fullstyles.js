dojo.provide("tests.std_fullstyles");

dojo.require("csl.csl");

doh.register("tests.std_fullstyles", [
    function(){
        var test = new StdTest("fullstyles_ChicagoAuthorDateSimple");
        doh.assertEqual(test.result, test.run());
    },
]);
