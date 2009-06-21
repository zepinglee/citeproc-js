dojo.provide("tests.std_discretionary");

doh.register("tests.std_discretionary", [
    function(){
        var test = new StdRhinoTest("discretionary_AuthorOnly");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("discretionary_CitationNumberAuthorOnlyThenSuppressAuthor");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("discretionary_CitationNumberSuppressAuthor");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("discretionary_SuppressAuthorSolo");
        doh.assertEqual(test.result, test.run());
    },
]);
