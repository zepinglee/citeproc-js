dojo.provide("csl.util_flipflop");

//
// Gee wiz, Wally, how is this going to work?
//
// The threshold question is how to deal with quotation marks.
// Could allow them only as semantic tags.  In that case, some
// UI method of transforming quotes or raising an error when
// quotes are entered as text would be needed.  Messy and expensive.
//
// Alternatively, quotes could be allowed, but treated as markup
// rather than characters.  This would require recognition of wiki-style
// symmetric markup (i.e. simple courier-font quotes), and of all
// possible quote marks in the world.  Messy, friendly on user side,
// but loses all semantic information.
//
// Or you could do the first option above, but allow quotes as
// text and just leave them as they stand.  Would create chaos
// in stored data, with different representations everywhere and
// no means of normalizing data.  Not a good idea.
//
// Okay, here's a possible plan, which should work for recognition
// of mixed tagged and wiki-markup text, with the possibility of
// mismatch failures (like with apostrphes and stuff).
//
// (1) Iterate a function over the string, in a progressive
// left-to-right scan for non-overlapping start elements.
// For each element found, push a two-element array onto a working stack.
// The array holds the element start position and the string constituting
// the start element tag.
//
// (2) Scan the string a second time, looking for the end element
// corresponding to each start element.  If found, push a newly minted
// array for the end element onto the working stack.  Iterate, but
// protect against pushing duplicates.
//
// (3) Sort the working stack by the position of the elements.
//
// (4) Open an output object, and generate a nested representation
// of the string by opening a new layer for each start element,
// and a text object for each text string that does not contain
// a start element.  Close each layer when a matching closing
// element is encountered.  Opening tags for which no closing
// partner match is found are passed through verbatim.  All of this
// stuff is the hard part, of course, but at least three other
// refactorings have involved recursive processing of this kind.
// Should be able to cope.
//
// (5) With appropriate decoration functions, the resulting output
// object should render in flip-flop fashion automagically, using
// the methods already built.  Need to improve on current behavior,
// though, by allowing an arbitrary number of "flops" in the flip-flop
// (or, say, flip-flop-flap) set, round-robin style.  Should implement
// cleanly, and would save some pain if it turns out to be needed
// for quotes or something.


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
