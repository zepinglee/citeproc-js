dojo.provide("csl.util_flipflop");

//
// Gee wiz, Wally, how is this going to work?
//
// (A) be sure there is an output blob open.
//
// (1) scan the string for escape characters, marking the position of
// the character immediately following the escape.
//
// (2) scan the string for non-overlapping open and close tags,
// skipping escaped tags.
//
// (a) For open tags, push the corresponding close tag onto a working
// stack, append any text before the tag as a plain text blob object,
// and open a level on the output queue.
//
// (b) For close tags, check to see if it matches the current
// top of the working stack.  If so, pop the stack, process
// the text to the tag as an append to the output stack, and close the
// output queue level.
//
// (B) at the end of processing, append any remaining text to
// the output queue and close the blob.
//
//
// And voila.  Should handle both wiki-style and tagged markup,
// and be reasonably simple and reasonably fast.  Feed it a
// set of config parameters, and we have inline processing.
//
// For config parameters, we'll need:
//
// - A map of names to formatting functions, incorporating flipflop.
// - A map of tags to names.
// - Ditch semantic tags.  If needed, they can be patched in later.


//		if (this.flipflops){
//			for each (var ff in this.flipflops){
//				style.fun.flipflopper.register( ff["start"], ff["end"], ff["func"], ff["alt"], ff["additive"] );
//			}
//		}

//>>===== FLIPFLOPS =====>>
//[
//  {
//    "start": "<span name=\"foreign-phrase\">",
//    "end": "</span>",
//    "func": ["@font-style", "italic"],
//    "alt": ["@font-style", "normal"]
//  }
//]
//<<===== FLIPFLOPS =====<<

//>>===== FLIPFLOPS =====>>
//[
//  {
//    "start":"'",
//    "end":"'",
//    "func":["@quotes","true"],
//    "alt":["@squotes","true"],
//    "additive":"true"
//  }
//]
//<<===== FLIPFLOPS =====<<

//>>===== FLIPFLOPS =====>>
//[
 // {
//    "start":"\"",
//    "end":"\"",
//    "func":["@quotes","true"],
//    "alt":["@squotes","true"],
//    "additive":"true"
//  },
//  {
//    "start":"'",
//    "end":"'",
//    "func":["@quotes","true"],
//    "alt":["@squotes","true"],
//    "additive":"true"
//  },
//  {
//    "start":"*",
//    "end":"*",
//    "func":["@font-weight","bold"],
//    "alt":["@font-weight","normal"],
//    "additive":"true"
//  }
//]
//<<===== FLIPFLOPS =====<<



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
			blob.blobs = new Array();
			//
			// Cast split items as unformatted objects for
			// a start.
			for (var j=0; j < strlst.length; j++){
				var tok = new CSL.Factory.Token();
				var newblob = new CSL.Factory.Blob(tok,strlst[j]);
				blob.push(newblob);
			}
			//
			// Apply registered formatting decorations to
			// every other element of the split, starting
			// with the second.
			//
			for (var j=1; j < blob.blobs.length; j += 2){
				this.applyFlipFlop(blob.blobs[j],flipflop,blob);
			}
			//
			// Install the bloblist and iterate over it
			//
			//blob.blobs = bloblist;
			for (var i in blob.blobs){
				blob.blobs[i] = this.compose(blob.blobs[i]);
			}
		} else {
			blob.blobs = strlst;
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

CSL.Util.FlipFlopper.prototype.applyFlipFlop = function(blob,flipflop){
	var found = false;
	var thing_to_add = flipflop.func;
	var breakme = false;
	for each (var blobdecorations in blob.alldecor){
		for (var i in blobdecorations){
			var decor = blobdecorations[i];
			var func_match = decor[0] == flipflop.func[0] && decor[1] == flipflop.func[1];
			var alt_match = decor[0] == flipflop.alt[0] && decor[1] == flipflop.alt[1];
			if (flipflop.alt && func_match){
				// replace with alt, mark as done
				thing_to_add = flipflop.alt;
				breakme = true;
				break;
			}
		}
		if (breakme){
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
	for (var i=(lst1.length-1); i > 0; i--){
		var first = lst1[(i-1)];
		var second = lst1[i];
		if ("\\" == first[(first.length-1)]){
			lst1[(i-1)] = first.slice(0,(first.length-1));
			var start = lst1.slice(0,i);
			start[(start.length-1)] += spec["start"];
			start[(start.length-1)] += lst1[i];
			var end = lst1.slice((i+1));
			lst1 = start.concat(end);
		}
	}
	// "\\" == lst2[(lst2.length-1)][(lst2[(lst2.length-1)].length-1)]){
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
