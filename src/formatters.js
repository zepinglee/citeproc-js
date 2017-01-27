/*global CSL: true */

/**
 * A bundle of handy functions for text processing.
 * <p>Several of these are ripped off from various
 * locations in the Zotero source code.</p>
 * @namespace Toolkit of string functions
 */

// See util_substitute.js and queue.js (append) for code supporting
// strip-periods.
//CSL.Output.Formatters.strip_periods = function (state, string) {
//    return string.replace(/\./g, "");
//};

CSL.Output.Formatters = new function () {
    this.passthrough = passthrough;
    this.lowercase = lowercase;
    this.uppercase = uppercase;
    this.sentence = sentence;
    this.title = title;
    this["capitalize-first"] = capitalizeFirst;
    this["capitalize-all"] = capitalizeAll;

    /*
     * Internal utilities
     */

    var tagParams = {
        "<span class=\"nocase\">": "</span>",
        "<span class=\"nodecor\">": "</span>"
    }

    function _capitalise (word, force) {
        // Weird stuff is (.) transpiled with regexpu
        //   https://github.com/mathiasbynens/regexpu
        var m = word.match(/(^\s*)((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))(.*)/);
        // Do not uppercase lone Greek letters
        // (This may not be a good thing when setting Greek-language citations)
        if (m && !(m[2].match(/^[\u0370-\u03FF]$/) && !m[3])) {
            return m[1] + m[2].toUpperCase() + m[3];
        }
        return word;
    }

    /*
     * Based on a commute-train suggestion by Shoji Kajita.
     */
    function _doppelString(str) {
        var mx, lst, len, pos, m, buf1, buf2, idx, ret, myret;
        // Normalize markup
        str = str.replace(/(<span)\s+(class=\"no(?:case|decor)\")[^>]*(>)/g, "$1 $2$3");
        // Split and match
        var m1match = str.match(/((?: \"| \'|\"|\'|[-/.,;?!:]|\[|\]|\(|\)|<span class=\"no(?:case|decor)\">|<\/span>|<\/?(?:i|sc|b|sub|sup)>))/g);
        if (!m1match) {
            return {
                tags: [],
                strings: [str]
            };
        }
        var m1split = str.split(/(?: \"| \'|\"|\'|[-/.,;?!:]|\[|\]|\(|\)|<span class=\"no(?:case|decor)\">|<\/span>|<\/?(?:i|sc|b|sub|sup)>)/g);
        
        return {
            tags: m1match,
            strings: m1split,
            origStrings: m1split.slice()
        }
    }

    function _undoppelString(obj) {
        var ret, len, pos;
        lst = [];
        var lst = obj.strings.slice(-1);
        for (var i=obj.tags.length-1; i>-1; i+=-1) {
            lst.push(obj.tags[i]);
            lst.push(obj.strings[i]);
        }
        lst.reverse();
        return lst.join("");
    }


    /**
     * A noop that just delivers the string.
     */
    function passthrough (state, str) {
        return str;
    }

    /**
     * Force all letters in the string to lowercase, skipping nocase spans
     */
    function lowercase(state, string) {
        var doppel = _doppelString(string);
        var tagState = [];

        function _lowercaseWords(str) {
            var words = str.split(" ");
            for (var i=0,ilen=words.length;i<ilen;i++) {
                var word = words[i];
                if (word) {
                    words[i] = word.toLowerCase();
                }
            }
            return words.join(" ");
        }

        if (doppel.strings.length && doppel.strings[0].trim()) {
            doppel.strings[0] = _lowercaseWords(doppel.strings[0]);
        }
        for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var str = doppel.strings[i+1];
            if (!str.trim()) continue;
            // Evaluate tag state for current string
            if (tagParams[tag]) {
                tagState.push(tagParams[tag]);
            } else if (tagState.length && tag === tagState[tagState.length - 1]) {
                tagState.pop();
            }
            // Process if outside tag scope, else noop for lower-casing
            if (tagState.length === 0) {
                doppel.strings[i+1] = _lowercaseWords(str);
            }
        }
        return _undoppelString(doppel);
    }

    /**
     * Force all letters in the string to uppercase.
     */
    function uppercase(state, string) {
        var doppel = _doppelString(string);
        var tagState = [];

        function _uppercaseWords(str) {
            var words = str.split(" ");
            for (var i=0,ilen=words.length;i<ilen;i++) {
                var word = words[i];
                if (word) {
                    words[i] = word.toUpperCase();
                }
            }
            return words.join(" ");
        }

        if (doppel.strings.length && doppel.strings[0].trim()) {
            doppel.strings[0] = _uppercaseWords(doppel.strings[0]);
        }
        for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var str = doppel.strings[i+1];
            if (!str.trim()) continue;
            // Evaluate tag state for current string
            if (tagParams[tag]) {
                tagState.push(tagParams[tag]);
            } else if (tagState.length && tag === tagState[tagState.length - 1]) {
                tagState.pop();
            }
            // Process if outside tag scope, else noop for lower-casing
            if (tagState.length === 0) {
                doppel.strings[i+1] = _uppercaseWords(str);
            }
        }
        return _undoppelString(doppel);
    }

    /**
     * Similar to <b>capitalize_first</b>, but force the
     * subsequent characters to lowercase.
     */
    function sentence(state, string) {
        var doppel = _doppelString(string);
        var tagState = [];
        var isFirst = true;

        function _capitaliseOrLowercase(str) {
            var words = str.split(" ");
            for (var i=0,ilen=words.length;i<ilen;i++) {
                var word = words[i];
                if (word) {
                    if (isFirst) {
                        words[i] = _capitalise(word);
                        isFirst = false;
                    } else {
                        words[i] = word.toLowerCase();
                    }
                }
            }
            return words.join(" ");
        }

        if (doppel.strings.length && doppel.strings[0].trim()) {
            doppel.strings[0] = _capitaliseOrLowercase(doppel.strings[0]);
        }
        for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var str = doppel.strings[i+1];
            if (!str.trim()) continue;
            // Evaluate tag state for current string
            if (tagParams[tag]) {
                tagState.push(tagParams[tag]);
            } else if (tagState.length && tag === tagState[tagState.length - 1]) {
                tagState.pop();
            }
            // Process if outside tag scope, else noop for lower-casing
            if (tagState.length === 0) {
                doppel.strings[i+1] = _capitaliseOrLowercase(str);
            }
        }
        return _undoppelString(doppel);
    }

    /**
     * Force capitalization of the first letter in the string, leave
     * the rest of the characters untouched.
     */
    function capitalizeFirst(state, string) {
        var doppel = _doppelString(string);
        var tagState = [];
        var isFirst = true;

        function _capitaliseFirst(str) {
            var words = str.split(" ");
            for (var i=0,ilen=words.length;i<ilen;i++) {
                var word = words[i];
                if (word) {
                    if (isFirst) {
                        words[i] = _capitalise(word);
                        isFirst = false;
                        break;
                    }
                }
            }
            return words.join(" ");
        }
        
        if (doppel.strings.length && doppel.strings[0].trim()) {
            doppel.strings[0] = _capitaliseFirst(doppel.strings[0]);
        }
        if (isFirst) {
            for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
                var tag = doppel.tags[i];
                var str = doppel.strings[i+1];
                if (!str.trim()) continue;
                // Evaluate tag state for current string
                if (tagParams[tag]) {
                    tagState.push(tagParams[tag]);
                } else if (tagState.length && tag === tagState[tagState.length - 1]) {
                    tagState.pop();
                }
                // Process if outside tag scope, else noop for lower-casing
                if (tagState.length === 0) {
                    doppel.strings[i+1] = _capitaliseFirst(str);
                } else if (tagParams[tag]) {
                    isFirst = false;
                }
                if (!isFirst) {
                    break;
                }
            }
        }
        return _undoppelString(doppel);
    }

    /**
     * Force the first letter of each space-delimited
     * word in the string to uppercase, and leave the remainder
     * of the string untouched.  Single characters are forced
     * to uppercase.
     */
    function capitalizeAll (state, string) {
        var doppel = _doppelString(string);
        var tagState = [];
        var isFirst = true;

        function _capitaliseEach(str) {
            var words = str.split(" ");
            for (var i=0,ilen=words.length;i<ilen;i++) {
                var word = words[i];
                if (word) {
                    words[i] = _capitalise(word);
                }
            }
            return words.join(" ");
        }
        
        if (doppel.strings.length && doppel.strings[0].trim()) {
            doppel.strings[0] = _capitaliseEach(doppel.strings[0]);
        }
        for (var i=0,ilen=doppel.tags.length;i<ilen;i++) {
            var tag = doppel.tags[i];
            var str = doppel.strings[i+1];
            if (!str.trim()) continue;
            // Evaluate tag state for current string
            if (tagParams[tag]) {
                tagState.push(tagParams[tag]);
            } else if (tagState.length && tag === tagState[tagState.length - 1]) {
                tagState.pop();
            }
            // Process if outside tag scope, else noop for lower-casing
            if (tagState.length === 0) {
                doppel.strings[i+1] = _capitaliseEach(str);
            }
        }
        return _undoppelString(doppel);
    }

    /**
     * Capitalization appropriate for use in a title.
     * Will not touch words that have some capitalization already.
     */
    function title(state, string) {
        var str, words, isAllUpperCase, newString, lastWordIndex, previousWordIndex, upperCaseVariant, lowerCaseVariant, pos, skip, notfirst, notlast, aftercolon, len, idx, tmp, skipword, ppos, mx, lst, myret;
        var SKIP_WORDS = state.locale[state.opt.lang].opts["skip-words"];
        if (!string) {
            return "";
        }

        // Separate tags from strings (as doppel.tags and doppel.strings)
        var doppel = _doppelString(string);

        //print("tags: " + JSON.stringify(doppel.tags, null, 2));
        //print("strings: " + JSON.stringify(doppel.strings, null, 2));
        
        // Set up initial state params

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
            if (isOpener) {
                return tryOpen(tag, pos);
            } else {
                return tryClose(tag, pos);
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
            if (quoteState.length > 0 && tag === quoteState[quoteState.length - 1].closer) {
                quoteState.pop()
            } else {
                return pos;
            }
        }
        
        function _capitaliseWords(str, i) {
            if (str.trim()) {
                var words = str.split(" ");
                for (var j=0,jlen=words.length;j<jlen;j++) {
                    var word = words[j];
                    if (!word) continue;
                    if (word.length > 1 && !word.toLowerCase().match(skipWordsRex)) {
                        // Capitalize every word that is not a stop-word
                        words[j] = _capitalise(words[j]);
                    } else if (isFirst) {
                        // Capitalize first word, even if a stop-word
                        words[j] = _capitalise(words[j]);
                    } else if (afterPunct) {
                        // Capitalize after punctuation
                        words[j] = _capitalise(words[j]);
                    }
                    afterPunct = false;
                    isFirst = false;
                    lastWordPos = {
                        strings: (i),
                        words: j
                    }
                }
                doppel.strings[i] = words.join(" ");
            }
        }

        var quoteState = [];
        var isFirst = true;
        var lastWordPos = null;
        var afterPunct = false;
        var skipWordsRex = state.locale[state.opt.lang].opts["skip-words-regexp"];
        
        // Run state machine
        if (doppel.strings.length && doppel.strings[0].trim()) {
            _capitaliseWords(doppel.strings[0], 0)
        }
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
                _capitaliseWords(str, i+1);
            }
            
            // Evaluate quote state of current string and fix chars that have flown
            var quotePos = quoteFix(tag, i);
            if (quotePos || quotePos === 0) {
                var origChar = doppel.origStrings[quotePos+1].slice(0, 1);
                doppel.strings[quotePos+1] = origChar + doppel.strings[quotePos+1].slice(1);
                lastWordPos = null;
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
        // Capitalize the last word if necessary (bypasses stop-word list)
        if (lastWordPos) {
            var lastWords = doppel.strings[lastWordPos.strings].split(" ");
            var lastWord = _capitalise(lastWords[lastWordPos.words]);
            lastWords[lastWordPos.words] = lastWord;
            doppel.strings[lastWordPos.strings] = lastWords.join(" ");
        }
        // Recombine the string
        var ret = _undoppelString(doppel);
        return ret;
    }
}


CSL.Output.Formatters.serializeItemAsRdf = function (Item) {
    return "";
};


CSL.Output.Formatters.serializeItemAsRdfA = function (Item) {
    return "";
};


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
