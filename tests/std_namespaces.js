dojo.provide("tests.std_namespaces");

doh.register("tests.std_namespaces", [
    function(){
        var test = new StdRhinoTest("namespaces_Nada4");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("namespaces_NonNada3");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("namespaces_NonNada4");
        doh.assertEqual(test.result, test.run());
    },
]);
