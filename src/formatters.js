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
	//
	// XXXXX
	// this listiness in lowercase and uppercase should
	// be handled when decorations are applied; these
	// functions should not have to worry about it.
	// XXXXX
	// the listiness stuff can go away now.
	if ("object" == typeof string){
		var ret = new Array();
		for each (item in string){
			ret.push(item.LowerCase());
		}
		return ret;
	}
	return string.LowerCase();
};


/**
 * Force all letters in the string to uppercase.
 */
CSL.Output.Formatters.uppercase = function(state,string) {
	if ("object" == typeof string){
		var ret = new Array();
		for each (item in string){
			ret.push(item.toUpperCase());
		}
		return ret;
	}
	return string.toUpperCase();
};


/**
 * Force capitalization of the first letter in the string, leave
 * the rest of the characters untouched.
 */
CSL.Output.Formatters.capitalize_first = function(state,string) {
	if (string.length){
		return string[0].toUpperCase()+string.substr(1);
	} else {
		return "";
	}
};


/**
 * Similar to <b>capitalize_first</b>, but force the
 * subsequent characters to lowercase.
 */
CSL.Output.Formatters.sentence_capitalization = function(state,string) {
	return string[0].toUpperCase()+string.substr(1).toLowerCase();
};


/**
 * Force the first letter of each space-delimited
 * word in the string to uppercase, and force remaining
 * letters to lowercase.  Single characters are forced
 * to uppercase.
 */
CSL.Output.Formatters.capitalize_all = function(state,string) {
	var strings = string.split(" ");
	for(var i=0; i<strings.length; i++) {
		if(strings[i].length > 1) {
            strings[i] = strings[i][0].toUpperCase()+strings[i].substr(1).toLowerCase();
        } else if(strings[i].length == 1) {
            strings[i] = strings[i].toUpperCase();
        }
    }
	return strings.join(" ");
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


