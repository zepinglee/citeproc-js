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
CSL.Output.Formatters.title = function (state, string) {
    var str, words, isAllUpperCase, newString, lastWordIndex, previousWordIndex, upperCaseVariant, lowerCaseVariant, pos, skip, notfirst, notlast, aftercolon, len, idx, tmp, skipword, ppos, mx, lst, myret;
    var SKIP_WORDS = state.locale[state.opt.lang].opts["skip-words"];
    if (!string) {
        return "";
    }
    var doppel = CSL.Output.Formatters.doppelString(string, CSL.TAG_ESCAPE, SKIP_WORDS);
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
    function splitme (str, rex) {
        var m = str.match(rex);
        if (m) {
            var splits = str.split(rex);
            res = [splits[0]];
            for (var i=0; i<m.length; i++) {
                res.push(m[i]);
                res.push(splits[i+1]);
            }
        } else {
            res = [str];
        }
        return res;
    }
    // Split on skip words
    var str = doppel.string;
    var lst = splitme(str, state.locale[state.opt.lang].opts["skip-words-regexp"]);

    // Capitalise stop-words that occur after a colon
    for (i=1,ilen=lst.length;i<ilen;i+=2) {
        if (lst[i].match(/^[:?!]/)) {
            lst[i] = capitalise(lst[i]);
        }
    }
    // Capitalise stop-words if they are the first or last words
    if (!lst[0] && lst[1]) {
        lst[1] = capitalise(lst[1]);
    }
    if (lst.length > 2 && !lst[lst.length-1]) {
        lst[lst.length-2] = capitalise(lst[lst.length-2]);
    }
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
                    //print("   do: "+capitalise(words[k]));
                    words[k] = capitalise(words[k]);
                }
            }
        }
        lst[i] = words.join("");
    }
    doppel.string = lst.join("");

// Step through the non-string elements of the array here on undoppel,
// noting open- and close-quotes, and restoring case of characters following
// any non-opening "open-quote."
    
    var ret = CSL.Output.Formatters.undoppelString(doppel);
    return ret;
};

/*
* Based on a suggestion by Shoji Kajita.
*/
CSL.Output.Formatters.doppelString = function (string, rex, stopWords) {
    var ret, pos, len;
    ret = {};
    // rex is a function that returns an appropriate array.
    //
    // XXXXX: Does this work in Internet Explorer?
    //
    ret.array = rex(string, stopWords);
    //print("ret.array: "+ret.array);
    // ret.array = string.split(rex);
    ret.string = "";
    for (var i=0,ilen=ret.array.length; i<ilen; i += 2) {
        ret.string += ret.array[i];
    }
    return ret;
};


CSL.Output.Formatters.undoppelString = function (obj) {
    var ret, len, pos;
    ret = "";
    var stack = [];
    // For each push ...
    //   Check quote against closer of last. If match, pop.
    //   Check quote against opener of last. If match, push.
    //   If quote is opener and fails tests above, restore case at backtrack pos
    var params = {
        " \"": {
            opener: " \'",
            closer: "\""
        },
        " \'": {
            opener: " \"",
            closer: "\'"
        }
    }
    function tryOpen(quot, positions) {
        if (stack.length === 0 || quot === stack[stack.length - 1].opener) {
            stack.push({
                opener: params[quot].opener,
                closer: params[quot].closer,
                positions: positions
            });
            return false;
        } else {
            var ret = stack[stack.length-1].positions;
            stack.pop()
            stack.push({
                opener: params[quot].opener,
                closer: params[quot].closer,
                positions: positions
            });
            return ret;
        }
    }
    function tryClose(quot, positions) {
        if (quot === stack[stack.length - 1].closer) {
            stack.pop()
        } else {
            // Bad closer will have no space in string, so no casing anomaly.
            // print("  Fix bad closer at this pos");
        }
    }
    function maybePush(quot, positions) {
        var isOpener = [" \"", " \'"].indexOf(quot) > -1 ? true : false;
        if ((stack.length === 0 && isOpener) || stack.length > 0) {
            if (isOpener) {
                return tryOpen(quot, positions);
            } else {
                return tryClose(quot, positions);
            }
        }
    }
    function fix (quot, positions) {
        var m = quot.match(/(^(?:\"|\')|(?: \"| \')$)/);
        if (m) {
            return maybePush(m[1], positions);
        }
    }
    // Open a stack object here
    for (var i=0,ilen=obj.array.length; i<ilen; i+=1) {
        if ((i % 2)) {
            ret += obj.array[i];
        } else {
            // check here for open-quotes with no matching closer.
            // somehow.
            if (i > 0) {
                var positions = fix(obj.array[i-1], {array:i, string:ret.length})
                if (positions) {
                    //print(JSON.stringify(positions))
                    //print("  Reset opener, fix capitalization after previous bad opener");
                    //print(ret)
                    //print("  curchar=" + ret.slice(positions.string, positions.string+1));
                    //print("  oldchar=" + obj.array[positions.array, positions.array].slice(0,1));
                    var origChar = obj.array[positions.array, positions.array].slice(0,1);
                    ret = ret.slice(0, positions.string) + origChar + ret.slice(positions.string+1);
                }
            }
            ret += obj.string.slice(0, obj.array[i].length);
            obj.string = obj.string.slice(obj.array[i].length);
        }
    }
    if (stack.length) {
        
    }
    return ret;
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
