dojo.provide("csl.factory");
if (!CSL) {
   load("./src/csl.js");
}

/**
 * Factory functions to build the token list representation of a style.
 * <p>The functions here are invoked via {@link CSL.Core.Build} and {@link CSL.Core.Configure}.</p>
 * @namespace Factory functions to create precompiled token objects from XML source.
 */
CSL.Factory = {};


CSL.Factory.version = function(){
	var msg = "\"Entropy\" citation processor (a.k.a. citeproc-js) ver.0.01";
	print(msg);
	return msg;
};


/**
 * Convert XML node to token.
 * <p>This is called on an XML node.  After extracting the name and attribute
 * information from the node, it performs three operations.  Attribute information
 * relating to output formatting is stored on the node as an array of tuples,
 * which fixes the sequence of execution of output functions to be invoked
 * in the next phase of processing.  Other attribute information is reduced
 * to functions, and is pushed into an array on the token in no particular
 * order, for later execution.  The element name is used as a key to
 * invoke the relevant <code>build</code> method of the target element.
 * Element methods are defined in {@link CSL.Lib.Elements}.</p>
 * @param {Object} state  The state object returned by {@link CSL.Core.Engine}.
 * @param {Int} tokentype  A CSL namespace constant (<code>CSL.START</code>,
 * <code>CSL.END</code> or <code>CSL.SINGLETON</code>.
 */
CSL.Factory.XmlToToken = function(state,tokentype){
	var name = state.build.xmlCommandInterface.nodename.call(this);
	// print(tokentype + " : " + name);
	if (state.build.skip && state.build.skip != name){
		return;
	}
	if (!name){
		var txt = state.build.xmlCommandInterface.content.call(this);
		if (txt){
			state.build.text = txt;
		}
		return;
	}
	if ( ! CSL.Lib.Elements[state.build.xmlCommandInterface.nodename.call(this)]){
		throw "Undefined node name \""+name+"\".";
	}
	var attrfuncs = new Array();
	var attributes = state.build.xmlCommandInterface.attributes.call(this);
	var decorations = CSL.Factory.setDecorations.call(this,state,attributes);
	var token = new CSL.Factory.Token(name,tokentype);
	for (var key in attributes){
		try {
			var attrfunc = CSL.Lib.Attributes[key].call(token,state,attributes[key]);
		} catch (e) {
			if (e == "TypeError: Cannot call method \"call\" of undefined"){
				throw "Unknown attribute \""+key+"\" in node \""+name+"\" while processing CSL file";
			} else {
				throw "CSL processor error, "+key+" attribute: "+e;
			}
		}
		if (attrfunc){
			attrfuncs.push(attrfunc);
		}
	}
	token.decorations = decorations;
	if (state.build.children.length){
		var target = state.build.children[0];
	} else {
		var target = state[state.build.area].tokens;
	}
	CSL.Lib.Elements[name].build.call(token,state,target);
};


CSL.Factory.mark_output = function(state,content){
	if (content){
		state.tmp.term_sibling.replace( true );
	} else {
		if (undefined == state.tmp.term_sibling.value()) {
			state.tmp.term_sibling.replace( false, CSL.LITERAL );
		}
	}
}

/**
 * Generate a separate list of formatting attributes.
 * <p>This generates a list of tuples containing attribute
 * information relevant to output formatting, in the order
 * fixed in the constant {@link CSL.FORMAT_KEY_SEQUENCE}.
 * This function is called during {@link CSL.Core.Build}.
 * Formatting hints are distilled to functions
 * later, in the second compilation pass ({@link CSL.Core.Configure}).</p>
 * @param {Object} state The state object returned by
 * {@link CSL.Core.Engine}.
 * @param {Object} attributes The hash object containing
 * the attributes and values extracted from an XML node.
 */
CSL.Factory.setDecorations = function(state,attributes){
	// This applies a fixed processing sequence
	var ret = new Array();
	for each (var key in CSL.FORMAT_KEY_SEQUENCE){
		if (attributes[key]){
			ret.push([key,attributes[key]]);
			delete attributes[key];
		}
	}
	return ret;
};

/**
 * Generate string formatting functions.
 * <p>This function is executed in the context of a token
 * by {@link CSL.Core.Configure}.
 * The list of formatting attributes stored on the token
 * is replaced with a list of compiled functions.
 * This is applied by {@link CSL.Core.Configure}.
 * @param {Array} state The state object returned by
 * {@link CSL.Core.Engine}.
 */
CSL.Factory.renderDecorations = function(state){
	var ret = new Array();
	for each (hint in this.decorations){
		ret.push(state.fun.decorate[hint[0]][hint[1]]);
	}
	this.decorations = ret;
};


/**
 * Substitution gadget.
 * <p>Creates a function for
 * delivering a string merged to a pre-defined template
 * with a minimum of fuss.</p>
 * @param {String} template A template containing
 * a <code>%%STRING%%</code> placeholder.  See
 * {@link CSL.Output.Formats.html} for examples.
 */
CSL.Factory.substituteOne = function(template) {
	return function(list) {
		if ("string" == typeof list){
			return template.replace("%%STRING%%",list);
		}
		var decor = template.split("%%STRING%%");
		var ret = [{"is_delimiter":true,"value":decor[0]}].concat(list);
		ret.push({"is_delimiter":true,"value":decor[1]});
		return ret;
	};
};


/**
 * Two-tiered substitutions gadget.
 * <p>This is used for
 * options like "font-family", where the option value
 * cannot be determined until the attribute is processed.</p>
 * @param {String} template A template containing
 * <code>%%STRING%%</code> and <code>%%PARAM%%</code>
 * placeholders.  See {@link CSL.Output.Formats.html} for
 * examples.
 */
CSL.Factory.substituteTwo = function(template) {
	return function(param) {
		var template2 = template.replace("%%PARAM%%", param);
		return function(list) {
			if ("string" == typeof list){
				return template2.replace("%%STRING%%",list);
			}
			var decor = template2.split("%%STRING");
			var ret = [{"is_delimiter":true,"value":decor[0]}].concat(list);
			ret.push({"is_delimiter":true,"value":decor[1]});
			return ret;
		};
	};
};

/**
 * Generate string functions for designated output mode.
 * <p>Only "html" (the default) is supported at present.</p>
 * @param {String} mode Either "html" or "rtf", eventually.
 */
CSL.Factory.Mode = function(mode){
	var decorations = new Object();

	var params = CSL.Output.Formats[mode];
	for (var param in params) {
		var func = false;
		var val = params[param];
		var args = param.split('/');

		if (typeof val == "string" && val.indexOf("%%STRING%%") > -1)  {
			if (val.indexOf("%%PARAM%%") > -1) {
				func = CSL.Factory.substituteTwo(val);
			} else {
				func = CSL.Factory.substituteOne(val);
			}
		} else if (typeof val == "boolean" && !val) {
			func = CSL.Output.Formatters.passthrough;
		} else if (typeof val == "function") {
			func = val;
		} else {
			throw "CSL.Compiler: Bad "+mode+" config entry for "+param+": "+val;
		}

		if (args.length == 1) {
			decorations[args[0]] = func;
		} else if (args.length == 2) {
			if (!decorations[args[0]]) {
				decorations[args[0]] = new Object();
			}
			decorations[args[0]][args[1]] = func;
		}
	}
	return decorations;
};


/**
 * Macro expander.
 * <p>Called on the state object.</p>
 */
CSL.Factory.expandMacro = function(macro_key_token){
	var mkey = macro_key_token.postponed_macro;
	if (this.build.macro_stack.indexOf(mkey) > -1){
		throw "CSL processor error: call to macro \""+mkey+"\" would cause an infinite loop";
	} else {
		this.build.macro_stack.push(mkey);
	}
	var ret = new Array();
	//
	// XXXXX This implicit group stuff can be dropped, I think.
	// XXXXX Macros don't take decorations or anything.
	var start_token = new CSL.Factory.Token("group",CSL.START);
	ret.push(start_token);

	for (var i in this.build.macro[mkey]){
		//
		// could use for each; this was an attempt to get a
		// fresh copy of the token to defeat a loop involving
		// interaction between sort and citation render.  had
		// no effect, probably not needed.
		var token = this.build.macro[mkey][i];
		if (token.postponed_macro){
			//
			// nested expansion
			ret.concat(CSL.Factory.expandMacro.call(this,token));
		} else {
			//
			// clone the token, so that navigation pointers are
			// specific to the token list into which the macro
			//  is being expanded.
			var newtoken = new Object();
			for (i in token) {
				newtoken[i] = token[i];
			}
			ret.push(newtoken);
		}
	}

	var end_token = new CSL.Factory.Token("group",CSL.END);
	ret.push(end_token);

	this.build.macro_stack.pop();

	return ret;
};


CSL.Factory.cloneAmbigConfig = function(config){
	var ret = new Object();
	ret["names"] = new Array();
	ret["givens"] = new Array();
	ret["year_suffix"] = false;
	ret["disambiguate"] = false;
	for (var i in config["names"]){
		var param = config["names"][i];
		ret["names"][i] = param;
	}
	for (var i in config["givens"]){
		var param = new Array();
		for (var j in config["givens"][i]){
			param.push(config["givens"][i][j]);
		}
		ret["givens"].push(param);
	}
	ret["year_suffix"] = config["year_suffix"];
	ret["disambiguate"] = config["disambiguate"];
	return ret;
};
