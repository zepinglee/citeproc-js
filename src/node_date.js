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

CSL.Node.date = {
	build: function (state, target) {
		var func, date_obj, tok, len, pos, part, dpx, parts, mypos, start, end;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			// used to collect rendered date part names in node_datepart,
			// for passing through to node_key, for use in dates embedded
			// in macros
			state.build.date_parts = [];
			state.build.date_variables = this.variables;
			if (!state.build.sort_flag) {
				CSL.Util.substituteStart.call(this, state, target);
			}
			func = function (state, Item) {
				state.tmp.element_rendered_ok = false;
				state.tmp.donesies = [];
				state.tmp.dateparts = [];
				var dp = [];
				//if (this.variables.length && Item[this.variables[0]]){
				if (this.variables.length) {
					state.parallel.StartVariable(this.variables[0]);
					date_obj = Item[this.variables[0]];
					if ("undefined" === typeof date_obj) {
						date_obj = {"date-parts": [[0]] };
					}
					if (date_obj.raw) {
						state.tmp.date_object = state.fun.dateparser.parse(date_obj.raw);
					} else if (date_obj["date-parts"]) {
						state.tmp.date_object = state.dateParseArray(date_obj);
					}
					//
					// Call a function here to analyze the
					// data and set the name of the date-part that
					// should collapse for this range, if any.
					//
					// (1) build a filtered list, in y-m-d order,
					// consisting only of items that are (a) in the
					// date-parts and (b) in the *_end data.
					// (note to self: remember that season is a
					// fallback var when month and day are empty)
					len = this.dateparts.length;
					for (pos = 0; pos < len; pos += 1) {
						part = this.dateparts[pos];
						if ("undefined" !== typeof state.tmp.date_object[(part +  "_end")]) {
							dp.push(part);
						} else if (part === "month" && "undefined" !== typeof state.tmp.date_object.season_end) {
							dp.push(part);
						}
					}
					dpx = [];
					parts = ["year", "month", "day"];
					len = parts.length;
					for (pos = 0; pos < len; pos += 1) {
						if (dp.indexOf(parts[pos]) > -1) {
							dpx.push(parts[pos]);
						}
					}
					dp = dpx.slice();
					//
					// (2) Reverse the list and step through in
					// reverse order, popping each item if the
					// primary and *_end data match.
					mypos = 2;
					len = dp.length;
					for (pos = 0; pos < len; pos += 1) {
						part = dp[pos];
						start = state.tmp.date_object[part];
						end = state.tmp.date_object[(part + "_end")];
						if (start !== end) {
							mypos = pos;
							break;
						}
					}
					//
					// (3) When finished, the first item in the
					// list, if any, is the date-part where
					// the collapse should occur.

					// XXXXX: was that it?
					state.tmp.date_collapse_at = dp.slice(mypos);
					//
					// The collapse itself will be done by appending
					// string output for the date, less suffix,
					// placing a delimiter on output, then then
					// doing the *_end of the range, dropping only
					// the prefix.  That should give us concise expressions
					// of ranges.
					//
					// Numeric dates should not collapse, though,
					// and should probably use a slash delimiter.
					// Scope for configurability will remain (all over
					// the place), but this will do to get this feature
					// started.
					//
				} else {
					state.tmp.date_object = false;
				}
			};
			this.execs.push(func);

			// newoutput
			func = function (state, Item) {
				state.output.startTag("date", this);
				var tok = new CSL.Token("date-part", CSL.SINGLETON);
				//
				// if present, sneak in a literal here and quash the remainder
				// of output from this date.
				//
				if (state.tmp.date_object.literal) {
					state.parallel.AppendToVariable(state.tmp.date_object.literal);
					state.output.append(state.tmp.date_object.literal, tok);
					state.tmp.date_object = {};
				}
				tok.strings.suffix = " ";
			};
			this.execs.push(func);
		}

		//
		// XXXXXX: Call back to key if date is in macro
		//
		if (state.build.sort_flag && (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON)) {
			tok = new CSL.Token("key", CSL.SINGLETON);
			//tok.date_object = state.tmp.date_object;
			tok.dateparts = state.build.date_parts.slice();
			// any date variable name will do here; it just triggers
			// construction of a date key, using the state.tmp.date_object
			// data constructed in the start tag.
			tok.variables = state.build.date_variables;
			CSL.Node.key.build.call(tok, state, target);
			state.build.sort_flag = false;
		}

		if (!state.build.sort_flag && (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON)) {
			// mergeoutput
			func = function (state, Item) {
				state.output.endTag();
				state.parallel.CloseVariable("date");
			};
			this.execs.push(func);
		}
		target.push(this);

		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			if (!state.build.sort_flag) {
				CSL.Util.substituteEnd.call(this, state, target);
			}
		}
	}
};
