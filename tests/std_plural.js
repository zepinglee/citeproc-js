dojo.provide("tests.std_plural");

doh.register("tests.std_plural", [
    function(){
        var test = new StdRhinoTest("plural_NameLabelNever");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("plural_NameLabelAlways");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("plural_NameLabelContextualPlural");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("plural_NameLabelContextualSingular");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("plural_NameLabelDefaultPlural");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("plural_NameLabelDefaultSingular");
        doh.assertEqual(test.result, test.run());
    },
]);

var x = [
]