/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 */

CSL.Output = {};
/**
 * Output queue object.
 * @class
 */
CSL.Output.Queue = function (state) {
	this.state = state;
	this.queue = [];
	this.empty = new CSL.Token("empty");
	var tokenstore = {};
	tokenstore.empty = this.empty;
	this.formats = new CSL.Stack(tokenstore);
	this.current = new CSL.Stack(this.queue);
	this.suppress_join_punctuation = false;
};

CSL.Output.Queue.prototype.getToken = function (name) {
	var ret = this.formats.value()[name];
	return ret;
};

CSL.Output.Queue.prototype.mergeTokenStrings = function (base, modifier) {
	var base_token, modifier_token, ret, key;
	base_token = this.formats.value()[base];
	modifier_token = this.formats.value()[modifier];
	ret = base_token;
	if (modifier_token) {
		if (!base_token) {
			base_token = new CSL.Token(base, CSL.SINGLETON);
			base_token.decorations = [];
		}
		ret = new CSL.Token(base, CSL.SINGLETON);
		key = "";
		for (key in base_token.strings) {
			ret.strings[key] = base_token.strings[key];
		}
		for (key in modifier_token.strings) {
			ret.strings[key] = modifier_token.strings[key];
		}
		ret.decorations = base_token.decorations.concat(modifier_token.decorations);
	}
	return ret;
}

// Store a new output format token based on another
CSL.Output.Queue.prototype.addToken = function (name, modifier, token) {
	var newtok = new CSL.Token("output");
	if ("string" == typeof token) {
		token = this.formats.value()[token];
	}
	if (token && token.strings) {
		for (attr in token.strings) {
			newtok.strings[attr] = token.strings[attr];
		}
		newtok.decorations = token.decorations;

	}
	if ("string" == typeof modifier) {
		newtok.strings.delimiter = modifier;
	}
	this.formats.value()[name] = newtok;
};

//
// newFormat adds a new bundle of formatting tokens to
// the queue's internal stack of such bundles
CSL.Output.Queue.prototype.pushFormats = function (tokenstore) {
	if (!tokenstore) {
		tokenstore = {};
	}
	tokenstore["empty"] = this.empty;
	this.formats.push(tokenstore);
};


CSL.Output.Queue.prototype.popFormats = function (tokenstore) {
	this.formats.pop();
};

CSL.Output.Queue.prototype.startTag = function (name, token) {
	var tokenstore = {};
	tokenstore[name] = token;
	this.pushFormats(tokenstore);
	this.openLevel(name);
}

CSL.Output.Queue.prototype.endTag = function () {
	this.closeLevel();
	this.popFormats();
}

//
// newlevel adds a new blob object to the end of the current
// list, and adjusts the current pointer so that subsequent
// appends are made to blob list of the new object.

CSL.Output.Queue.prototype.openLevel = function (token) {
	//CSL.debug("openLevel");
	if (!this.formats.value()[token]) {
		throw "CSL processor error: call to nonexistent format token \"" + token + "\"";
	}
	//CSL.debug("newlevel: "+token);
	//
	// delimiter, prefix, suffix, decorations from token
	var blob = new CSL.Blob(this.formats.value()[token]);
	if (this.state.tmp.count_offset_characters && blob.strings.prefix.length) {
		// this.state.tmp.offset_characters += blob.strings.prefix.length;
		this.state.tmp.offset_characters += blob.strings.prefix.length;
	}
	if (this.state.tmp.count_offset_characters && blob.strings.suffix.length) {
		// this.state.tmp.offset_characters += blob.strings.suffix.length;
		this.state.tmp.offset_characters += blob.strings.suffix.length;
	}
	var curr = this.current.value();
	curr.push(blob);
	this.current.push(blob);
};

/**
 * "merge" used to be real complicated, now it's real simple.
 */
CSL.Output.Queue.prototype.closeLevel = function (name) {
	//CSL.debug("closeLevel");
	//CSL.debug("merge");
	this.current.pop();
}

//
// append does the same thing as newlevel, except
// that the blob it pushes has text content,
// and the current pointer is not moved after the push.

CSL.Output.Queue.prototype.append = function (str, tokname) {
	if ("undefined" == typeof str) {
		return;
	};
	if ("number" == typeof str) {
		str = "" + str;
	}
	if (this.state.tmp.element_trace && this.state.tmp.element_trace.value() == "suppress-me") {
		return;
	}
	var blob = false;
	if (!tokname) {
		var token = this.formats.value()["empty"];
	} else if (tokname == "literal") {
		var token = true;
	} else if ("string" == typeof tokname) {
		var token = this.formats.value()[tokname];
	} else {
		var token = tokname;
	}
	if (!token) {
		throw "CSL processor error: unknown format token name: " + tokname;
	}
	if ("string" == typeof str && str.length) {
		this.last_char_rendered = str.slice(-1);
	}
	blob = new CSL.Blob(token, str);
	if (this.state.tmp.count_offset_characters && blob.strings.prefix) {
		this.state.tmp.offset_characters += blob.strings.prefix.length;
	}
	if (this.state.tmp.count_offset_characters && blob.strings.suffix) {
		this.state.tmp.offset_characters += blob.strings.suffix.length;
	}
	var curr = this.current.value();
	if ("string" == typeof blob.blobs) {
		this.state.tmp.term_predecessor = true;
	}
	//
	// XXXXX: Interface to this function needs cleaning up.
	// The str variable is ignored if blob is given, and blob
	// must contain the string to be processed.  Ugly.
	//CSL.debug("str:"+str.length);
	//CSL.debug("blob:"+blob);
	//CSL.debug("tokname:"+tokname);
	//
	// <Dennis Hopper impersonation>
	// XXXXX: This is, like, too messed up for _words_, man.
	// </Dennis Hopper impersonation>
	//
	if (this.state.tmp.count_offset_characters) {
		if ("string" == typeof str) {
			//
			// XXXXX: for all this offset stuff, need to strip affixes
			// before measuring; they may contain markup tags.
			//
			this.state.tmp.offset_characters += blob.strings.prefix.length;
			this.state.tmp.offset_characters += blob.strings.suffix.length;
			this.state.tmp.offset_characters += blob.blobs.length;
		} else if ("undefined" != str.num) {
			this.state.tmp.offset_characters += str.strings.prefix.length;
			this.state.tmp.offset_characters += str.strings.suffix.length;
			this.state.tmp.offset_characters += str.formatter.format(str.num).length;
		}
	}
	//
	// Caution: The parallel detection machinery will blow up if tracking
	// variables are not properly initialized elsewhere.
	//
	this.state.parallel.AppendBlobPointer(curr);
	if ("string" == typeof str) {
		curr.push(blob);
		if (blob.strings["text-case"]) {
			//
			// This one is _particularly_ hard to follow.  It's not obvious,
			// but the blob already contains the input string at this
			// point, as blob.blobs -- it's a terminal node, as it were.
			// The str variable also contains the input string, but
			// that copy is not used for onward processing.  We have to
			// apply our changes to the blob copy.
			//
			blob.blobs = CSL.Output.Formatters[blob.strings["text-case"]](this.state, str);
		};
		this.state.fun.flipflopper.init(str, blob);
		//CSL.debug("(queue.append blob decorations): "+blob.decorations);
		this.state.fun.flipflopper.processTags();
	} else {
		curr.push(str);
	}
}

//
// Maybe the way to do this is to take it by layers, and
// analyze a FLAT list of blobs returned during recursive
// execution.  If the list is all numbers and there is no
// group decor, don't touch it.  If it ends in numbers,
// set the group delimiter on the first in the series,
// and join the strings with the group delimiter.  If it
// has numbers followed by strings, render each number
// in place, and join with the group delimiter.  Return
// the mixed flat list, and recurse upward.
//
// That sort of cascade should work, and should be more
// easily comprehensible than this mess.
//

CSL.Output.Queue.prototype.string = function (state, myblobs, blob) {

	var blobs = myblobs.slice();
	var ret = [];

	if (blobs.length == 0) {
		return ret;
	}

	if (!blob) {
		CSL.Output.Queue.normalizePrefixPunctuation(blobs);
	}

	var blob_last_chars = [];

	//
	// Need to know the join delimiter before boiling blobs down
	// to strings, so that we can cleanly clip out duplicate
	// punctuation characters.
	//
	if (blob) {
		var blob_delimiter = blob.strings.delimiter;
	} else {
		var blob_delimiter = "";
	};
	//if (blob_delimiter.indexOf(".") > -1) {
	//	CSL.debug("*** blob_delimiter: "+blob_delimiter);
	//};
	for (var i in blobs) {
		var blobjr = blobs[i];
		if ("string" == typeof blobjr.blobs) {
			var last_str = "";
			if (blobjr.strings.suffix) {
				last_str = blobjr.strings.suffix;
			} else if (blobjr.blobs) {
				last_str = blobjr.blobs;
			};
			//var last_char = last_str[(last_str.length-1)];
			var last_char = last_str.slice(-1);

			if ("number" == typeof blobjr.num) {
				ret.push(blobjr);
				blob_last_chars.push(last_char);
			} else if (blobjr.blobs) {
				// skip empty strings!!!!!!!!!!!!
				//
				// text_escape is applied by flipflopper.
				//
				var b = blobjr.blobs;
				if (!state.tmp.suppress_decorations) {
					for each (var params in blobjr.decorations) {
						b = state.fun.decorate[params[0]][params[1]](state, b);
					};
				};
				var use_suffix = blobjr.strings.suffix;
				if (b[(b.length-1)] == "." && use_suffix && use_suffix[0] == ".") {
				    use_suffix = use_suffix.slice(1);
				}
				//
				// Handle punctuation/quote swapping for suffix.
				//
				var qres = this.swapQuotePunctuation(b, use_suffix);
				b = qres[0];
				use_suffix = qres[1];
				//
				// because we will rip out portions of the output
				// queue before rendering, group wrappers need
				// to produce no output if they are found to be
				// empty.
				if(b && b.length) {
					b = blobjr.strings.prefix + b + use_suffix;
					ret.push(b);
					blob_last_chars.push(last_char);
				}
			};
		} else if (blobjr.blobs.length) {
			var res = state.output.string(state, blobjr.blobs, blobjr);
			var addtoret = res[0];
			ret = ret.concat(addtoret);
			blob_last_chars = blob_last_chars.concat(res[1]);

			//blob_last_chars = res[1];
		} else {
			continue;
		}
	};
	var span_split = 0;
	for (var j in ret) {
		if ("string" == typeof ret[j]) {
			span_split = (parseInt(j, 10) + 1);
		}
	}
	if (blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)) {
		span_split = ret.length;
	}
	//
	// Need to know the last char of every element in the list
	// here, so that we can delete duplicates before the join.  But the elements
	// are text strings, so there is noplace to store that info.  What to do?
	// Can we know the delimiter at the point these strings are built?
	// ...
	// Oh.  Yes, we can.  Good.
	//
	var res = state.output.renderBlobs(ret.slice(0, span_split), blob_delimiter, blob_last_chars);
	var blobs_start = res[0];
	blob_last_chars = res[1].slice();
	if (blobs_start && blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)) {
		if (!state.tmp.suppress_decorations) {
			for each (var params in blob.decorations) {
				blobs_start = state.fun.decorate[params[0]][params[1]](state, blobs_start);
			}
		}
		//
		// XXXX: cut-and-paste warning.  same as a code block above.
		//
		var b = blobs_start;
		var use_suffix = blob.strings.suffix;
		if (b[(b.length-1)] == "." && use_suffix && use_suffix[0] == ".") {
			use_suffix = use_suffix.slice(1);
		}
		//
		// Handle punctuation/quote swapping for suffix.
		//
		var qres = this.swapQuotePunctuation(b, use_suffix);
		b = qres[0];
		if(b && b.length) {
			use_suffix = qres[1];
			b = blob.strings.prefix + b + use_suffix;
		}
		blobs_start = b;
	}
	var blobs_end = ret.slice(span_split, ret.length);
	if (!blobs_end.length && blobs_start){
		ret = [blobs_start];
	} else if (blobs_end.length && !blobs_start) {
		ret = blobs_end;
	} else if (blobs_start && blobs_end.length) {
		ret = [blobs_start].concat(blobs_end);
	}
	//
	// Blobs is now definitely a string with
	// trailing blobs.  Return it.
	if ("undefined" == typeof blob){
		this.queue = [];
		this.current.mystack = [];
		this.current.mystack.push(this.queue);
		if (state.tmp.suppress_decorations){
			var res = state.output.renderBlobs(ret);
			ret = res[0];
			blob_last_chars = res[1].slice();
		};
	} else if ("boolean" == typeof blob){
		var res = state.output.renderBlobs(ret);
		ret = res[0];
		blob_last_chars = res[1].slice();
	};
	if (blob){
		return [ret, blob_last_chars.slice()];
	} else {
		return ret;
	};
};

CSL.Output.Queue.prototype.clearlevel = function (){
	var blob = this.current.value();
	for (var i=(blob.blobs.length-1); i > -1; i--){
		blob.blobs.pop();
	}
};

CSL.Output.Queue.prototype.renderBlobs = function (blobs, delim, blob_last_chars){
	if (!delim){
		delim = "";
	}
	if (!blob_last_chars){
		blob_last_chars = [];
	};
	var state = this.state;
	var ret = "";
	var ret_last_char = [];
	var use_delim = "";
	var l = blobs.length;
	for (var i=0; i < l; i++){
		if (blobs[i].checkNext){
			blobs[i].checkNext(blobs[(i + 1)]);
		}
	}
	for (var i in blobs){
		var blob = blobs[i];
		if (ret){
			use_delim = delim;
		}
		if (blob && "string" == typeof blob){
			//throw "Attempt to render string as rangeable blob"
			if (use_delim && blob_last_chars[(i-1)] == use_delim[0]) {
				//
				// Something for posterity, at the end of a remarkably
				// unproductive day.
				//
				//CSL.debug("  ####################################################");
				//CSL.debug("  ######################## EUREKA ####################");
				//CSL.debug("  ####################################################");
				use_delim = use_delim.slice(1);
			};
			//
			// Handle punctuation/quote swapping for delimiter joins.
			//
			var res = this.swapQuotePunctuation(ret, use_delim);
			ret = res[0];
			use_delim = res[1];
			ret += use_delim;
			ret += blob;
			ret_last_char = blob_last_chars.slice(-1);
		} else if (blob.status != CSL.SUPPRESS){
			// CSL.debug("doing rangeable blob");
			//var str = blob.blobs;
			var str = blob.formatter.format(blob.num);
			if (blob.strings["text-case"]){
				str = CSL.Output.Formatters[blob.strings["text-case"]](this.state, str);
			}
			if (!state.tmp.suppress_decorations){
				for each (var params in blob.decorations){
					str = state.fun.decorate[params[0]][params[1]](state, str);
				};
			};
			//if (!suppress_decor){
				str = blob.strings.prefix + str + blob.strings.suffix;
			//}
			if (blob.status == CSL.END){
				ret += blob.range_prefix;
			} else if (blob.status == CSL.SUCCESSOR){
				ret += blob.successor_prefix;
			} else if (blob.status == CSL.START){
				//
				// didn't need this.  don't really know how this works.
				// pure empirical fingerpainting for these joins.
				//
				ret += "";
			} else if (blob.status == CSL.SEEN){
				ret += blob.successor_prefix;
			}
			ret += str;
			//ret_last_char = blob_last_chars.slice((blob_last_chars.length-1),blob_last_chars.length);
			ret_last_char = blob_last_chars.slice(-1);
		};
	};
	return [ret, ret_last_char];
	////////return ret;
};


CSL.Output.Queue.prototype.swapQuotePunctuation = function (ret, use_delim){
	var pre_quote;
	if (ret.length && this.state.getOpt("punctuation-in-quote") && this.state.opt.close_quotes_array.indexOf(ret[(ret.length-1)]) > -1){
		// if (use_delim && CSL.SWAPPING_PUNCTUATION.indexOf(use_delim.slice(0)) > -1) {
		if (use_delim) {

			//
			// XXXXX: this is messed up,  but for now it works for common cases.
			//

			//  && CSL.SWAPPING_PUNCTUATION.indexOf(use_delim.slice(0)) > -1) {

			var pos = use_delim.indexOf(" ");
			if (pos === -1) {
				pos = use_delim.length;
			}
			if (pos > -1) {
				if (CSL.SWAPPING_PUNCTUATION.indexOf(use_delim.slice(0, 1)) > -1) {
					pre_quote = use_delim.slice(0, pos);
					use_delim = use_delim.slice(pos);
				} else {
					pre_quote = "";
				}
			} else {
				pre_quote = use_delim;
				use_delim = "";
			}
			ret = ret.slice(0, (ret.length-1)) + pre_quote + ret.slice((ret.length-1));
		};
	};
	return [ret, use_delim];
};


CSL.Output.Queue.normalizePrefixPunctuation = function (blobs){
	//
	// Move leading punctuation on prefixes to preceding
	// element's suffix.
	//
	var punct = "";
	if ("object" == typeof blobs[0] && blobs[0].blobs.length){
		CSL.Output.Queue.normalizePrefixPunctuation(blobs[0].blobs);
	}
	if ("object" == typeof blobs){
		for (var pos=(blobs.length-1); pos > 0; pos += -1){
			if (!blobs[pos].blobs){
				continue;
			}
			var m = blobs[pos].strings.prefix.match(/^([!.?])(.*)/);
			if (m){
				blobs[pos].strings.prefix = m[2];
				if (["!", ".", "?"].indexOf(blobs[(pos-1)].strings.suffix.slice(-1)) > -1){
					blobs[(pos-1)].strings.suffix += m[1];
				}
			};
			if ("object" == typeof blobs[pos] && blobs[pos].blobs.length){
				CSL.Output.Queue.normalizePrefixPunctuation(blobs[pos].blobs);
			}
		};
	};
};
