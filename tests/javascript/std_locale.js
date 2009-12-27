/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
dojo.provide("tests.std_locale");

doh.register("tests.std_locale", [
    function(){
        var test = new StdRhinoTest("locale_EmptyDate");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_EmptyPlusOverrideDate");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_EmptyPlusOverrideStyleOpt");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_EmptyPlusOverrideTerm");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_EmptyStyleOpt");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_EmptyTerm");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_SpecificDate");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_SpecificStyleOpt");
        doh.assertEqual(test.result, test.run());
    },
    function(){
        var test = new StdRhinoTest("locale_SpecificTerm");
        doh.assertEqual(test.result, test.run());
    },
]);
