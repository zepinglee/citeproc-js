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

CSL.Util.LongOrdinalizer = function () {};

CSL.Util.LongOrdinalizer.prototype.init = function (state) {
	this.state = state;
	this.names = {};
	for (var i = 1; i < 10; i += 1) {
		this.names[("" + i)] = state.getTerm(("long-ordinal-0" + i));
	}
	this.names["10"] = state.getTerm("long-ordinal-10");

};

CSL.Util.LongOrdinalizer.prototype.format = function (num) {
	var ret = this.names[("" + num)];
	if (!ret) {
		ret = this.state.fun.ordinalizer.format(num);
	}
	return ret;
};


CSL.Util.Ordinalizer = function () {};

CSL.Util.Ordinalizer.prototype.init = function (state) {
	this.suffixes = [];
	for (var i = 1; i < 5; i += 1) {
		this.suffixes.push(state.getTerm(("ordinal-0" + i)));
	}
};

CSL.Util.Ordinalizer.prototype.format = function (num) {
	var str;
	num = parseInt(num, 10);
	str = num.toString();
	if ((num / 10) % 10 === 1) {
		str += this.suffixes[3];
	} else if (num % 10 === 1) {
		str += this.suffixes[0];
	} else if (num % 10 === 2) {
		str += this.suffixes[1];
	} else if (num % 10 === 3) {
		str += this.suffixes[2];
	} else {
		str += this.suffixes[3];
	}
	return str;
};

CSL.Util.Romanizer = function () {};

CSL.Util.Romanizer.prototype.format = function (num) {
	var ret, pos, n, numstr, len;
	ret = "";
	if (num < 6000) {
		numstr = num.toString().split("");
		numstr.reverse();
		pos = 0;
		n = 0;
		len = numstr.length;
		for (pos = 0; pos < len; pos += 1) {
			n = parseInt(numstr[pos], 10);
			ret = CSL.ROMAN_NUMERALS[pos][n] + ret;
		}
	}
	return ret;
};


/**
 * Create a suffix formed from a list of arbitrary characters of arbitrary length.
 * <p>This is a <i>lot</i> harder than it seems.</p>
 */
CSL.Util.Suffixator = function (slist) {
	if (!slist) {
		slist = CSL.SUFFIX_CHARS;
	}
	this.slist = slist.split(",");
};

/**
 * The format method.
 * <p>This method is used in generating ranges.  Every numeric
 * formatter (of which Suffixator is one) must be an instantiated
 * object with such a "format" method.</p>
 */

CSL.Util.Suffixator.prototype.format = function (num) {
	var suffixes = this.get_suffixes(num);
	return suffixes[(suffixes.length - 1)];
};

CSL.Util.Suffixator.prototype.get_suffixes = function (num) {
	var suffixes, digits, chrs, pos, len, llen, ppos;
	num = parseInt(num, 10);
	suffixes = [];

	for (pos = 0; pos <= num; pos += 1) {
		if (!pos) {
			suffixes.push([0]);
		} else {
			suffixes.push(this.incrementArray(suffixes[(suffixes.length - 1)], this.slist));
		}
	}
	len = suffixes.length;
	for (pos = 0; pos < len; pos += 1) {
		digits = suffixes[pos];
		chrs = "";
		llen = digits.length;
		for (ppos = 0; ppos < llen; ppos += 1) {
			chrs = chrs + this.slist[digits[ppos]];
		}
		suffixes[pos] = chrs;
	}
	return suffixes;
};


CSL.Util.Suffixator.prototype.incrementArray = function (array) {
	var incremented, newdigit, i, pos, len, ppos, llen;
	array = array.slice();
	incremented = false;
	len = array.length - 1;
	for (pos = len; pos > -1; pos += -1) {
		if (array[pos] < (this.slist.length - 1)) {
			array[pos] += 1;
			// zero out everything to the right of the
			// incremented element
			for (ppos = (pos + 1), llen = array.length; ppos < llen; ppos += 1) {
				array[ppos] = 0;
			}
			incremented = true;
			break;
		}
	}
	if (!incremented) {
		len = array.length;
		for (pos = 0; pos < len; pos += 1) {
			array[pos] = 0;
		}
		newdigit = [0];
		array = newdigit.concat(array);
	}
	return array;
};
