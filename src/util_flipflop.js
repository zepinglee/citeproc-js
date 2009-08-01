dojo.provide("csl.util_flipflop");

//
// (A) initialize flipflopper with an empty blob to receive output.
// Text string in existing output queue blob will be replaced with
// an array containing this blob.

CSL.Util.FlipFlopper = function(state){
	this.state = state;
	this.blob = false;
	var tagdefs = [
		["<i>","</i>","italics","@font-style",["italic","normal"],true],
		["<b>","</b>","boldface","@font-weight",["bold","normal"],true],
		["<sup>","</sup>","superscript","@vertical-align",["sup","sup"],true],
		["<sub>","</sub>","subscript","@font-weight",["sub","sub"],true],
		["<sc>","</sc>","smallcaps","@font-variant",["small-caps","small-caps"],true],
		['(',')',"parens","@parens",["true","inner"],true],
		["[","]","parens","@parens",["inner","true"],true],
		['"','"',"quotes","@quotes",["true","inner"],"'"],
		["'","'","quotes","@quotes",["inner","true"],'"']
	];
	//
	// plus quote defs from locale, if any (parens localization not included in CSL spec)
	//
	for each (var t in ["quote"]){
		for each (var p in ["-","-inner-"]){
			var entry = new Array();
			entry.push( state.getTerm( "open"+p+t ) );
			entry.push( state.getTerm( "close"+p+t ) );
			entry.push( t+"s" );
			entry.push( "@"+t+"s" );
			if ("-" == p){
				entry.push( ["outer", "inner"] );
			} else {
				entry.push( ["inner", "outer"] );
			};
			entry.push(true);
			tagdefs.push(entry);
		};
	};
	var allTags = function(tagdefs){
		var ret = new Array();
		for each (var def in tagdefs){
			if (ret.indexOf(def[0]) == -1){
				var esc = "";
				if (["(",")","[","]"].indexOf(def[0]) > -1){
					esc = "\\";
				}
				ret.push(esc+def[0]);
			};
			if (ret.indexOf(def[1]) == -1){
				var esc = "";
				if (["(",")","[","]"].indexOf(def[1]) > -1){
					esc = "\\";
				}
				ret.push(esc+def[1]);
			};
		};
		return ret;
	};
	this.allTagsRex = RegExp( "(" + allTags(tagdefs).join("|") + ")" );
	var makeHashes = function(tagdefs){
		var closeTags = new Object();
		var flipTags = new Object();
		var openToClose = new Object();
		var openToDecorations = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			closeTags[tagdefs[i][1]] = true;
			flipTags[tagdefs[i][1]] = tagdefs[i][5];
			openToClose[tagdefs[i][0]] = tagdefs[i][1];
			openToDecorations[tagdefs[i][0]] = [tagdefs[i][3],tagdefs[i][4]];
		};
		return [closeTags,flipTags,openToClose,openToDecorations];
	};
	var hashes = makeHashes(tagdefs);
	this.closeTagsHash = hashes[0];
	this.flipTagsHash = hashes[1];
	this.openToCloseHash = hashes[2];
	this.openToDecorations = hashes[3];
};

CSL.Util.FlipFlopper.prototype.init = function(str,blob){
	if (!blob){
		this.strs = this.getSplitStrings(str);
		this.blob = new CSL.Factory.Blob();
	} else {
		this.blob = blob;
		this.strs = this.getSplitStrings( this.blob.blobs );
		this.blob.blobs = new Array();
	}
	this.blobstack = new CSL.Factory.Stack(this.blob);
};
//
// (1) scan the string for escape characters.  Split the
// string on tag candidates, and rejoin the tags that
// are preceded by an escape character.
//
CSL.Util.FlipFlopper.prototype.getSplitStrings = function(str){
	var strs = str.split( this.allTagsRex );
	for (var i=(strs.length-2); i>0; i +=-2){
		if (strs[(i-1)].slice((strs[(i-1)].length-1)) == "\\"){
			var newstr = strs[(i-1)] + strs[i] + strs[(i+1)];
			var head = strs.slice(0,(i-1));
			var tail = strs.slice((i+2));
			head.push(newstr);
			strs = head.concat(tail);
		};
	};
	return strs;
};
//
// (2) scan the string for non-overlapping open and close tags,
// skipping escaped tags.  During processing, a list of expected
// closing tags will be maintained on a working stack.
//
CSL.Util.FlipFlopper.prototype.processTags = function(){
	var expected_closers = new Array();
	var expected_openers = new Array();
	var expected_flips = new Array();
	var expected_rendering = new Array();
	var str = "";

	if (this.strs.length == 1){
		this.blob.blobs = this.strs[0];
	} else if (this.strs.length > 2){
		for (var posA=1; posA < (this.strs.length-1); posA+=2){
			var tag = this.strs[posA];
			var prestr = this.strs[(posA-1)];
			// start by pushing in the trailing text string
			var newblob = new CSL.Factory.Blob(false,prestr);
			var blob = this.blobstack.value();
			blob.push(newblob);
//
// (a) For closing tags, check to see if it matches something
// on the working stack.  If so, pop the stack and close the
// output queue level.
//
			if (this.closeTagsHash[tag]){
				//
				// Gaack.  Conditions.  Allow if ...
				// ... the close tag is not also an open tag, or ...
				// ... ... there is a possible open tag on our stacks, and ...
				// ... ... there is no intervening flipped partner to it.
				//
				expected_closers.reverse();
				var sameAsOpen = this.openToCloseHash[tag];
				var openRev = expected_closers.indexOf(tag);
				var flipRev = expected_flips.indexOf(tag);
				expected_closers.reverse();

				if ( !sameAsOpen || (openRev > -1 && openRev < flipRev)){
					var ibeenrunned = false;
					for (var posB=(expected_closers.length-1); posB>-1; posB+=-1){
						ibeenrunned = true;
						var wanted_closer = expected_closers[posB];
						//print("wanted_closer: "+wanted_closer);
						if (tag == wanted_closer){
							expected_closers.pop();
							expected_openers.pop();
							expected_flips.pop();
							expected_rendering.pop();
							this.blobstack.pop();
							break;
						};
						blob = this.blobstack.value();
						blob.blobs[(blob.blobs.length-1)].blobs += tag;
					};
					if (!ibeenrunned){
						blob.blobs[(blob.blobs.length-1)].blobs += tag;
					}
					continue;
				};
			};
//
// (b) For open tags, push the corresponding close tag onto a working
// stack, and open a level on the output queue.
//
			if (this.openToCloseHash[tag]){
				//print("open:"+tag);
				expected_closers.push( this.openToCloseHash[tag] );
				expected_openers.push( tag );
				expected_flips.push( this.flipTagsHash[tag] );
				blob = this.blobstack.value();
				var newblobnest = new CSL.Factory.Blob();
				var param = this.addFlipFlop(newblobnest,this.openToDecorations[tag]);
				expected_rendering.push( this.state.fun.decorate[param[0]][param[1]](this.state));
				blob.push(newblobnest);
				this.blobstack.push(newblobnest);
			};
		};
	};
//
// (B) at the end of processing, unwind any open tags, append any
// remaining text to the output queue and return the blob.
//
	var debug = false;
	for (var i in expected_closers.slice()){
		if (debug){
			print("#####################");
			print("iteration: "+i);
			print("expected_closers: "+expected_closers);
		}
		expected_closers.pop();
		expected_flips.pop();
		var markup = expected_openers.pop();
		var rendering = expected_rendering.pop();
		if (debug){
			print("markup to be restored: "+markup);
			print("alldecor: "+blob.alldecor+" len: "+blob.alldecor.length);
			print("---------------------");
		};
		if (markup.length && markup[0] != "<"){
			markup = rendering;
		}
		var blob = this.blobstack.value();
		//
		// Don't pull out the string just move the blob.
		//
		if (blob.blobs.length){
			blob.blobs[0].blobs = markup+blob.blobs[0].blobs;
			var blobbies = blob.blobs;
			this.blobstack.pop();
			blob = this.blobstack.value();
			blob.blobs.pop();
			blob.blobs = blob.blobs.concat(blobbies);
		} else {
			this.blobstack.pop();
			blob = this.blobstack.value();
			blob.blobs.pop();
			blob.blobs[(blob.blobs.length-1)].blobs += markup;
		};
		if (debug){
			print("final content of lattermost blob: "+blob.blobs[(blob.blobs.length-1)].blobs);
			print("#####################");
		};
	};
	//
	// The final str is stuck on the very end, after nesting levels
	// are reconciled.  It never takes formatting.  Ever.
	//
	if (this.strs.length > 2){
		str = this.strs[(this.strs.length-1)];
		var blob = this.blobstack.value();
		var newblob = new CSL.Factory.Blob(false,str);
		blob.blobs.push(newblob);
	};
	return this.blob;
};

CSL.Util.FlipFlopper.prototype.addFlipFlop = function(blob,fun){
	var decorations = blob.alldecor[0];
	var pos = 0;
	for (var i=(decorations.length-1); i>-1; i+=-1){
		var decor = decorations[i];
		if (decor[0] == fun[0]){
			if (decor[1] == fun[1][0]){
				pos = 1;
			};
			break;
		};
	};
	var newdecor = [fun[0],fun[1][pos]];
	decorations.reverse();
	decorations.push(newdecor);
	decorations.reverse();
	return newdecor;
};
