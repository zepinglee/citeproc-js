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
						state.parallel.StartVariable(this.variables[0]);
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
					var tok = new CSL.Token("date-part",CSL.SINGLETON);
					//
					// if present, sneak in a literal here and quash the remainder
					// of output from this date.
					//
					if (state.tmp.date_object["literal"]){
						state.parallel.AppendToVariable(state.tmp.date_object["literal"]);
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
					state.parallel.CloseVariable();
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


