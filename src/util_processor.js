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
	return function(state,list) {
		if (!list){
			return "";
		} else if ("string" == typeof list){
			return template.replace("%%STRING%%",list);
		};
		CSL.debug("USING is_delimiter (1) ... WHY?");
		var decor = template.split("%%STRING%%");
		var ret = [{"is_delimiter":true,"value":decor[0]}].concat(list);
		ret.push({"is_delimiter":true,"value":decor[1]});
		return ret;
	};
};


/**
 * Two-tiered substitutions gadget.
 * <p>This is used for
 * options like (now defunct) "font-family", where the option value
 * cannot be determined until the attribute is processed.
 * Need for this function might be reviewed at some point ...</p>
 * @param {String} template A template containing
 * <code>%%STRING%%</code> and <code>%%PARAM%%</code>
 * placeholders.  See {@link CSL.Output.Formats.html} for
 * examples.
 */
CSL.Factory.substituteTwo = function(template) {
	return function(param) {
		var template2 = template.replace("%%PARAM%%", param);
		return function(state,list) {
			if ("string" == typeof list){
				return template2.replace("%%STRING%%",list);
			}
			CSL.debug("USING is_delimiter (2) ... WHY?");
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
		if ("@" != param[0]){
			decorations[param] = params[param];
			continue;
		}
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
 * Generate a separate list of formatting attributes.
 * <p>This generates a list of tuples containing attribute
 * information relevant to output formatting, in the order
 * fixed in the constant {@link CSL.FORMAT_KEY_SEQUENCE}.
 * This function is called during {@link CSL.Core.Build}.
 * Formatting hints are distilled to functions
 * later, in the second compilation pass ({@link CSL.Core.Configure}).</p>
 * @param {Object} state The state object returned by
 * {@link CSL.Engine}.
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

