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
CSL.Node["date-part"] = new function(){
	this.build = build;
	function build(state,target){
		if (!this.strings.form){
			this.strings.form = "long";
		}
		if (state.build.datexml){
			for each (var decor in this.decorations){
				//
				// Xml: find one node by attribute value and set attribute value
				//
				state.sys.xml.setAttributeOnNodeIdentifiedByNameAttribute(state.build.datexml,'date-part',this.strings.name,decor[0],decor[1]);
			};
			for (var attr in this.strings){
				if (attr == "name" || attr == "prefix" || attr == "suffix"){
					continue;
				};
				//
				// Xml: find one node by attribute value and set attribute value
				//
				state.sys.xml.setAttributeOnNodeIdentifiedByNameAttribute(state.build.datexml,'date-part',this.strings.name,attr,this.strings[attr]);
			}
		} else {
			//
			// Set delimiter here, if poss.
			//
			var render_date_part = function(state,Item){
				var value = "";
				var value_end = "";
				state.tmp.donesies.push(this.strings.name);
				if (state.tmp.date_object){
					value = state.tmp.date_object[this.strings.name];
					value_end = state.tmp.date_object[(this.strings.name+"_end")];
				};
				var real = !state.tmp.suppress_decorations;
				var have_collapsed = state.tmp.have_collapsed;
				var invoked = state[state.tmp.area].opt.collapse == "year-suffix" || state[state.tmp.area].opt.collapse == "year-suffix-ranged";
				var precondition = state[state.tmp.area].opt["disambiguate-add-year-suffix"];
				if (real && precondition && invoked){
					state.tmp.years_used.push(value);
					var known_year = state.tmp.last_years_used.length >= state.tmp.years_used.length;
					if (known_year && have_collapsed){
						if (state.tmp.last_years_used[(state.tmp.years_used.length-1)] == value){
							value = false;
						};
					};
				};
				if (value){
					var bc = false;
					var ad = false;
					if ("year" == this.strings.name && parseInt(value,10) < 500 && parseInt(value,10) > 0){
						ad = state.getTerm("ad");
					};
					if ("year" == this.strings.name && parseInt(value,10) < 0){
						bc = state.getTerm("bc");
						value = (parseInt(value,10) * -1);
					};

					state.parallel.AppendToVariable(value);

					if (this.strings.form){
						value = CSL.Util.Dates[this.strings.name][this.strings.form](state,value);
						if (value_end){
							value_end = CSL.Util.Dates[this.strings.name][this.strings.form](state,value_end);
						}
					};
					if (state.tmp.date_collapse_at.length){
						//state.output.startTag(this.strings.name,this);
						var ready = true;
						for each (var item in state.tmp.date_collapse_at){
							if (state.tmp.donesies.indexOf(item) == -1){
								ready = false;
								break;
							}
						}
						if (ready){
							if (value_end != "0"){
								state.dateput.append(value_end,this);
							}
							state.output.append(value,this);
							var curr = state.output.current.value();
							curr.blobs[(curr.blobs.length-1)].strings.suffix="";
							state.output.append(this.strings["range-delimiter"],"empty");
							var dcurr = state.dateput.current.value();
							curr.blobs = curr.blobs.concat(dcurr);
							state.dateput.string(state,state.dateput.queue);
							state.tmp.date_collapse_at = [];
						} else {
							state.output.append(value,this);
							if (state.tmp.date_collapse_at.indexOf(this.strings.name) > -1){
								//
								// Use ghost dateput queue
								//
								if (value_end != "0"){
									state.dateput.append(value_end,this);
								}
							}
						}
					} else {
						state.output.append(value,this);
					}


					if (bc){
						state.output.append(bc);
					}
					if (ad){
						state.output.append(ad);
					}
					//state.output.endTag();
				} else if ("month" == this.strings.name) {
					//
					// No value for this target variable
					//
					if (state.tmp.date_object["season"]){
						value = ""+state.tmp.date_object["season"];
						if (value && value.match(/^[1-4]$/)){
							state.output.append(state.getTerm(("season-0"+value)),this);
						} else if (value){
							state.output.append(value,this);
						};
					};
				};
				state.tmp.value = new Array();
				if (!state.opt.has_year_suffix && "year" == this.strings.name){
					if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
						var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
						var number = new CSL.NumericBlob(num,this);
						var formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
						number.setFormatter(formatter);
						state.output.append(number,"literal");
					};
				};
			};
			if ("undefined" == typeof this.strings["range-delimiter"]){
				this.strings["range-delimiter"] = "-";
			}
			this["execs"].push(render_date_part);
			target.push(this);
		};
	};
};


