/*global CSL: true */

/**
 * A bundle of handy functions for text processing.
 * <p>Several of these are ripped off from various
 * locations in the Zotero source code.</p>
 * @namespace Toolkit of string functions
 */
CSL.Output.Formatters = {};

CSL.getSafeEscape = function(state) {
    if (["bibliography", "citation"].indexOf(state.tmp.area) > -1) {
        // Callback to apply thin space hack
        // Callback to force LTR/RTL on parens and braces
        var callbacks = [];
        if (state.opt.development_extensions.thin_non_breaking_space_html_hack && state.opt.mode === "html") {
            callbacks.push(function (txt) {
                return txt.replace(/\u202f/g, '<span style="white-space:nowrap">&thinsp;</span>');
            });
        }
        if (callbacks.length) {
            return function (txt) {
                for (var i = 0, ilen = callbacks.length; i < ilen; i += 1) {
                    txt = callbacks[i](txt);
                }
                return CSL.Output.Formats[state.opt.mode].text_escape(txt);
            }
        } else {
            return CSL.Output.Formats[state.opt.mode].text_escape;
        }
    } else {
        return function (txt) { return txt; };
    }
};

// See util_substitute.js and queue.js (append) for code supporting
// strip-periods.
//CSL.Output.Formatters.strip_periods = function (state, string) {
//    return string.replace(/\./g, "");
//};


/**
 * A noop that just delivers the string.
 */
CSL.Output.Formatters.passthrough = function (state, string) {
    return string;
};

/**
 * Force all letters in the string to lowercase.
 */
CSL.Output.Formatters.lowercase = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_USEALL);
    str.string = str.string.toLowerCase();
    return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force all letters in the string to uppercase.
 */
CSL.Output.Formatters.uppercase = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_USEALL);
    str.string = str.string.toUpperCase();
    return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force capitalization of the first letter in the string, leave
 * the rest of the characters untouched.
 */
CSL.Output.Formatters["capitalize-first"] = function (state, string) {
    var obj = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    var str = obj.string;
    for (var j=0,jlen=str.length;j<jlen;j++) {
        if (str.charAt(j).toLowerCase() !== str.charAt(j).toUpperCase()) {
            obj.string = str.slice(0,j) + str.charAt(j).toUpperCase() + str.slice(j+1);
            break
        }
    }
    return CSL.Output.Formatters.undoppelString(obj);
};


/**
 * Similar to <b>capitalize_first</b>, but force the
 * subsequent characters to lowercase.
 */
CSL.Output.Formatters.sentence = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    str.string = str.string.slice(0, 1).toUpperCase() + str.string.substr(1).toLowerCase();
    return CSL.Output.Formatters.undoppelString(str);
};


/**
 * Force the first letter of each space-delimited
 * word in the string to uppercase, and leave the remainder
 * of the string untouched.  Single characters are forced
 * to uppercase.
 */
CSL.Output.Formatters["capitalize-all"] = function (state, string) {
    var str = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    var strings = str.string.split(" ");
    for (var i = 0, ilen = strings.length; i < ilen; i += 1) {
        if (strings[i].length > 1) {
			if (state.opt.development_extensions.allow_force_lowercase) {
				strings[i] = strings[i].slice(0, 1).toUpperCase() + strings[i].substr(1).toLowerCase();
			} else {
				strings[i] = strings[i].slice(0, 1).toUpperCase() + strings[i].substr(1);
			}
        } else if (strings[i].length === 1) {
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

// ZZZ Right. So let's restore the treatment of the string as an array.
// ZZZ It will need to be a *copy* of the array, to restore the original
// ZZZ casing when interpreting quotation marks.

CSL.Output.Formatters.title = function (state, string) {
    var str, words, isAllUpperCase, newString, lastWordIndex, previousWordIndex, upperCaseVariant, lowerCaseVariant, pos, skip, notfirst, notlast, aftercolon, len, idx, tmp, skipword, ppos, mx, lst, myret;
    var SKIP_WORDS = state.locale[state.opt.lang].opts["skip-words"];
    if (!string) {
        return "";
    }

    function capitalise (word, force) {
        // Weird stuff is (.) transpiled with regexpu
        //   https://github.com/mathiasbynens/regexpu
        var m = word.match(/([:?!]+\s+|-|^\s*)((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))(.*)/);
        // Do not uppercase lone Greek letters
        // (This may not be a good thing when setting Greek-language citations)
        if (m && !(m[2].match(/^[\u0370-\u03FF]$/) && !m[3])) {
            return m[1] + m[2].toUpperCase() + m[3];
        }
        return word;
    }
    // So ... right. Rethink.
    // First separate tags from strings (as doppel.tags and doppel.strings)
    var doppel = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE);
    
    print(JSON.stringify(doppel, null, 2))


    // Set up initial state params
    var tagParams = {
        "<span class=\"nocase\">": "</span>",
        "<span class=\"nodecor\">": "</span>"
    }
    var tagState = [];
    var quoteParams = {
        " \"": {
            opener: " \'",
            closer: "\""
        },
        " \'": {
            opener: " \"",
            closer: "\'"
        }
    }
    var quoteState = [];
    function quoteFix (tag, positions) {
        var m = tag.match(/(^(?:\"|\')|(?: \"| \')$)/);
        if (m) {
            return pushQuoteState(m[1], positions);
        }
    }
    function pushQuoteState(tag, pos) {
        var isOpener = [" \"", " \'"].indexOf(tag) > -1 ? true : false;
        if ((quoteState.length === 0 && isOpener) || quoteState.length > 0) {
            if (isOpener) {
                return tryOpen(tag, pos);
            } else {
                return tryClose(tag, pos);
            }
        }
    }
    function tryOpen(tag, pos) {
        if (quoteState.length === 0 || tag === quoteState[quoteState.length - 1].opener) {
            quoteState.push({
                opener: quoteParams[tag].opener,
                closer: quoteParams[tag].closer,
                pos: pos
            });
            return false;
        } else {
            var prevPos = quoteState[quoteState.length-1].pos;
            quoteState.pop()
            quoteState.push({
                opener: quoteParams[tag].opener,
                closer: quoteParams[tag].closer,
                positions: pos
            });
            return prevPos;
        }
    }
    function tryClose(tag, pos) {
        if (tag === quoteState[quoteState.length - 1].closer) {
            quoteState.pop()
            //return false;
        } else {
            print("BAD CLOSER! " + pos);
            return pos;
            // Bad closer will have no space in string, so no casing anomaly.
            // print("  Fix bad closer at this pos");
        }
    }
    var quoteState = [];
    var isFirst = true;
    var afterPunct = false;
    var skipWordsRex = state.locale[state.opt.lang].opts["skip-words-regexp"];
    // Run state machine
    for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
        var tag = doppel.tags[i];
        var str = doppel.strings[i+1];

        // Evaluate tag state for current string
        if (tagParams[tag]) {
            tagState.push(tagParams[tag]);
        } else if (tagState.length && tag === tagState[tagState.length - 1]) {
            tagState.pop();
        }

        // Evaluate punctuation state of current string
        if (tag.match(/[\!\?\:]$/)) {
            afterPunct = true;
        }

        // Process if outside tag scope, else noop for upper-casing
        if (tagState.length === 0) {
            print("OUTSIDE: " + str);
            // Capitalize every word that is not a stop-word
            var words = str.split(" ");
            for (var j=0,jlen=words.length;j<jlen;j++) {
                var word = words[j];
                print("*** word=("+word+") "+ word.toLowerCase().match(skipWordsRex));
                if (word && !word.toLowerCase().match(skipWordsRex)) {
                    words[j] = capitalise(words[j]);
                }
            }
            doppel.strings[i+1] = words.join(" ");
            if (isFirst && str.trim()) {
                print("  First-word cap");
                // Capitalize the word
            }
            if (afterPunct && str.trim()) {
                print("  After-punct cap");
                // Capitalize the word
            }
        } else {
            print("INSIDE: " + str);
        }

        // Evaluate quote state of current string and fix chars that have flown
        var quotePos = quoteFix(tag, i);
        if (quotePos) {
            var origChar = doppel.origStrings[quotePos+1].slice(0, 1);
            doppel.strings[quotePos+1] = origChar + doppel.origStrings[quotePos+1].slice(1);
            print("*** FIXED WITH (" + origChar + ")");
        }

        // If there was a printable string, unset first-word and after-punctuation
        if (str.trim()) {
            if (isFirst) {
                isFirst = false;
            }
            if (afterPunct) {
                afterPunct = false;
            }
        }
    }
    // Capitalize the last word
    // Recombine the string
    print(string);

    //var lst = splitme(str, state.locale[state.opt.lang].opts["skip-words-regexp"]);
/*
    // Move this to a function after review
    for (var i=0,ilen=lst.length;i<ilen;i+=2) {
        var words = lst[i].split(/([:?!]*\s+|\/|-)/);
        // Inspect each word individually
        for (var k=0,klen=words.length;k<klen;k+=2) {
            // Word has length
            if (words[k].length !== 0) {
                //print("Word: ("+words[k]+")");
                upperCaseVariant = words[k].toUpperCase();
                lowerCaseVariant = words[k].toLowerCase();
                // Always leave untouched if word contains a number
                if (words[k].match(/[0-9]/)) {
                    continue;
                }
                // Transform word only if all lowercase
                if (words[k] === lowerCaseVariant) {
                    words[k] = capitalise(words[k]);
                }
            }
        }
        lst[i] = words.join("");
    }
    doppel.string = lst.join("");
*/

// Step through the non-string elements of the array here on undoppel,
// noting open- and close-quotes, and restoring case of characters following
// any non-opening "open-quote."

//print(JSON.stringify(doppel.array, null, 2));

    var ret = CSL.Output.Formatters.undoppelString(doppel);
print("OK " + ret);
    return ret;
};

/*
* Based on a suggestion by Shoji Kajita.
*/
CSL.Output.Formatters.doppelString = function (str) {
    var mx, lst, len, pos, m, buf1, buf2, idx, ret, myret;
    // Normalize markup
    str = str.replace(/(<span)\s+(class=\"no(?:case|decor)\")[^>]*(>)/g, "$1 $2$3");
    // Split and match
    var m1match = str.match(/((?: \"| \'|\"|\'|[-.,;?!:]|\[|\]|\(|\)|<span class=\"no(?:case|decor)\">|<\/span>|<\/?(?:i|sc|b|sub|sup)>))/g);
    if (!m1match) {
        return {
            tags: [],
            strings: [str]
        };
    }
    var m1split = str.split(/(?: \"| \'|\"|\'|[-.,;?!:]|\[|\]|\(|\)|<span class=\"no(?:case|decor)\">|<\/span>|<\/?(?:i|sc|b|sub|sup)>)/g);
    
    return {
        tags: m1match,
        strings: m1split,
        origStrings: m1split.slice()
    }
}

CSL.Output.Formatters.undoppelString = function (obj) {
    var ret, len, pos;
    lst = [];
    var lst = obj.strings.slice(-1);
    for (var i=obj.tags.length-1; i>-1; i+=-1) {
        lst.push(obj.tags[i]);
        lst.push(obj.strings[i]);
    }
    lst.reverse();
    return lst.join("");
};


CSL.Output.Formatters.serializeItemAsRdf = function (Item) {
    return "";
};


CSL.Output.Formatters.serializeItemAsRdfA = function (Item) {
    return "";
};


CSL.demoteNoiseWords = function (state, fld, drop_or_demote) {
    var SKIP_WORDS = state.locale[state.opt.lang].opts["leading-noise-words"];
    if (fld && drop_or_demote) {
        fld = fld.split(/\s+/);
        fld.reverse();
        var toEnd = [];
        for (var j  = fld.length - 1; j > -1; j += -1) {
            if (SKIP_WORDS.indexOf(fld[j].toLowerCase()) > -1) {
                toEnd.push(fld.pop());
            } else {
                break;
            }
        }
        fld.reverse();
        var start = fld.join(" ");
        var end = toEnd.join(" ");
        if ("drop" === drop_or_demote || !end) {
            fld = start;
        } else if ("demote" === drop_or_demote) {
            fld = [start, end].join(", ");
        }
    }
    return fld;
};

// Nearly there!
// Need to iterate over all multi keys somehow, here or in a calling loop ...
CSL.extractTitleAndSubtitle = function (Item) {
    var segments = ["", "container-"];
    for (var i=0,ilen=segments.length;i<ilen;i++) {
        var seg = segments[i];
        var title = CSL.TITLE_FIELD_SPLITS(seg);
        var langs = [false];
        if (Item.multi) {
            for (var lang in Item.multi._keys[title.short]) {
                langs.push(lang);
            }
        }
        for (var j=0,jlen=langs.length;j<ilen;j++) {
            var lang = langs[j];
            var vals = {};
            if (lang) {
                if (Item.multi._keys[title.title]) {
                    vals[title.title] = Item.multi._keys[title.title][lang];
                }
                if (Item.multi._keys[title["short"]]) {
                    vals[title["short"]] = Item.multi._keys[title["short"]][lang];
                }
            } else {
                vals[title.title] = Item[title.title];
                vals[title["short"]] = Item[title["short"]];
            }
            vals[title.main] = vals[title.title];
            vals[title.sub] = false;
            if (vals[title.title] && vals[title["short"]]) {
                var shortTitle = vals[title["short"]];
                offset = shortTitle.length;
                if (vals[title.title].slice(0,offset) === shortTitle && vals[title.title].slice(offset).match(/^\s*:/)) {
                    vals[title.main] = vals[title.title].slice(0,offset).replace(/\s+$/,"");
                    vals[title.sub] = vals[title.title].slice(offset).replace(/^\s*:\s*/,"");
                }
            }
            if (lang) {
                for (var key in vals) {
                    if (!Item.multi._keys[key]) {
                        Item.multi._keys[key] = {};
                    }
                    Item.multi._keys[key][lang] = vals[key];
                }
            } else {
                for (var key in vals) {
                    Item[key] = vals[key];
                }
            }
        }
    }
}

CSL.titlecaseSentenceOrNormal = function(state, Item, seg, lang, sentenceCase) {
    var title = CSL.TITLE_FIELD_SPLITS(seg);
    var vals = {};
    if (lang && Item.multi) {
        if (Item.multi._keys[title.title]) {
            vals[title.title] = Item.multi._keys[title.title][lang];
        }
        if (Item.multi._keys[title.main]) {
            vals[title.main] = Item.multi._keys[title.main][lang];
        }
        if (Item.multi._keys[title.sub]) {
            vals[title.sub] = Item.multi._keys[title.sub][lang];
        }
    } else {
        vals[title.title] = Item[title.title];
        vals[title.main] = Item[title.main];
        vals[title.sub] = Item[title.sub];
    }
    if (vals[title.main] && vals[title.sub]) {
        var mainTitle = vals[title.main];
        var subTitle = vals[title.sub];
        if (sentenceCase) {
            mainTitle = CSL.Output.Formatters.sentence(state, mainTitle);
            subTitle = CSL.Output.Formatters.sentence(state, subTitle);
        } else {
            subTitle = CSL.Output.Formatters["capitalize-first"](state, subTitle);
        }
        return [mainTitle, subTitle].join(vals[title.title].slice(mainTitle.length, -1 * subTitle.length));
    } else {
        if (sentenceCase) {
            return CSL.Output.Formatters.sentence(state, vals[title.title]);
        } else {
            return vals[title.title];
        }
    }
}
