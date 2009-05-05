dojo.provide("csl.util_flipflop");

CSL.Util.FlipFlopper = function(){
	this.flipflops = [];
	this.objlist = [];
	this.cont = true;
	this.stoplist = [];
};

CSL.Util.FlipFlopper.prototype.register = function(start, end, func, alt, action){
	var flipflop = {
		"start": start,
		"end": end,
		"func": func,
		"alt": alt,
		"action": action
	};
	this.flipflops.push(flipflop);
};


CSL.Util.FlipFlopper.prototype.compose = function(obj){
	//
	// Normalize to an object list
	//
	var objlist = [];
	objlist.push( obj );
	//
	// For each flipflop, process the list and
	// get the result
	//
	this.stoplist = [];
	while (this.cont){
		objlist = this._compose(objlist);
	}
	return objlist;
}

CSL.Util.FlipFlopper.prototype.find = function(str){
	var spos = -1;
	this.fpos = -1;
	for (var i in this.flipflops){
		if (i in this.stoplist){
			continue;
		}
		var pos = str.indexOf(this.flipflops[i]["start"]);
		if (spos == -1 && pos > -1){
			spos = pos;
			this.fpos = i;
		}
		if (pos > -1 && pos < spos){
			this.fpos = i;
		}
	}
	if (this.fpos > -1){
		this.cont = true;
		return true;
	}
	return false;
}

CSL.Util.FlipFlopper.prototype.applyFlipFlop = function(blob,flipflop){
	//
	// this needs to work a LITTLE harder.
	//
	blob.decorations.push( flipflop["func"]);
};


CSL.Util.FlipFlopper.prototype._compose = function(objlist){
	//
	// be pessimistic
	//
	this.cont = false;
	//
	// Compose a new object list based on the split
	//
	var newobjlist = new Array();
	this.opos = 0;
	for (var x in objlist){
		if ((x+this.opos) in this.stoplist){
			continue;
		}
		var obj = objlist[x];
		if (this.find(obj["blobs"])){
			var flipflop = this.flipflops[this.fpos];
			var strlst = this.split(this.fpos, obj["blobs"]);
			for (var j=0; j < strlst.length; j++){
				var newobj = new CSL.Factory.Blob(obj,strlst[j]);
				//this.makeObj(strlst[j], obj.funcs.slice());
				newobjlist.push(newobj);
			}
			for (var j=(this.opos+1); j < newobjlist.length; j += 2){
				this.applyFlipFlop(newobjlist[j],flipflop);
			}
		} else {
			newobjlist.push(obj);
		}
		this.opos = newobjlist.length;
	}
	return newobjlist.slice();
}

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
		for (var i=1; i < lst1.length; i++){
			var sublst = lst1[i].split(spec["end"]);
			if (sublst.length == 1){
				var buf = lst2.pop();
				lst2.push( buf + spec["start"] + lst1.slice(i).join(spec["start"]) );
				this.fail = true;
				this.stoplist.push((this.opos+i));
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
