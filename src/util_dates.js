/*
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights
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
 * Sections 1.13, 14 and 15 have been added to cover use of software over a
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
 * under the ./tests subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights Reserved.
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

/*global CSL: true */

/**
 * Date mangling functions.
 * @namespace Date construction utilities
 */
CSL.Util.Dates = {};

/**
 * Year manglers
 * <p>short, long</p>
 */
CSL.Util.Dates.year = {};

/**
 * Convert year to long form
 * <p>This just passes the number back as a string.</p>
 */
CSL.Util.Dates.year["long"] = function (state, num) {
    if (!num) {
        if ("boolean" === typeof num) {
            num = "";
        } else {
            num = 0;
        }
    }
    return num.toString();
};

/**
 * Crudely convert to Japanese Imperial form.
 * <p>Returns the result as a string.</p>
 */
CSL.Util.Dates.year.imperial = function (state, num, end) {
    if (!num) {
        if ("boolean" === typeof num) {
            num = "";
        } else {
            num = 0;
        }
    }
    end = end ? "_end" : "";
    var month = state.tmp.date_object["month" + end];
    month = month ? ""+month : "1";
    while (month.length < 2) {
        month = "0" + month;
    }
    var day = state.tmp.date_object["day" + end];
    day = day ? ""+day : "1";
    while (day.length < 2) {
        day = "0" + day;
    }
    var date = parseInt(num + month + day, 10);
    if (date >= 18680908 && date < 19120730) {
        year = "明治" + (num - 1867);
    } else if (date >= 19120730 && date < 19261225) {
        year = "対象" + (num - 1911);
    } else if (date >= 19261225 && date < 19890108) {
        year = "昭和" + (num - 1925);
    } else if (date >= 19890108) {
        year = "平成" + (num - 1988);
    }
    return year;
};

/**
 * Convert year to short form
 * <p>Just crops any 4-digit year to the last two digits.</p>
 */
CSL.Util.Dates.year["short"] = function (state, num) {
    num = num.toString();
    if (num && num.length === 4) {
        return num.substr(2);
    }
};


/**
 * Convert year to short form
 * <p>Just crops any 4-digit year to the last two digits.</p>
 */
CSL.Util.Dates.year.numeric = function (state, num) {
    var m, pre;
    num = "" + num;
    m = num.match(/([0-9]*)$/);
    if (m) {
        pre = num.slice(0, m[1].length * -1);
        num = m[1];
    } else {
        pre = num;
        num = "";
    }
    while (num.length < 4) {
        num = "0" + num;
    }
    return (pre + num);
};


/*
 * MONTH manglers
 * normalize
 * long, short, numeric, numeric-leading-zeros
 */
CSL.Util.Dates.normalizeMonth = function (num, useSeason) {
    var ret;
    if (!num) {
        num = 0;
    }
    num = "" + num;
    if (!num.match(/^[0-9]+$/)) {
        num = 0;
    }
    num = parseInt(num, 10);
    if (useSeason) {
        var res = {stub: "month-", num: num};
        if (res.num < 1 || res.num > 20) {
            res.num = 0;
        } else if (res.num > 16) {
            res.stub = "season-";
            res.num = res.num - 16;
        } else if (res.num > 12) {
            res.stub = "season-";
            res.num = res.num - 12;
        }
        ret = res;
    } else {
        if (num < 1 || num > 12) {
            num = 0;
        }
        ret = num;
    }
    return ret;
}

CSL.Util.Dates.month = {};

/**
 * Convert month to numeric form
 * <p>This just passes the number back as a string.</p>
 */
CSL.Util.Dates.month.numeric = function (state, num) {
    var num = CSL.Util.Dates.normalizeMonth(num);
    if (!num) {
        num = "";
    }
    return num;
};

/**
 * Convert month to numeric-leading-zeros form
 * <p>This just passes the number back as string padded with zeros.</p>
 */
CSL.Util.Dates.month["numeric-leading-zeros"] = function (state, num) {
    var num = CSL.Util.Dates.normalizeMonth(num);
    if (!num) {
        num = "";
    } else {
        num = "" + num;
        while (num.length < 2) {
            num = "0" + num;
        }
    }
    return num;
};

/**
 * Convert month to long form
 * <p>This passes back the month of the locale in long form.</p>
 */

// Gender is not currently used. Is it needed?

CSL.Util.Dates.month["long"] = function (state, num, gender, forceDefaultLocale) {
    var res = CSL.Util.Dates.normalizeMonth(num, true);
    var num = res.num;
    if (!num) {
        num = "";
    } else {
        num = "" + num;
        while (num.length < 2) {
            num = "0" + num;
        }
        num = state.getTerm(res.stub + num, "long", 0, 0, false, forceDefaultLocale);
    }
    return num;
};

/**
 * Convert month to long form
 * <p>This passes back the month of the locale in short form.</p>
 */

// See above.

CSL.Util.Dates.month["short"] = function (state, num, gender, forceDefaultLocale) {
    var res = CSL.Util.Dates.normalizeMonth(num, true);
    var num = res.num;
    if (!num) {
        num = "";
    } else {
        num = "" + num;
        while (num.length < 2) {
            num = "0" + num;
        }
        num = state.getTerm(res.stub + num, "short", 0, 0, false, forceDefaultLocale);
    }
    return num;
};

/*
 * DAY manglers
 * numeric, numeric-leading-zeros, ordinal
 */
CSL.Util.Dates.day = {};

/**
 * Convert day to numeric form
 * <p>This just passes the number back as a string.</p>
 */
CSL.Util.Dates.day.numeric = function (state, num) {
    return num.toString();
};

CSL.Util.Dates.day["long"] = CSL.Util.Dates.day.numeric;

/**
 * Convert day to numeric-leading-zeros form
 * <p>This just passes the number back as a string padded with zeros.</p>
 */
CSL.Util.Dates.day["numeric-leading-zeros"] = function (state, num) {
    if (!num) {
        num = 0;
    }
    num = num.toString();
    while (num.length < 2) {
        num = "0" + num;
    }
    return num.toString();
};

/**
 * Convert day to ordinal form
 * <p>This will one day pass back the number as a string with the
 * ordinal suffix appropriate to the locale.  For the present,
 * it just does what is most of the time right for English.</p>
 */
CSL.Util.Dates.day.ordinal = function (state, num, gender) {
    return state.fun.ordinalizer.format(num, gender);
};
