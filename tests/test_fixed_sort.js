dojo.provide("tests.test_fixed_sort");

var _make_sort_deletes = function(deletes){
	return function(a,b){
		if (deletes.indexOf(a.id) > -1){
			return -1;
		} else if (deletes.indexOf(b.id) > -1){
			return 1;
		};
		return 0;
	};
};

doh.register("tests.fixed_sort", [
	function testFixedSort() {
		var series = [{"id":"ITEM-1"},{"id":"ITEM-2"},{"id":"ITEM-3"},{"id":"ITEM-4"}];
		var deletes = ["ITEM-2","ITEM-4"];
		var _sort_deletes = _make_sort_deletes(deletes);
		series.sort(_sort_deletes);
		for each (i in series){
			print(i.id);
		}
		doh.assertEqual( "Success",  "Failure");
	}
]);
