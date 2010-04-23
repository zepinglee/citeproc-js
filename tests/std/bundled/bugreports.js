dojo.provide("std.bugreports");
doh.register("std.bugreports", [
    function(){
        var test = new StdRhinoTest("bugreports_DemoPageFullCiteCruftOnSubsequent");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("bugreports_ChicagoAuthorDateLooping");
        doh.assertEqual(test.result, test.run());
    }, 
    function(){
        var test = new StdRhinoTest("bugreports_BrokenInstitutionalName");
        doh.assertEqual(test.result, test.run());
    }, 
]);
