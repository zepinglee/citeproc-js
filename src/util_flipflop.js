/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
if(dojo){ 
    dojo.provide("csl.util_flipflop");
};

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
		["<ok>","</ok>","passthrough","@passthrough",["true","true"],true],
		['"','"',"quotes","@quotes",["true","inner"],"'"],
		["'","'","quotes","@quotes",["inner","true"],'"']
	];
	//
	// plus quote defs from locale.
	//
	for each (var t in ["quote"]){
		for each (var p in ["-","-inner-"]){
			var entry = new Array();
			entry.push( state.getTerm( "open"+p+t ) );
			entry.push( state.getTerm( "close"+p+t ) );
			entry.push( t+"s" );
			entry.push( "@"+t+"s" );
			if ("-" == p){
				entry.push( ["true", "inner"] );
			} else {
				entry.push( ["inner", "true"] );
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
	//CSL.debug("(flipflopper received blob decorations): "+blob.decorations);
	//CSL.debug("(blob alldecor): "+blob.alldecor);
	if (!blob){
		this.strs = this.getSplitStrings(str);
		this.blob = new CSL.Factory.Blob();
	} else {
		this.blob = blob;
		this.strs = this.getSplitStrings( this.blob.blobs );
		this.blob.blobs = new Array();
	}
	this.blobstack = new CSL.Factory.Stack(this.blob);
	//CSL.debug("(this.blobstack.value() alldecor): "+this.blobstack.value().alldecor);
};
//
// (1) scan the string for escape characters.  Split the
// string on tag candidates, and rejoin the tags that
// are preceded by an escape character.  Ignore broken
// markup.
//
CSL.Util.FlipFlopper.prototype.getSplitStrings = function(str){
	//
	// Do the split.
	//
	var strs = str.split( this.allTagsRex );
	//
	// Resplice tags preceded by an escape character.
	//
	for (var i=(strs.length-2); i>0; i +=-2){
		if (strs[(i-1)].slice((strs[(i-1)].length-1)) == "\\"){
			var newstr = strs[(i-1)].slice(0,(strs[(i-1)].length-1)) + strs[i] + strs[(i+1)];
			var head = strs.slice(0,(i-1));
			var tail = strs.slice((i+2));
			head.push(newstr);
			strs = head.concat(tail);
		};
	};
	//
	// Find tags that would break hierarchical symmetry.
	//
	var expected_closers = new Array();
	var expected_openers = new Array();
	var expected_flips = new Array();
	var tagstack = new Array();
	var badTagStack = new Array();
	for (var posA=1; posA<(strs.length-1); posA +=2){
		var tag = strs[posA];
		if (this.closeTagsHash[tag]){
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
					if (tag == wanted_closer){
						expected_closers.pop();
						expected_openers.pop();
						expected_flips.pop();
						tagstack.pop();
						break;
					};
					//CSL.debug("badA:"+posA);
					badTagStack.push( posA );
				};
				if (!ibeenrunned){
					//CSL.debug("badB:"+posA);
					badTagStack.push( posA );
				};
				continue;
			};
		};
		if (this.openToCloseHash[tag]){
			expected_closers.push( this.openToCloseHash[tag] );
			expected_openers.push( tag );
			expected_flips.push( this.flipTagsHash[tag] );
			tagstack.push(posA);
		};
	};
	for (var posC in expected_closers.slice()){
		expected_closers.pop();
		expected_flips.pop();
		expected_openers.pop();
		badTagStack.push( tagstack.pop() );
	};
	//
	// Resplice tags.
	//
	// Default sort algoritm in JS appears to be some string-based thing.  Go figure.
	badTagStack.sort(function(a,b){if(a<b){return 1;}else if(a>b){return -1;};return 0;});
	for each (var badTagPos in badTagStack){
		var head = strs.slice(0,(badTagPos-1));
		var tail = strs.slice((badTagPos+2));
		var sep = strs[badTagPos];
		if (sep.length && sep[0] != "<" && this.openToDecorations[sep]){
			var params = this.openToDecorations[sep];
			sep = this.state.fun.decorate[params[0]][params[1][0]](this.state);
		}
		var resplice = strs[(badTagPos-1)] + sep + strs[(badTagPos+1)];
		head.push(resplice);
		strs = head.concat(tail);
	};
	for (var i=0; i<strs.length; i+=2){
		strs[i] = CSL.Output.Formats[this.state.opt.mode].text_escape( strs[i] );
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
					//
					// XXXXX: Validated, so can take just the last tag, so?
					//
					for (var posB=(expected_closers.length-1); posB>-1; posB+=-1){
						var wanted_closer = expected_closers[posB];
						if (tag == wanted_closer){
							expected_closers.pop();
							expected_openers.pop();
							expected_flips.pop();
							expected_rendering.pop();
							this.blobstack.pop();
							break;
						};
					};
					continue;
				};
			};
//
// (b) For open tags, push the corresponding close tag onto a working
// stack, and open a level on the output queue.
//
			if (this.openToCloseHash[tag]){
				//CSL.debug("open:"+tag);
				expected_closers.push( this.openToCloseHash[tag] );
				expected_openers.push( tag );
				expected_flips.push( this.flipTagsHash[tag] );
				blob = this.blobstack.value();
				var newblobnest = new CSL.Factory.Blob();
				blob.push(newblobnest);
				var param = this.addFlipFlop(newblobnest,this.openToDecorations[tag]);
				expected_rendering.push( this.state.fun.decorate[param[0]][param[1]](this.state));
				this.blobstack.push(newblobnest);
			};
		};
//
// (B) at the end of processing, unwind any open tags, append any
// remaining text to the output queue and return the blob.
//
	if (this.strs.length > 2){
		str = this.strs[(this.strs.length-1)];
		var blob = this.blobstack.value();
		var newblob = new CSL.Factory.Blob(false,str);
		blob.push(newblob);
	};
	};
	return this.blob;
};

CSL.Util.FlipFlopper.prototype.addFlipFlop = function(blob,fun){
	var posB = 0;
	for (var posA=0; posA<blob.alldecor.length; posA+=1){
		var decorations = blob.alldecor[posA];
		var breakme = false;
		for (var posC=(decorations.length-1); posC>-1; posC+=-1){
			var decor = decorations[posC];
			if (decor[0] == fun[0]){
				if (decor[1] == fun[1][0]){
					posB = 1;
				};
				breakme = true;
				break;
			};
		};
		if (breakme){
			break;
		};
	};
	var newdecor = [fun[0],fun[1][posB]];
	blob.decorations.reverse();
	blob.decorations.push(newdecor);
	blob.decorations.reverse();
	return newdecor;
};
