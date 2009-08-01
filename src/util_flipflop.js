dojo.provide("csl.util_flipflop");

//
// Gee wiz, Wally, how is this going to work?
//
// (A) initialize flipflopper with an empty blob to receive output.
// Text string in existing output queue blob will be replaced with
// an array containing this blob.

CSL.Util.FlipFlopper = function(state){
	//print("state: "+state);
	this.state = state;
	this.str = false;
	this.escapees = false;
	this.blob = false;
	var tagdefs = [
		["<i>","</i>","italics","@font-style",["italic","normal"],false],
		["<b>","</b>","boldface","@font-weight",["bold","normal"],false],
		["<sup>","</sup>","superscript","@vertical-align",["sup","sup"],false],
		["<sub>","</sub>","subscript","@font-weight",["sub","sub"],false],
		["<sc>","</sc>","smallcaps","@font-variant",["small-caps","small-caps"],false],
		['(',')',"parens","@parens",["true","inner"],false],
		["[","]","parens","@parens",["inner","true"],false],
		['"','"',"quotes","@quotes",["true","inner"],"'"],
		["'","'","quotes","@quotes",["inner","true"],'"']
	];
	//
	// plus quote and parens defs from locale, if any
	// (parens localization not included in CSL spec)
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
			//print(entry);
			tagdefs.push(entry);
		};
	};
	var allTags = function(tagdefs){
		var ret = new Array();
		for each (var def in tagdefs){
			//print("def: "+def);
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
	var closeTags = function(tagdefs){
		var ret = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			ret[tagdefs[i][1]] = true;
		};
		return ret;
	};
	this.closeTagsHash = closeTags(tagdefs);
	var flipTags = function(tagdefs){
		var ret = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			ret[tagdefs[i][1]] = tagdefs[i][5];
		};
		return ret;
	};
	this.flipTagsHash = flipTags(tagdefs);
	var openTags = function(tagdefs){
		var ret = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			ret[tagdefs[i][0]] = tagdefs[i][1];
		};
		return ret;
	};
	this.openTagsHash = openTags(tagdefs);
};

CSL.Util.FlipFlopper.prototype.init = function(str,blob){
	if (!blob){
		this.strs = this.getSplitStrings(str);
		this.blob = new CSL.Factory.Blob();
	} else {
		this.strs = this.blob.blobs;
		this.blob = blob;
		this.blob.blobs = new Array();
	}
	this.blobstack = new CSL.Factory.Stack(this.blob);
};

//
// (1) scan the string for escape characters.  Split the
// string on tag candidates, and rejoin the tags that
// are preceded by an escape character.

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
				// ... there is no previous tag of this type, or ...
				// ... the most recent tag of this type matches. XXXXX NEEDED!
				//
				expected_closers.reverse();
				var sameAsOpen = this.openTagsHash[tag];
				var openRev = expected_closers.indexOf(tag);
				var flipRev = expected_flips.indexOf(tag);
				expected_closers.reverse();

				if ( !sameAsOpen || openRev > -1 || (flipRev > -1 && openRev > flipRev)){
					// print("Close sesame: "+tag);
					for (var posB=(expected_closers.length-1); posB>-1; posB+=-1){
						var wanted_closer = expected_closers[posB];
						if (tag == wanted_closer){
							expected_closers.pop();
							expected_openers.pop();
							expected_flips.pop();
							this.blobstack.pop();
							break;
						};
						blob = this.blobstack.value();
						blob.blobs[(blob.blobs.length-1)].blobs += tag;
					};
					continue;
				};
			};
//
// (b) For open tags, push the corresponding close tag onto a working
// stack, and open a level on the output queue.
//
			if (this.openTagsHash[tag]){
				// print("Open sesame: "+tag);
				expected_closers.push( this.openTagsHash[tag] );
				expected_openers.push( tag );
				expected_flips.push( this.flipTagsHash[tag] );
				blob = this.blobstack.value();
				var newblobnest = new CSL.Factory.Blob();
				blob.push(newblobnest);
				this.blobstack.push(newblobnest);
				continue;
			};
		};
	};
//
// (B) at the end of processing, append any remaining text to
// the output queue and close the blob.
//
	//
	// But first, unwind the queue as necessary to reach top level
	//
	var debug = false;
	//print(expected_closers[0]);
	for (var i in expected_closers.slice()){
		if (debug){
			print("#####################");
			print(i);
			print(expected_closers);
			print("---------------------");
		};
		expected_closers.pop();
		var markup = expected_openers.pop();
		var blob = this.blobstack.value();
		//
		// Madness here too.  Don't pull out the string,
		// just move the blob.  There are two of them here, and
		// they both need to be moved; it's the PARENT that has
		// the formatting we need to reconstitute!
		//
		if (blob.blobs.length){
			// print("Blobs to move: "+blob.blobs);
			// print("Leading string blob to move: "+blob.blobs[0].blobs);
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
			blob.blobs[0].blobs += markup;
		};
		if (debug){
			print("???");
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
