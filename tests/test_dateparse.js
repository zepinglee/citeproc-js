
dojo.provide("tests.test_dateparse");

var sys = new RhinoTest();
var citeproc = new CSL.Engine(sys,"<style></style>");

doh.register("tests.dateparse", [function test_dateparse001() {
        var res = citeproc.dateParse("Aug 31, 2000");
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse002() {
        var res = citeproc.dateParse("31 Aug 2000");
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse003() {
        var res = citeproc.dateParse("08-31-2000");
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse004() {
        var res = citeproc.dateParse("2000-8-31");
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse005() {
        var res = citeproc.dateParse("Sum 2000");
        // doh.assertEqual("summer", res["season"]);
        // doh.assertEqual("2000", res["year"]);
    },
    function test_dateparse006() {
        var res = citeproc.dateParse("Trinity 2001");
        // doh.assertEqual("Trinity", res["season"]);
        // doh.assertEqual("2001", res["year"]);
    },
    function test_dateparse007() {
        var res = citeproc.dateParse("circa 08-31-2000");
        // doh.assertEqual("1", res["fuzzy"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse008() {
        var res = citeproc.dateParse("circa 2000-31-08");
        // doh.assertEqual("1", res["fuzzy"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse009() {
        var res = citeproc.dateParse("circa Aug 31, 2000");
        // doh.assertEqual("1", res["fuzzy"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse010() {
        var res = citeproc.dateParse("Aug 31 2000 ?");
        // doh.assertEqual("1", res["fuzzy"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse011() {
        var res = citeproc.dateParse("[31 Aug 2000?]");
        // doh.assertEqual("1", res["fuzzy"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("31", res["day"]);
        // doh.assertEqual("8", res["month"]);
    },
    function test_dateparse012() {
        var res = citeproc.dateParse("200BC");
        // doh.assertEqual("-200", res["year"]);
    },
    function test_dateparse013() {
        var res = citeproc.dateParse("200bc");
        // doh.assertEqual("-200", res["year"]);
    },
    function test_dateparse014() {
        var res = citeproc.dateParse("200 b.c.");
        // doh.assertEqual("-200", res["year"]);
    },
    function test_dateparse015() {
        var res = citeproc.dateParse("250AD");
        // doh.assertEqual("250", res["year"]);
    },
    function test_dateparse016() {
        var res = citeproc.dateParse("250ad");
        // doh.assertEqual("250", res["year"]);
    },
    function test_dateparse017() {
        var res = citeproc.dateParse("250 a.d.");
        // doh.assertEqual("250", res["year"]);
    },
    function test_dateparse018() {
        var res = citeproc.dateParse("2000-2001");
        // doh.assertEqual("2001", res["year_end"]);
        // doh.assertEqual("2000", res["year"]);
    },
    function test_dateparse019() {
        var res = citeproc.dateParse("Aug - Sep 2000");
        // doh.assertEqual("9", res["month_end"]);
        // doh.assertEqual("8", res["month"]);
        // doh.assertEqual("2000", res["year_end"]);
        // doh.assertEqual("2000", res["year"]);
    },
    function test_dateparse020() {
        var res = citeproc.dateParse("Aug 15-20 2000");
        // doh.assertEqual("2000", res["year_end"]);
        // doh.assertEqual("8", res["month"]);
        // doh.assertEqual("20", res["day_end"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("8", res["month_end"]);
        // doh.assertEqual("15", res["day"]);
    },
    function test_dateparse021() {
        var res = citeproc.dateParse("Aug 2000-Sep 2000");
        // doh.assertEqual("9", res["month_end"]);
        // doh.assertEqual("8", res["month"]);
        // doh.assertEqual("2000", res["year_end"]);
        // doh.assertEqual("2000", res["year"]);
    },
    function test_dateparse022() {
        var res = citeproc.dateParse("Aug 15 2000 - Aug 20 2000");
        // doh.assertEqual("2000", res["year_end"]);
        // doh.assertEqual("8", res["month"]);
        // doh.assertEqual("20", res["day_end"]);
        // doh.assertEqual("2000", res["year"]);
        // doh.assertEqual("8", res["month_end"]);
        // doh.assertEqual("15", res["day"]);
    }
]);

