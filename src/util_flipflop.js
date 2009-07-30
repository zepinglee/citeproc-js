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
		["<i>","</i>","italics","@font-style",["italic","normal"]],
		["<b>","</b>","boldface","@font-weight",["bold","normal"]],
		["<sup>","</sup>","superscript","@vertical-align",["sup","sup"]],
		["<sub>","</sub>","subscript","@font-weight",["sub","sub"]],
		["<sc>","</sc>","smallcaps","@font-variant",["small-caps","small-caps"]],
		['"','"',"quotes","@quotes",["outer","inner"]],
		["'","'","quotes","@quotes",["inner","outer"]]
	];
	//
	// plus quote and parens defs from locale, if any
	//
	for each (var t in ["quote","paren"]){
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
	//print(this.allTagsRex);
	var openToClose = function(tagdefs){
		var ret = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			ret[tagdefs[i][0]] = tagdefs[i][1];
		};
		return ret;
	};
	this.openToCloseHash = openToClose(tagdefs);
	var closeTags = function(tagdefs){
		var ret = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			ret[tagdefs[i][1]] = true;
		};
		return ret;
	};
	this.closeTagsHash = closeTags(tagdefs);
	var openTags = function(tagdefs){
		var ret = new Object();
		for (var i=0; i < tagdefs.length; i += 1){
			ret[tagdefs[i][0]] = tagdefs[i][1];
		};
		return ret;
	};
	this.openTagsHash = openTags(tagdefs);
	//print("finished instantiating");
};

CSL.Util.FlipFlopper.prototype.init = function(str){
	this.str = str;
	this.escapees = new Array();
	this.blob = new CSL.Factory.Blob();
	this.blobstack = new CSL.Factory.Stack(this.blob);
};

//
// (1) scan the string for escape characters, marking the position of
// the character immediately following the escape.

CSL.Util.FlipFlopper.prototype.getEscapees = function(){
	var escapees = new Array();
	var str = this.str;
	var newstr = "";
	var last_pos = 0;
	while (true){
		var pos = str.indexOf("\\");
		if (pos == -1){
			newstr += str;
			break;
		} else {
			newstr += str.slice(0,pos);
			str = str.slice((pos+1));
		};
		if (str.length){
			escapees.push((pos+last_pos));
			last_pos = pos;
		};
	};
	this.str = newstr;
	this.escapees = escapees;
};

//
// (2) scan the string for non-overlapping open and close tags,
// skipping escaped tags.  During processing, a list of expected
// closing tags will be maintained on a working stack.
//

CSL.Util.FlipFlopper.prototype.processTags = function(){
	var str = this.str;
	var expected_closers = new Array();
	var expected_closers_openers = new Array();

	while (true){
		var pos = str.search( this.allTagsRex );
		var prestr = "";
		if (pos in this.escapees){
			continue;
		}
		if (pos == -1){
			var tag = undefined;
			break;
		} else {
			var tag = str.match( this.allTagsRex )[0];
			prestr = str.slice(0,pos);
			str = str.slice((pos+tag.length));
		};
//
// (a) For closing tags, check to see if it matches something
// on the working stack.  If so, pop the stack, process
// the text to the tag as an append to the output stack, and close the
// output queue level.
//
		if (this.closeTagsHash[tag]){
			expected_closers.reverse();
			var tpos = expected_closers.indexOf(tag);
			expected_closers.reverse();
			if (tpos > -1){
				//print("closing tag: "+tag);
				//print("  expected_closers.length: "+expected_closers.length);
				//print("  expected_closers: "+expected_closers);
				//print("  tpos: "+tpos);
				for (var i=(expected_closers.length-1); i>(expected_closers.length-tpos-2); i+=-1){
					var poptag = expected_closers.pop();
					var poptagopener = expected_closers_openers.pop();
					if (poptag != tag){
						//print("POPPED ??: "+poptag+", prestr="+prestr);
						prestr = poptagopener+prestr;
						this.blobstack.pop();
						var blob = this.blobstack.value();
						//
						// pop level for failed open tag environment
						//
						blob.blobs.pop();
						//
						// pop preceding text blob
						//
						var poppedblob = blob.blobs.pop();
						prestr = poppedblob.blobs + prestr;
					} else {
						//print("POPPED !!: "+poptag);
						break;
					}
				};
				//print("  -- text --> "+prestr);
				//expected_closers.reverse();
				var blob = this.blobstack.value();
				var newblob = new CSL.Factory.Blob(false,prestr);
				blob.push(newblob);
				this.blobstack.pop();
				continue;
			};
		};
//
// (b) For open tags, push the corresponding close tag onto a working
// stack, append any text before the tag as a plain text blob object,
// and open a level on the output queue.
//
		if (this.openTagsHash[tag]){
			//print("pushed value for ["+tag+"]: "+this.openTagsHash[tag]+", text: "+prestr);
			expected_closers.push( this.openTagsHash[tag] );
			expected_closers_openers.push( tag );
			var newblob = new CSL.Factory.Blob(false,prestr);
			var blob = this.blobstack.value();
			blob.push(newblob);
			var newblobnest = new CSL.Factory.Blob();
			blob.push(newblobnest);
			this.blobstack.push(newblobnest);
			continue;
		};
//
// (c) For mismatched tags, restore the content to
// the string.
//
		if (this.closeTagsHash[tag]){
			//print("(tag not a closer, do something else:"+tag);
			prestr = prestr+tag;
			//this.blobstack.pop();
			var blob = this.blobstack.value();
			var newblob = new CSL.Factory.Blob(false,prestr);
			blob.push(newblob);
			//var blob = this.blobstack.value();
			//blob.blobs.pop();
			//var poppedblob = blob.blobs.pop();
			//prestr = poppedblob.blobs + prestr;
			//print("  -----> text: "+prestr);
		};
//
// (B) at the end of processing, append any remaining text to
// the output queue and close the blob.
//
	};
	//
	// First finish off the last hanging blob for symmetry.
	//
	if (expected_closers.length){
		var blob = this.blobstack.value();
		var newblob = new CSL.Factory.Blob(false,str);
		blob.push(newblob);
		blob.push( new CSL.Factory.Blob() );
		str = "";
	};
	//
	// Now unwind the queue.
	//
	for (var i in expected_closers.slice()){
		if (debug){
			print("#####################");
			print(i);
			print(expected_closers);
			print(str);
			print(this.blobstack.mystack.length);
			print("---------------------");
		};
		expected_closers.pop();
		var markup = expected_closers_openers.pop();
		if (markup.slice(0,1) != "<"){
			print("------------------------> Hi! Let's convert a character to its output form!");
			print(markup);
			//
			// (1) Check for 
			//
		};
		var blob = this.blobstack.value();
		blob.blobs.pop();
		var blobstr = blob.blobs.pop().blobs;
		this.blobstack.pop();
		str = blobstr + str;
		str = markup + str;
		if (debug){
			print(str);
			print("#####################");
		};
	};
	var blob = this.blobstack.value();
	var newblob = new CSL.Factory.Blob(false,str);
	blob.push(newblob);
	return this.blob;
};

//
//
// And voila.  Should handle both wiki-style and tagged markup,
// and be reasonably simple and reasonably fast.  Feed it a
// set of config parameters, and we have inline processing.
//
// For config parameters, we'll need:
//
// - A map of tags to names.
// - A map of names to formatting functions, incorporating flipflop.
