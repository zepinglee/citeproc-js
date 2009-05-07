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
	if (this.flipflops.length){
		this.stoplist = [];
		blob = this._compose(blob);
	}
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
		if (strlst.length > 1){
			var bloblist = new Array();
			//
			// Cast split items as unformatted objects for
			// a start.
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
			for (var j=1; j < bloblist.length; j += 2){
				this.applyFlipFlop(bloblist[j],flipflop,blob);
			}
			//
			// Install the bloblist and iterate over it
			//
			blob.blobs = bloblist;
			for (var i in blob.blobs){
				blob.blobs[i] = this.compose(blob.blobs[i]);
			}
		}
	} // if find flipflop string inside blob
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
	blob.decorations.reverse();
	blob.decorations.push( thing_to_add );
	blob.decorations.reverse();
};


CSL.Util.FlipFlopper.prototype.split = function(idx,str){
	var spec = this.flipflops[idx];
	var lst1 = str.split(spec["start"]);
	if (lst1.length > 1){
		if (spec["start"] != spec["end"]){
			for (var i=(lst1.length-1); i > 0; i--){
				var sublst = lst1[i].split(spec["end"]);
				// reduce to a two-element list
				for (var j=(sublst.length-1); j > 1; j--){
					sublst[(j-1)] += spec["end"];
					sublst[(j-1)] += sublst[j];
					sublst.pop();
				}
				var start = lst1.slice(0,i);
				var end = lst1.slice((i+1));
				if (sublst.length == 1){
					start[(start.length-1)] += spec["start"];
					start[(start.length-1)] += sublst[0];
					lst1 = start.concat(end);
				} else {
					lst1 = start.concat(sublst).concat(end);
				}
			}
			// sublst.length == 1 || "\\" == lst2[(lst2.length-1)][(lst2[(lst2.length-1)].length-1)]){
		} else {
			if (lst1.length && (lst1.length % 2) == 0){
				var buf = lst1.pop();
				lst1[(lst1.length-1)] += spec["start"];
				lst1[(lst1.length-1)] += buf;
			}
		}
	}
	return lst1;
}
