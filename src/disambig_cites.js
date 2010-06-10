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

var debug = true;

/*
 * Pseudocode for disambiguation
 *
 * This module has been rewritten several times.  In each iteration, it
 * has gradually gotten wooly and incomprehensible as additional wrinkles
 * in disambiguation requirements emerged.  The current implementation is
 * meant to be as lucid as possible, given the complexity of the process.
 *
 * Disambiguation actions affect the state of several state objects
 * in the citeproc-js metabolism:
 *
 * (1) Names registry entries
 * (2) Reference registry entries
 *     - the disambig object
 *     - the ambig key string for the group
 *
 * Disambiguation of type (1) is performed first, if required.  The code
 * for that is in disambig_names.js.  Type (2) disambiguation is handled
 * by the code below.
 *
 * Disambiguation of type (2) involves three possible operations, which
 * are performed in the following sequence:
 *   (a) progressive transformation of names;
 *   (b) rendering with disambiguate="true"; and
 *   (c) application of year suffixes.
 *
 * The result of disambiguation is stored in a unique "disambig"
 * object for each item in the registry.  The aim of disambiguation
 * in this module is to set this bundle of values, which are used to
 * control the form of the citation during rendering.
 *
 * The functions in this module used to perform each stage of
 * disambiguation are as follows:
 *   (a)(i)  disNames();
 *   (a)(ii) disGivens();
 *   (b)     disExtraText()
 *   (c)     disYears()
 *
 * The wrapper function disambigateCites() sets up variables
 * that are fed to each of the above functions in sequence.
 * Some functions may be skipped, depending on the configuration
 * of the style.
 *
 * The disambiguateCites() function operates on a group of
 * cites that share the same "akey" or ambiguity key, which is the
 * form of the cite when rendered in "subsequent" position by
 * the style, with any dynamically generated numbers (note backreferences,
 * year-suffixes, etc) set to nil.
 *
 * The registry disambig objects for each cite to be disambiguated
 * are set to a base value by disambigCites() at the start of processing.
 * The base "names" and "givens" values may vary between citations at
 * the start of processing, depending on the number of names available
 * on the target item, and the effect of Type (1) disambiguation.
 *
 * The disambig object is incremented during disambiguation.  The
 * algorithm used for incrementing differs for each of the functions
 * (a)-(c) listed above:
 *   (a)(i)  disNames():     one name is added for each increment
 *   (a)(ii) disGivens():    each name is incremented in turn, from
 *                           base to max value
 *   (b)     disExtraText(): extra text is toggled on, then off
 *   (c)     disYears():     year suffixes are applied in a single
 *                           operation.
 *
 * [...]
 *
 * During disambiguation, the rendered form of cites at successive
 * increments of
 *
 */

CSL.Registry.prototype.disambiguateCites = function (state, akey, modes, candidate_list) {
	var ambigs, reg_token, keypos, id_vals, a, base, token, pos, len, tokens, str, maxvals, minval, testpartner, otherstr, base_return, ret, id, key, origbase, remainder, last_remainder;
	if (!candidate_list) {
		//
		// We start with the state and an ambig key.
		// We acquire a copy of the list of ambigs that relate to the key from state.
		ambigs = this.ambigcites[akey].slice();
		//
		// We clear the list of ambigs so it can be rebuilt
		this.ambigcites[akey] = [];
	} else {
		//
		// If candidate_list is true, we are running one final time with
		// disambiguate="true"
		//
		ambigs = [];
		len = candidate_list.length;
		for (pos = 0; pos < len; pos += 1) {
			reg_token = candidate_list[pos];
			ambigs.push(reg_token.id);
			keypos = this.ambigcites[akey].indexOf(reg_token.id);
			if (keypos > -1) {
				this.ambigcites[akey] = this.ambigcites[akey].slice(0, keypos).concat(this.ambigcites[akey].slice((keypos + 1)));
			}
		}
	}
	//
	// We get the ids of the partners from the copy
	// (what's the point of this?  why not just push
	// ambigs itself?)
	id_vals = [];
	len = ambigs.length;
	for (pos = 0; pos < len; pos += 1) {
		id_vals.push(ambigs[pos]);
	}
	//
	// We get the tokens of the partners
	tokens = state.retrieveItems(id_vals);

	// The processing sequence is the same for all modes,
	// but there are important differences at the decision
	// points.
	if (candidate_list && candidate_list.length) {
		modes = ["disambiguate_true"].concat(modes);
	}
	CSL.initCheckerator.call(this.checkerator, tokens, modes, akey, this);

	this.checkerator.lastclashes = (ambigs.length - 1);

	// We iterate through every cite in the list, front to back.
	// But we use a while loop, because repeated renderings
	// of the same cite might be needed.
	base = false;
	this.checkerator.pos = 0;

	// temporary stuff for debugging
	str = CSL.getAmbiguousCite.call(state, tokens[0], base);
	maxvals = CSL.getMaxVals.call(state);
	minval = CSL.getMinVal.call(state);
	base = CSL.getAmbigConfig.call(state);
	origbase = CSL.cloneAmbigConfig(base);
	//	return [];
	remainder = tokens.length;
	last_remainder = this.checkerator.seen.length;
	while (CSL.runCheckerator.call(this.checkerator)) {
		token = this.checkerator.tokens[this.checkerator.pos];
		//SNIP-START
		if (debug) {
			CSL.debug("<<<<<<<<<<<<<<<<<<<<<<<<< " + token.id + " >>>>>>>>>>>>>>>>>>>>>>>>>>>");
		}
		//SNIP-END
		//
		// skip items that have been finally resolved.
		if (this.ambigcites[akey].indexOf(token.id) > -1) {
			//SNIP-START
			if (debug) {
				CSL.debug("---> Skip registered token for: " + token.id);
			}
			//SNIP-END
			this.checkerator.pos += 1;
			continue;
		}
		this.checkerator.candidate = token.id;

		if (base === false) {
			this.checkerator.mode = modes[0];
		}
		//SNIP-START
		if (debug) {
			CSL.debug("  ---> Mode: " + this.checkerator.mode);
		}
		if (debug) {
			CSL.debug("base in (givens):" + base.givens);
		}
		//SNIP-END
		str = CSL.getAmbiguousCite.call(state, token, base);
		maxvals = CSL.getMaxVals.call(state);
		minval = CSL.getMinVal.call(state);
		base = CSL.getAmbigConfig.call(state);
		var testbase = CSL.cloneAmbigConfig(base);
		//
		// XXXXX: band-aid to block infinite looping for cites
		// with no names to work with.
		//

		// maybe this doesn't work.  doesn't base.names always
		// start out at zero anyway?
		//len = base.names.length - 1;
		//for (pos = len; pos > -1; pos += -1) {
		//	if (base.names[pos] === 0) {
		//		base.names.pop();
		//		base.givens.pop();
		//	} else {
		//		break;
		//	}
		//}
		//if (!base.names.length) {
		//	maxvals = 0;
		//}
		//SNIP-START
		if (debug) {
			CSL.debug("base out (givens):" + base.givens);
		}
		//SNIP-END
		if (candidate_list && candidate_list.length) {
			base.disambiguate = true;
		}

		CSL.setCheckeratorBase.call(this.checkerator, base);
		CSL.setMaxVals.call(this.checkerator, maxvals);
		CSL.setMinVal.call(this.checkerator, minval);

		len = tokens.length;
		this.checkerator.test_partners = [];
		this.checkerator.test_strangers = [];
		for (pos = 0; pos < len; pos += 1) {
			testpartner = tokens[pos];
			if (token.id === testpartner.id) {
				continue;
			}
			otherstr = CSL.getAmbiguousCite.call(state, testpartner, base);
			// Oh, crap.  We need to skip this item if the base differs from
			// that of the current cite.  How to do that without a performance hit?
			// Patch up for now.  But there might be a better way to do this.
			if (this.checkerator.maxed_out_bases[testpartner.id]) {
				if (CSL.compareAmbigConfig(base, testbase)) {
					base.names = testbase.names.slice();
					base.givens = testbase.givens.slice();
					for (pos = 0, len = testbase.givens; pos < len; pos += 1) {
						base.givens[pos] = testbase.givens[pos].slice();
					}
					continue;
				}
			}
			//SNIP-START
			if (debug) {
				CSL.debug("  ---> last clashes: " + this.checkerator.lastclashes);
				CSL.debug("  ---> master:    " + token.id);
				CSL.debug("  ---> master:    " + str);
				CSL.debug("  ---> partner: " + testpartner.id);
				CSL.debug("  ---> partner: " + otherstr);
			}
			//SNIP-END

			if (CSL.checkCheckeratorForClash.call(this.checkerator, str, otherstr)) {
				if (CSL.compareAmbigConfig(base, testbase) === 0) {
					//xxprint("cache: "+testpartner.id);
					// xx print("  clashing bases are equivalent, could cache testpartner");
					this.checkerator.test_partners.push(testpartner.id);
				}
			} else {
				this.checkerator.test_strangers.push(testpartner.id);
			}
		}
		if (CSL.evaluateCheckeratorClashes.call(this.checkerator)) {
			// This remainder stuff is used to trigger aggressive rollout
			// of expanded givennames.  It's an empirical fix; not quite
			// sure of the exact logic that moves the values here.
			base_return = CSL.decrementCheckeratorNames.call(this, state, base, origbase, token.id);
			this.registerAmbigToken(akey, token.id, base_return);
			if (this.checkerator.seen.indexOf(token.id) === -1) {
				//xxxprint("pushing token id to seen: "+token.id);
				this.checkerator.seen.push(token.id);
			}
			this.checkerator.ids[this.checkerator.ids.indexOf(token.id)] = false;
			//SNIP-START
			if (debug) {
				CSL.debug("  ---> Evaluate: storing token config");
				CSL.debug("           akey: " + akey);
				CSL.debug("          names: " + base_return.names);
				CSL.debug("         givens: " + base_return.givens);
			}
			//SNIP-END
			//xxprint("tokens_length: "+this.checkerator.tokens_length);
			//xxprint("seen: "+this.checkerator.seen);
			//xxprint("tokens: "+this.checkerator.tokens);
			//xxprint("pos: "+this.checkerator.pos);

			continue;
		}
		if (CSL.maxCheckeratorAmbigLevel.call(this.checkerator, origbase)) {
			//if (true || (!state.opt.has_disambigate && !state.citation.opt["disambiguate-add-year-suffix"]) || !state.citation.opt.oneauthor_bib_sort) {
			this.checkerator.mode1_counts = false;
			this.checkerator.maxed_out_bases[token.id] = CSL.cloneAmbigConfig(base);
			//SNIP-START
			if (debug) {
				CSL.debug("  ---> Max out: remembering token config for: " + token.id);
				CSL.debug("       (" + base.names + ":" + base.givens + ")");
			}
			//SNIP-END
			if (this.checkerator.seen.indexOf(token.id) === -1) {
				this.checkerator.seen.push(token.id);
			}
			base = false;
			continue;
		}
		//SNIP-START
		if (debug) {
			CSL.debug("  ---> Incrementing");
		}
		//SNIP-END
		CSL.incrementCheckeratorAmbigLevel.call(this.checkerator);
	}
	// return tuples of registry tokens and item tokens.
	// the former are useful for second-run disambiguation,
	// the latter for sorting.
	ret = [];
	len = this.checkerator.ids.length;
	for (pos = 0; pos < len; pos += 1) {
		id = this.checkerator.ids[pos];
		if (id) {
			// xx print("stuffed in ret: "+id);
			ret.push(this.registry[id]);
		}
	}
	// if we don't have year-suffix available, we may
	// have maxed out bases lying around
	len = this.checkerator.maxed_out_bases.length;
	for (key in this.checkerator.maxed_out_bases) {
		if (this.checkerator.maxed_out_bases.hasOwnProperty(key)) {
			// xx print("maxed: "+key);
			this.registry[key].disambig = this.checkerator.maxed_out_bases[key];
			if (this.ambigcites[akey].indexOf(key) === -1) {
				this.ambigcites[akey].push(key);
			}
		}
	}
	return ret;
};

/**
 * Management object to support the disambiguation control loop.
 */
CSL.Checkerator = function () {};

CSL.initCheckerator = function (tokens, modes, akey, registry) {
	var len, pos;
	// set during names disambiguation, rerun in givens
	// disambiguation.
	this.tokensets = {};
	this.registry = registry;
	this.tokens = tokens;
	this.seen = [];
	this.modes = modes;
	this.mode = this.modes[0];
	this.tokens_length = tokens.length;
	this.pos = 0;
	this.clashes = 0;
	this.maxvals = false;
	this.base = false;
	this.akey = akey;
	this.ids = [];
	this.maxed_out_bases = {};
	len = tokens.length;
	for (pos = 0; pos < len; pos += 1) {
		this.ids.push(tokens[pos].id);
	}
	//
	// used in givens mode (mode 1)
	this.lastclashes = -1;
	//
	// used to address into the base array in both modes
	this.namepos = 0;
	this.modepos = 0;
	this.mode1_counts = false;
};

CSL.runCheckerator = function () {
	var len, pos;
	//if (this.maxvals.length && this.maxvals[this.modepos] === 0) {
	//	print("modepos: "+this.modepos);
	//	this.seen.push(this.tokens[this.pos].id);
	//}

	//if (this.maxvals.length && this.maxvals[this.modepos] === 0) {
	//	len = this.tokens.length;
	//	for (pos = 0; pos < len; pos += 1) {
	//		this.maxed_out_bases[this.tokens[pos].id] =
	//CSL.cloneAmbigConfig(base);
	//	}
	//	return false;
	//}
	if (this.seen.length < this.tokens_length) {
		// xx print("seen: "+this.seen);
		// xx print("tokens_length: "+this.tokens_length);
		// xx print("tokens: "+this.tokens.length);
		return true;
	}
	return false;
};

CSL.setMaxVals = function (maxvals) {
	this.maxvals = maxvals;
};


CSL.setMinVal = function (minval) {
	this.minval = minval;
};

CSL.setCheckeratorBase = function (base) {
	var pos, len;
	this.base = base;
	if (! this.mode1_counts) {
		this.mode1_counts = [];
		len = this.base.givens.length;
		for (pos = 0; pos < len; pos += 1) {
			this.mode1_counts.push(0);
		}
	}
};


CSL.setCheckeratorMode = function (mode) {
	this.mode = mode;
};

CSL.checkCheckeratorForClash = function (str, otherstr) {
	if (str === otherstr) {
		if (this.mode === "names" || this.mode === "disambiguate_true") {
			this.clashes += 1;
			//SNIP-START
			if (debug) {
				CSL.debug("   (mode 0 clash, returning true)");
			}
			//SNIP-END
			return true;
		}
		if (this.mode === "givens") {
			this.clashes += 1;
			//SNIP-START
			if (debug) {
				CSL.debug("   (mode 1 clash, returning true)");
			}
			//SNIP-END
			return true;
		}
		return false;
	}
};

CSL.evaluateCheckeratorClashes = function () {
	var namepos, ret, old;
	//
	// necessary for the odd case of static cites with no authors
	if (!this.maxvals.length) {
		return false;
	}
	if (this.mode === "names" || this.mode === "disambiguate_true") {
		if (this.clashes === this.lastclashes) {
			//xxprint("[SAME]");
			// xx print("reset 1");
			this.lastclashes = this.clashes;
			this.clashes = 0;
			return false;
		} else if (this.clashes) {
			//xxprint("[BETTER]: "+this.test_partners+" vs "+this.test_strangers);
			//
			// hasn't cleared in this case, there are still conflicts, BUT
			//
			if (this.test_strangers.length === 1) {
				//xxprint("Oh, Save Me!");
				this.registry.registerAmbigToken(this.akey, this.test_strangers[0], this.base);
				if (this.seen.indexOf(this.test_strangers[0]) === -1) {
					this.seen.push(this.test_strangers[0]);
				}
				this.ids[this.ids.indexOf(this.test_strangers[0])] = false;
			}
			//this.ids[this.pos] = false;
			//this.pos += 1;
			// xx print("reset 2");
			this.lastclashes = this.clashes;
			return false;
		} else {
			//xxprint("[DUNNO]");
			// cleared, so increment.  also quash the id as done.
			this.ids[this.pos] = false;
			this.pos += 1;
			// xx print("reset 2");
			this.lastclashes = this.clashes;
			return true;
		}
	} else

	// compare the clash counts
	// if clash counts not reduced, reverse change in base
	// if clash counts reduced, hold the change steady
	// in the above two cases, just return false.  leave the incementing to the
	// incrementing function
	// if no clashes at all on expanded pass, just return true, it's a wrap
	if (this.mode === "givens") {
		ret = true;
		//SNIP-START
		if (debug) {
			CSL.debug("  ---> Comparing in mode 1: clashes=" + this.clashes + "; lastclashes=" + this.lastclashes);
		}
		//SNIP-END
		namepos = this.mode1_counts[this.modepos];
		if (this.clashes && this.clashes === this.lastclashes) {
			//SNIP-START
			if (debug) {
				CSL.debug("   ---> Applying mode 1 defaults: " + this.mode1_defaults);
			}
			//SNIP-END
			if (this.mode1_defaults && namepos > 0) {
				old = this.mode1_defaults[(namepos - 1)];
				//SNIP-START
				if (debug) {
					CSL.debug("   ---> Resetting to default: (" + old + ")");
				}
				//SNIP-END
				this.base.givens[this.modepos][(namepos - 1)] = old;
			}
			ret = false;
		} else if (this.clashes) {
			//SNIP-START
			if (debug) {
				CSL.debug("   ---> Expanding given name helped a little, retaining it");
			}
			//SNIP-END
			ret = false;
		} else { // only non-clash should be possible
			//SNIP-START
			if (debug) {
				CSL.debug("   ---> No clashes, storing token config and going to next");
			}
			//SNIP-END
			this.mode1_counts = false;
			this.pos += 1;
			ret = true;
		}
		// xx print("Uh-oh.  Resetting clashes: "+this.clashes+" "+this.lastclashes);
		if (this.lastclashes === this.clashes) {
		    // xx print("Nasty hack alert (as if that were necessary, given the state of this code): requesting unwind.");
			this.please_unwind_givens = true;
		}
		this.lastclashes = this.clashes;
		this.clashes = 0;
		if (ret) {
			this.ids[this.pos] = false;
		}
		return ret;
	}
};

CSL.maxCheckeratorAmbigLevel = function (origbase) {
	var pos, len;
	//
	// like the above, necessary for the odd case of static cites with no authors
	if (!this.maxvals.length) {
		return true;
	}

	if (this.mode === "disambiguate_true") {
	//	this.mode = "names";
	//	return true;
		if (this.modes.indexOf("disambiguate_true") < (this.modes.length - 1)) {
			this.mode = this.modes[(this.modes.indexOf("disambiguate_true") + 1)];
			this.modepos = 0;
		} else {
			this.pos += 1;
			return true;
		}
	}

	if (this.mode === "names") {
		//SNIP-START
		if (debug) {
			CSL.debug("CHECK =================> ");
		}
		//SNIP-END
		//xxprint("tokens: "+this.tokens);
		//xxprint("modepos: "+this.modepos);
		//xxprint("base.names.length: "+this.base.names.length);
		//xxprint("base.names[this.modepos]: "+this.base.names[this.modepos]);
		//xxprint("maxvals[this.modepos]: "+this.maxvals[this.modepos]);
		if (this.modepos === (this.base.names.length - 1) && this.base.names[this.modepos] === this.maxvals[this.modepos]) {
			//xxprint("n")
			if (this.modes.length === 2) {
			    if (this.pos === (this.tokens.length -1)) {
					print("n one")
					this.mode = "givens";
					this.mode1_counts[this.modepos] = 0;
					this.modepos = 0;
					this.pos = 0;
				} else {
					print("n other")
					print("test_partners: "+this.test_partners);
					if (this.test_partners.length) {

					}
					print("test_strangers: "+this.test_strangers);
					if (this.test_strangers.length === 0) {
						this.pos += 1;
					}
				}
			} else {
				print("n two")
				this.pos += 1;
				return true;
			}
		}
	} else if (this.mode === "givens") {
		if (this.modepos === (this.mode1_counts.length - 1) && this.mode1_counts[this.modepos] === (this.maxvals[this.modepos])) {
			//SNIP-START
			if (debug) {
				CSL.debug("-----  Item maxed out -----");
			}
			//SNIP-END
			if (this.modes.length === 2) {
				// xx print("g one");
				// xx print("tokens: "+this.tokens)
				// xx print("pos: "+this.pos)
				// xx print(this.seen)
				// xx print("modepos: "+this.modepos)
				// xx print("mode1_counts length: "+this.mode1_counts.length)
				// xx print("mode1_counts: "+this.mode1_counts)
				// xx print("this.maxvals[this.modepos]: "+this.maxvals[this.modepos])

				this.mode = "givens";
				if (this.pos === (this.tokens.length - 1)) {
					// xx print("a")
					this.pos = 0;
					//return true;
				} else {
					// xx print("b")

					var token = this.tokens[this.pos];
					// xx print("clashes: "+this.clashes);
					// xx print("lastclashes: "+this.lastclashes);
					if (this.please_unwind_givens) {
						// xx print("decrementing?");
						this.base = CSL.decrementCheckeratorGivenNames.call(this.registry, this.state, this.base, origbase, token.id);
						// xx print("GOT: "+this.base.givens);
						this.please_unwind_givens = false;
					}
					this.registry.registerAmbigToken(this.akey, token.id, this.base);
					if (this.seen.indexOf(token.id) === -1) {
						this.seen.push(token.id);
					}
					this.maxed_out_bases[token.id] = CSL.cloneAmbigConfig(this.base);
					this.pos += 1;
					this.modepos = 0;
					this.mode1_counts[this.modepos] = 0;

					// Can we identify fellow maxers at this point?
					// xx print("Q: Can we identify fellow maxers at this point?");
					// xx print("A: Yes.");
					// xx print(this.test_partners);

					for (pos = 0, len = this.test_partners.length; pos < len; pos += 1) {
						this.registry.registerAmbigToken(this.akey, this.test_partners[pos], this.base);
						if (this.seen.indexOf(this.test_partners[pos]) === -1) {
							this.seen.push(this.test_partners[pos]);
						}
						this.maxed_out_bases[this.test_partners[pos]] = CSL.cloneAmbigConfig(this.base);
					}
					return false;
				}

			} else {
				// xx print("g two")
				this.pos += 1;
			}
			return true;
			//this.ids[this.pos] = false;
		}
	}
	//xxprint("return false");
	return false;
};


/**
 * Increment disambiguation level
 */
CSL.incrementCheckeratorAmbigLevel = function () {
	var val;
	//
	// this is a little tricky.  the counters are arrays.
	// ... and for mode 1, this only gives us the position,
	// not the values of the array of booleans, which of
	// course are not subject to incrementing in this
	// sense.
	if (this.mode === "names") {
		this.given_name_second_pass = false;
		val = this.base.names[this.modepos];
		if (val < this.maxvals[this.modepos]) {
			this.base.names[this.modepos] += 1;
		} else if (this.modepos < (this.base.names.length - 1)) {
			this.modepos += 1;
			this.base.names[this.modepos] = 0;
		}
	}
	if (this.mode === "givens") {
		val = (this.mode1_counts[this.modepos]);
		if (val < this.maxvals[this.modepos]) {
			if (this.given_name_second_pass) {
				//SNIP-START
				if (debug) {
					CSL.debug(" ** second pass");
				}
				//SNIP-END
				this.given_name_second_pass = false;
				this.mode1_counts[this.modepos] += 1;
				this.base.givens[this.modepos][val] += 1;
				//SNIP-START
				if (debug) {
					CSL.debug("   ---> (A) Setting expanded givenname param with base: " + this.base.givens);
				}
				//SNIP-END
			} else {
				this.mode1_defaults = this.base.givens[this.modepos].slice();
				//SNIP-START
				if (debug) {
					CSL.debug(" ** first pass");
				}
				//SNIP-END
				this.given_name_second_pass = true;
			}
		} else if (this.modepos < (this.base.givens.length - 1)) {
			this.modepos += 1;
			this.base.givens[this.modepos][0] += 1;
			this.mode1_defaults = this.base.givens[this.modepos].slice();
			//SNIP-START
			if (debug) {
				CSL.debug("   ---> (B) Set expanded givenname param with base: " + this.base.givens);
			}
			//SNIP-END
		} else {
			this.mode = "names";
			this.pos += 1;
		}
	}
};

CSL.decrementCheckeratorGivenNames = function (state, base, origbase, id) {
	var base_return, ids, pos, len;
	ids = this.checkerator.ids;
	//
	// Maybe.  Might need a toggle for this.
	//
	//this.checkerator.ids = ids.slice(0,ids.indexOf(id)).concat(ids.slice(ids.indexOf(id) + 1));
	base_return = CSL.cloneAmbigConfig(base);
	for (pos = 0, len = base_return.givens.length; pos < len; pos += 1) {
		base_return.givens[pos] = origbase.givens[pos].slice();
	}
	return base_return;
};

CSL.decrementCheckeratorNames = function (state, base, origbase, id) {
	var base_return, do_me, i, j, pos, len, ppos, llen, ids;
	// two reverse scans, one to determine if there are any expanded
	// names to stop the unwind, and another to perform the
	// unwind
	base_return = CSL.cloneAmbigConfig(base);
	do_me = false;
	len = base_return.givens.length - 1;
	for (pos = len; pos > -1; pos += -1) {
		llen = base_return.givens[pos].length - 1;
		for (ppos = llen; ppos > -1; ppos += -1) {
			if (base_return.givens[pos][ppos] > origbase.givens[pos][ppos]) {
				do_me = true;
			}
		}
	}
	if (do_me) {
		ids = this.checkerator.ids;
		len = base_return.givens.length - 1;
		for (pos = len; pos > -1; pos += -1) {
			llen = base_return.givens[pos].length - 1;
			for (ppos = llen; ppos > -1; ppos += -1) {
				if (base_return.givens[pos][ppos] > origbase.givens[pos][ppos]) {
					if (ids.indexOf(id) > -1) {
						this.checkerator.ids = ids.slice(0,ids.indexOf(id)).concat(ids.slice(ids.indexOf(id) + 1));
					}
					break;
				}
				// Be careful to treat the givens and names
				// arrays in step.  Fixes bug affecting
				// disambiguate_AllNamesBaseNameCountOnFailureIfYearSuffixAvailable
				if (ppos < base_return.names[pos]) {
					base_return.names[pos] += -1;
				}
			}
		}
	}
	return base_return;
};

/**
 * Return current base configuration for disambiguation
 */
CSL.getAmbigConfig = function () {
	var config, ret;
	config = this.tmp.disambig_request;
	if (!config) {
		config = this.tmp.disambig_settings;
	}
	ret = CSL.cloneAmbigConfig(config);
	return ret;
};

/**
 * Return max values for disambiguation
 */
CSL.getMaxVals = function () {
	return this.tmp.names_max.mystack.slice();
};

/**
 * Return min value for disambiguation
 */
CSL.getMinVal = function () {
	return this.tmp["et-al-min"];
};

/**
 * Return available modes for disambiguation
 */
CSL.getModes = function () {
	var ret, dagopt, gdropt;
	ret = [];
	if (this[this.tmp.area].opt["disambiguate-add-names"]) {
		ret.push("names");
	}
	dagopt = this[this.tmp.area].opt["disambiguate-add-givenname"];
	gdropt = this[this.tmp.area].opt["givenname-disambiguation-rule"];
	//
	// Use by-cite disambiguation for everything, for starters.
	//
	// hmm.  don't need any name expansion with the primary-name
	// disambiguate-add-givenname, so no givens in that case.
	if (dagopt) {
		if (!gdropt || ("string" === typeof gdropt && "primary-name" !== gdropt.slice(0, 12))) {
			ret.push("givens");
		}
	}
	return ret;
};

