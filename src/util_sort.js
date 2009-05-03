dojo.provide("csl.util_sort");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * Helper functions for constructing sort keys.
 * @namespace Sort key utilities
 */
CSL.Util.Sort = new function(){};

/**
 * Strip prepositions from a string
 * <p>Used when generating sort keys.</p>
 */
CSL.Util.Sort.strip_prepositions = function(str){
	var m = str.toLocaleLowerCase().match(/((a|an|the)\s+)/);
	if (m){
		str = str.substr(m[1].length);
	};
	return str;
};

