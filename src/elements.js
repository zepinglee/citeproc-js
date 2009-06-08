dojo.provide("csl.elements");


//
// XXXXX Fix initialization of given name count.
// Should this be removed from the base?  not sure.
//


/**
 * Functions corresponding to CSL element names.
 * <p>These are static function used during build and
 * configuration.  The <code>build</code> method is called
 * on a token generated from the XML node at build time, and
 * may manipulate either the content of the state object or that
 * of the token.</p>
 * <p>The <code>configure</code> method is invoked on the
 * node during a back-to-front pass through the tokens,
 * and sets skip positions for conditionals.</p>
 * <p>Tokens that do not affect citation rendering in any
 * way can be discarded by not pushing them to the target.
 * In this case, the <code>configure</code> method need
 * not be defined.</p>
 * @class
 */
CSL.Lib.Elements = {};


/**
 * The info element.
 * <p>Everything in this scope is a total
 * <code>noop</code>.</p>
 * @name CSL.Lib.Elements.info
 */
CSL.Lib.Elements.info = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START){
			state.build.skip = "info";
		} else {
			state.build.skip = false;
		}
	};
};

CSL.Lib.Elements.macro = new function(){
	this.build = build;
	function build (state,target){
	};
};
/**
 * The text element.
 * @name CSL.Lib.Elements.text
 * @function
 */
CSL.Lib.Elements.text = new function(){
	this.build = build;
	function build (state,target){
		CSL.Util.substituteStart(state,target);
		if (this.postponed_macro){
			CSL.Factory.expandMacro.call(state,this);
		} else {
			// ...
			//
			// Do non-macro stuff
			var variable = this.variables[0];
			if ("citation-number" == variable || "year-suffix" == variable){
				//
				// citation-number and year-suffix are super special,
				// because they are rangeables, and require a completely
				// different set of formatting parameters on the output
				// queue.
				if (variable == "citation-number"){
					//this.strings.is_rangeable = true;
					if ("citation-number" == state[state.tmp.area].opt["collapse"]){
						this.range_prefix = "-";
					}
					var func = function(state,Item){
						var id = Item["id"];
						if (!state.tmp.force_subsequent){
							var num = state.registry.registry[id].seq;
							var number = new CSL.Output.Number(num,this);
							state.output.append(number,"literal");
						}
					};
					this["execs"].push(func);
				} else if (variable == "year-suffix"){
					if (state[state.tmp.area].opt["year-suffix-range-delimiter"]){
						this.range_prefix = state[state.tmp.area].opt["year-suffix-range-delimiter"];
					}
					var func = function(state,Item){
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
							//state.output.append(state.registry.registry[Item.id].disambig[2],this);
							var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
							var number = new CSL.Output.Number(num,this);
							var formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
							number.setFormatter(formatter);
							state.output.append(number,"literal");
							//
							// don't ask :)
							// obviously the variable naming scheme needs
							// a little touching up
							var firstoutput = state.tmp.term_sibling.mystack.indexOf(true) == -1;
							var specialdelimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							if (firstoutput && specialdelimiter && !state.tmp.sort_key_flag){
								state.tmp.splice_delimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							}
						}
					};
					this["execs"].push(func);
				}

			} else {
				if (state.build.term){
					var term = state.build.term;
					var form = "long";
					var plural = 0;
					if (state.build.form){
						form = state.build.form;
					}
					if (state.build.plural){
						plural = state.build.plural;
					}
					term = state.getTerm(term,form,plural);
					var printterm = function(state,Item){
						// capitalize the first letter of a term, if it is the
						// first thing rendered in a citation (or if it is
						// being rendered immediately after terminal punctuation,
						// I guess, actually).
						if (!state.tmp.term_predecessor){
							//print("Capitalize");
							term = CSL.Output.Formatters.capitalize_first(term);
							state.tmp.term_predecessor = true;
						};
						state.output.append(term,this);
					};
					this["execs"].push(printterm);
					state.build.term = false;
					state.build.form = false;
					state.build.plural = false;
				} else if (this.variables.length){
					var func = function(state,Item){
						state.output.append(Item[this.variables[0]],this);
					};
					this["execs"].push(func);
				} else if (this.strings.value){
					var func = function(state,Item){
						state.output.append(this.strings.value,this);
					};
					this["execs"].push(func);
				} else {
					var weird_output_function = function(state,Item){
						if (state.tmp.value.length){
							print("Weird output pattern.  Can this be revised?");
							for each (var val in state.tmp.value){
								state.output.append(val,this);
							}
							state.tmp.value = new Array();
						}
					};
					this["execs"].push(weird_output_function);
				}
			}
			target.push(this);
		};
		CSL.Util.substituteEnd(state,target);
	};
};


/**
 * The group node, start and end.
 * @name CSL.Lib.Elements.group
 * @function
 */
CSL.Lib.Elements.group = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START){
			CSL.Util.substituteStart(state,target);
			if (state.build.substitute_level.value()){
				state.build.substitute_level.replace((state.build.substitute_level.value()+1));
			}
			var newoutput = function(state,Item){
				state.output.startTag("group",this);
			};
			//
			// Paranoia.  Assure that this init function is the first executed.
			var execs = new Array();
			execs.push(newoutput);
			this.execs = execs.concat(this.execs);

			var fieldcontentflag = function(state,Item){
				state.tmp.term_sibling.push( undefined, CSL.LITERAL );
			};
			this["execs"].push(fieldcontentflag);
		} else {
			var quashnonfields = function(state,Item){
				var flag = state.tmp.term_sibling.value();
				if (false == flag){
					state.output.clearlevel();
				}
				state.tmp.term_sibling.pop();
				//
				// Heals group quashing glitch with nested groups.
				//
				if (flag && state.tmp.term_sibling.mystack.length > 1){
					state.tmp.term_sibling.replace(true);
				}
			};
			this["execs"].push(quashnonfields);

			var mergeoutput = function(state,Item){
				//
				// rendering happens inside the
				// merge method, by applying decorations to
				// each token to be merged.
				state.output.endTag();
			};
			this["execs"].push(mergeoutput);
		}
		target.push(this);

		if (this.tokentype == CSL.END){
			if (state.build.substitute_level.value()){
				state.build.substitute_level.replace((state.build.substitute_level.value()-1));
			}
			CSL.Util.substituteEnd(state,target);
		}
	}
};

/**
 * Citation element
 */
CSL.Lib.Elements.citation = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START) {
			state.build.area_return = state.build.area;
			state.build.area = "citation";
		}
		if (this.tokentype == CSL.END) {
			state.build.area = state.build.area_return;
		}
	}
};

/**
 * The choose node, start and end.
 * @name CSL.Lib.Elements.choose
 * @function
 */
CSL.Lib.Elements.choose = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		if (this.tokentype == CSL.START){
			var func = function(state,Item){ //open condition
				state.tmp.jump.push(undefined, CSL.LITERAL);
			};
		}
		if (this.tokentype == CSL.END){
			var func = function(state,Item){ //close condition
				state.tmp.jump.pop();
			};
		}
		this["execs"].push(func);
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.END){
			state.configure["fail"].push((pos));
			state.configure["succeed"].push((pos));
		} else {
			state.configure["fail"].pop();
			state.configure["succeed"].pop();
		}
	}
};


/**
 * The if node, start and end.
 * @name CSL.Lib.Elements.if
 * @function
 */
CSL.Lib.Elements["if"] = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		if (this.tokentype == CSL.START){
			for each (var variable in this.variables){
				var func = function(state,Item){
					if (Item[variable]){
						return true;
					}
					return false;
				};
				this["tests"].push(func);
			};
			if (this.strings.position){
				var tryposition = this.strings.position;
				var func = function(state,Item){
					if (state.tmp.force_subsequent && tryposition < 2){
						return true;
					} else if (Item["position"] && Item["position"] >= tryposition){
						return true;
					};
					return false;
				};
				this.tests.push(func);
			}
			if (! this.evaluator){
				//
				// cut and paste of "any"
				this.evaluator = function(state,Item){
					var res = this.fail;
					state.tmp.jump.replace("fail");
					for each (var func in this.tests){
						if (func.call(this,state,Item)){
							res = this.succeed;
							state.tmp.jump.replace("succeed");
							break;
						}
					}
					return res;
				};
			};
		}
		if (this.tokentype == CSL.END){
			var closingjump = function(state,Item){
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this["execs"].push(closingjump);
		};
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			// jump index on failure
			this["fail"] = state.configure["fail"][(state.configure["fail"].length-1)];
			this["succeed"] = this["next"];
		} else {
			// jump index on success
			this["succeed"] = state.configure["succeed"][(state.configure["succeed"].length-1)];
			this["fail"] = this["next"];
		}
	}
};


/**
 * The else-if node, start and end.
 * @name CSL.Lib.Elements.else-if
 * @function
 */
CSL.Lib.Elements["else-if"] = new function(){
	this.build = build;
	this.configure = configure;
	//
	// these function are the same as those in if, might just clone
	function build (state,target){
		if (this.tokentype == CSL.START){
			for each (var variable in this.variables){
				var func = function(state,Item){
					if (Item[variable]){
						return true;
					}
					return false;
				};
				this["tests"].push(func);
			};
			if (this.strings.position){
				var tryposition = this.strings.position;
				var func = function(state,Item){
					if (state.tmp.force_subsequent && tryposition < 2){
						return true;
					} else if (Item["position"] && Item["position"] >= tryposition){
						return true;
					};
					return false;
				};
				this.tests.push(func);
			}
			if (! this.evaluator){
				//
				// cut and paste of "any"
				this.evaluator = function(state,Item){
					var res = this.fail;
					state.tmp.jump.replace("fail");
					for each (var func in this.tests){
						if (func.call(this,state,Item)){
							res = this.succeed;
							state.tmp.jump.replace("succeed");
							break;
						}
					}
					return res;
				};
			};
		}
		if (this.tokentype == CSL.END){
			var closingjump = function(state,Item){
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this["execs"].push(closingjump);
		};
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			// jump index on failure
			this["fail"] = state.configure["fail"][(state.configure["fail"].length-1)];
			this["succeed"] = this["next"];
			state.configure["fail"][(state.configure["fail"].length-1)] = pos;
		} else {
			// jump index on success
			this["succeed"] = state.configure["succeed"][(state.configure["succeed"].length-1)];
			this["fail"] = this["next"];
		}
	}
};


/**
 * The else node, start and end.
 * @name CSL.Lib.Elements.else
 * @function
 */
CSL.Lib.Elements["else"] = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			state.configure["fail"][(state.configure["fail"].length-1)] = pos;
		}
	}
};


/**
 * The name node.
 * @name CSL.Lib.Elements.name
 * @function
 */
CSL.Lib.Elements.name = new function(){
	this.build = build;
	function build(state,target){

		state.build.form = this.strings.form;
		state.build.name_flag = true;

		var func = function(state,Item){
			state.output.addToken("name",false,this);
		};
		this["execs"].push(func);

		var set_initialize_with = function(state,Item){
			state.tmp["initialize-with"] = this.strings["initialize-with"];
		};
		this["execs"].push(set_initialize_with);


		target.push(this);
	};
};


/**
 * The name node.
 * @name CSL.Lib.Elements.name-part
 * @function
 */
CSL.Lib.Elements["name-part"] = new function(){
	this.build = build;
	function build(state,target){
		// XXXXX problem.  can't be global.  don't want to remint
		// for every rendering.  somehow get tokens stored on
		// closing names tag static.  always safe, b/c
		// no conditional branching inside names.
		// same treatment for etal styling element.
		var set_namepart_format = function(state,Item){
			state.output.addToken(state.tmp.namepart_type,false,this);
		};
		this["execs"].push(set_namepart_format);
		target.push(this);
	};
};


/**
 * The label node.
 * <p>A plural-sensitive localized label.</p>
 * @name CSL.Lib.Elements.label
 * @function
 */
CSL.Lib.Elements.label = new function(){
	this.build = build;
	/*
	 * Account for form option.
	 */
	function build(state,target){
		if (state.build.name_flag){
			this.strings.label_position = CSL.AFTER;
		} else {
			this.strings.label_position = CSL.BEFORE;
		}
		var set_label_info = function(state,Item){
		//	if (!this.strings.form){
		//		this.strings.form = "long";
		//	}
			state.output.addToken("label",false,this);
		};
		this["execs"].push(set_label_info);
		if (state.build.term){
			var term = state.build.term;
			var plural = 0;
			if (!this.strings.form){
				this.strings.form = "long";
			}
			var form = this.strings.form;
			//
			// XXXXX: probably wrong.  needs a test.
			//
			if (state.build.plural){
				plural = state.build.plural;
			}
			var output_label = function(state,Item){
				if ("locator" == term){
					myterm = Item["label"];
				}
				if (!myterm){
					myterm = "page";
				}
				var myterm = state.getTerm(myterm,form,plural);
				if (this.strings["include-period"]){
					myterm += ".";
				}
				state.output.append(myterm,this);
			};
			this.execs.push(output_label);
			state.build.plural = false;
			state.build.term = false;
			state.build.form = false;
		}
		target.push(this);
	};
};


/**
 * The substitute node.
 * <p>A special conditional environment for use inside a names node.
 * Just used to record whether a name was found in the main element.</p>
 * @name CSL.Lib.Elements.substitute
 * @function
 */
CSL.Lib.Elements.substitute = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			var set_conditional = function(state,Item){
				if (state.tmp.value.length){
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
			};
			this.execs.push(set_conditional);
			target.push(this);
		}
	};
};


/**
 * The et-al node.
 * <p>This is a formatting hook for the et-al string
 * that is appended to truncated name sets.  It also
 * permits the specification of the "and others" localized
 * term for use instead of the standard et-al string.</p>
 */
CSL.Lib.Elements["et-al"] = new function(){
	this.build = build;
	function build(state,target){
		var set_et_al_format = function(state,Item){
			state.output.addToken("etal",false,this);
		};
		this["execs"].push(set_et_al_format);
		target.push(this);
	};
};


/**
 * The layout node.
 * <p>The tag environment that marks the end of option declarations
 * and encloses the renderable tags.</p>
 * @name CSL.Lib.Elements.layout
 * @function
 */
CSL.Lib.Elements.layout = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			state.build.layout_flag = true;
			//
			// done_vars is used to prevent the repeated
			// rendering of variables
			var initialize_done_vars = function(state,Item){
				state.tmp.done_vars = new Array();
				state.tmp.no_name_rendered = true;
				state.tmp.rendered_name = false;
			};
			this.execs.push(initialize_done_vars);

			var set_opt_delimiter = function(state,Item){
				// just in case
				state.tmp.sort_key_flag = false;
				state[state.tmp.area].opt.delimiter = "";
				if (this.strings.delimiter){
					state[state.tmp.area].opt.delimiter = this.strings.delimiter;
				};
			};
			this["execs"].push(set_opt_delimiter);

			var reset_nameset_counter = function(state,Item){
				state.tmp.nameset_counter = 0;
			};
			this["execs"].push(reset_nameset_counter);

			var declare_thyself = function(state,Item){
				state.tmp.term_predecessor = false;
				state[state.tmp.area].opt.layout_prefix = this.strings.prefix;
				state[state.tmp.area].opt.layout_suffix = this.strings.suffix;
				state[state.tmp.area].opt.layout_decorations = this.decorations;
				state.output.openLevel("empty");
			};
			this["execs"].push(declare_thyself);
			target.push(this);
			if (state.build.area == "citation"){
				var prefix_token = new CSL.Factory.Token("text",CSL.SINGLETON);
				var func = function(state,Item){
					if (Item["prefix"]){
						var sp = "";
						if (Item["prefix"].match(/.*[a-zA-Z\u0400-\u052f].*/)){
							var sp = " ";
						}
						state.output.append((Item["prefix"]+sp),this);
					};
				};
				prefix_token["execs"].push(func);
				target.push(prefix_token);
			}
		};
		if (this.tokentype == CSL.END){
			state.build.layout_flag = false;
			if (state.build.area == "citation"){
				var suffix_token = new CSL.Factory.Token("text",CSL.SINGLETON);
				var func = function(state,Item){
					if (Item["suffix"]){
						var sp = "";
						if (Item["suffix"].match(/.*[a-zA-Z\u0400-\u052f].*/)){
							var sp = " ";
						}
						state.output.append((sp+Item["suffix"]),this);
					};
				};
				suffix_token["execs"].push(func);
				target.push(suffix_token);
			}
			var mergeoutput = function(state,Item){
				state.output.closeLevel();
				// state.tmp.name_quash = new Object();
			};
			this["execs"].push(mergeoutput);
			target.push(this);
		}
	};
};


CSL.Lib.Elements.number = new function(){
	this.build = build;
	function build(state,target){
		CSL.Util.substituteStart(state,target);
		//
		// This should push a rangeable object to the queue.
		//
		if (this.strings.form == "roman"){
			this.formatter = state.fun.romanizer;
		}
		var push_number = function(state,Item){
			var num = parseInt(Item[this.variables[0]], 10);
			var number = new CSL.Output.Number(num,this);
			state.output.append(number,"literal");
		};
		this["execs"].push(push_number);
		target.push(this);
		CSL.Util.substituteEnd(state,target);
	};
};


CSL.Lib.Elements.date = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			CSL.Util.substituteStart(state,target);
			var set_value = function(state,Item){
				state.tmp.element_rendered_ok = false;
				if (this.variables.length && Item[this.variables[0]]){
					state.tmp.date_object = Item[this.variables[0]];
				}
			};
			this["execs"].push(set_value);

			var newoutput = function(state,Item){
				state.output.startTag("date",this);
			};
			this["execs"].push(newoutput);

		} else if (this.tokentype == CSL.END){
			var mergeoutput = function(state,Item){
				if (!state.tmp.element_rendered_ok || state.tmp.date_object["literal"]){
					state.output.append(state.tmp.date_object["literal"],"empty");
				}
				state.output.endTag();
			};
			this["execs"].push(mergeoutput);
		}
		target.push(this);

		if (this.tokentype == CSL.END){
			CSL.Util.substituteEnd(state,target);
		};
	};
};


CSL.Lib.Elements["date-part"] = new function(){
	this.build = build;
	function build(state,target){
		var value = "";
		if (!this.strings.form){
			this.strings.form = "long";
		}
		var render_date_part = function(state,Item){
			if (state.tmp.date_object){
				value = state.tmp.date_object[this.strings.name];
			};
			var real = !state.tmp.suppress_decorations;
			var have_collapsed = state.tmp.have_collapsed;
			var invoked = state[state.tmp.area].opt.collapse == "year-suffix";
			var precondition = state[state.tmp.area].opt["disambiguate-add-year-suffix"];
			//
			// XXXXX: need a condition for year as well?
			if (real && precondition && invoked){
				state.tmp.years_used.push(value);
				var known_year = state.tmp.last_years_used.length >= state.tmp.years_used.length;
				if (known_year && have_collapsed){
					if (state.tmp.last_years_used[(state.tmp.years_used.length-1)] == value){
						value = false;
					}
				}
			}
			if (value){
				if (this.strings.form){
					value = CSL.Util.Dates[this.strings.name][this.strings.form](state,value);
				}
				//state.output.startTag(this.strings.name,this);
				state.output.append(value,this);
				//state.output.endTag();
			};
			state.tmp.value = new Array();
		};
		this["execs"].push(render_date_part);
		target.push(this);
	};
};


CSL.Lib.Elements.option = new function(){
	this.build = build;
	function build(state,target){
		if (this.strings.name == "collapse"){
			// only one collapse value will be honoured.
			if (this.strings.value){
				state[state.tmp.area].opt.collapse = this.strings.value;
			}
		}
		if (CSL.ET_AL_NAMES.indexOf(this.strings.name) > -1){
			if (this.strings.value){
				state[state.build.area].opt[this.strings.name] = parseInt(this.strings.value, 10);
			}
		}
		if (CSL.DISAMBIGUATE_OPTIONS.indexOf(this.strings.name) > -1){
			state[state.tmp.area].opt[this.strings.name] = true;
		}
		if ("year-suffix-delimiter" == this.strings.name){
			state[state.tmp.area].opt["year-suffix-delimiter"] = this.strings.value;
		}
		if ("year-suffix-range-delimiter" == this.strings.name){
			state[state.tmp.area].opt["year-suffix-range-delimiter"] = this.strings.value;
		}
		if ("after-collapse-delimiter" == this.strings.name){
			state[state.tmp.area].opt["after-collapse-delimiter"] = this.strings.value;
		}
		target.push(this);
	};
};


CSL.Lib.Elements.bibliography = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			state.build.area_return = state.build.area;
			state.build.area = "bibliography";
		}
		if (this.tokentype == CSL.END){
			state.build.area = state.build.area_return;
		}
		target.push(this);
	};
};


CSL.Lib.Elements.sort = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			state.build.sort_flag  = true;
			state.build.area_return = state.build.area;
			state.build.area = state.build.area+"_sort";
		};
		if (this.tokentype == CSL.END){
			state.build.area = state.build.area_return;
			state.build.sort_flag  = false;
		}
	};
};


CSL.Lib.Elements.key = new function(){
	this.build = build;
	function build(state,target){
		var start_key = new CSL.Factory.Token("key",CSL.START);
		start_key.strings["et-al-min"] = this.strings["et-al-min"];
		start_key.strings["et-al-use-first"] = this.strings["et-al-use-first"];
		var initialize_done_vars = function(state,Item){
			state.tmp.done_vars = new Array();
		};
		start_key.execs.push(initialize_done_vars);

		var sort_direction = new Array();
		if (this.strings.sort_direction == CSL.DESCENDING){
			sort_direction.push(1);
			sort_direction.push(-1);
		} else {
			sort_direction.push(-1);
			sort_direction.push(1);
		}
		state[state.build.area].opt.sort_directions.push(sort_direction);

		var et_al_init = function(state,Item){
			state.tmp.sort_key_flag = true;
			if (this.strings["et-al-min"]){
				state.tmp["et-al-min"] = this.strings["et-al-min"];
			}
			if (this.strings["et-al-use-first"]){
				state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
			}
		};
		start_key["execs"].push(et_al_init);
		target.push(start_key);
		//
		// ops to initialize the key's output structures
		if (this.variables.length){
			var single_text = new CSL.Factory.Token("text",CSL.SINGLETON);
			single_text.variables = this.variables.slice();

			var output_variables = function(state,Item){
				for each(var variable in single_text.variables){
					if (variable == "citation-number"){
						state.output.append(state.registry.registry[Item["id"]].seq.toString(),"empty");
					} else if (CSL.DATE_VARIABLES.indexOf(variable) > -1) {
						state.output.append(CSL.Util.Dates.year["long"](state,Item[variable]["year"]));
						state.output.append(CSL.Util.Dates.month["numeric-leading-zeros"](state,Item[variable]["month"]));
						state.output.append(CSL.Util.Dates.day["numeric-leading-zeros"](state,Item[variable]["day"]));
					} else {
						state.output.append(Item[variable],"empty");
					}
				}
			};
			single_text["execs"].push(output_variables);
			target.push(single_text);
		} else {
			//
			// if it's not a variable, it's a macro
			var token = new CSL.Factory.Token("text",CSL.SINGLETON);
			token.postponed_macro = this.postponed_macro;
			CSL.Factory.expandMacro.call(state,token);
		}
		//
		// ops to output the key string result to an array go
		// on the closing "key" tag before it is pushed.
		// Do not close the level.
		var end_key = new CSL.Factory.Token("key",CSL.END);
		var store_key_for_use = function(state,Item){
			var keystring = state.output.string(state,state.output.queue);
			if (false){
				print("keystring: "+keystring);
			}
			state[state.tmp.area].keys.push(keystring);
			state.tmp.value = new Array();
		};
		end_key["execs"].push(store_key_for_use);
		var reset_key_params = function(state,Item){
			// state.tmp.name_quash = new Object();
			state.tmp["et-al-min"] = false;
			state.tmp["et-al-use-first"] = false;
			state.tmp.sort_key_flag = false;
		};
		end_key["execs"].push(reset_key_params);
		target.push(end_key);
	};
};
