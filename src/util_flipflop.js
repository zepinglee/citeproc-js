dojo.provide("csl.util_flipflop");

CSL.Util.FlipFlopper = function(){
	this.flipflops = [];
	this.objlist = [];
};

CSL.Util.FlipFlopper.prototype.register = function(start, end, func, opt){
	var flipflop = {
		"start": start,
		"end": end,
		"func": func,
		"opt": opt
	};
	this.flipflops.push(flipflop);
};

CSL.Util.FlipFlopper.prototype.makeObj = function(str,funcs){
	var ret = new Object();
	ret["str"] = str;
	ret["funcs"] = funcs.slice();
	return ret;
}

CSL.Util.FlipFlopper.prototype.compose = function(str){
	var objlist = [];
	objlist.push( this.makeObj(str,[]));
	for each (flipflop in this.flipflops){
		var newobjlist = new Array();
		for each (obj in objlist){
			var strlst = this.split(obj["str"]);
			for (var i=0; i < objlist.length; i++){
				var obj = this.makeObj(strlst[i], obj.funcs.slice());
				newobjlist.push(obj);
			}
			for (var i=1; i < newobjlist.length; i += 2){
				newobjlist[i].funcs.push(flipflop.func);
			}
			objlist = newobjlist.slice();
		}
	}
	return objlist;
};

CSL.Util.FlipFlopper.prototype.split = function(idx,str){
	var spec = this.flipflops[idx];
	var lst1 = str.split(spec["start"]);
	if (spec["start"] == spec["end"]){
		if (lst1.length && (lst1.length % 2) == 0){
			var buf = lst1.pop();
			lst1[(lst1.length-1)] += spec["start"];
			lst1[(lst1.length-1)] += buf;
		}
		var lst2 = lst1.slice();
	} else {
		var lst2 = [lst1[0]];
		var do_me = true;
		for (var i=1; i < lst1.length; i++){
			var sublst = lst1[i].split(spec["end"]);
			if (sublst.length == 1){
				var buf = lst2.pop();
				lst2.push( buf + spec["start"] + lst1.slice(i).join(spec["start"]) );
				break;
			}
			sublst[1] = sublst.slice(1).join(spec["end"]);
			for (var j=(sublst.length-1); j > 1; j--){
				sublst.pop();
			}
			lst2 = lst2.concat(sublst);
		}
	}
	return lst2;
}
