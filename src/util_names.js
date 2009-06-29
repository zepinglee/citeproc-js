dojo.provide("csl.util_names");


/**
 * Helper functions for constructing names and namesets.
 * @namespace Name construction utilities
 */
CSL.Util.Names = new function(){};

/**
 * Build a set of names, less any label or et al. tag
 */
CSL.Util.Names.outputNames = function(state,display_names){

	var segments = new this.StartMiddleEnd(state,display_names);
	var sort_order = state.output.getToken("name").strings["name-as-sort-order"];
	if (sort_order == "first"){
		state.output.addToken("start");
		state.output.getToken("start").strings.name_as_sort_order = true;
	} else if (sort_order == "all"){
		state.output.addToken("start");
		state.output.getToken("start").strings.name_as_sort_order = true;
		state.output.addToken("middle");
		state.output.getToken("middle").strings.name_as_sort_order = true;
		state.output.addToken("end");
		state.output.getToken("end").strings.name_as_sort_order = true;
	}
	var and = state.output.getToken("name").strings.delimiter;
	if (state.output.getToken("name").strings["delimiter-precedes-last"] == "always"){
		and = state.output.getToken("inner").strings.delimiter+and;
	} else if (state.output.getToken("name").strings["delimiter-precedes-last"] == "never"){
		if (!and){
			and = state.output.getToken("inner").strings.delimiter;
		}
	} else if ((segments.segments.start.length + segments.segments.middle.length) > 1){
		and = state.output.getToken("inner").strings.delimiter+and;
	} else {
		if (!and){
			and = state.output.getToken("inner").strings.delimiter;
		}
	}
	if (and.match(/^[&a-zA-Z\u0400-\u052f].*/)){
		and = " "+and;
	}
	if (and.match(/.*[&a-zA-Z\u0400-\u052f]$/)){
		and = and+" ";
	}
	state.output.getToken("name").strings.delimiter = and;

	state.output.openLevel("name");
	state.output.openLevel("inner");
	segments.outputSegmentNames("start");
	segments.outputSegmentNames("middle");
	state.output.closeLevel(); // inner
	segments.outputSegmentNames("end");
	state.output.closeLevel(); // name
};

CSL.Util.Names.StartMiddleEnd = function(state,names){
	this.state = state;
	this.nameoffset = 0;
	//
	// what to do here?  we need config for this, tokens to
	// control the joining that will come.  how do we get
	// them into this function?
	var start = names.slice(0,1);
	var middle = names.slice(1,(names.length-1));
	var endstart = 1;
	if (names.length > 1){
		endstart = (names.length-1);
	}
	var end = names.slice(endstart,(names.length));
	var ret = {};
	ret["start"] = start;
	ret["middle"] = middle;
	ret["end"] = end;
	this.segments = ret;
};

CSL.Util.Names.StartMiddleEnd.prototype.outputSegmentNames = function(seg){
	var state = this.state;
	for (var namenum in this.segments[seg]){
		this.namenum = parseInt(namenum,10);
		this.name = this.segments[seg][namenum];
		if (this.name.literal){
			//
			// XXXXX Separate formatting for institution names?
			// XXXXX This needs to be firmly settled in xbib.
			//
			state.output.append(this.name.literal);
		} else {
			var sequence = CSL.Util.Names.getNamepartSequence(this.name,state.output.getToken(seg));

			state.output.openLevel(sequence[0][0]);
			state.output.openLevel(sequence[0][1]);
			state.output.openLevel(sequence[0][2]);
			this.outputNameParts(sequence[1]);

			state.output.closeLevel();
			state.output.openLevel(sequence[0][2]);

			// XXX cloned code!  make this a function.
			this.outputNameParts(sequence[2]);

			state.output.closeLevel();
			state.output.closeLevel();
			//
			// articular goes here  //
			//
			this.outputNameParts(sequence[3]);

			state.output.closeLevel();

			//
			// the articular goes in at a different level, but
			// is nonetheless part of the name, so it goes into
			// this function to avoid repetition.
			// (special handling when comma is to be included)
			//if (name.suffix){
			//	state.output.squeeze();
			//	if (name.comma_suffix){
			//		state.tmp.delimiter.replace(", ");
			//	}
			//	state.output.append(name.suffix);
			//}
		}
	};
	this.nameoffset += this.segments[seg].length;
}

CSL.Util.Names.StartMiddleEnd.prototype.outputNameParts = function(subsequence){
	var state = this.state;
	for each (var key in subsequence){
		var namepart = this.name[key];
		if ("secondary-key" == key && !this.name.sticky){
			if (0 == state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][(this.namenum+this.nameoffset)]){
				continue;
			} else if (1 == state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][(this.namenum+this.nameoffset)]){
				namepart = CSL.Util.Names.initializeWith(namepart,state.tmp["initialize-with"]);
			}
		}
		//state.output.openLevel(key);
		state.output.append(namepart,key);
		//state.output.closeLevel();
	}
}

CSL.Util.Names.getNamepartSequence = function(name,token){
	// Set the rendering order and separators of the core nameparts
	// sequence[0][0] separates elements inside each of the the two lists
	// sequence[0][1] separates the two lists
	if (name.comma_suffix){
		var suffix_sep = "commasep";
	} else {
		var suffix_sep = "space";
	}
	var romanesque = name["primary-key"].match(/.*[a-zA-Z\u0400-\u052f].*/);
	if (!romanesque ){ // neither roman nor Cyrillic characters
		var sequence = [["empty","empty","empty"],["prefix", "primary-key"],["secondary-key"],[]];
	} else if (name.sticky) { // entry likes sort order
		var sequence = [["space","space","space"],["prefix", "primary-key"],["secondary-key"],[]];
	} else if (token && token.strings.name_as_sort_order){
		var sequence = [["sortsep","sortsep","space"],["prefix", "primary-key"],["secondary-key"],["suffix"]];
	} else { // plain vanilla
		var sequence = [[suffix_sep,"space","space"],["secondary-key"],["prefix","primary-key"],["suffix"]];
	}
	return sequence;
};

CSL.Util.Names.deep_copy = function(nameset){
	var nameset2 = new Array();
	for each (name in nameset){
		var name2 = new Object();
		for (var i in name){
			name2[i] = name[i];
		}
		nameset2.push(name2);
	}
	return nameset2;
}


/**
 * Reinitialize scratch variables used by names machinery.
 */
//
// XXXX A handy guide to variable assignments that need
// XXXX to be eliminated.  :)
//
CSL.Util.Names.reinit = function(state,Item){
	//
	// Author vars should render only once.  This flag
	// can be used to quash unwanted renderings.
	//
	// XXXXX: Replaced by more general mechanism for
	// quashing repeat variable renderings.
	//
	//for each (namevar in state.tmp.value){
	//	state.tmp.name_quash[namevar.type] = true;
	//}
	state.tmp.value = new Array();
	state.tmp.name_et_al_term = false;
	state.tmp.name_et_al_decorations = false;


	state.tmp.name_et_al_form = "long";
	state.tmp["et-al-min"] = false;
	state.tmp["et-al-use-first"] = false;
	state.tmp["initialize-with"] = false;
	state.tmp["name-as-sort-order"] = false;
	state.tmp.et_al_prefix = false;
};

CSL.Util.Names.getCommonTerm = function(state,namesets){
	if (namesets.length < 2){
		return false;
	}
	var base_nameset = namesets[0];
	var varnames = new Array();
	if (varnames.indexOf(base_nameset.type) == -1){
		varnames.push(base_nameset.type);
	}
	for each (nameset in namesets.slice(1)){
		if (!CSL.Util.Names.compareNamesets(base_nameset,nameset)){
			return false;
		}
		if (varnames.indexOf(nameset.type) == -1){
			varnames.push(nameset.type);
		}
	}
	varnames.sort();
	return varnames.join("");
};


CSL.Util.Names.compareNamesets = function(base_nameset,nameset){
	//
	// These might not be namesets at all.  They could be variables
	// gleaned from entire groups.  And -- yikes -- those groups
	// could include names, couldn't they.  Something needs to be
	// done at the validation level to keep this under control.
	// Otherwise we're going to have to track rendered values,
	// which is not possible with the current model -- we can't
	// render just one element, it's the whole cite or nothing.
	// Sucks.
	//
	if (base_nameset.length != nameset.length){
		return false;
	}
	var name;
	for (var n in nameset.names){
		name = nameset.names[n];
		for each (var part in ["primary-key","secondary-key","prefix","suffix"]){
			if (base_nameset.names[n][part] != name[part]){
				return false;
			}
		}
	}
	return true;
};


/**
 * Initialize a name.
 */
CSL.Util.Names.initializeWith = function(name,terminator){
	if (!name){
		return "";
	};
	var namelist = name.split(/\s+/);
	var nstring = "";
	for each (var n in namelist){
		var m = n.match( CSL.NAME_INITIAL_REGEXP);
		if (m){
			var extra = "";
			if (m[2]){
				extra = m[2].toLocaleLowerCase();
			}
			nstring = nstring + m[1].toLocaleUpperCase() + extra + terminator;
		} else if (n.match(/.*[a-zA-Z\u0400-\u052f].*/)){
			nstring = CSL.Util.Names.stripRight(nstring) + " " +CSL.Util.Names.stripRight(n) + " ";
		};
	};
	if (nstring){
		return CSL.Util.Names.stripRight(nstring);
	}
	return name;
};


CSL.Util.Names.stripRight = function(str){
	var end = 0;
	for (var pos=(str.length-1); pos > -1; pos += -1){
		if (str[pos] != " "){
			end = (pos+1);
			break;
		};
	};
	return str.slice(0,end);
};
