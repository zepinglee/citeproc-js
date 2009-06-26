dojo.provide("tests.std_namespaces");

doh.register("tests.std_namespaces", [
    function(){
        var test = new StdRhinoTest("namespaces_Nada2");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("namespaces_Nada");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("namespaces_NonNada");
        doh.assertEqual(test.result, test.run());
    },
]);
