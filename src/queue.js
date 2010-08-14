/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights
 * Reserved.
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
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */

CSL.Output = {};
/**
 * Output queue object.
 * @class
 */
CSL.Output.Queue = function (state) {
	this.levelname = ["top"];
	this.state = state;
	this.queue = [];
	this.empty = new CSL.Token("empty");
	var tokenstore = {};
	tokenstore.empty = this.empty;
	this.formats = new CSL.Stack(tokenstore);
	this.current = new CSL.Stack(this.queue);
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
			if (base_token.strings.hasOwnProperty(key)) {
				ret.strings[key] = base_token.strings[key];
			}
		}
		for (key in modifier_token.strings) {
			if (modifier_token.strings.hasOwnProperty(key)) {
				ret.strings[key] = modifier_token.strings[key];
			}
		}
		ret.decorations = base_token.decorations.concat(modifier_token.decorations);
	}
	return ret;
};

// Store a new output format token based on another
CSL.Output.Queue.prototype.addToken = function (name, modifier, token) {
	var newtok, attr;
	newtok = new CSL.Token("output");
	if ("string" === typeof token) {
		token = this.formats.value()[token];
	}
	if (token && token.strings) {
		for (attr in token.strings) {
			if (token.strings.hasOwnProperty(attr)) {
				newtok.strings[attr] = token.strings[attr];
			}
		}
		newtok.decorations = token.decorations;

	}
	if ("string" === typeof modifier) {
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
	tokenstore.empty = this.empty;
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
};

CSL.Output.Queue.prototype.endTag = function () {
	this.closeLevel();
	this.popFormats();
};

//
// newlevel adds a new blob object to the end of the current
// list, and adjusts the current pointer so that subsequent
// appends are made to blob list of the new object.

CSL.Output.Queue.prototype.openLevel = function (token, ephemeral) {
	var blob, curr, x, has_ephemeral;
	if (!this.formats.value()[token]) {
		throw "CSL processor error: call to nonexistent format token \"" + token + "\"";
	}
	// delimiter, prefix, suffix, decorations from token
	blob = new CSL.Blob(this.formats.value()[token], false, token);
	if (this.state.tmp.count_offset_characters && blob.strings.prefix.length) {
		this.state.tmp.offset_characters += blob.strings.prefix.length;
	}
	if (this.state.tmp.count_offset_characters && blob.strings.suffix.length) {
		this.state.tmp.offset_characters += blob.strings.suffix.length;
	}
	curr = this.current.value();
	has_ephemeral = false;
	for (x in this.state.tmp.names_cut.variable) {
		if (this.state.tmp.names_cut.variable.hasOwnProperty(x)) {
			has_ephemeral = x;
			break;
		}
	}
	// can only do this for one variable
	if (ephemeral && (!has_ephemeral || ephemeral === has_ephemeral)) {
		if (!this.state.tmp.names_cut.variable[ephemeral]) {
			this.state.tmp.names_cut.variable[ephemeral] = [];
			this.state.tmp.names_cut.used = ephemeral;
		}
		this.state.tmp.names_cut.variable[ephemeral].push([curr, curr.blobs.length]);
	}
	curr.push(blob);
	this.current.push(blob);
};

/**
 * "merge" used to be real complicated, now it's real simple.
 */
CSL.Output.Queue.prototype.closeLevel = function (name) {
	// CLEANUP: Okay, so this.current.value() holds the blob at the
	// end of the current list.  This is wrong.  It should
	// be the parent, so that we have  the choice of reading
	// the affixes and decorations, or appending to its
	// content.  The code that manipulates blobs will be
	// much simpler that way.
	if (name && name !== this.current.value().levelname) {
		CSL.error("Level mismatch error:  wanted " + name + " but found " + this.current.value().levelname);
	}
	this.current.pop();
};

//
// append does the same thing as newlevel, except
// that the blob it pushes has text content,
// and the current pointer is not moved after the push.

CSL.Output.Queue.prototype.append = function (str, tokname) {
	var token, blob, curr;
	if ("undefined" === typeof str) {
		return;
	}
	if ("number" === typeof str) {
		str = "" + str;
	}
	if (this.state.tmp.element_trace && this.state.tmp.element_trace.value() === "suppress-me") {
		return;
	}
	blob = false;
	if (!tokname) {
		token = this.formats.value().empty;
	} else if (tokname === "literal") {
		token = true;
	} else if ("string" === typeof tokname) {
		token = this.formats.value()[tokname];
	} else {
		token = tokname;
	}
	if (!token) {
		throw "CSL processor error: unknown format token name: " + tokname;
	}
	if ("string" === typeof str && str.length) {
		this.last_char_rendered = str.slice(-1);
		// This, and not the str argument below on flipflop, is the
		// source of the flipflopper string source.
		str = str.replace(/\s+'/g, "  \'").replace(/^'/g, " \'");
		// signal whether we end with terminal punctuation?
		this.state.tmp.term_predecessor = true;
	}
	blob = new CSL.Blob(token, str);
	if (this.state.tmp.count_offset_characters && blob.strings.prefix) {
		this.state.tmp.offset_characters += blob.strings.prefix.length;
	}
	if (this.state.tmp.count_offset_characters && blob.strings.suffix) {
		this.state.tmp.offset_characters += blob.strings.suffix.length;
	}
	curr = this.current.value();
	if ("string" === typeof blob.blobs) {
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
		if ("string" === typeof str) {
			//
			// XXXXX: for all this offset stuff, need to strip affixes
			// before measuring; they may contain markup tags.
			//
			this.state.tmp.offset_characters += blob.strings.prefix.length;
			this.state.tmp.offset_characters += blob.strings.suffix.length;
			this.state.tmp.offset_characters += blob.blobs.length;
		} else if ("undefined" !== str.num) {
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
	if ("string" === typeof str) {
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
		}
		//
		// XXX: Beware superfluous code in your code.  str in this
		// case is not the source of the final rendered string.
		// See note above.
		//
		this.state.fun.flipflopper.init(str, blob);
		//CSL.debug("(queue.append blob decorations): "+blob.decorations);
		this.state.fun.flipflopper.processTags();
	} else {
		curr.push(str);
	}
};

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
	var blobs, ret, blob_delimiter, i, params, blobjr, last_str, last_char, b, use_suffix, qres, addtoret, span_split, j, res, blobs_start, blobs_end, key, pos, len, ppos, llen, ttype, ltype, terminal, leading, delimiters, use_prefix, txt_esc;
	txt_esc = CSL.Output.Formats[this.state.opt.mode].text_escape;
	blobs = myblobs.slice();
	ret = [];

	if (blobs.length === 0) {
		return ret;
	}

	if (!blob) {
		blob_delimiter = "";
		CSL.Output.Queue.normalizePunctuation(blobs);
	} else {
		blob_delimiter = blob.strings.delimiter;
	}

	for (pos = 0, len = blobs.length; pos < len; pos += 1) {
		blobjr = blobs[pos];

		if ("string" === typeof blobjr.blobs) {

			if ("number" === typeof blobjr.num) {
				ret.push(blobjr);
			} else if (blobjr.blobs) {
				// (skips empty strings)
				b = blobjr.blobs;

				use_suffix = blobjr.strings.suffix;
				use_prefix = blobjr.strings.prefix;

				// Run strip-periods
				// This is 'way awkward, but this does need to be run
				// here, and the other decorations do need to be run
				// below, within the conditional.  Might eventually
				// separate the two categories of decoration, but for
				// now, this works.
				for (ppos = blobjr.decorations.length - 1; ppos > -1; ppos += -1) {
					params = blobjr.decorations[ppos];
					if (params[0] === "@strip-periods" && params[1] === "true") {
						b = state.fun.decorate[params[0]][params[1]](state, b);
						blobjr.decorations = blobjr.decorations.slice(0, ppos).concat(blobjr.decorations.slice(ppos + 1));
					}
				}

				if (CSL.TERMINAL_PUNCTUATION.indexOf(use_suffix.slice(0, 1)) > -1 && use_suffix.slice(0, 1) === b.slice(-1)) {
					use_suffix = use_suffix.slice(1);
				}

				// CSL.debug("ZZZa =============");
				if (CSL.TERMINAL_PUNCTUATION.indexOf(use_prefix.slice(-1)) > -1 && use_prefix.slice(-1) === b.slice(0, 1)) {
					// CSL.debug("ZZZa prefix before: " + use_prefix);
					use_prefix = use_prefix.slice(0, -1);
					// CSL.debug("ZZZa prefix after: " + use_prefix);
				}

				if (!state.tmp.suppress_decorations) {
					llen = blobjr.decorations.length;
					for (ppos = 0; ppos < llen; ppos += 1) {
						params = blobjr.decorations[ppos];
						b = state.fun.decorate[params[0]][params[1]](state, b);
					}
				}
				//
				// Handle punctuation/quote swapping for suffix.
				//
				qres = this.swapQuotePunctuation(b, use_suffix);
				b = qres[0];
				use_suffix = qres[1];
				//
				// because we will rip out portions of the output
				// queue before rendering, group wrappers need
				// to produce no output if they are found to be
				// empty.
				if (b && b.length) {
					b = txt_esc(blobjr.strings.prefix) + b + txt_esc(use_suffix);
					ret.push(b);
				}
				// CSL.debug("ZZZa b: " + b);
				// CSL.debug("ZZZa <=============");
			}
		} else if (blobjr.blobs.length) {
			addtoret = state.output.string(state, blobjr.blobs, blobjr);
			if (ret.slice(-1)[0] && addtoret.slice(-1)[0]) {
				ttype = typeof ret.slice(-1)[0];
				ltype = typeof addtoret.slice(-1)[0];
				//
				// The list generated by the string function is a mixture
				// of strings and numeric data objects awaiting evaluation
				// for ranged joins.  If we hit one of them, we skip this
				// fixit operation.
				//
				if ("string" === ttype && "string" === ltype) {
					terminal = ret.slice(-1)[0].slice(-1);
					leading = addtoret.slice(-1)[0].slice(0, 1);

					// CSL.debug("ZZZc ==============>");
					// CSL.debug("ZZZc ret before: " + ret);
					if ((CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(terminal) > -1 && terminal === leading) || (CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(terminal) > -1 && CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(leading) > -1)) {
						// last terminal punctuation wins
						ret[(ret.length - 1)] = ret[(ret.length - 1)].slice(0, -1);
					}
					// CSL.debug("ZZZc ret after: " + ret);
					// CSL.debug("ZZZc <==============");
				}
			}
			ret = ret.concat(addtoret);
		} else {
			continue;
		}
	}
	span_split = 0;
	len = ret.length;
	for (pos = 0; pos < len; pos += 1) {
		if ("string" === typeof ret[pos]) {
			span_split = (parseInt(pos, 10) + 1);
		}
	}
	if (blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)) {
		span_split = ret.length;
	}
	blobs_start = state.output.renderBlobs(ret.slice(0, span_split), blob_delimiter);
	if (blobs_start && blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)) {
		if (!state.tmp.suppress_decorations) {
			len = blob.decorations.length;
			for (pos = 0; pos < len; pos += 1) {
				params = blob.decorations[pos];
				if (["@bibliography", "@display"].indexOf(params[0]) > -1) {
					continue;
				}
				blobs_start = state.fun.decorate[params[0]][params[1]](state, blobs_start);
			}
		}
		//
		// XXXX: cut-and-paste warning.  same as a code block above.
		//
		b = blobs_start;
		use_suffix = blob.strings.suffix;
		//
		// Handle punctuation/quote swapping for suffix.
		//
		qres = this.swapQuotePunctuation(b, use_suffix);
		b = qres[0];
		if (b && b.length) {
			use_suffix = qres[1];
			use_prefix = blob.strings.prefix;

			// CSL.debug("ZZZb =============>");
			if (CSL.TERMINAL_PUNCTUATION.indexOf(use_prefix.slice(-1)) > -1 && use_prefix.slice(-1) === b.slice(0, 1)) {
				// CSL.debug("ZZZb prefix before: " + use_prefix);
				use_prefix = use_prefix.slice(0, -1);
				// CSL.debug("ZZZb prefix after: " + use_prefix);
			}

			b = txt_esc(use_prefix) + b + txt_esc(use_suffix);
			// CSL.debug("ZZZb b: " + b);
			// CSL.debug("ZZZb <=============");
		}
		blobs_start = b;
		if (!state.tmp.suppress_decorations) {
			len = blob.decorations.length;
			for (pos = 0; pos < len; pos += 1) {
				params = blob.decorations[pos];
				if (["@bibliography", "@display"].indexOf(params[0]) === -1) {
					continue;
				}
				blobs_start = state.fun.decorate[params[0]][params[1]](state, blobs_start);
			}
		}
	}
	blobs_end = ret.slice(span_split, ret.length);
	if (!blobs_end.length && blobs_start) {
		ret = [blobs_start];
	} else if (blobs_end.length && !blobs_start) {
		ret = blobs_end;
	} else if (blobs_start && blobs_end.length) {
		ret = [blobs_start].concat(blobs_end);
	}
	//
	// Blobs is now definitely a string with
	// trailing blobs.  Return it.
	if ("undefined" === typeof blob) {
		this.queue = [];
		this.current.mystack = [];
		this.current.mystack.push(this.queue);
		if (state.tmp.suppress_decorations) {
			ret = state.output.renderBlobs(ret);
		}
	} else if ("boolean" === typeof blob) {
		ret = state.output.renderBlobs(ret);
	}
	if (blob) {
		return ret;
	} else {
		return ret;
	}
};

CSL.Output.Queue.prototype.clearlevel = function () {
	var blob, pos, len;
	blob = this.current.value();
	len = blob.blobs.length;
	for (pos = 0; pos < len; pos += 1) {
		blob.blobs.pop();
	}
};

CSL.Output.Queue.prototype.renderBlobs = function (blobs, delim) {
	var state, ret, ret_last_char, use_delim, i, blob, pos, len, ppos, llen, pppos, lllen, res, str, params, txt_esc;
	txt_esc = CSL.Output.Formats[this.state.opt.mode].text_escape;
	if (!delim) {
		delim = "";
	}
	state = this.state;
	ret = "";
	ret_last_char = [];
	use_delim = "";
	len = blobs.length;
	for (pos = 0; pos < len; pos += 1) {
		if (blobs[pos].checkNext) {
			blobs[pos].checkNext(blobs[(pos + 1)]);
		}
	}
	len = blobs.length;
	for (pos = 0; pos < len; pos += 1) {
		blob = blobs[pos];
		if (ret) {
			use_delim = delim;
		}
		if (blob && "string" === typeof blob) {
			res = this.swapQuotePunctuation(ret, use_delim);
			ret = res[0];
			// CSL.debug("ZZZd ==============>");
			// CSL.debug("ZZZd ret before: " + ret);
			use_delim = res[1];
			if (use_delim && CSL.TERMINAL_PUNCTUATION.indexOf(use_delim.slice(0, 1)) > -1) {
				if (use_delim.slice(0, 1) === ret.slice(-1)) {
					// CSL.debug("ZZZd slicing @ A");
					use_delim = use_delim.slice(1);
				}
			}
			if (use_delim && CSL.TERMINAL_PUNCTUATION.indexOf(use_delim.slice(-1)) > -1) {
				if (use_delim.slice(-1) === blob.slice(0, 1)) {
					// CSL.debug("ZZZd slicing @ B");
					use_delim = use_delim.slice(0, -1);
				}
			}
			if (!use_delim && CSL.TERMINAL_PUNCTUATION.indexOf(blob.slice(0, 1)) > -1) {
				if (ret.slice(-1) === blob.slice(0, 1)) {
					// CSL.debug("ZZZd slicing @ C");
					blob = blob.slice(1);
				}
			}
			ret += txt_esc(use_delim);
			ret += blob;
			// CSL.debug("ZZZd <==============");
			// CSL.debug("ZZZd ret after: " + ret);
		} else if (blob.status !== CSL.SUPPRESS) {
			// CSL.debug("doing rangeable blob");
			//var str = blob.blobs;
			str = blob.formatter.format(blob.num);
			if (blob.strings["text-case"]) {
				str = CSL.Output.Formatters[blob.strings["text-case"]](this.state, str);
			}
			if (!state.tmp.suppress_decorations) {
				llen = blob.decorations.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					params = blob.decorations[ppos];
					str = state.fun.decorate[params[0]][params[1]](state, str);
				}
			}
			str = blob.strings.prefix + str + blob.strings.suffix;
			if (blob.status === CSL.END) {
				ret += blob.range_prefix;
			} else if (blob.status === CSL.SUCCESSOR) {
				ret += blob.successor_prefix;
			} else if (blob.status === CSL.START) {
				ret += "";
			} else if (blob.status === CSL.SEEN) {
				ret += blob.successor_prefix;
			}
			ret += str;
		}
	}
	return ret;
};

CSL.Output.Queue.prototype.swapQuotePunctuation = function (ret, use_delim) {
	var pre_quote, pos, len;
	if (ret.length && this.state.getOpt("punctuation-in-quote") && this.state.opt.close_quotes_array.indexOf(ret.slice(-1)) > -1) {

		if (use_delim) {
			pos = use_delim.indexOf(" ");
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
			ret = ret.slice(0, (ret.length - 1)) + pre_quote + ret.slice((ret.length - 1));
		}
	}
	return [ret, use_delim];
};


CSL.Output.Queue.normalizePunctuation = function (blobs, res) {
	var pos, len, m, punct, suff, predecessor, rex, params, ppos, llen;
	//
	// Move leading punctuation on prefixes to preceding
	// element's suffix.  This is not good logic, actually;
	// if there is an intervening delimiter, we will
	// be moving the punctuation to the other side of it.
	// But if we assume that punctuation will always be
	// intended to apply directly to the preceding element,
	// and so be splice at element level with an empty
	// delimiter, it will be okay.
	//
	if ("object" === typeof blobs) {
		for (pos = 0, len = blobs.length; pos < len; pos += 1) {
			if (!blobs[pos].blobs) {
				continue;
			}

			if (pos > 0) {
				m = blobs[pos].strings.prefix.match(CSL.TERMINAL_PUNCTUATION_REGEXP);
				if (m) {
					blobs[pos].strings.prefix = m[2];
					predecessor = blobs[(pos - 1)];
					CSL.Output.Queue.appendPunctuationToSuffix(predecessor, m[1]);
				}
			}
			if ("object" === typeof blobs[pos] && blobs[pos].blobs.length) {
				res = CSL.Output.Queue.normalizePunctuation(blobs[pos].blobs, res);
			}
			if (res) {
				if (CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(blobs[pos].strings.suffix.slice(0, 1)) > -1) {
					blobs[pos].strings.suffix = blobs[pos].strings.suffix.slice(1);
				}
			}
			if (pos === blobs.length -1 && (("string" === typeof blobs[pos].blobs && CSL.TERMINAL_PUNCTUATION.slice(0, -1).indexOf(blobs[pos].blobs.slice(-1)) > -1) || CSL.TERMINAL_PUNCTUATION.slice(0,-1).indexOf(blobs[pos].strings.suffix.slice(0, 1)) > -1)) {
				res = true;
			}
			if (res && blobs[pos].strings.suffix.match(CSL.CLOSURES)) {
				res = false;
			}
			if (pos !== blobs.length - 1) {
				res = false;
			}
		}
	}
	return res;
};


CSL.Output.Queue.appendPunctuationToSuffix = function (predecessor, punct) {
	var suff, newpredecessor;
	suff = predecessor.strings.suffix;
	if (suff) {
		if (CSL.TERMINAL_PUNCTUATION.indexOf(suff.slice(-1)) === -1) {
			predecessor.strings.suffix += punct;
		}
	} else {
		if ("string" === typeof predecessor.blobs) {
			if (CSL.TERMINAL_PUNCTUATION.indexOf(predecessor.blobs.slice(-1)) === -1) {
				predecessor.strings.suffix += punct;
			}
		} else {
			newpredecessor = predecessor.blobs.slice(-1)[0];
			if (newpredecessor) {
				CSL.Output.Queue.appendPunctuationToSuffix(newpredecessor, punct);
			}
		}
	}
};

CSL.Output.Queue.quashDuplicateFinalPunctuation = function (myblobs, chr) {
	if ("string" === typeof myblobs) {
		if (chr === myblobs.slice(-1)) {
			return myblobs.slice(0, -1);
		} else {
			return myblobs;
		}
	} else if (myblobs.length) {
		var lastblob = myblobs.slice(-1)[0];
		if (lastblob.strings.suffix && chr === lastblob.strings.suffix.slice(-1)) {
			lastblob.strings.suffix = lastblob.strings.suffix.slice(0, -1);
		} else if ("object" === typeof lastblob.blobs) {
			return CSL.Output.Queue.quashDuplicateFinalPunctuation(lastblob.blobs, chr);
		} else if ("string" === typeof lastblob.blobs) {
			lastblob.blobs = CSL.Output.Queue.quashDuplicateFinalPunctuation(lastblob.blobs, chr);
		}
	}
	return false;
}
