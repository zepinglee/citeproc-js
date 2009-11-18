
dojo.provide("tests.test_dateparse");

var sys = new RhinoTest();
var citeproc = new CSL.Engine(sys,"<style></style>");

var keycount = function(obj){
    var c=0;
    for (pos in obj) {
      c+=1;
    }
    return c;
};

print("Note: some tests in this bundle that fail under Rhino because of coding issues");
print("::::: will pass under python+spidermonkey.");

doh.register("tests.dateparse", [function test_dateparse001() {
        var res = citeproc.dateParseRaw("Wed 24 Oct 2000");
        doh.assertEqual("10", res["month"]);
        doh.assertEqual("24", res["day"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse002() {
        var res = citeproc.dateParseRaw("平成12年10月24日");
        doh.assertEqual("10", res["month"]);
        doh.assertEqual("24", res["day"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse003() {
        var res = citeproc.dateParseRaw("19??-10");
        doh.assertEqual("10", res["month"]);
        doh.assertEqual("19??", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse004() {
        var res = citeproc.dateParseRaw("myauntsally 23");
        doh.assertEqual("myauntsally 23", res["literal"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse005() {
        var res = citeproc.dateParseRaw("\"[Dec 23, 2009]\"");
        doh.assertEqual("[Dec 23, 2009]", res["literal"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse006() {
        var res = citeproc.dateParseRaw("Aug 31, 2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse007() {
        var res = citeproc.dateParseRaw("31 Aug 2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse008() {
        var res = citeproc.dateParseRaw("08-31-2000");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse009() {
        var res = citeproc.dateParseRaw("2000-8-31");
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(3, keycount(res) );
    },
    function test_dateparse010() {
        var res = citeproc.dateParseRaw("Sum 2000");
        doh.assertEqual("2", res["season"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse011() {
        var res = citeproc.dateParseRaw("Trinity 2001");
        doh.assertEqual("Trinity", res["season"]);
        doh.assertEqual("2001", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse012() {
        var res = citeproc.dateParseRaw("circa 08-31-2000");
        doh.assertEqual("1", res["fuzzy"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse013() {
        var res = citeproc.dateParseRaw("circa 2000-31-08");
        doh.assertEqual("1", res["fuzzy"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse014() {
        var res = citeproc.dateParseRaw("circa Aug 31, 2000");
        doh.assertEqual("1", res["fuzzy"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse015() {
        var res = citeproc.dateParseRaw("Aug 31 2000 ?");
        doh.assertEqual("1", res["fuzzy"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse016() {
        var res = citeproc.dateParseRaw("[31 Aug 2000?]");
        doh.assertEqual("1", res["fuzzy"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("31", res["day"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse017() {
        var res = citeproc.dateParseRaw("200BC");
        doh.assertEqual("-200", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse018() {
        var res = citeproc.dateParseRaw("200bc");
        doh.assertEqual("-200", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse019() {
        var res = citeproc.dateParseRaw("200 b.c.");
        doh.assertEqual("-200", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse020() {
        var res = citeproc.dateParseRaw("250AD");
        doh.assertEqual("250", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse021() {
        var res = citeproc.dateParseRaw("250ad");
        doh.assertEqual("250", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse022() {
        var res = citeproc.dateParseRaw("250 a.d.");
        doh.assertEqual("250", res["year"]);
        doh.assertEqual(1, keycount(res) );
    },
    function test_dateparse023() {
        var res = citeproc.dateParseRaw("2000-2001");
        doh.assertEqual("2001", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(2, keycount(res) );
    },
    function test_dateparse024() {
        var res = citeproc.dateParseRaw("Aug - Sep 2000");
        doh.assertEqual("9", res["month_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse025() {
        var res = citeproc.dateParseRaw("Aug 15-20 2000");
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("20", res["day_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("8", res["month_end"]);
        doh.assertEqual("15", res["day"]);
        doh.assertEqual(6, keycount(res) );
    },
    function test_dateparse026() {
        var res = citeproc.dateParseRaw("Aug 2000-Sep 2000");
        doh.assertEqual("9", res["month_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse027() {
        var res = citeproc.dateParseRaw("平成12年8月〜平成12年9月");
        doh.assertEqual("9", res["month_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual(4, keycount(res) );
    },
    function test_dateparse028() {
        var res = citeproc.dateParseRaw("Aug 15 2000 - Aug 20 2000");
        doh.assertEqual("2000", res["year_end"]);
        doh.assertEqual("8", res["month"]);
        doh.assertEqual("20", res["day_end"]);
        doh.assertEqual("2000", res["year"]);
        doh.assertEqual("8", res["month_end"]);
        doh.assertEqual("15", res["day"]);
        doh.assertEqual(6, keycount(res) );
    }
]);

