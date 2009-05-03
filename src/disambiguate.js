dojo.provide("csl.disambiguate");

var debug = false;

/**
 * Disambiguate a list of cites
 */
CSL.Factory.Registry.prototype.disambiguateCites = function (state,akey,modes,candidate_list){
	if ( ! candidate_list){
		//
		// We start with the state and an ambig key.
		// We acquire a copy of the list of ambigs that relate to the key from state.
		var ambigs = this.ambigs[akey].slice();
		//
		// We clear the list of ambigs so it can be rebuilt
		this.ambigs[akey] = new Array();
	} else {
		// candidate list consists of registry tokens.
		// extract the ids and build an ambigs list.
		// This is roundabout -- we already collected
		// these once for the first-phase disambiguation.
		// Maybe it can be cleaned up later.
		var ambigs = new Array();
		for each (var reg_token in candidate_list){
			ambigs.push(reg_token.id);
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
	var tokens = state.fun.retriever.getInput(id_vals);

	// The processing sequence is the same for all modes,
	// but there are important differences at the decision
	// points.
	var checkerator = new this.Checkerator(tokens,modes);

	checkerator.lastclashes = (ambigs.length-1);

	// We iterate through every cite in the list, front to back.
	// But we use a while loop, because repeated renderings
	// of the same cite might be needed.
	var base = false;
	checkerator.pos = 0;

	//
	// OKAY!  It's now all working right, but the loop isn't
	// exiting.  We need to know which items we have seen,
	// and exit when we've seen them all.
	//
	while (checkerator.run()){
		var token = tokens[checkerator.pos];
		if (debug){
			print("<<<<<<<<<<<<<<<<<<<<<<<<< "+ token.id +" >>>>>>>>>>>>>>>>>>>>>>>>>>>");
		}
		//
		// skip items that have been finally resolved.
		if (this.ambigs[akey].indexOf(token.id) > -1){
			if (debug){
				print("---> Skip registered token for: "+token.id);
			}
			checkerator.pos += 1;
			continue;
		}
		checkerator.candidate = token.id;

		if (base == false){
			checkerator.mode = modes[0];
		}
		if (debug){
			print ("  ---> Mode: "+checkerator.mode);
		}
		if (debug){
			print("base in (givens):"+base["givens"]);
		}
		var str = state.getAmbiguousCite(token,base);
		var maxvals = state.getMaxVals();
		var minval = state.getMinVal();
		base = state.getAmbigConfig();
		if (debug){
			print("base out (givens):"+base["givens"]);
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
				print("  ---> last clashes: "+checkerator.lastclashes);
				print("  ---> master:    "+token.id);
				print("  ---> master:    "+str);
				print("  ---> partner: "+testpartner.id);
				print("  ---> partner: "+otherstr);
			}

			if(checkerator.checkForClash(str,otherstr)){
				break;
			}
		}
		if (checkerator.evaluateClashes()){
			var base_return = this.decrementNames(state,base);
			this.registerAmbigToken(state,akey,token.id,base_return);
			checkerator.seen.push(token.id);
			if (debug){
				print("  ---> Evaluate: storing token config: "+base);
			}
			continue;
		}
		if (checkerator.maxAmbigLevel()){
			if ( ! state["citation"].opt["disambiguate-add-year-suffix"]){
				//this.registerAmbigToken(state,akey,token.id,base);
				checkerator.mode1_counts = false;
				checkerator.maxed_out_bases[token.id] = base;
				if (debug){
					print("  ---> Max out: remembering token config for: "+token.id);
					print("       ("+base["names"]+":"+base["givens"]+")");
				}
			} else {
				if (debug){
					print("  ---> Max out: NOT storing token config for: "+token.id);
					print("       ("+base["names"]+":"+base["givens"]+")");
				}
			}
			checkerator.seen.push(token.id);
			base = false;
			continue;
		}
		if (debug){
			print("  ---> Incrementing");
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
		if (this.mode == "names"){
			this.clashes += 1;
			if (debug){
				print("   (mode 0 clash, returning true)");
			}
			return true;
		}
		if (this.mode == "givens"){
			this.clashes += 1;
			if (debug){
				print("   (mode 1 clash, returning false)");
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
	if (this.mode == "names"){
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
			print("  ---> Comparing in mode 1: clashes="+this.clashes+"; lastclashes="+this.lastclashes);
		}
		var namepos = this.mode1_counts[this.modepos];
		if (this.clashes && this.clashes == this.lastclashes){
			if (debug){
				print("   ---> Applying mode 1 defaults: "+this.mode1_defaults);
			}
			if (this.mode1_defaults){
				var old = this.mode1_defaults[(namepos-1)];
				if (debug){
					print("   ---> Resetting to default: ("+old+")");
				}
				this.base["givens"][this.modepos][(namepos-1)] = old;
			}
			ret = false;
		} else if (this.clashes) {
			if (debug){
				print("   ---> Expanding given name helped a little, retaining it");
			}
			ret = false;
		} else { // only non-clash should be possible
			if (debug){
				print("   ---> No clashes, storing token config and going to next");
			}
			this.mode1_counts = false;
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

	if (this.mode == "names"){
		//print(this.modepos+" : "+this.base[0].length+" : "+this.base[0][this.modepos]);
		if (this.modepos == (this.base["names"].length-1) && this.base["names"][this.modepos] == this.maxvals[this.modepos]){
			if (this.modes.length == 2){
				this.mode = "givens";
				this.modepos = 0;
				//this.pos = 0;
			} else {
				this.pos += 1;
				return true;
			}
		}
	}
	if (this.mode == "givens"){
		if (this.modepos == (this.mode1_counts.length-1) && this.mode1_counts[this.modepos] == (this.maxvals[this.modepos])){
			if (debug){
				print("-----  Item maxed out -----");
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
			this.mode1_counts[this.modepos] += 1;
			this.mode1_defaults = this.base["givens"][this.modepos].slice();
			this.base["givens"][this.modepos][val] += 1;
			if (debug){
				print("   ---> (A) Set expanded givenname param with base: "+this.base["givens"]);
			}
		} else if (this.modepos < (this.base["givens"].length-1)){
			this.modepos +=1;
			this.base["givens"][this.modepos][0] += 1;
			this.mode1_defaults = this.base["givens"][this.modepos].slice();
			if (debug){
				print("   ---> (B) Set expanded givenname param with base: "+this.base["givens"]);
			}
		} else {
			this.mode = "names";
			this.pos += 1;
		}
	}
};

CSL.Factory.Registry.prototype.registerAmbigToken = function (state,akey,id,ambig_config){
	if ( ! this.ambigs[akey]){
		this.ambigs[akey] = new Array();
	};
	var found = false;
	for (var i in this.ambigs[akey]){
		if (this.ambigs[akey].indexOf(id) > -1){
			found = true;
		}
	}
	if (!found){
		this.ambigs[akey].push(id);
	}
	this.registry[id].disambig = state.fun.clone_ambig_config(ambig_config);
};

CSL.Factory.Registry.prototype.decrementNames = function(state,base){
	// two reverse scans, one to determine if there are any expanded
	// names to stop the unwind, and another to perform the
	// unwind
	var base_return = state.fun.clone_ambig_config(base);
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
