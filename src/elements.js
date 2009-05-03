dojo.provide("csl.elements");
if (!CSL) {
    load("./src/csl.js");
}

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
 * The style element.
 * @name CSL.Lib.Elements.style
 * @function
 */
CSL.Lib.Elements.style = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START){
			if (!state.build.lang){
				state.build.lang = "en";
			}
			state.opt.lang = state.build.lang;
			state.build.in_style = true;
			state.build.lang = false;
			state.opt.term = CSL.System.Retrieval.getLocaleObjects(state.opt.lang,state.opt.locale);
			state.tmp.term_predecessor = false;
		} else {
			state.tmp.disambig_request = false;
			state.build.in_style = false;
		}
		if (this.tokentype == CSL.START){
			var func = function(state,Item){
				if (state.tmp.disambig_request  && ! state.tmp.disambig_override){
					state.tmp.disambig_settings = state.tmp.disambig_request;
				} else if (state.registry.registry[Item.id] && ! state.tmp.disambig_override) {
					state.tmp.disambig_request = state.registry.registry[Item.id].disambig;
					state.tmp.disambig_settings = state.registry.registry[Item.id].disambig;
				} else {

					state.tmp.disambig_settings = new CSL.Factory.AmbigConfig();
				}
			};
			state["init"].push(func);
			var tracking_info_init = function(state,Item){
				state.tmp.names_used = new Array();
				state.tmp.nameset_counter = 0;
				state.tmp.years_used = new Array();
			};
			state["init"].push(tracking_info_init);

			var splice_init = function(state,Item) {
				state.tmp.splice_delimiter = state[state.tmp.area].opt.delimiter;
			};
			state["init"].push(splice_init);

			var sort_keys_init = function(state,Item) {
				state["bibliography_sort"].keys = new Array();
				state["citation_sort"].keys = new Array();
			};
			state["init"].push(sort_keys_init);

		};
		if (this.tokentype == CSL.END){
			var set_splice = function(state,Item){
				//
				// set the inter-cite join delimiter
				// here.
				if (state.tmp.last_suffix_used && state.tmp.last_suffix_used.match(/.*[-.,;:]$/)){
					state.tmp.splice_delimiter = " ";
				} else if (state.tmp.prefix.value() && state.tmp.prefix.value().match(/^[,,:;a-z].*/)){
					state.tmp.splice_delimiter = " ";
				} else if (state.tmp.last_suffix_used || state.tmp.prefix.value()){
					//
					// forcing the delimiter back to normal if a
					// suffix or prefix touch the join, even if
					// a year-suffix is the only output.
					state.tmp.splice_delimiter = state[state.tmp.area].opt.delimiter;
				} else {
					// XXXX year-suffix must have been used for special
					// XXXX delimiter to be invoked here.
				}
			};
			state["stop"].push(set_splice);
			var set_lastvals = function(state,Item){
				state.tmp.last_suffix_used = state.tmp.suffix.value();
				state.tmp.last_years_used = state.tmp.years_used.slice();
				state.tmp.last_names_used = state.tmp.names_used.slice();
			};
			state["stop"].push(set_lastvals);
			var func = function(state,Item){
				state.tmp.disambig_request = false;
			};
			state["stop"].push(func);
		}
	}
};


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

/**
 * The text element.
 * @name CSL.Lib.Elements.text
 * @function
 */
CSL.Lib.Elements.text = new function(){
	this.build = build;
	function build (state,target){
		//
		// CSL permits macros to be called before they
		// are declared.  We file a placeholder token unless we are
		// in the layout area, and when in the layout area we scan
		// any inserted macros for nested macro calls, and explode
		// them.
		if (state.build.postponed_macro){
			//
			// XXXX Could catch undeclared macros here.
			//
			if ( ! state.build.layout_flag && ! state.build.sort_flag){
				//
				// Fudge it with a placeholder if we're not yet
				// inside the layout area.
				this.postponed_macro = state.build.postponed_macro;
				target.push(this);
			} else {
				//
				// tag this token with the name of the postponed macro
				this.postponed_macro = state.build.postponed_macro;
				//
				// push an implict group token with the strings and
				// decorations of the invoking text tag
				var start_token = new CSL.Factory.Token("group",CSL.START);
				for (i in this.strings){
					start_token.strings[i] = this.strings[i];
				}
				start_token.decorations = this.decorations;
				var newoutput = function(state,Item){
					state.output.startTag("group",this);
					//state.tmp.decorations.push(this.decorations);
				};
				start_token["execs"].push(newoutput);
				target.push(start_token);

				//
				// Special handling for text macros inside a substitute
				// environment.
				if (state.build.names_substituting){
					//
					// A text macro inside a substitute environment is
					// treated as a special conditional.
					var choose_start = new CSL.Factory.Token("choose",CSL.START);
					target.push(choose_start);
					var if_start = new CSL.Factory.Token("if",CSL.START);
					//
					// Here's the Clever Part.
					// Set a test of the shadow if token to skip this
					// macro if we have acquired a name value.
					var check_for_variable = function(state,Item){
						if (state.tmp.value){
							return true;
						}
						return false;
					};
					if_start.tests.push(check_for_variable);
					//
					// this is cut-and-paste of the "any" evaluator
					// function, from Attributes.  These functions
					// should be defined in a namespace for reuse.
					var evaluator = function(state,Item){
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
					if_start.evaluator = evaluator;
					target.push(if_start);

					var macro = CSL.Factory.expandMacro.call(state,this);
					for each (var t in macro){
						target.push(t);
					}

					var if_end = new CSL.Factory.Token("if",CSL.END);
					target.push(if_end);
					var choose_end = new CSL.Factory.Token("choose",CSL.END);
					target.push(choose_end);
				} else {
					var macro = CSL.Factory.expandMacro.call(state,this);
					for each (var t in macro){
						target.push(t);
					}
				}

				var end_token = new CSL.Factory.Token("group",CSL.END);
				var mergeoutput = function(state,Item){
					//
					// rendering happens inside the
					// merge method, by applying decorations to
					// each token to be merged.
					state.output.endTag();
				};
				end_token["execs"].push(mergeoutput);
				target.push(end_token);

				state.build.names_substituting = false;
			}
			state.build.postponed_macro = false;
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
					this.strings.is_rangeable = true;
					var func = function(state,Item){
						var id = Item["id"];
						if (!state.tmp.force_subsequent){
							var num = state.registry.registry[id].seq;
							//
							// DO SOMETHING USEFUL HERE
							//
							var number = new CSL.Output.Number(num,this);
							state.output.append(number,"literal");
						}
					};
					this["execs"].push(func);
				} else if (variable == "year-suffix"){
					var func = function(state,Item){
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
							//state.output.append(state.registry.registry[Item.id].disambig[2],this);
							var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
							var number = new CSL.Output.Number(num,this);
							var formatter = new CSL.Util.Disambiguate.Suffixator(CSL.SUFFIX_CHARS);
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
					term = state.opt.term[term][form][plural];
					var printterm = function(state,Item){
						// capitalize the first letter of a term, if it is the
						// first thing rendered in a citation (or if it is
						// being rendered immediately after terminal punctuation,
						// I guess, actually).
						if (!state.tmp.term_predecessor){
							//print("Capitalize");
							term = CSL.Output.Formatters.capitalize_first(term);
							state.tmp.term_predecessor = false;
						};
						state.output.append(term,this);
					};
					this["execs"].push(printterm);
					state.build.term = false;
					state.build.form = false;
					state.build.plural = false;
				} else if (variable){
					var func = function(state,Item){
						if (this.variables.length){
							state.fun.mark_output(state,Item[variable]);
							state.output.append(Item[variable],this);
							//state.tmp.value.push(Item[variable]);
						}
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
	}
};


/**
 * Macro node, start and end.
 * <p>Because macros are expanded into the body of the style,
 * their element function requires only a build method.</p>
 * @name CSL.Lib.Elements.macro
 * @function
 */
CSL.Lib.Elements.macro = new function(){
	this.build = build;
	/*
	 * Executed on token
	 */
	function build (state,target){
		if (this.tokentype == CSL.START){
			state.build.name = this.strings.name;
			var bufferlist = new Array();
			state.build.children.push(bufferlist);
		} else {
			//
			// catch repeated declarations of the same macro name
			if (state.build.macro[state.build.name]){
				throw "CSL processor error: repeated declaration of macro \""+state.build.name+"\"";
			}
			//
			// is this slice really needed?
			state.build.macro[state.build.name] = target.slice();
			state.build.name = false;
			state.build.children = new Array();;
		}
	}
};


/**
 * Locale node, start and end.
 * <p>Sets a flag on the state, to cause terms to
 * be stored in a state object for later processing.</p>
 * @name CSL.Lib.Elements.locale
 */
CSL.Lib.Elements.locale = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			if (state.opt.lang && state.build.lang != state.opt.lang){
				state.build.skip = true;
			} else {
				state.build.skip = false;
			}
		}
	}
};


/**
 * Terms node.
 * <p>This is a noop.</p>
 * @name CSL.Lib.Elements.terms
 * @function
 */
CSL.Lib.Elements.terms = new function(){
	this.build = build;
	function build(state,target){
	}
};


/**
 * Term node, start and end.
 * @name CSL.Lib.Elements.term
 * @function
 */
CSL.Lib.Elements.term = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START){
			var bufferlist = new Array();
			state.build.children.push(bufferlist);
			state.build.name = this.strings.name;
			state.build.form = this.strings.form;

		} else {
			if (state.build.text){
				var single = new CSL.Factory.Token("single",CSL.SINGLETON);
				var multiple = new CSL.Factory.Token("multiple",CSL.SINGLETON);
				target.push(single);
				target.push(multiple);
				for (i in target){
					target[i]["string"] = state.build.text;
				}
				state.build.text = false;
			}
			// set strings from throwaway tokens to term object
			var termstrings = new Array();
			// target should be pointing at the state.build.children
			// array, set by the start tag above
			for (i in target){
				termstrings.push(target[i].string);
			}
			// initialize object for this term
			if (!state.opt.term[state.build.name]){
				state.opt.term[state.build.name] = new Object();
			}
			//
			// long writes to long and any unused form key.
			//
			// short writes to short and to symbol if it is unused
			//
			// verb writes to verb and to verb-short if it is unused
			//
			// symbol and verb-short write only to themselves
			if (!state.build.form){
				state.build.form = "long";
			}
			var keywrites = new Object();
			keywrites["long"] = ["verb-short","symbol","verb","short","long"];
			keywrites["short"] = ["symbol"];
			keywrites["verb"] = ["verb-short"];
			keywrites["symbol"] = [];
			keywrites["verb-short"] = [];
			// forced write
			state.opt.term[state.build.name][state.build.form] = termstrings;
			if ( !state.build.in_style ){
				// shy write, performed only when external locale
				// is loaded.
				for each (var key in keywrites[state.build.form]){
					if (!state.opt.term[state.build.name][key]){
						state.opt.term[state.build.name][key] = termstrings;
					}
				}
			}
			state.build.name = false;
			state.build.form = false;
			state.build.children = new Array();
		}
	}
};


/**
 * Single term node.
 * @name CSL.Lib.Elements.single
 * @function
 */
CSL.Lib.Elements.single = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.END){
			this["string"] = state.build.text;
			this["key"] = state.build.name;
			state.build.text = false;
			target.push(this);
		}
	}
};

/**
 * Multiple term node.
 * @name CSL.Lib.Elements.multiple
 * @function
 */
CSL.Lib.Elements.multiple = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.END){
			this["string"] = state.build.text;
			this["key"] = state.build.name;
			state.build.text = false;
			target.push(this);
		}
	}
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
			state.configure["fail"].push((pos+1));
			state.configure["succeed"].push((pos+1));
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
			if (!this.strings.form){
				this.strings.form = "long";
			}
			state.output.addToken("label",false,this);
		};
		this["execs"].push(set_label_info);
		target.push(this);
	};
};


/**
 * The substitute node.
 * <p>A special conditional environment for use inside a names node.</p>
 * @name CSL.Lib.Elements.substitute
 * @function
 */
CSL.Lib.Elements.substitute = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			state.build.names_substituting = true;
			var declare_thyself = function(state,Item){
				state.tmp.names_substituting = true;
			};
			this["execs"].push(declare_thyself);
		};
		target.push(this);
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
				//
				// This is not very pretty.
				//
				state[state.tmp.area].opt.layout_prefix = this.strings.prefix;
				state[state.tmp.area].opt.layout_suffix = this.strings.suffix;
				state[state.tmp.area].opt.layout_decorations = this.decorations;
				state.output.openLevel("empty");
			};
			this["execs"].push(declare_thyself);

		};
		if (this.tokentype == CSL.END){
			state.build.layout_flag = false;
			var mergeoutput = function(state,Item){
				state.output.closeLevel();
				state.tmp.name_quash = new Object();
			};
			this["execs"].push(mergeoutput);
		}
		target.push(this);
	};
};


CSL.Lib.Elements.number = new function(){
	this.build = build;
	function build(state,target){
		target.push(this);
	};
};


CSL.Lib.Elements.date = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			var set_value = function(state,Item){
				state.tmp.value.push(Item[this.variables[0]]);
			};
			this["execs"].push(set_value);

			var newoutput = function(state,Item){
				state.output.startTag("date",this);
			};
			this["execs"].push(newoutput);

		} else if (this.tokentype == CSL.END){
			var mergeoutput = function(state,Item){
				state.output.endTag();
			};
			this["execs"].push(mergeoutput);
		}
		target.push(this);
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
			for each (var val in state.tmp.value){
				value = val[this.strings.name];
				break;
			};
			var real = !state.tmp.suppress_decorations;
			var invoked = state[state.tmp.area].opt.collapse == "year-suffix";
			var precondition = state[state.tmp.area].opt["disambiguate-add-year-suffix"];
			if (real && precondition && invoked){
				state.tmp.years_used.push(value);
				var known_year = state.tmp.last_years_used.length >= state.tmp.years_used.length;
				if (known_year){
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
				state[state.tmp.area].opt[this.strings.name] = parseInt(this.strings.value, 10);
			}
		}
		if (CSL.DISAMBIGUATE_OPTIONS.indexOf(this.strings.name) > -1){
			state[state.tmp.area].opt[this.strings.name] = true;
		}
		if ("year-suffix-delimiter" == this.strings.name){
			state[state.tmp.area].opt["year-suffix-delimiter"] = this.strings.value;
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

			//var init_sort_keys = function(state,Item){
			//	state.tmp.sort_keys = new Array();
			//};
			//this["execs"].push(init_sort_keys);
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
		}
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
			//
			// should default to the area value, with these as override.
			// be sure that the area-level value is set correctly, then
			// do this up.  lots of inheritance, so lots of explicit
			// conditions, but it's all very systematic and boring.
			//
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
		if (state.build.key_is_variable){
			state.build.key_is_variable = false;
			var single_text = new CSL.Factory.Token("text",CSL.SINGLETON);
			single_text["execs"] = this["execs"].slice();
			var output_variables = function(state,Item){
				for each(var val in state.tmp.value){
					if (val == "citation-number"){
						state.output.append(state.registry.registry[Item["id"]].seq.toString(),"empty");
					} else {
						state.output.append(val,"empty");
					}
				}
			};
			single_text["execs"].push(output_variables);
			target.push(single_text);
		} else {
			//


			// if it's not a variable, it's a macro
			var token = new CSL.Factory.Token("text",CSL.SINGLETON);
			token.postponed_macro = state.build.postponed_macro;
			var macro = CSL.Factory.expandMacro.call(state,token);
			for each (var t in macro){
				target.push(t);
			}
			state.build.postponed_macro = false;
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
			state.tmp.name_quash = new Object();
			state.tmp["et-al-min"] = false;
			state.tmp["et-al-use-first"] = false;
			state.tmp.sort_key_flag = false;
		};
		end_key["execs"].push(reset_key_params);
		target.push(end_key);
	};
};
