dojo.provide("csl.attributes");

/**
 * Functions corresponding to CSL attribute
 * names (no idea why JsDoc insists on printing
 * the function names twice).
 * <p>Used by Build.
 * Non-formatting attributes are distilled into
 * functions ready to execute without arguments
 * when {@link CSL.Core.Build} is run.</p>
 * <p>JsDoc is definitely not happy with my coding
 * style here; none of the attribute functions come
 * through in the online documentation.  You'll have
 * to refer directly to the source code for information
 * on these.</p>
 * @class
 */
CSL.Lib.Attributes = {};

/**
 * Store the value attribute on the token.
 * @name CSL.Lib.Attributes.@value
 * @function
 */
CSL.Lib.Attributes["@value"] = function(state,arg){
	this.strings.value = arg;
};


/**
 * Store the name attribute (of a macro or term node)
 * on the state object.
 * <p>For reference when the closing node of a macro
 * or locale definition is encountered.</p>
 * @name CSL.Lib.Attributes.@name
 * @function
 */
CSL.Lib.Attributes["@name"] = function(state,arg){
	if (this.name == "name-part") {
		//
		// Note that there will be multiple name-part items,
		// and they all need to be collected before doing anything.
		// So this must be picked up when the <name-part/>
		// element is processed, and used as a key on an
		// object holding the formatting attribute functions.
		state.tmp.namepart_type = arg;
	} else {
		this.strings.name = arg;
	};
};


/**
 * Store the form attribute (of a term node) on the state object.
 * <p>For reference when the closing node of a macro
 * or locale definition is encountered.</p>
 * @name CSL.Lib.Attributes.@form
 * @function
 */
CSL.Lib.Attributes["@form"] = function(state,arg){
	this.strings.form = arg;
};

CSL.Lib.Attributes["@date-parts"] = function(state,arg){
	this.strings["date-parts"] = arg;
};

/**
 * Store macro tokens in a buffer on the state object.
 * <p>For reference when the enclosing text token is
 * processed.</p>
 * @name CSL.Lib.Attributes.@macro
 * @function
 */
CSL.Lib.Attributes["@macro"] = function(state,arg){
	this.postponed_macro = arg;
};


/*
 * Store the term tokens on the singleton buffer.
 * <p>This works the same as a macro</p>
 * XXXXX Terms have to be
 * carried in a hash object anyway, to account for
 * singular and plural forms.  This should be a function
 * that ends up in execs, the same as value and
 * variable.  the string content should come from
 * state.getTerm(key,key,0or1).
 * @name CSL.Lib.Attributes.@suffix
 * @function
 */
CSL.Lib.Attributes["@term"] = function(state,arg){
	if (this.name == "et-al"){
		if (state.locale_terms[arg]){
			this.strings.et_al_term = state.getTerm(arg,"long",0);
		} else {
			this.strings.et_al_term = arg;
		}
	}
	state.build.term = arg;
};


/*
 * Ignore xmlns attribute.
 * <p>This should always be <p>http://purl.org/net/xbiblio/csl</code>
 * anyway.  At least for the present we will blindly assume
 * that it is.</p>
 * @name CSL.Lib.Attributes.@xmlns
 * @function
 */
CSL.Lib.Attributes["@xmlns"] = function(state,arg){};


/*
 * Store language attribute to a buffer field.
 * <p>Will be placed in the appropriate location
 * when the element is processed.</p>
 * @name CSL.Lib.Attributes.@lang
 * @function
 */
CSL.Lib.Attributes["@lang"] = function(state,arg){
	if (arg){
		state.build.lang = arg;
	}
};


/*
 * Store item type evaluation function on token.
 * @name CSL.Lib.Attributes.@type
 * @function
 */
CSL.Lib.Attributes["@type"] = function(state,arg){
		var func = function(state,Item){
			var types = arg.split(/\s+/);
			var ret = [];
			for each (var type in types){
				ret.push(Item.type == type);
			}
			return ret;
		};
		this["tests"].push(func);
};


/*
 * Store variable retrieval function on token.
 * <p>Returned function will return the variable value
 * or values as an array.</p>
 * @name CSL.Lib.Attributes.@variable
 * @function
 */
CSL.Lib.Attributes["@variable"] = function(state,arg){
	this.variables = arg.split(/\s+/);
	if ("label" == this.name && this.variables[0]){
		state.build.term = this.variables[0];
	} else if (["names","date","text","number"].indexOf(this.name) > -1) {
		//
		// An oddity of variable handling is that this.variables
		// is actually ephemeral; the full list of variables is
		// held in the inner var, and pushed into this.variables
		// conditionally in order to suppress repeat renderings of
		// the same item variable.
		//
		// Do not suppress repeat renderings of dates.
		//
		var set_variable_names = function(state,Item){
			var variables = this.variables.slice();
			this.variables = [];
			for each (var variable in variables){
				if (state.tmp.done_vars.indexOf(variable) == -1){
					this.variables.push(variable);
					if ("date" != this.name){
						state.tmp.done_vars.push(variable);
					};
				};
			};
		};
		this.execs.push(set_variable_names);

		var check_for_output = function(state,Item){
			var output = false;
			for each (var variable in this.variables){
				if ("object" == typeof Item[variable]){
					for (i in Item[variable]){
						output = true;
						break;
					}
				} else if ("string" == typeof Item[variable] && Item[variable]){
					output = true;
				} else if ("number" == typeof Item[variable]){
					output = true;
				}
				if (output){
					break;
				}
			}
			if (output){
				state.tmp.term_sibling.replace( true );
				state.tmp.can_substitute.replace(false, CSL.LITERAL);
			} else {
				if (undefined == state.tmp.term_sibling.value()) {
					state.tmp.term_sibling.replace( false, CSL.LITERAL );
				};
			};
			//if (output){
			//	print("Output! "+this.variables);
			//} else {
			//	print("No output! "+this.variables);
			//}
		};
		this.execs.push(check_for_output);
	} else if (["if", "else-if"].indexOf(this.name) > -1){
		var check_for_variable_value = function(state,Item){
			var ret = [];
			for each(variable in this.variables){
				var x = false;
				if (Item[variable]){
					if ("number" == typeof Item[variable] || "string" == typeof Item[variable]){
						x = true;
					} else if ("object" == typeof Item[variable]){
						if (Item[variable].length){
							x = true;
						} else {
							//
							// this will turn true only for hash objects
							// that have at least one attribute.
							//
							for (var i in Item[variable]){
								x = true;
								break;
							};
						};
					};
				};
				ret.push(x);
			};
			return ret;
		};
		this.tests.push(check_for_variable_value);
	};
};


/**
 * Store "and" flag on the token
 * @name CSL.Lib.Attributes.@and
 * @function
 */
CSL.Lib.Attributes["@and"] = function(state,arg){
	if ("symbol" == arg){
		this.strings["and"] = "&";
	} else {
		var and = state.getTerm("and","long",0);
		this.strings["and"] = and;
	}
};

/**
 * Store "initialize-with" string in build object
 * @name CSL.Lib.Attributes.@initialize_with
 * @function
 */
CSL.Lib.Attributes["@initialize-with"] = function(state,arg){
	this.strings["initialize-with"] = arg;
};


/*
 * Store suffix string on token.
 * @name CSL.Lib.Attributes.@suffix
 * @function
 */
CSL.Lib.Attributes["@suffix"] = function(state,arg){
	this.strings.suffix = arg;
};


/*
 * Store prefix string on token.
 * @name CSL.Lib.Attributes.@prefix
 * @function
 */
CSL.Lib.Attributes["@prefix"] = function(state,arg){
	this.strings.prefix = arg;
};


/*
 * Store delimiter string on token.
 * @name CSL.Lib.Attributes.@delimiter
 * @function
 */
CSL.Lib.Attributes["@delimiter"] = function(state,arg){
	this.strings.delimiter = arg;
};


/*
 * Store match evaluator on token.
 */
CSL.Lib.Attributes["@match"] = function(state,arg){
	if (this.tokentype == CSL.START){
		if ("none" == arg){
			var evaluator = state.fun.match.none;
		} else if ("any" == arg){
			var evaluator = state.fun.match.any;
		} else if ("all" == arg){
			var evaluator = state.fun.match.all;
		} else {
			throw "Unknown match condition \""+arg+"\" in @match";
		}
		this.evaluator = evaluator;
	};
};

CSL.Lib.Attributes["@sort-separator"] = function(state,arg){
	this.strings["sort-separator"] = arg;
};


CSL.Lib.Attributes["@delimiter-precedes-last"] = function(state,arg){
	this.strings["delimiter-precedes-last"] = arg;
};


CSL.Lib.Attributes["@name-as-sort-order"] = function(state,arg){
	this.strings["name-as-sort-order"] = arg;
};


CSL.Lib.Attributes["@is-numeric"] = function(state,arg){
	var variables = arg.split(/\s+/);
	for each (var variable in variables){
		var func = function(state,Item){
			if (CSL.NUMERIC_VARIABLES.indexOf(variable) == -1){
				return false;
			}
			var val = Item[variable];
			if (typeof val == "undefined"){
				return false;
			}
			if (typeof val == "number"){
				val = val.toString();
			}
			if (typeof val != "string"){
				return false;
			}
			if (val.match(CSL.QUOTED_REGEXP)){
				return false;
			}
			if (val.match(CSL.NUMBER_REGEXP)){
				return true;
			}
			return false;
		};
		this["tests"].push(func);
	};

};


CSL.Lib.Attributes["@names-min"] = function(state,arg){
	this.strings["et-al-min"] = parseInt(arg, 10);
};

CSL.Lib.Attributes["@names-use-first"] = function(state,arg){
	this.strings["et-al-use-first"] = parseInt(arg,10);
};

CSL.Lib.Attributes["@sort"] = function(state,arg){
	if (arg == "descending"){
		this.strings.sort_direction = CSL.DESCENDING;
	}
}


CSL.Lib.Attributes["@plural"] = function(state,arg){
	if ("always" == arg){
		this.strings.plural = 1;
	} else if ("never" == arg){
		this.strings.plural = 0;
	};
};


CSL.Lib.Attributes["@locator"] = function(state,arg){

};


CSL.Lib.Attributes["@position"] = function(state,arg){
	if (arg == "subsequent"){
		this.strings.position = CSL.POSITION_SUBSEQUENT;
	} else if (arg == "ibid") {
		this.strings.position = CSL.POSITION_IBID;
	} else if (arg == "ibid-with-locator"){
		this.strings.position = CSL.POSITION_IBID_WITH_LOCATOR;
	} else if (arg == "near-note"){
		this.strings["near-note-distance"] = state[state.tmp.area].opt["near-note-distance"];
	};
};


CSL.Lib.Attributes["@disambiguate"] = function(state,arg){
	if (this.tokentype == CSL.START && ["if","else-if"].indexOf(this.name) > -1){
		if (arg == "true"){
			state.opt.has_disambiguate = true;
			var func = function(state,Item){
				if (state.tmp.disambig_settings["disambiguate"]){
					return true;
				}
				return false;
			};
			this["tests"].push(func);
		};
	};
};
