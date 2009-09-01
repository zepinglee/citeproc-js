/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
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
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
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
	if (sort_order == "first" && !state.tmp.sort_key_flag){
		state.output.addToken("start");
			state.output.getToken("start").strings.name_as_sort_order = true;
			state.output.getToken("start").strings.particle_in_name_sort = state[state.tmp.area].opt["particle-in-name-sort"];
	} else if (sort_order == "all" || state.tmp.sort_key_flag){
		state.output.addToken("start");
		state.output.getToken("start").strings.name_as_sort_order = true;
		state.output.getToken("start").strings.particle_in_name_sort = state[state.tmp.area].opt["particle-in-name-sort"];
		state.output.addToken("middle");
		state.output.getToken("middle").strings.name_as_sort_order = true;
		state.output.getToken("middle").strings.particle_in_name_sort = state[state.tmp.area].opt["particle-in-name-sort"];
		state.output.addToken("end");
		state.output.getToken("end").strings.name_as_sort_order = true;
		state.output.getToken("end").strings.particle_in_name_sort = state[state.tmp.area].opt["particle-in-name-sort"];
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
		if ("given" == key && !this.name.sticky){
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
	var romanesque = name["family"].match(/.*[a-zA-Z\u0400-\u052f].*/);
	if (!romanesque ){ // neither roman nor Cyrillic characters
		var sequence = [["empty","empty","empty"],["prefix", "family"],["given"],[]];
	} else if (name.sticky) { // entry likes sort order
		var sequence = [["space","space","space"],["prefix", "family"],["given"],[]];
	} else if (token && token.strings.name_as_sort_order){
		if (token.strings.particle_in_name_sort){
			var sequence = [["sortsep","sortsep","space"],["prefix", "family"],["given"],["suffix"]];
		} else {
			var sequence = [["sortsep","sortsep","space"],["family"],["given","prefix"],["suffix"]];
		}
	} else { // plain vanilla
		var sequence = [[suffix_sep,"space","space"],["given"],["prefix","family"],["suffix"]];
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
		for each (var part in ["family","given","prefix","suffix"]){
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
	var namelist = name.replace(/\s*\-\s*/g,"-").replace(/\s+/g," ").split(/(\-|\s+)/);
	for (var i=0; i<namelist.length; i+=2){
		var n = namelist[i];
		var m = n.match( CSL.NAME_INITIAL_REGEXP);
		if (m){
			var extra = "";
			// extra upper-case characters also included
			if (m[2]){
				extra = m[2].toLocaleLowerCase();
			}
			namelist[i] = m[1].toLocaleUpperCase() + extra;
			if (i < (namelist.length-1)){
				if (namelist[(i+1)].indexOf("-") > -1){
					namelist[(i+1)] = terminator + namelist[(i+1)];
				} else {
					namelist[(i+1)] = terminator;
				}
			} else {
				namelist.push(terminator);
			}
		} else if (n.match(/.*[a-zA-Z\u0400-\u052f].*/)){
			// romanish things that began with lower-case characters don't get initialized ...
			namelist[i] = " "+n;
		};
	};
	var ret = CSL.Util.Names.stripRight( namelist.join("") );
	return ret.replace(/\s*\-\s*/g,"-").replace(/\s+/g," ");
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


CSL.Util.Names.rescueNameElements = function(names){
	for (var name in names){
		if (names[name]["given"]){
			if (names[name]["given"].indexOf(",") > -1){
				var m = names[name]["given"].match(/(.*),(!?)\s*(.*)/);
				names[name]["given"] = m[1];
				if (m[2]){
					names[name]["comma_suffix"] = true;
				}
				names[name]["suffix"] = m[3];
			};
			var m = names[name]["given"].match(/(.*?)\s+([ a-z]+)$/);
			if (m){
				names[name]["given"] = m[1];
				names[name]["prefix"] = m[2];
			}
		};
	};
	return names;
};
