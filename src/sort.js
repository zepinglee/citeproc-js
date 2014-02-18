/*global CSL: true */

CSL.getSortCompare = function (default_locale) {
    if (CSL.stringCompare) {
        return CSL.stringCompare;
    }
    var strcmp;
    // In order, attempt the following:
    //   (1) Set locale collation from processor language
    //   (2) Use localeCompare()
    if (!default_locale) {
        default_locale = "en-US";
    }
    try {
        var localeService = Components.classes["@mozilla.org/intl/nslocaleservice;1"]
            .getService(Components.interfaces.nsILocaleService);
        var collationFactory = Components.classes["@mozilla.org/intl/collation-factory;1"]
            .getService(Components.interfaces.nsICollationFactory);
        var collation = collationFactory.CreateCollation(localeService.newLocale(default_locale));
        strcmp = function(a, b) {
            return collation.compareString(1, a, b);
        };
        CSL.debug("Using collation sort: "+default_locale);
    } catch (e) {
        CSL.debug("Using localeCompare sort");
        strcmp = function (a, b) {
            return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
        };
    }
    var isKana = /^[\[\]\'\"]*[\u3040-\u309f\u30a0-\u30ff]/;
    var stripPunct = function (str) {
        return str.replace(/^[\[\]\'\"]*/g, "");
    }
    var getKanaPreSort = function () {
        if (strcmp("\u3044", "\u3046")) {
            return false;
        } else {
            return function (a, b) {
                a = stripPunct(a);
                b = stripPunct(b);
                var ak = isKana.exec(a);
                var bk = isKana.exec(b);
                if (ak || bk) {
                    if (!ak) {
                        return -1;
                    } else if (!bk) {
                        return 1;
                    } else if (a < b) {
                        return -1;
                    } else if (a > b) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return false;
                }
            };
        }
    }
    var getBracketPreSort = function () {
        if (!strcmp("[x","x")) {
            return false;
        } else {
            return function (a, b) {
                return strcmp(stripPunct(a), stripPunct(b));
            }
        }
    }
    var kanaPreSort = getKanaPreSort();
    var bracketPreSort = getBracketPreSort();
    var sortCompare = function (a, b) {
        if (kanaPreSort) {
            var ret = kanaPreSort(a, b);
            if (false !== ret) {
                return ret;
            }
        }
        if (bracketPreSort) {
            return bracketPreSort(a, b);
        } else {
            return strcmp(a, b);
        }
    }
    return sortCompare;
};
