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
CSL.Node.date = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START || this.tokentype == CSL.SINGLETON){
			//
			// If form is set, the date form comes from the locale, and date-part
			// will just tinker with the formatting.
			//
			if (this.strings.form){
				if (state.getDate(this.strings.form)){
					//
					// Xml: Copy a node
					//
					var datexml = state.sys.xml.nodeCopy( state.getDate(this.strings.form) );
					//
					// Xml: Set attribute
					//
					state.sys.xml.setAttribute( datexml, 'variable', this.variables[0] );
					if (this.strings.prefix){
						//
						// Xml: Set attribute
						//
						state.sys.xml.setAttribute( datexml, "prefix", this.strings.prefix);
					}
					if (this.strings.suffix){
						//
						// Xml: Set attribute
						//
						state.sys.xml.setAttribute( datexml, "suffix", this.strings.suffix);
					}
					//
					// Xml: Delete attribute
					//
					state.sys.xml.deleteAttribute(datexml,'form');
					if (this.strings["date-parts"] == "year"){
						//
						// Xml: Find one node by attribute and delete
						//
						state.sys.xml.deleteNodeByNameAttribute(datexml,'month');
						//
						// Xml: Find one node by attribute and delete
						//
						state.sys.xml.deleteNodeByNameAttribute(datexml,'day');
					} else if (this.strings["date-parts"] == "year-month"){
						//
						// Xml: Find one node by attribute and delete
						//
						state.sys.xml.deleteNodeByNameAttribute(datexml,'day');
					}
					//
					// pass this xml object through to state.build for
					// post processing by date-part and in END or at the finish of
					// SINGLETON.  Delete after processing.
					//
					//
					// Xml: Copy node
					//
					state.build.datexml = state.sys.xml.nodeCopy( datexml );
				};
			} else {

				CSL.Util.substituteStart.call(this,state,target);
				var set_value = function(state,Item){
					state.tmp.element_rendered_ok = false;
					state.tmp.donesies = [];
					state.tmp.dateparts = [];
					var dp = [];
					if (this.variables.length && Item[this.variables[0]]){
						var date_obj = Item[this.variables[0]];
						if (date_obj.raw){
							state.tmp.date_object = state.dateParseRaw( date_obj.raw );
						} else if (date_obj["date-parts"]) {
							state.tmp.date_object = state.dateParseArray( date_obj );
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
						for each (var part in this.dateparts){
							if ("undefined" != typeof state.tmp.date_object[(part+"_end")]){
								dp.push(part);
							} else if (part == "month" && "undefined" != typeof state.tmp.date_object["season_end"]) {
								dp.push(part);
							};
						};
						//
						// (2) Reverse the list and step through in
						// reverse order, popping each item if the
						// primary and *_end data match.
						var mypos = -1;
						for (var pos=(dp.length-1); pos>-1; pos += -1){
							var part = dp[pos];
							var start = state.tmp.date_object[part];
							var end = state.tmp.date_object[(part+"_end")];
							if (start != end){
								mypos = pos;
								break;
							};
						};
						//
						// (3) When finished, the first item in the
						// list, if any, is the date-part where
						// the collapse should occur.
						state.tmp.date_collapse_at = dp.slice(0,(mypos+1));
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
				this["execs"].push(set_value);

				var newoutput = function(state,Item){
					state.output.startTag("date",this);
					var tok = new CSL.Factory.Token("date-part",CSL.SINGLETON);
					//
					// if present, sneak in a literal here and quash the remainder
					// of output from this date.
					//
					if (state.tmp.date_object["literal"]){
						state.output.append(state.tmp.date_object["literal"],tok);
						state.tmp.date_object = {};
					}
					tok.strings.suffix = " ";
				};
				this["execs"].push(newoutput);
			};
		};
		if (this.tokentype == CSL.END || this.tokentype == CSL.SINGLETON){
			if (this.strings.form && state.build.datexml){
				// Apparently this is all that is required to compile
				// the XML chunk into the style.  Same as for macros.
				//
				var datexml = state.build.datexml;
				delete state.build.datexml;
				var navi = new state._getNavi( state, datexml );
				CSL.buildStyle.call(state,navi);
			} else {
				var mergeoutput = function(state,Item){
					state.output.endTag();
				};
				this["execs"].push(mergeoutput);
			}
		};
		target.push(this);
		if (this.tokentype == CSL.END){
			CSL.Util.substituteEnd.call(this,state,target);
		};
	};
};


