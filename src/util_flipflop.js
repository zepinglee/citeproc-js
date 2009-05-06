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


CSL.Util.FlipFlopper.prototype.compose = function(blob){
	//
	// Process flipflops and return the result as a single
	// blob object
	//
	print("this.flipflops: "+this.flipflops);
	if (this.flipflops.length){
		this.stoplist = [];
		blob = this._compose(blob);
	}
	print("compose returns blob: "+blob);
	return blob;
}


CSL.Util.FlipFlopper.prototype._compose = function(blob){
	//
	// blob.blobs starts off as a string.  Replace it with
	// an array if it parses, and recurse on the blob elements
	// in the array.  Otherwise just return the blob.
	//
	if (this.find(blob.blobs)){
		var str = blob.blobs;
		var flipflop = this.flipflops[this.fpos];
		var strlst = this.split(this.fpos, blob.blobs);
		var bloblist = new Array();
		//
		// Cast split items as unformatted objects for
		// a start.
		print("strlst: "+strlst);
		for (var j=0; j < strlst.length; j++){
			var tok = new CSL.Factory.Token();
			var newblob = new CSL.Factory.Blob(tok,strlst[j]);
			bloblist.push(newblob);
		}
		//
		// Apply registered formatting decorations to
		// every other element of the split, starting
		// with the second.
		//
		print("bloblist: "+bloblist);
		for (var j=1; j < bloblist.length; j += 2){
			this.applyFlipFlop(bloblist[j],flipflop,blob);
		}
		//
		// Install the bloblist and iterate over it
		//
		blob.blobs = bloblist;
		for (var i in blob.blobs){
			blob.blobs[i] = this._compose(blob.blobs[i]);
		}
	}
	print("typeof blobs: "+typeof blob.blobs);
	return blob;
}


CSL.Util.FlipFlopper.prototype.find = function(str){
	this.fpos = -1;
	var min = [-1, -1];
	var values = [];
	var val = [];
	for (var i in this.flipflops){
		if (i in this.stoplist){
			continue;
		}
		val = [ i, str.indexOf(this.flipflops[i]["start"]) ];
		values.push(val.slice());
	}
	for each (var val in values){
		if (val[1] > min[1]){
			min = val;
		};
	}
	for each (var val in values){
		if (val[1] > -1 && val[1] < min[1]){
			min = val;
		}
	}
	this.fpos = min[0];
	if (this.fpos > -1){
		return true;
	}
	return false;
}

CSL.Util.FlipFlopper.prototype.applyFlipFlop = function(blob,flipflop,parent){
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
	var found = false;
	var thing_to_add = flipflop.func;
	for (var i in parent.decorations){
		var decor = parent.decorations[i];
		var func_match = decor[0] == flipflop.func[0] && decor[1] == flipflop.func[1];
		var alt_match = decor[0] == flipflop.alt[0] && decor[1] == flipflop.alt[1];
		if (flipflop.alt && func_match){
			// replace with alt, mark as done
			thing_to_add = flipflop.alt;
			break;
		}
	}
	// add func
	print("decorating!");
	blob.decorations.reverse();
	blob.decorations.push( thing_to_add );
	blob.decorations.reverse();
};


CSL.Util.FlipFlopper.prototype.split = function(idx,str){
	var spec = this.flipflops[idx];
	var lst1 = str.split(spec["start"]);
	print("lst1: "+lst1);
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
	print("lst2: "+lst2);
	return lst2;
}
