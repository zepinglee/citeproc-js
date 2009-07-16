dojo.provide("csl.registry");

//
// Time for a rewrite of this module.
//
// Simon has pointed out that list and hash behavior can
// be obtained by ... just using a list and a hash.  This
// is faster for batched operations, because sorting is
// greatly optimized.  Since most of the interaction
// with plugins at runtime will involve batches of
// references, there will be solid gains if the current,
// one-reference-at-a-time approach implemented here
// can be replaced with something that leverages the native
// sort method of the Array() type.
//
// That's going to take some redesign, but it will simplify
// things in the long run, so it might as well happen now.
//
// Here's the sequence of operations to be performed on
// update:
//
// ( ) Receive list as function argument
// ( ) Apply citation numbers to list
// ( ) Add list items to hash as necessary
// ( ) Rerun disambiguation on disambig sets as necessary
// ( ) Reset sort keys stored in items
// ( ) Resort list
// ( ) Reset citation numbers on list items
//

//
// should allow batched registration of items by
// key.  should behave as an update, with deletion
// of items and the tainting of disambiguation
// partner sets affected by a deletes and additions.
//
//
// we'll need a reset method, to clear the decks
// in the citation area and start over.

/**
 * Registry of cited items.
 * <p>This is a persistent store of disambiguation and
 * sort order information relating to individual items
 * for which rendering is requested.  Item data is stored
 * in a hash, with the item key as hash key, for quick
 * retrieval.  A virtual sequence within the hashed store
 * is maintained on the fly as items are added to the
 * store, using <code>*_next</code> and <code>*_prev</code>
 * attributes on each item.  A separate hash of items
 * based on their undisambiguated cite form is
 * maintained, and the item id list and disambiguation
 * level for each set of disambiguation partners is shared
 * through the registry item.</p>
 * @class
 */
CSL.Factory.Registry = function(state){
	this.debug = false;
	this.debug_sort = false;
	//
	// each entry has a sort key, navigation vectors,
	// and a disambiguation config object
	if (this.debug){
		print("---> Instantiate registry");
	}
	this.registry = new Object();
	this.namereg = new this.NameReg(state);
	//
	// each ambig is a list of the ids of other objects
	// that have the same base-level rendering
	this.ambigs = new Object();
	this.start = false;
	this.end = false;
	this.initialized = false;
	this.skip = false;
	this.maxlength = 0;
	this.sorter = new CSL.Factory.Registry.Comparifier(state,"bibliography_sort");

	this.getSortedIds = function(){
		var step = "next";
		var item_id = this.start;
		var ret = new Array();
		while (true){
			ret.push(item_id);
			item_id = this.registry[item_id][step];
			if ( ! item_id){
				break;
			}
		}
		return ret;
	};
};

CSL.Factory.Registry.prototype.insert = function(state,Item){
	//
	// abort if we've already inserted
	if (this.debug){
		print("---> Start of insert");
	}
	if (this.registry[Item.id]){
		return;
	}
	//
	// get the sort key (it's an array containing
	// multiple key strings).
	var sortkeys = state.getSortKeys(Item,"bibliography_sort");
	//
	// get the disambiguation key and register it
	//
	var akey = state.getAmbiguousCite(Item);
	var abase = state.getAmbigConfig();
	var modes = state.getModes();
	//
	// registryItem instantiates an object with a copy of the
	// sort key, and a list shared with
	// disambiguation partners, if any, maintained
	// in sort key order.
	// (after this, we're ready to roll for the insert)
	var newitem = {
		"id":Item.id,
		"seq":1,
		"dseq":0,
		"sortkeys":sortkeys,
		"disambig":abase,
		"prev":false,
		"next":false
	};
	//
	// if the registry is empty, initialize it with
	// this object.
	if (this.debug){
		print("---> Begin manipulating registry");
	}
	var breakme = false;
	if (!this.initialized){
		if (this.debug_sort){
			print("-->initializing registry with "+newitem.id);
		}
		this.registry[newitem.id] = newitem;
		this.start = newitem.id;
		this.end = newitem.id;
		this.initialized = true;
		//
		// XXXXX
		//this.registerAmbigToken(state,akey,Item.id,abase.slice());
		this.registerAmbigToken(state,akey,Item.id,abase);
		return;
	}
	// if this object is less than the first one,
	// insert it as the first.
	if (-1 == this.sorter.compareKeys(newitem.sortkeys,this.registry[this.start].sortkeys)){
		if (this.debug_sort){
			print("-->inserting "+newitem.id+" before "+this.start+" as first entry");
		}
		newitem.next = this.registry[this.start].id;
		this.registry[this.start].prev = newitem.id;
		newitem.prev = false;
		newitem.seq = 1;
		var tok = this.registry[this.start];
		this.incrementSubsequentTokens(tok);
		this.start = newitem.id;
		this.registry[newitem.id] = newitem;
		breakme = true;
	}
	// if this object is greater than the
	// last one, insert it as the last.
	if (-1 == this.sorter.compareKeys(this.registry[this.end].sortkeys,newitem.sortkeys)  && !breakme){
		if (this.debug_sort){
			print("-->inserting "+newitem.id+" after "+this.end+" as last entry");
		}
		newitem.prev = this.registry[this.end].id;
		this.registry[this.end].next = newitem.id;
		newitem.next = false;
		newitem.seq = (this.registry[this.end].seq + 1);
		this.end = newitem.id;
		this.registry[newitem.id] = newitem;
		breakme = true;
	}
	//
	// if we reach this, it's safe to iterate
	var curr = this.registry[this.end];
	while (true && !breakme){
		// compare the new token to be added with
		// the one we're thinking about placing it after.
		var cmp = this.sorter.compareKeys(curr.sortkeys,newitem.sortkeys);
		if (cmp == -1){
			if (this.debug_sort){
				print("-->inserting "+newitem.id+" after "+curr.id);
			}
			// insert mid-list, after the tested item
			this.registry[curr.next].prev = newitem.id;
			newitem.next = curr.next;
			newitem.prev = curr.id;
			curr.next = newitem.id;
			newitem.seq = (curr.seq+1);
			this.incrementSubsequentTokens(this.registry[newitem.next]);
			this.registry[newitem.id] = newitem;
			breakme = true;
			break;
		} else if (cmp == 2){
			breakme = true;
		} else if (cmp == 0) {
			// insert _after_, but this one is equivalent
			// to the comparison partner for sortkey purposes
			// (so we needed to provide for cases where the
			// inserted object ends up at the end of
			// the virtual list.)
			if (false == curr.next){
				if (this.debug_sort){
					print("-->inserting "+newitem.id+" after "+curr.id+" as last entry, although equal");
				}
				newitem.next = false;
				newitem.prev = curr.id;
				curr.next = newitem.id;
				newitem.seq = (curr.seq+1);
				//this.incrementSubsequentTokens(curr);
				this.registry[newitem.id] = newitem;
				this.end = newitem.id;
				breakme = true;
				break;
			} else {
				if (this.debug_sort){
					print("-->inserting "+newitem.id+" after "+curr.id+", although equal");
				}
				this.registry[curr.next].prev = newitem.id;
				newitem.next = curr.next;
				newitem.prev = curr.id;
				curr.next = newitem.id;
				newitem.seq = curr.seq;
				this.registry[newitem.id] = newitem;
				this.incrementSubsequentTokens(newitem);
				breakme = true;
				break;
			}
		}
		if (breakme){
			break;
		}
		//
		// we scan in reverse order, because working
		// from the initial draft of the code, this
		// makes it simpler to order cites in submission
		// order, when no sort keys are available.
		curr = this.registry[curr.prev];
	};
	if (this.debug){
		print("---> End of registry insert");
	}
	//
	// register the notional ambiguation config
	this.registerAmbigToken(state,akey,Item.id,abase);
	//
	// if there are multiple ambigs, disambiguate them
	if (this.ambigs[akey].length > 1){
		if (modes.length){
			if (this.debug){
				print("---> Names disambiguation begin");
			}
			var leftovers = this.disambiguateCites(state,akey,modes);
			if (this.debug){
				print("---> Names disambiguation done");
			}
			//
			// leftovers is a list of registry tokens.  sort them.
			leftovers.sort(this.compareRegistryTokens);
		} else {
			//
			// if we didn't disambiguate with names, everything is
			// a leftover.
			var leftovers = new Array();
			for each (var key in this.ambigs[akey]){
				leftovers.push(this.registry[key]);
				leftovers.sort(this.compareRegistryTokens);
			}
		}
	}
	//
	// for anything left over, set disambiguate to true, and
	// try again from the base.
	if (leftovers && leftovers.length && state.opt.has_disambiguate){
		var leftovers = this.disambiguateCites(state,akey,modes,leftovers);
	}

	if ( leftovers && leftovers.length && state[state.tmp.area].opt["disambiguate-add-year-suffix"]){
		//var suffixes = state.fun.suffixator.get_suffixes(leftovers.length);
		for (var i in leftovers){
			this.registry[ leftovers[i].id ].disambig[2] = i;
			this.registry[ leftovers[i].id ].dseq = i;
		}
	}
	if (this.debug) {
		print("---> End of registry cleanup");
	}
};

/**
 * Compare two sort keys
 * <p>Nested, because keys are an array.</p>
 */
CSL.Factory.Registry.Comparifier = function(state,keyset){
	var sort_directions = state[keyset].opt.sort_directions.slice();
    this.compareKeys = function(a,b){
		for (var i=0; i < a.length; i++){
			//
			// for ascending sort 1 uses 1, -1 uses -1.
			// For descending sort, the values are reversed.
			//
			// XXXXX
			//
			// Need to handle undefined values.  No way around it.
			// So have to screen .localeCompare (which is also
			// needed) from undefined values.  Everywhere, in all
			// compares.
			//
			var cmp = 0;
			if ( !a[i].length || !b[i].length ){
				if (a[i] < b[i]){
					cmp = -1;
				} else if (a[i] > b[i]){
					cmp = 1;
				}
			} else {
				cmp = a[i].toLocaleLowerCase().localeCompare(b[i].toLocaleLowerCase());
			}
			if (0 < cmp){
				return sort_directions[i][1];
			} else if (0 > cmp){
				return sort_directions[i][0];
			}
		}
		return 0;
	};
};


/**
 * Compare two disambiguation tokens by their registry sort order
 * <p>Disambiguation lists need to be sorted this way, to
 * obtain the correct year-suffix when that's used.</p>
 */
CSL.Factory.Registry.prototype.compareRegistryTokens = function(a,b){
	if (a.seq > b.seq){
		return 1;
	} else if (a.seq < b.seq){
		return -1;
	}
	return 0;
};

CSL.Factory.Registry.prototype.incrementSubsequentTokens = function (tok){
	while (tok.next){
		tok.seq += 1;
		tok = this.registry[tok.next];
	}
	tok.seq += 1;
};
