dojo.provide("csl.util_flipflop");

CSL.Util.FlipFlopper = function(){
	this.flipflops = [];
	this.objlist = [];
	this.cont = true;
	this.stoplist = [];
};

CSL.Util.FlipFlopper.prototype.register = function(start, end, func, alt){
	var flipflop = {
		"start": start,
		"end": end,
		"func": func,
		"alt": alt
	};
	this.flipflops.push(flipflop);
};


CSL.Util.FlipFlopper.prototype.compose = function(obj){
	//
	// Normalize to an object list
	//
	var objlist = [];
	objlist.push( obj );
	this.cont = true;
	//
	// For each flipflop, process the list and
	// get the result
	//
	if (this.flipflops.length){
		this.stoplist = [];
		while (this.cont){
			objlist = this._compose(objlist);
		}
		for (var i=1; i < objlist.length; i++){
			objlist[i].strings.prefix = "";
		}
		for (var i=0; i < (objlist.length-1); i++){
			objlist[i].strings.suffix = "";
		}
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
	// Func and alt are key/value tuples that serve as
	// drop-in replacements for the values used in the decorations.
	// Func is always defined.  Alt may be either a tuple
	// or false.
	//
	// If both func and alt are present, func and alt are used as
	// replacements for their partner if it is found on the
	// decoration stack.  If neither exists, func is placed at
	// the bottom of the stack, and the innermost formatting
	// element.
	//
	// If alt is false, func is added to the bottom of
	// the decoration stack unless func is already present.
	//
	// Quotation marks require special handling elsewhere, because
	// they apply visible characters to the content.  These are
	// reduced to left-side/right side singletons on the end
	// chunks of a span when it is split, and noop markers
	// are placed on the middle objects in the span.  Otherwise,
	// quotes work as standard flipflops of the first type
	// described above.
	var ffdecor = flipflop.func;
	var found = false;
	for (var i in blob.decorations){
		var decor = blob.decorations[i];
		if (flipflop.alt && decor[0] == flipflop.func[0] && decor[1] == flipflop.func[1]){
			// replace with alt, mark as done
			blob.decorations[i] = flipflop.alt;
			found = true;
			break;
		} else if (flipflop.alt && decor[0] == flipflop.alt[0] && decor[1] == flipflop.alt[1]){
			// replace with func, mark as done
			blob.decorations[i] = flipflop.func;
			found = true;
			break;
		} else if (!flipflop.alt && decor[0] == flipflop.func[0] && decor[1] == flipflop.func[1]){
			// just mark as done
			found = true;
			break;
		}
	}
	if (!found){
		// add func
		blob.decorations.reverse();
		blob.decorations.push(flipflop.func);
		blob.decorations.reverse();
	}
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
	if (lst1.length > 1){
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
			if (sublst.length == 1 || "\\" == lst2[(lst2.length-1)][(lst2[(lst2.length-1)].length-1)]){
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
	} else {
		var lst2 = lst1.slice();
	}
	return lst2;
}
