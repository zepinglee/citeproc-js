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
dojo.provide("csl.formatters");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * A bundle of handy functions for text processing.
 * <p>Several of these are ripped off from various
 * locations in the Zotero source code.</p>
 * @namespace Toolkit of string functions
 */
CSL.Output.Formatters = new function(){};


/**
 * A noop that just delivers the string.
 */
CSL.Output.Formatters.passthrough = function(state,string){
	return string;
};

//
// XXXXX
// A bit of interest coming up with vertical-align.
// This needs to include the prefixes and suffixes
// in its scope, so it's applied last, AFTER they
// are appended to the string.  I think it's the
// only one that will need to work that way.


/**
 * Force all letters in the string to lowercase.
 */
CSL.Output.Formatters.lowercase = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string);
	str.string = str.string.toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force all letters in the string to uppercase.
 */
CSL.Output.Formatters.uppercase = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string);
	str.string = str.string.toUpperCase();
	return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force capitalization of the first letter in the string, leave
 * the rest of the characters untouched.
 */
CSL.Output.Formatters.capitalize_first = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string);
	if (str.string.length){
		str.string = str.string[0].toUpperCase()+str.string.substr(1);
		return CSL.Output.Formatters.undoppelString(str);
	} else {
		return "";
	}
};


/**
 * Similar to <b>capitalize_first</b>, but force the
 * subsequent characters to lowercase.
 */
CSL.Output.Formatters.sentence_capitalization = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string);
	str.string = str.string[0].toUpperCase()+str.string.substr(1).toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force the first letter of each space-delimited
 * word in the string to uppercase, and force remaining
 * letters to lowercase.  Single characters are forced
 * to uppercase.
 */
CSL.Output.Formatters.capitalize_all = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string);
	var strings = str.string.split(" ");
	for(var i=0; i<strings.length; i++) {
		if(strings[i].length > 1) {
            strings[i] = strings[i][0].toUpperCase()+strings[i].substr(1).toLowerCase();
        } else if(strings[i].length == 1) {
            strings[i] = strings[i].toUpperCase();
        }
    }
	str.string = strings.join(" ");
	return CSL.Output.Formatters.undoppelString(str);
};

CSL.Output.Formatters.strip_periods = function(state,string) {
    return string.replace(/\./g," ").replace(/\s*$/g,"").replace(/\s+/g," ");
};

/**
 * A complex function that attempts to produce a pattern
 * of capitalization appropriate for use in a title.
 * Will not touch words that have some capitalization
 * already; to force reformatting, convert the string
 * to all uppercase or lowercase before passing it to
 * this function.
 */
CSL.Output.Formatters.title_capitalization = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string);
	if (!string) {
		return "";
	}

	// split words
	var words = string.split(delimiterRegexp);
	var isUpperCase = string.toUpperCase() == string;

	var newString = "";
	var delimiterOffset = words[0].length;
	var lastWordIndex = words.length-1;
	var previousWordIndex = -1;
	for(var i=0; i<=lastWordIndex; i++) {
		// only do manipulation if not a delimiter character
		if(words[i].length != 0 && (words[i].length != 1 || !delimiterRegexp.test(words[i]))) {
			var upperCaseVariant = words[i].toUpperCase();
			var lowerCaseVariant = words[i].toLowerCase();

				// only use if word does not already possess some capitalization
				if(isUpperCase || words[i] == lowerCaseVariant) {
					if(
						// a skip word
						skipWords.indexOf(lowerCaseVariant.replace(/[^a-zA-Z]+/, "")) != -1
						// not first or last word
						&& i != 0 && i != lastWordIndex
						// does not follow a colon
						&& (previousWordIndex == -1 || words[previousWordIndex][words[previousWordIndex].length-1] != ":")
					) {
							words[i] = lowerCaseVariant;
					} else {
						// this is not a skip word or comes after a colon;
						// we must capitalize
						words[i] = upperCaseVariant[0] + lowerCaseVariant.substr(1);
					}
				}
				previousWordIndex = i;
		}

		newString += words[i];
	}
	return newString;
};



CSL.Output.Formatters.doppelString = function(string){
	var ret = new Object();
	ret.array = string.split(/(<ok>.*?<\/ok>)|<[^>]+>/);
	ret.string = "";
	for (var i=0; i<ret.array.length; i += 2){
		ret.string += ret.array[i];
	};
	return ret;
};

CSL.Output.Formatters.undoppelString = function(str){
	var ret = "";
	for (var i=0; i<str.array.length; i += 1){
		if ((i%2)){
			ret += str.array[i];
		} else {
			ret += str.string.slice(0,str.array[i].length);
			str.string = str.string.slice(str.array[i].length);
		};
	};
	return ret;
};
