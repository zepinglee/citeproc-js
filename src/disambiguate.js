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
dojo.provide("csl.disambiguate");

var debug = false;

CSL.Factory.Registry.prototype.disambiguateCites = function (state,akey,modes,candidate_list){
	if ( ! candidate_list){
		//
		// We start with the state and an ambig key.
		// We acquire a copy of the list of ambigs that relate to the key from state.
		var ambigs = this.ambigcites[akey].slice();
		//
		// We clear the list of ambigs so it can be rebuilt
		this.ambigcites[akey] = new Array();
	} else {
		//
		// If candidate_list is true, we are running one final time with
		// disambiguate="true"
		//
		var ambigs = new Array();
		for each (var reg_token in candidate_list){
			ambigs.push(reg_token.id);
			var keypos = this.ambigcites[akey].indexOf(reg_token.id);
			if (keypos > -1){
				this.ambigcites[akey] = this.ambigcites[akey].slice(0,keypos).concat(this.ambigcites[akey].slice((keypos+1)));
			}
		}
	}
	//
	// We get the ids of the partners from the copy
	// (what's the point of this?  why not just push
	// ambigs itself?)
	var id_vals = new Array();
	for each (var a in ambigs){
		id_vals.push(a);
	}
	//
	// We get the tokens of the partners
	var tokens = state.retrieveItems(id_vals);

	// The processing sequence is the same for all modes,
	// but there are important differences at the decision
	// points.
	if (candidate_list && candidate_list.length){
		modes = ["disambiguate_true"].concat(modes);
	}
	var checkerator = new this.Checkerator(tokens,modes);

	checkerator.lastclashes = (ambigs.length-1);

	// We iterate through every cite in the list, front to back.
	// But we use a while loop, because repeated renderings
	// of the same cite might be needed.
	var base = false;
	checkerator.pos = 0;

	while (checkerator.run()){
		var token = tokens[checkerator.pos];
		if (debug){
			CSL.debug("<<<<<<<<<<<<<<<<<<<<<<<<< "+ token.id +" >>>>>>>>>>>>>>>>>>>>>>>>>>>");
		}
		//
		// skip items that have been finally resolved.
		if (this.ambigcites[akey].indexOf(token.id) > -1){
			if (debug){
				CSL.debug("---> Skip registered token for: "+token.id);
			}
			checkerator.pos += 1;
			continue;
		}
		checkerator.candidate = token.id;

		if (base == false){
			checkerator.mode = modes[0];
		}
		if (debug){
			CSL.debug("  ---> Mode: "+checkerator.mode);
		}
		if (debug){
			CSL.debug("base in (givens):"+base["givens"]);
		}
		var str = state.getAmbiguousCite(token,base);
		var maxvals = state.getMaxVals();
		var minval = state.getMinVal();
		base = state.getAmbigConfig();
		if (debug){
			CSL.debug("base out (givens):"+base["givens"]);
		}
		if (candidate_list && candidate_list.length){
			base["disambiguate"] = true;
		}

		checkerator.setBase(base);
		checkerator.setMaxVals(maxvals);
		checkerator.setMinVal(minval);

		for each (testpartner in tokens){

			if (token.id == testpartner.id){
				continue;
			}
			var otherstr = state.getAmbiguousCite(testpartner,base);
			if (debug){
				CSL.debug("  ---> last clashes: "+checkerator.lastclashes);
				CSL.debug("  ---> master:    "+token.id);
				CSL.debug("  ---> master:    "+str);
				CSL.debug("  ---> partner: "+testpartner.id);
				CSL.debug("  ---> partner: "+otherstr);
			}

			if(checkerator.checkForClash(str,otherstr)){
				break;
			}
		}
		if (checkerator.evaluateClashes()){
			var base_return = this.decrementNames(state,base);
			this.registerAmbigToken(akey,token.id,base_return);
			checkerator.seen.push(token.id);
			if (debug){
				CSL.debug("  ---> Evaluate: storing token config");
				CSL.debug("          names: "+base["names"]);
				CSL.debug("         givens: "+base_return["givens"]);
			}
			continue;
		}
		if (checkerator.maxAmbigLevel()){
			if ( ! state["citation"].opt["disambiguate-add-year-suffix"]){
				checkerator.mode1_counts = false;
				checkerator.maxed_out_bases[token.id] = CSL.Factory.cloneAmbigConfig(base);
				if (debug){
					CSL.debug("  ---> Max out: remembering token config for: "+token.id);
					CSL.debug("       ("+base["names"]+":"+base["givens"]+")");
				}
			} else {
				if (debug){
					CSL.debug("  ---> Max out: NOT storing token config for: "+token.id);
					CSL.debug("       ("+base["names"]+":"+base["givens"]+")");
				}
			}
			checkerator.seen.push(token.id);
			base = false;
			continue;
		}
		if (debug){
			CSL.debug("  ---> Incrementing");
		}
		checkerator.incrementAmbigLevel();
	}
	// return tuples of registry tokens and item tokens.
	// the former are useful for second-run disambiguation,
	// the latter for sorting.
	var ret = new Array();
	for each (id in checkerator.ids){
		if (id){
			ret.push(this.registry[id]);
		}
	}
	// if we don't have year-suffix available, we may
	// have maxed out bases lying around
	for (i in checkerator.maxed_out_bases){
		this.registry[i].disambig = checkerator.maxed_out_bases[i];
	}
	return ret;
};

/**
 * Management object to support the disambiguation control loop.
 */
CSL.Factory.Registry.prototype.Checkerator = function(tokens,modes){
	this.seen = new Array();
	this.modes = modes;
	this.mode = this.modes[0];
	this.tokens_length = tokens.length;
	this.pos = 0;
	this.clashes = 0;
	this.maxvals = false;
	this.base = false;
	this.ids = new Array();
	this.maxed_out_bases = new Object();
	for each (token in tokens){
		this.ids.push(token.id);
	}
	//
	// used in givens mode (mode 1)
	this.lastclashes = -1;
	//
	// used to address into the base array in both modes
	this.namepos = 0;
	this.modepos = 0;
	this.mode1_counts = false;
};

CSL.Factory.Registry.prototype.Checkerator.prototype.run = function(){
	if (this.seen.length < this.tokens_length){
		return true;
	}
	return false;
}

CSL.Factory.Registry.prototype.Checkerator.prototype.setMaxVals = function(maxvals){
	this.maxvals = maxvals;
};


CSL.Factory.Registry.prototype.Checkerator.prototype.setMinVal = function(minval){
	this.minval = minval;
};

CSL.Factory.Registry.prototype.Checkerator.prototype.setBase = function(base){
	this.base = base;
	if (! this.mode1_counts){
		this.mode1_counts = new Array();
		for each (i in this.base["givens"]){
			this.mode1_counts.push(0);
		}
	}
};


CSL.Factory.Registry.prototype.Checkerator.prototype.setMode = function(mode){
	this.mode = mode;
};

CSL.Factory.Registry.prototype.Checkerator.prototype.checkForClash = function(str,otherstr){
	if (str == otherstr){
		if (this.mode == "names" || this.mode == "disambiguate_true"){
			this.clashes += 1;
			if (debug){
				CSL.debug("   (mode 0 clash, returning true)");
			}
			return true;
		}
		if (this.mode == "givens"){
			this.clashes += 1;
			if (debug){
				CSL.debug("   (mode 1 clash, returning false)");
			}
		}
		return false;
	}
};

CSL.Factory.Registry.prototype.Checkerator.prototype.evaluateClashes = function(){
	//
	// necessary for the odd case of static cites with no authors
	if (!this.maxvals.length){
		return false;
	}
	// mode 0 is pretty simple
	if (this.mode == "names" || this.mode == "disambiguate_true"){
		if (this.clashes){
			this.lastclashes = this.clashes;
			this.clashes = 0;
			return false;
		} else {
			// cleared, so increment.  also quash the id as done.
			this.ids[this.pos] = false;
			this.pos += 1;
			this.lastclashes = this.clashes;
			return true;
		}
	}
	// compare the clash counts
	// if clash counts not reduced, reverse change in base
	// if clash counts reduced, hold the change steady
	// in the above two cases, just return false.  leave the incementing to the
	// incrementing function
	// if no clashes at all on expanded pass, just return true, it's a wrap
	if (this.mode == "givens"){
		var ret = true;
		if (debug){
			CSL.debug("  ---> Comparing in mode 1: clashes="+this.clashes+"; lastclashes="+this.lastclashes);
		}
		var namepos = this.mode1_counts[this.modepos];
		if (this.clashes && this.clashes == this.lastclashes){
			if (debug){
				CSL.debug("   ---> Applying mode 1 defaults: "+this.mode1_defaults);
			}
			if (this.mode1_defaults && namepos > 0){
				var old = this.mode1_defaults[(namepos-1)];
				if (debug){
					CSL.debug("   ---> Resetting to default: ("+old+")");
				}
				this.base["givens"][this.modepos][(namepos-1)] = old;
			}
			ret = false;
		} else if (this.clashes) {
			if (debug){
				CSL.debug("   ---> Expanding given name helped a little, retaining it");
			}
			ret = false;
		} else { // only non-clash should be possible
			if (debug){
				CSL.debug("   ---> No clashes, storing token config and going to next");
			}
			this.mode1_counts = false;
			this.pos += 1;
			ret = true;
		}
		this.lastclashes = this.clashes;
		this.clashes = 0;
		if (ret){
			this.ids[this.pos] = false;
		}
		return ret;
	}
};

CSL.Factory.Registry.prototype.Checkerator.prototype.maxAmbigLevel = function (){
	//
	// like the above, necessary for the odd case of static cites with no authors
	if (!this.maxvals.length){
		return true;
	}

	if (this.mode == "disambiguate_true"){
	//	this.mode = "names";
	//	return true;
		if (this.modes.indexOf("disambiguate_true") < (this.modes.length-1)){
			this.mode = this.modes[(this.modes.indexOf("disambiguate_true")+1)];
			this.modepos = 0;
		} else {
			this.pos += 1;
			return true;
		}
	}

	if (this.mode == "names"){
		if (this.modepos == (this.base["names"].length-1) && this.base["names"][this.modepos] == this.maxvals[this.modepos]){
			if (this.modes.length == 2){
				this.mode = "givens";
				this.mode1_counts[this.modepos] = 0;
			} else {
				this.pos += 1;
				return true;
			}
		}
	} else if (this.mode == "givens"){
		if (this.modepos == (this.mode1_counts.length-1) && this.mode1_counts[this.modepos] == (this.maxvals[this.modepos])){
			if (debug){
				CSL.debug("-----  Item maxed out -----");
			}
			if (this.modes.length == 2){
				this.mode = "givens";
				this.pos += 1;
			} else {
				this.pos += 1;
			}
			//this.ids[this.pos] = false;
			return true;
		}
	}
	return false;
};


/**
 * Increment disambiguation level
 */
CSL.Factory.Registry.prototype.Checkerator.prototype.incrementAmbigLevel = function (){
	//
	// this is a little tricky.  the counters are arrays.
	// ... and for mode 1, this only gives us the position,
	// not the values of the array of booleans, which of
	// course are not subject to incrementing in this
	// sense.
	if (this.mode == "names"){
		var val = this.base["names"][this.modepos];
		if (val < this.maxvals[this.modepos]){
			this.base["names"][this.modepos] += 1;
		} else if (this.modepos < (this.base["names"].length-1)){
			this.modepos +=1;
			this.base["names"][this.modepos] = 0;
		}
	}
	if (this.mode == "givens"){
		var val = (this.mode1_counts[this.modepos]);
		if (val < this.maxvals[this.modepos]){
			if (this.given_name_second_pass){
				if (debug){
					CSL.debug(" ** second pass");
				};
				this.given_name_second_pass = false;
				this.mode1_counts[this.modepos] += 1;
				this.base["givens"][this.modepos][val] += 1;
				if (debug){
					CSL.debug("   ---> (A) Setting expanded givenname param with base: "+this.base["givens"]);
				};
			} else {
				this.mode1_defaults = this.base["givens"][this.modepos].slice();
				if (debug){
					CSL.debug(" ** first pass");
				};
				this.given_name_second_pass = true;
			};
		} else if (this.modepos < (this.base["givens"].length-1)){
			this.modepos +=1;
			this.base["givens"][this.modepos][0] += 1;
			this.mode1_defaults = this.base["givens"][this.modepos].slice();
			if (debug){
				CSL.debug("   ---> (B) Set expanded givenname param with base: "+this.base["givens"]);
			}
		} else {
			this.mode = "names";
			this.pos += 1;
		}
	}
};

CSL.Factory.Registry.prototype.decrementNames = function(state,base){
	// two reverse scans, one to determine if there are any expanded
	// names to stop the unwind, and another to perform the
	// unwind
	var base_return = CSL.Factory.cloneAmbigConfig(base);
	var do_me = false;
	for (var i=(base_return["givens"].length-1); i > -1; i--){
		for (var j=(base_return["givens"][i].length-1); j > -1; j--){
			if (base_return["givens"][i][j] == 2){
				do_me = true;
			}
		}
	}
	if (do_me){
		for (var i=(base_return["givens"].length-1); i > -1; i--){
			for (var j=(base_return["givens"][i].length-1); j > -1; j--){
				if (base_return["givens"][i][j] == 2){
					i = -1;
					break;
				}
				base_return["names"][i] += -1;
			}
		}
	}
	return base_return;
};
