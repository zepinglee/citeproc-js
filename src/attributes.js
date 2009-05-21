dojo.provide("csl.attributes");
if (!CSL) {
    load("./src/csl.js");
}

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
	this.strings.name = arg;
};


/**
 * Store the form attribute (of a term node) on the state object.
 * <p>For reference when the closing node of a macro
 * or locale definition is encountered.</p>
 * @name CSL.Lib.Attributes.@form
 * @function
 */
CSL.Lib.Attributes["@form"] = function(state,arg){
	//
	// This looks meaningless
	//
	//if (!arg){
	//	arg = "long";
	//}
	this.strings.form = arg;
};

/**
 * Store macro tokens in a buffer on the state object.
 * <p>For reference when the enclosing text token is
 * processed.</p>
 * @name CSL.Lib.Attributes.@macro
 * @function
 */
CSL.Lib.Attributes["@macro"] = function(state,arg){
	state.build.postponed_macro = arg;
};


/*
 * Store the term tokens on the singleton buffer.
 * <p>This works the same as a macro</p>
 * XXXXX Terms have to be
 * carried in a hash object anyway, to account for
 * singular and plural forms.  This should be a function
 * that ends up in execs, the same as value and
 * variable.  the string content should come from
 * state.opt.term[key][key][0 or 1].
 * @name CSL.Lib.Attributes.@suffix
 * @function
 */
CSL.Lib.Attributes["@term"] = function(state,arg){
	if (this.name == "et-al"){
		if (state.opt.term[arg]){
			this.strings.et_al_term = state.opt.term[arg]["long"][0];
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
 * Store class attribute in state config object.
 * @name CSL.Lib.Attributes.@class
 * @function
 */
CSL.Lib.Attributes["@class"] = function(state,arg){
	state.opt["class"] = arg;
};



/*
 * Store item type evaluation function on token.
 * @name CSL.Lib.Attributes.@type
 * @function
 */
CSL.Lib.Attributes["@type"] = function(state,arg){
	if (this.name == "name-part") {
		//
		// Note that there will be multiple name-part items,
		// and they all need to be collected before doing anything.
		// So this must be picked up when the <name-part/>
		// element is processed, and used as a key on an
		// object holding the formatting attribute functions.
		state.tmp.namepart_type = arg;
	} else {
		var func = function(state,Item){
			if(Item.type == arg){
				return true;
			}
			return false;
		};
		this["tests"].push(func);
	}

};


/*
 * Store variable retrieval function on token.
 * <p>Returned function will return the variable value
 * or values as an array.</p>
 * @name CSL.Lib.Attributes.@variable
 * @function
 */
CSL.Lib.Attributes["@variable"] = function(state,arg){
	if (["label","names","date","text","number"].indexOf(this.name) > -1) {
		this.variables = arg.split(/\s+/);
	} else if (this.name == "key"){
		this.variables = arg.split(/\s+/);
	} else if (["if","else-if"].indexOf(this.name) > -1){
		var variables = arg.split(/\s+/);
		for each (var variable in variables){
			var func = function(state,Item){
				if (Item[variable]){
					return true;
				}
				return false;
			};
			this["tests"].push(func);
		};
	};
};


/**
 * Store "and" flag on the token
 * @name CSL.Lib.Attributes.@and
 * @function
 */
CSL.Lib.Attributes["@and"] = function(state,arg){
	if ("symbol" == arg){
		this.strings["and"] = " & ";
	} else {
		var and = state.opt.term["and"]["long"][0];
		if (and.match(/.*[a-zA-Z\u0400-\u052f].*/)){
			and = ", "+and+" ";
		}
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
			var evaluator = function(state,Item){
				var res = this.succeed;
				state.tmp.jump.replace("succeed");
				for each (var func in this.tests){
					if (func.call(this,state,Item)){
						res = this.fail;
						state.tmp.jump.replace("fail");
						break;
					}
				}
				return res;
			};
		} else if ("any" == arg){
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
		} else if ("all" == arg){
			var evaluator = function(state,Item){
				var res = this.succeed;
				state.tmp.jump.replace("succeed");
				for each (var func in this.tests){
					if (!func.call(this,state,Item)){
						res = this.fail;
						state.tmp.jump.replace("fail");
						break;
					}
				}
				return res;
			};
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

};


CSL.Lib.Attributes["@locator"] = function(state,arg){

};


CSL.Lib.Attributes["@include-period"] = function(state,arg){

};


CSL.Lib.Attributes["@position"] = function(state,arg){

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
