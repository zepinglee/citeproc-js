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

CSL.dateParser = function (txt) {
	var jiy_list, jiy, jiysplitter, jy, jmd, jr, pos, key, val, yearlast, yearfirst, number, rangesep, fuzzychar, chars, rex, rexdash, rexdashslash, rexslashdash, seasonstrs, seasonrexes, seasonstr, monthstrs, monthstr, monthrexes, seasonrex, len;

	// instance object with private constants and a public function.

	// japanese imperial years
	jiy_list = [
		["\u660E\u6CBB", 1867],
		["\u5927\u6B63", 1911],
		["\u662D\u548C", 1925],
		["\u5E73\u6210", 1988]
	];
	// years by names (jiy)
	// ... and ...
	// regular expression to trap year name and year (jiysplitter)
	jiy = {};
	len = jiy_list.length;
	for (pos = 0; pos < len; pos += 1) {
		key = jiy_list[pos][0];
		val = jiy_list[pos][1];
		jiy[val] = key;
	}
	jiysplitter = [];
	for (pos = 0; pos < len; pos += 1) {
		val = jiy_list[pos];
		jiysplitter.push(val);
	}
	jiysplitter = jiysplitter.join("|");
	jiysplitter = "(" + jiysplitter + ")([0-9]+)";
	jiysplitter = new RegExp(jiysplitter);
	// japanese regular expression for month or day
	jmd = /(\u6708|\u5E74)/g;
	// japanese regular expression for year
	jy = /\u65E5$/;
	// japanese regular expression for range
	jr = /〜/g;

	// main parsing regexps
	yearlast = "(?:[?0-9]{1,2}%%NUMD%%){0,2}[?0-9]{4}(?![0-9])";
	yearfirst = "[?0-9]{4}(?:%%NUMD%%[?0-9]{1,2}){0,2}(?![0-9])";
	number = "[?0-9]{1,3}";
	rangesep = "[%%DATED%%]";
	fuzzychar = "[?~]";
	chars = "[a-zA-Z]+";
	rex = "(" + yearfirst + "|" + yearlast + "|" + number + "|" + rangesep + "|" + fuzzychar + "|" + chars + ")";
	rexdash = new RegExp(rex.replace(/%%NUMD%%/g, "-").replace(/%%DATED%%/g, "-"));
	rexdashslash = new RegExp(rex.replace(/%%NUMD%%/g, "-").replace(/%%DATED%%/g, "\/"));
	rexslashdash = new RegExp(rex.replace(/%%NUMD%%/g, "\/").replace(/%%DATED%%/g, "-"));

	// seasons
	seasonstrs = ["spr", "sum", "fal", "win"];
	seasonrexes = [];
	len = seasonstrs.length;
	for (pos = 0; pos < len; pos += 1) {
		seasonrex = new RegExp(seasonstrs[pos] + ".*");
		seasonrexes.push(seasonrex);
	}

	// months
	monthstrs = "jan feb mar apr may jun jul aug sep oct nov dec";
	monthstrs = monthstrs.split(" ");
	monthrexes = [];
	len = monthstrs.length;
	for (pos = 0; pos < len; pos += 1) {
		monthstr = monthstrs[pos];
		rex = new RegExp(monthstr);
		monthrexes.push(rex);
	}

	this.parse = function (txt) {
		var slash, dash, lst, l, m, number, note, thedate, slashcount, range_delim, date_delim, ret, delim_pos, delims, isrange, suff, date, breakme, item, pos, delim, ppos, element, pppos, len, llen, lllen;
		//
		// Normalize the format and the year if it's a Japanese date
		//
		m = txt.match(jmd, "-");
		if (m) {
			txt = txt.replace(jy, "");
			txt = txt.replace(jmd, "-");
			txt = txt.replace(jr, "/");

			lst = txt.split(jiysplitter);
			l = lst.length;
			for	(pos = 1; pos < l; pos += 3) {
				lst[(pos + 1)] = jiy[lst[(pos)]] + parseInt(lst[(pos + 1)], 10);
				lst[pos] = "";
			}
			txt = lst.join("");
			txt = txt.replace(/\s*-\s*$/, "").replace(/\s*-\s*\//, "/");
			//
			// normalize date and identify delimiters
			//
			txt = txt.replace(/\.\s*$/, "");
			txt = txt.replace(/\.(?! )/, "");
			slash = txt.indexOf("/");
			dash = txt.indexOf("-");
		}

		number = "";
		note = "";
		thedate = {};
		if (txt.match(/^".*"$/)) {
			thedate.literal = txt.slice(1, -1);
			return thedate;
		}
		if (slash > -1 && dash > -1) {
			slashcount = txt.split("/");
			if (slashcount.length > 3) {
				range_delim = "-";
				date_delim = "/";
				lst = txt.split(rexslashdash);
			} else {
				range_delim = "/";
				date_delim = "-";
				lst = txt.split(rexdashslash);
			}
		} else {
			txt = txt.replace("/", "-");
			range_delim = "-";
			date_delim = "-";
			lst = txt.split(rexdash);
		}
		ret = [];
		len = lst.length;
		for (pos = 0; pos < len; pos += 1) {
			item = lst[pos];
			m = item.match(/^\s*([\-\/]|[a-zA-Z]+|[\-~?0-9]+)\s*$/);
			if (m) {
				ret.push(m[1]);
			}
		}
		//
		// Phase 2
		//
		delim_pos = ret.indexOf(range_delim);
		delims = [];
		isrange = false;
		if (delim_pos > -1) {
			delims.push([0, delim_pos]);
			delims.push([(delim_pos + 1), ret.length]);
			isrange = true;
		} else {
			delims.push([0, ret.length]);
		}
		//
		// For each side of a range divide ...
		//
		suff = "";
		len = delims.length;
		for (pos = 0; pos < len; pos += 1) {
			delim = delims[pos];
			//
			// Process each element ...
			//
			date = ret.slice(delim[0], delim[1]);
			llen = date.length;
			for (ppos = 0; ppos < llen; ppos += 1) {
				element = date[ppos];
				//
				// If it's a numeric date, process it.
				//
				if (element.indexOf(date_delim) > -1) {
					this.parseNumericDate(thedate, date_delim, suff, element);
					continue;
				}
				//
				// If it's an obvious year, record it.
				//
				if (element.match(/[0-9]{4}/)) {
					thedate[("year" + suff)] = element.replace(/^0*/, "");
					continue;
				}
				//
				// If it's a month, record it.
				//
				breakme = false;
				lllen = monthrexes.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					if (element.toLocaleLowerCase().match(monthrexes[pppos])) {
						thedate[("month" + suff)] = "" + (parseInt(pppos, 10) + 1);
						breakme = true;
						break;
					}
					if (breakme) {
						continue;
					}
					//
					// If it's a number, make a note of it
					//
					if (element.match(/^[0-9]+$/)) {
						number = parseInt(element, 10);
					}
					//
					// If it's a BC or AD marker, make a year of
					// any note.  Separate, reverse the sign of the year
					// if it's BC.
					//
					if (element.toLocaleLowerCase().match(/^bc.*/) && number) {
						thedate[("year" + suff)] = "" + (number * -1);
						number = "";
						continue;
					}
					if (element.toLocaleLowerCase().match(/^ad.*/) && number) {
						thedate[("year" + suff)] = "" + number;
						number = "";
						continue;
					}
				}
				//
				// If it's a season, record it.
				//
				breakme = false;
				lllen = seasonrexes.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					if (element.toLocaleLowerCase().match(seasonrexes[pppos])) {
						thedate[("season" + suff)] = "" + (parseInt(pppos, 10) + 1);
						breakme = true;
						break;
					}
				}
				if (breakme) {
					continue;
				}
				//
				// If it's a fuzzy marker, record it.
				//
				if (element === "~" || element === "?" || element === "c" || element.match(/cir.*/)) {
					thedate.fuzzy = "" + 1;
					continue;
				}
				//
				// If it's cruft, make a note of it
				//
				if (element.toLocaleLowerCase().match(/(?:mic|tri|hil|eas)/) && !thedate[("season" + suff)]) {
					note = element;
					continue;
				}
			}
			//
			// If at the end of the string there's still a note
			// hanging around, make a day of it.
			//
			if (number) {
				thedate[("day" + suff)] = number;
				number = "";
			}
			//
			// If at the end of the string there's cruft lying
			// around, and the season field is empty, put the
			// cruft there.
			//
			if (note && !thedate[("season" + suff)]) {
				thedate[("season" + suff)] = note;
				note = "";
			}
			suff = "_end";
		}
		//
		// update any missing elements on each side of the divide
		// from the other
		//
		if (isrange) {
			len = CSL.DATE_PARTS_ALL.length;
			for (pos = 0; pos < len; pos += 1) {
				item = CSL.DATE_PARTS_ALL[pos];
				if (thedate[item] && !thedate[(item + "_end")]) {
					thedate[(item + "_end")] = thedate[item];
				} else if (!thedate[item] && thedate[(item + "_end")]) {
					thedate[item] = thedate[(item + "_end")];
				}
			}
		}
		//
		// If there's no year, it's a failure; pass through the literal
		//
		if (!thedate.year) {
			thedate = { "literal": txt };
		}
		return thedate;
	};
};
