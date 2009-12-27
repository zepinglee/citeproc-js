/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
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


CSL.Output.Formatters.strip_periods = function(state,string) {
    return string.replace(/\./g," ").replace(/\s*$/g,"").replace(/\s+/g," ");
};


/**
 * A noop that just delivers the string.
 */
CSL.Output.Formatters.passthrough = function(state,string){
	return string;
};

/**
 * Force all letters in the string to lowercase.
 */
CSL.Output.Formatters.lowercase = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_USEALL);
	str.string = str.string.toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force all letters in the string to uppercase.
 */
CSL.Output.Formatters.uppercase = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_USEALL);
	str.string = str.string.toUpperCase();
	var ret = CSL.Output.Formatters.undoppelString(str);
	return ret;
};


/**
 * Force capitalization of the first letter in the string, leave
 * the rest of the characters untouched.
 */
CSL.Output.Formatters["capitalize-first"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
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
CSL.Output.Formatters["sentence"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	str.string = str.string[0].toUpperCase()+str.string.substr(1).toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force the first letter of each space-delimited
 * word in the string to uppercase, and force remaining
 * letters to lowercase.  Single characters are forced
 * to uppercase.
 */
CSL.Output.Formatters["capitalize-all"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	var strings = str.string.split(" ");
	var l = strings.length;
	for(var i=0; i<l; i++) {
		if(strings[i].length > 1) {
            strings[i] = strings[i][0].toUpperCase()+strings[i].substr(1).toLowerCase();
        } else if(strings[i].length == 1) {
            strings[i] = strings[i].toUpperCase();
        }
    }
	str.string = strings.join(" ");
	return CSL.Output.Formatters.undoppelString(str);
};

/**
 * A complex function that attempts to produce a pattern
 * of capitalization appropriate for use in a title.
 * Will not touch words that have some capitalization
 * already.
 */
CSL.Output.Formatters["title"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	if (!string) {
		return "";
	}

	// split words
	var words = str.string.split(/(\s+)/);
	var isUpperCase = str.string.toUpperCase() == string;

	var newString = "";
	var delimiterOffset = words[0].length;
	var lastWordIndex = words.length-1;
	var previousWordIndex = -1;
	for(var i=0; i<=lastWordIndex;  i += 2) {
		// only do manipulation if not a delimiter character
		if(words[i].length != 0 && (words[i].length != 1 || !/\s+/.test(words[i]))) {
			var upperCaseVariant = words[i].toUpperCase();
			var lowerCaseVariant = words[i].toLowerCase();

				// only use if word does not already possess some capitalization
				if(isUpperCase || words[i] == lowerCaseVariant) {
					if(
						// a skip word
						CSL.SKIP_WORDS.indexOf(lowerCaseVariant.replace(/[^a-zA-Z]+/, "")) != -1
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
	}
	str.string = words.join("");
	return CSL.Output.Formatters.undoppelString(str);
};

CSL.Output.Formatters.doppelString = function(string,rex){
	var ret = new Object();
	ret.array = string.split(rex);
	ret.string = "";
	var l = ret.array.length;
	for (var i=0; i<l; i += 2){
		ret.string += ret.array[i];
	};
	return ret;
};


CSL.Output.Formatters.undoppelString = function(str){
	var ret = "";
	var l = str.array.length;
	for (var i=0; i<l; i += 1){
		if ((i%2)){
			ret += str.array[i];
		} else {
			ret += str.string.slice(0,str.array[i].length);
			str.string = str.string.slice(str.array[i].length);
		};
	};
	return ret;
};
