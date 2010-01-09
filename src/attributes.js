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
CSL.Attributes = {};

CSL.Attributes["@class"] = function(state,arg){
	state.opt["class"] = arg;
};

CSL.Attributes["@version"] = function(state,arg){
	state.opt["version"] = arg;
}

/**
 * Store the value attribute on the token.
 * @name CSL.Attributes.@value
 * @function
 */
CSL.Attributes["@value"] = function(state,arg){
	this.strings.value = arg;
};


/**
 * Store the name attribute (of a macro or term node)
 * on the state object.
 * <p>For reference when the closing node of a macro
 * or locale definition is encountered.</p>
 * @name CSL.Attributes.@name
 * @function
 */
CSL.Attributes["@name"] = function(state,arg){
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
 * @name CSL.Attributes.@form
 * @function
 */
CSL.Attributes["@form"] = function(state,arg){
	this.strings.form = arg;
};

CSL.Attributes["@date-parts"] = function(state,arg){
	this.strings["date-parts"] = arg;
};

CSL.Attributes["@range-delimiter"] = function(state,arg){
	this.strings["range-delimiter"] = arg;
};

/**
 * Store macro tokens in a buffer on the state object.
 * <p>For reference when the enclosing text token is
 * processed.</p>
 * @name CSL.Attributes.@macro
 * @function
 */
CSL.Attributes["@macro"] = function(state,arg){
	this.postponed_macro = arg;
};


CSL.Attributes["@term"] = function(state,arg){
	if (this.name == "et-al"){
		if (CSL.locale[state.opt.lang].terms[arg]){
			this.strings.et_al_term = state.getTerm(arg,"long",0);
		} else {
			this.strings.et_al_term = arg;
		}
	} else {
		state.build.term = arg;
	}
};


/*
 * Ignore xmlns attribute.
 * <p>This should always be <p>http://purl.org/net/xbiblio/csl</code>
 * anyway.  At least for the present we will blindly assume
 * that it is.</p>
 * @name CSL.Attributes.@xmlns
 * @function
 */
CSL.Attributes["@xmlns"] = function(state,arg){};


/*
 * Store language attribute to a buffer field.
 * <p>Will be placed in the appropriate location
 * when the element is processed.</p>
 * @name CSL.Attributes.@lang
 * @function
 */
CSL.Attributes["@lang"] = function(state,arg){
	if (arg){
		state.build.lang = arg;
	}
};


/*
 * Store item type evaluation function on token.
 * @name CSL.Attributes.@type
 * @function
 */
CSL.Attributes["@type"] = function(state,arg){
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
 * @name CSL.Attributes.@variable
 * @function
 */
CSL.Attributes["@variable"] = function(state,arg){
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
		var set_variable_names = function(state,Item){
			var variables = this.variables.slice();
			this.variables = [];
			for each (var variable in variables){
				if (state.tmp.done_vars.indexOf(variable) == -1){
					this.variables.push(variable);
				};
				if (state.tmp.can_block_substitute){
					state.tmp.done_vars.push(variable);
				};
			};
		};
		this.execs.push(set_variable_names);

		var check_for_output = function(state,Item,item){
			var output = false;
			for each (var variable in this.variables){
				if ("locator" == variable){
					if (item && item.locator){
						output = true;
						break;
					};
				} else if ("object" == typeof Item[variable]){
					for (i in Item[variable]){
						output = true;
						break;
					}
				} else if ("string" == typeof Item[variable] && Item[variable]){
					output = true;
					break;
				} else if ("number" == typeof Item[variable]){
					output = true;
					break;
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
			//	CSL.debug("Output! "+this.variables);
			//} else {
			//	CSL.debug("No output! "+this.variables);
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

/*
 * Store suffix string on token.
 * @name CSL.Attributes.@suffix
 * @function
 */
CSL.Attributes["@suffix"] = function(state,arg){
	this.strings.suffix = arg;
};


/*
 * Store prefix string on token.
 * @name CSL.Attributes.@prefix
 * @function
 */
CSL.Attributes["@prefix"] = function(state,arg){
	this.strings.prefix = arg;
};


/*
 * Store delimiter string on token.
 * @name CSL.Attributes.@delimiter
 * @function
 */
CSL.Attributes["@delimiter"] = function(state,arg){
	this.strings.delimiter = arg;
};


/*
 * Store match evaluator on token.
 */
CSL.Attributes["@match"] = function(state,arg){
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

CSL.Attributes["@uncertain-date"] = function(state,arg){
	var variables = arg.split(/\s+/);
	for each (var variable in variables){
		var func = function(state,Item){
			if (Item[variable] && Item[variable].circa){
				return true;
			}
			return false;
		};
		this["tests"].push(func);
	};
};

CSL.Attributes["@is-numeric"] = function(state,arg){
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


CSL.Attributes["@names-min"] = function(state,arg){
	this.strings["et-al-min"] = parseInt(arg, 10);
};

CSL.Attributes["@names-use-first"] = function(state,arg){
	this.strings["et-al-use-first"] = parseInt(arg,10);
};

CSL.Attributes["@sort"] = function(state,arg){
	if (arg == "descending"){
		this.strings.sort_direction = CSL.DESCENDING;
	}
}


CSL.Attributes["@plural"] = function(state,arg){
	if ("always" == arg){
		this.strings.plural = 1;
	} else if ("never" == arg){
		this.strings.plural = 0;
	};
};


CSL.Attributes["@locator"] = function(state,arg){

};


CSL.Attributes["@position"] = function(state,arg){
	state.opt.update_mode = CSL.POSITION;
	if (arg == "first"){
		this.strings.position = CSL.POSITION_FIRST;
	} else if (arg == "subsequent"){
		this.strings.position = CSL.POSITION_SUBSEQUENT;
	} else if (arg == "ibid") {
		this.strings.position = CSL.POSITION_IBID;
	} else if (arg == "ibid-with-locator"){
		this.strings.position = CSL.POSITION_IBID_WITH_LOCATOR;
	} else if (arg == "near-note"){
		this.strings["near-note-distance-check"] = true;
	};
};


CSL.Attributes["@disambiguate"] = function(state,arg){
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

CSL.Attributes["@givenname-disambiguation-rule"] = function(state,arg){
	if (CSL.GIVENNAME_DISAMBIGUATION_RULES.indexOf(arg) > -1) {
		state[this.name].opt["givenname-disambiguation-rule"] = arg;
	};
};

CSL.Attributes["@collapse"] = function(state,arg){
	// only one collapse value will be honoured.
	if (arg){
		state[this.name].opt.collapse = arg;
	};
};



CSL.Attributes["@names-delimiter"] = function(state,arg){
	state.setOpt(this,"names-delimiter", arg);
}

CSL.Attributes["@name-form"] = function(state,arg){
	state.setOpt(this,"name-form", arg);
}

CSL.Attributes["@name-delimiter"] = function(state,arg){
	state.setOpt(this,"name-delimiter", arg);
}

CSL.Attributes["@et-al-min"] = function(state,arg){
	state.setOpt(this,"et-al-min", parseInt(arg, 10));
};

CSL.Attributes["@et-al-use-first"] = function(state,arg){
	state.setOpt(this,"et-al-use-first", parseInt(arg, 10));
};

CSL.Attributes["@et-al-subsequent-min"] = function(state,arg){
	state.setOpt(this,"et-al-subsequent-min", parseInt(arg, 10));
};

CSL.Attributes["@et-al-subsequent-use-first"] = function(state,arg){
	state.setOpt(this,"et-al-subsequent-use-first", parseInt(arg, 10));
};

CSL.Attributes["@truncate-min"] = function(state,arg){
	this.strings["truncate-min"] = parseInt(arg,10);
};

CSL.Attributes["@suppress-min"] = function(state,arg){
	this.strings["suppress-min"] = parseInt(arg,10);
};


CSL.Attributes["@and"] = function(state,arg){
	var myarg = "&";
	if ( "text" == arg) {
		var and = state.getTerm("and","long",0);
		myarg = and;
	}
	state.setOpt(this,"and",myarg);
};

CSL.Attributes["@delimiter-precedes-last"] = function(state,arg){
	state.setOpt(this,"delimiter-precedes-last",arg);
};

CSL.Attributes["@initialize-with"] = function(state,arg){
	state.setOpt(this,"initialize-with",arg);
};

CSL.Attributes["@name-as-sort-order"] = function(state,arg){
	state.setOpt(this,"name-as-sort-order",arg);
};

CSL.Attributes["@sort-separator"] = function(state,arg){
	state.setOpt(this,"sort-separator",arg);
};



CSL.Attributes["@year-suffix-delimiter"] = function(state,arg){
	state[this.name].opt["year-suffix-delimiter"] = arg;
};

CSL.Attributes["@after-collapse-delimiter"] = function(state,arg){
	state[this.name].opt["after-collapse-delimiter"] = arg;
};

CSL.Attributes["@subsequent-author-substitute"] = function(state,arg){
	state[this.name].opt["subsequent-author-substitute"] = arg;
};

CSL.Attributes["@disambiguate-add-names"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["disambiguate-add-names"] = true;
	};
};

CSL.Attributes["@disambiguate-add-givenname"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["disambiguate-add-givenname"] = true;
	};
};

CSL.Attributes["@disambiguate-add-year-suffix"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["disambiguate-add-year-suffix"] = true;
	};
};


CSL.Attributes["@second-field-align"] = function(state,arg){
	if (arg == "flush" || arg == "margin"){
		state[this.name].opt["second-field-align"] = arg;
	};
};


CSL.Attributes["@hanging-indent"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["hangingindent"] = 2;
	};
};


CSL.Attributes["@line-spacing"] = function(state,arg){
	if (arg && arg.match(/^[.0-9]+$/)){
			state[this.name].opt["linespacing"] = parseFloat(arg,10);
	};
};


CSL.Attributes["@entry-spacing"] = function(state,arg){
	if (arg && arg.match(/^[.0-9]+$/)){
			state[this.name].opt["entryspacing"] = parseFloat(arg,10);
	};
};


CSL.Attributes["@near-note-distance"] = function(state,arg){
	state[this.name].opt["near-note-distance"] = parseInt(arg,10);
};

CSL.Attributes["@page-range-format"] = function(state,arg){
	state.opt["page-range-format"] = arg;
};

CSL.Attributes["@text-case"] = function(state,arg){
	this.strings["text-case"] = arg;
};


CSL.Attributes["@page-range-format"] = function(state,arg){
	state.opt["page-range-format"] = arg;
}


CSL.Attributes["@default-locale"] = function(state,arg){
	var lst = arg;
	lst = lst.split(/-x-(sort|pri|sec|name)-/);
	var l = lst.length;
	for (var pos=1; pos<l; pos += 2){
		state.opt[("locale-"+lst[pos])].push(lst[(pos+1)].replace(/^\s*/g,"").replace(/\s*$/g,""));
	};
	if (l){
		state.opt["default-locale"] = lst.slice(0,1);
	} else {
		state.opt["default-locale"] = ["en"];
	}
}

CSL.Attributes["@demote-non-dropping-particle"] = function(state,arg){
	state.opt["demote-non-dropping-particle"] = arg;
}

CSL.Attributes["@initialize-with-hyphen"] = function(state,arg){
	if (arg == "false"){
		state.opt["initialize-with-hyphen"] = false;
	}
}

CSL.Attributes["@institution-parts"] = function(state,arg){
	this.strings["institution-parts"] = arg;
};

CSL.Attributes["@if-short"] = function(state,arg){
	if (arg == "true"){
		this.strings["if-short"] = true;
	};
};

CSL.Attributes["@substitute-use-first"] = function(state,arg){
	if (arg.match(/^[0-9]+$/)){
		this.strings["substitute-use-first"] = parseInt(arg,10);
	};
};

CSL.Attributes["@use-first"] = function(state,arg){
	if (arg.match(/^[0-9]+$/)){
		this.strings["use-first"] = parseInt(arg,10);
	};
};

CSL.Attributes["@use-last"] = function(state,arg){
	if (arg.match(/^[0-9]+$/)){
		this.strings["use-last"] = parseInt(arg,10);
	};
};


CSL.Attributes["@reverse-order"] = function(state,arg){
	if ("true" == arg){
		this.strings["reverse-order"] = true;
	};
};
