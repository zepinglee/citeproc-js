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
// We'll keep makeCitationCluster and makeBibliography as
// simple methods that return a string.  Neither should
// have any effect on internal state.  This will be a change
// in behavior for makeCitationCluster.
//
// A new updateItems command will be introduced, to replace
// insertItems.  It will be a simple list of IDs, in the
// sequence of first reference in the document.
//
// The calling application should always invoke updateItems
// before makeCitationCluster.
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
	this.state = state;
	this.registry = new Object();
	this.reflist = new Array();
	this.namereg = new CSL.Factory.Registry.NameReg(state);
	//
	// shared scratch vars
	this.mylist = new Array();
	this.myhash = new Object();
	this.deletes = new Array();
	this.inserts = new Array();
	this.refreshes = new Object();
	this.akeys = new Object();
	//
	// each ambig is a list of the ids of other objects
	// that have the same base-level rendering
	this.ambigcites = new Object();
	this.sorter = new CSL.Factory.Registry.Comparifier(state,"bibliography_sort");
	this.modes = CSL.getModes.call(this.state);

	this.getSortedIds = function(){
		var ret = [];
		for each (var Item in this.reflist){
			ret.push(Item.id);
		};
		return ret;
	};
};

//
// Here's the sequence of operations to be performed on
// update:
//
//  1.  (o) [init] Receive list as function argument, store as hash and as list.
//  2.  (o) [init] Initialize refresh list.  Never needs sorting, only hash required.

//  3.  (o) [dodeletes] Delete loop.
//  3a. (o) [dodeletes] Delete names in items to be deleted from names reg.
//  3b. (o) [dodeletes] Complement refreshes list with items affected by
//      possible name changes.  We'll actually perform the refresh once
//      all of the necessary data and parameters have been established
//      in the registry.
//  3c. (o) [dodeletes] Delete all items to be deleted from their disambig pools.
//  3d. (o) [dodeletes] Delete all items in deletion list from hash.

//  4.  (o) [doinserts] Insert loop.
//  4a. (o) [doinserts] Retrieve entries for items to insert.
//  4b. (o) [doinserts] Generate ambig key.
//  4c. (o) [doinserts] Add names in items to be inserted to names reg
//      (implicit in getAmbiguousCite).
//  4d. (o) [doinserts] Record ambig pool key on akey list (used for updating further
//      down the chain).
//  4e. (o) [doinserts] Create registry token.
//  4f. (o) [doinserts] Add item ID to hash.
//  4g. (o) [doinserts] Set and record the base token to hold disambiguation
//      results ("disambig" in the object above).
//  5.  (o) [rebuildlist] Create "new" list of hash pointers, in the order given
//          in the argument to the update function.
//  6.  (o) [rebuildlist] Apply citation numbers to new list.
//  7.  (o) [dorefreshes] Refresh items requiring update.



//  5. (o) [delnames] Delete names in items to be deleted from names reg, and obtain IDs
//         of other items that would be affected by changes around that surname.
//  6. (o) [delnames] Complement delete and insert lists with items affected by
//         possible name changes.
//  7. (o) [delambigs] Delete all items to be deleted from their disambig pools.
//  8. (o) [delhash] Delete all items in deletion list from hash.

//  9. (o) [addtohash] Retrieve entries for items to insert.
// 10. (o) [addtohash] Add items to be inserted to their disambig pools.
// 11. (o) [addtohash] Add names in items to be inserted to names reg
//         (implicit in getAmbiguousCite).
// 12. (o) [addtohash] Create registry token for each item to be inserted.
// 13. (o) [addtohash] Add items for insert to hash.

// 14. (o) [buildlist] Create "new" list of hash pointers, in the order given in the argument
//         to the update function.
// 15. (o) [renumber] Apply citation numbers to new list.
// 16. (o) [setdisambigs] Set disambiguation parameters on each inserted item token.
// 17. (o) [setsortkeys] Set sort keys on each item token.
// 18. (o) [sorttokens] Resort token list
// 19. (o) [renumber] Reset citation numbers on list items
//

CSL.Factory.Registry.prototype.init = function(myitems){
	//
	//  1. Receive list as function argument, store as hash and as list.
	//
	this.mylist = myitems;
	this.myhash = new Object();
	for each (var item in myitems){
		this.myhash[item] = true;
	};
	//
	//  2. Initialize refresh list.  Never needs sorting, only hash required.
	//
	this.refreshes = new Object();
	this.touched = new Object();
};

CSL.Factory.Registry.prototype.dodeletes = function(myhash){
	if ("string" == typeof myhash){
		myhash = {myhash:true};
	};
	//
	//  3. Delete loop.
	//
	for (var delitem in this.registry){
		if (!myhash[delitem]){
			//
			//  3a. Delete names in items to be deleted from names reg.
			//
			var otheritems = this.namereg.delitems(delitem);
			//
			//  3b. Complement refreshes list with items affected by
			//      possible name changes.  We'll actually perform the refresh once
			//      all of the necessary data and parameters have been established
			//      in the registry.
			//
			for (var i in otheritems){
				this.refreshes[i] = true;
			};
			//
			//  3c. Delete all items to be deleted from their disambig pools.
			//
			var ambig = this.registry[delitem].ambig;
			var pos = this.ambigcites[ambig].indexOf(delitem);
			if (pos > -1){
				var items = this.ambigcites[ambig].slice();
				this.ambigcites[ambig] = items.slice(0,pos).concat(items.slice([pos+1],items.length));
			}
			//
			// XX. What we've missed is to provide an update of all
			// items sharing the same ambig -- the remaining items in
			// ambigcites.  So let's do that here, just in case the
			// names update above doesn't catch them all.
			//
			for each (var i in this.ambigcites[ambig]){
				this.refreshes[i] = true;
			};
			//
			//  3d. Delete all items in deletion list from hash.
			//
			delete this.registry[delitem];
		};
	};
	// Disabled.  See formats.js for code.
	// this.state.fun.decorate.items_delete( this.state.output[this.state.opt.mode].tmp, myhash );
};

CSL.Factory.Registry.prototype.doinserts = function(mylist){
	if ("string" == typeof mylist){
		mylist = [mylist];
	};
	//
	//  4. Insert loop.
	//
	for each (var item in mylist){
		if (!this.registry[item]){
			//
			//  4a. Retrieve entries for items to insert.
			//
			var Item = this.state.sys.retrieveItem(item);
			//
			//  4b. Generate ambig key.
			//
			// AND
			//
			//  4c. Add names in items to be inserted to names reg
			//      (implicit in getAmbiguousCite).
			//
			var akey = CSL.getAmbiguousCite.call(this.state,Item);
			//
			//  4d. Record ambig pool key on akey list (used for updating further
			//      down the chain).
			//
			this.akeys[akey] = true;
			//
			//  4e. Create registry token.
			//
			var newitem = {
				"id":item,
				"seq":0,
				"offset":0,
				"sortkeys":undefined,
				"ambig":undefined,
				"disambig":undefined
			};
			//
			//
			//  4f. Add item ID to hash.
			//
			this.registry[item] = newitem;
			//
			//  4g. Set and record the base token to hold disambiguation
			//      results ("disambig" in the object above).
			//
			var abase = CSL.getAmbigConfig.call(this.state);
			this.registerAmbigToken(akey,item,abase);

			//if (!this.ambigcites[akey]){
			//	this.ambigcites[akey] = new Array();
			//}
			//CSL.debug("Run: "+item+"("+this.ambigcites[akey]+")");
			//if (this.ambigcites[akey].indexOf(item) == -1){
			//	CSL.debug("  Add: "+item);
			//	this.ambigcites[akey].push(item);
			//};
			//
			//  4h. Make a note that this item needs its sort keys refreshed.
			//
			this.touched[item] = true;
		};
	};
	// Disabled.  See formats.js for code.
	// this.state.fun.decorate.items_add( this.state.output[this.state.opt.mode].tmp, mylist );
};

CSL.Factory.Registry.prototype.rebuildlist = function(){
	//
	//  5. Create "new" list of hash pointers, in the order given in the argument
	//     to the update function.
	//
	this.reflist = new Array();
	//
	//  6. Apply citation numbers to new list.
	//
	var count = 1;
	for each (var item in this.mylist){
		this.reflist.push(this.registry[item]);
		this.registry[item].seq = count;
		count += 1;
	};
};

/*
 * Okay, at this point we should have a numbered list
 * of registry tokens in the notional order requested,
 * with sequence numbers to reconstruct the ordering
 * if the list is remangled.  So far so good.
 */

CSL.Factory.Registry.prototype.dorefreshes = function(){
	//
	//  7. Refresh items requiring update.
	//
	// It looks like we need to do four things on each cite for refresh:
	// (1) Generate the akey for the cite.
	// (2) Register it on the ambig token.
	// (3) Register the akey in this.akeys
	// (4) Register the item ID in this.touched
	//
	for (var item in this.refreshes){

		var regtoken = this.registry[item];
		delete this.registry[item];
		regtoken.disambig = undefined;
		regtoken.sortkeys = undefined;
		regtoken.ambig = undefined;

		var Item = this.state.sys.retrieveItem(item);
		var akey = CSL.getAmbiguousCite.call(this.state,Item);
		this.registry[item] = regtoken;

		var abase = CSL.getAmbigConfig.call(this.state);
		this.registerAmbigToken(akey,item,abase);

		this.akeys[akey] = true;
		this.touched[item] = true;
	};

};

/*
 * Main disambiguation -- can everything for disambiguation be
 * crunched into this function?
 */
CSL.Factory.Registry.prototype.setdisambigs = function(){
	//
	// Okay, more changes.  Here is where we resolve all disambiguation
	// issues for cites touched by the update.  The this.ambigcites set is
	// based on the complete short form of citations, and is the basis on
	// which names are added and minimal adding of initials or given names
	// is performed.
	//

	//
	// we'll save a list of leftovers for each disambig pool.
	this.leftovers = new Array();
	//
	//  8.  Set disambiguation parameters on each inserted item token.
	//
	for (var akey in this.akeys){
		//
		// if there are multiple ambigs, disambiguate them
		if (this.ambigcites[akey].length > 1){
			if (this.modes.length){
				if (this.debug){
					CSL.debug("---> Names disambiguation begin");
				};
				var leftovers = this.disambiguateCites(this.state,akey,this.modes);
			} else {
				//
				// if we didn't disambiguate with names, everything is
				// a leftover.
				var leftovers = new Array();
				for each (var key in this.ambigcites[akey]){
					leftovers.push(this.registry[key]);
				};
			};
			//
			// for anything left over, set disambiguate to true, and
			// try again from the base.
			if (leftovers && leftovers.length && this.state.opt.has_disambiguate){
				var leftovers = this.disambiguateCites(this.state,akey,this.modes,leftovers);
			};
			//
			// Throws single leftovers.
			// Enough of this correctness shtuff already.  Using a band-aide on this.
			if (leftovers.length > 1){
				this.leftovers.push(leftovers);
			};
		};
	};
	this.akeys = new Object();
};



CSL.Factory.Registry.prototype.renumber = function(){
	//
	// 19. Reset citation numbers on list items
	//
	var count = 1;
	for each (var item in this.reflist){
		item.seq = count;
		count += 1;
	};
};

CSL.Factory.Registry.prototype.yearsuffix = function(){
	for each (var leftovers in this.leftovers){
		if ( leftovers && leftovers.length && this.state[this.state.tmp.area].opt["disambiguate-add-year-suffix"]){
			//CSL.debug("ORDER OF ASSIGNING YEAR SUFFIXES");
			leftovers.sort(this.compareRegistryTokens);
			for (var i in leftovers){
				//CSL.debug("  "+leftovers[i].id);
				this.registry[ leftovers[i].id ].disambig[2] = i;
			};
		};
		if (this.debug) {
			CSL.debug("---> End of registry cleanup");
		};
	};
};

CSL.Factory.Registry.prototype.setsortkeys = function(){
	//
	// 17. Set sort keys on each item token.
	//
	for (var item in this.touched){
		this.registry[item].sortkeys = CSL.getSortKeys.call(this.state,this.state.sys.retrieveItem(item),"bibliography_sort");
		//CSL.debug("touched: "+item+" ... "+this.registry[item].sortkeys);
	};
};

CSL.Factory.Registry.prototype.sorttokens = function(){
	//
	// 18. Resort token list.
	//
	this.reflist.sort(this.sorter.compareKeys);
};

/**
 * Compare two sort keys
 * <p>Nested, because keys are an array.</p>
 */
CSL.Factory.Registry.Comparifier = function(state,keyset){
	var sort_directions = state[keyset].opt.sort_directions;
    this.compareKeys = function(a,b){
		var l = a.sortkeys.length;
		for (var i=0; i < l; i++){
			//
			// for ascending sort 1 uses 1, -1 uses -1.
			// For descending sort, the values are reversed.
			//
			// Need to handle undefined values.  No way around it.
			// So have to screen .localeCompare (which is also
			// needed) from undefined values.  Everywhere, in all
			// compares.
			//
			var cmp = 0;
			if (a.sortkeys[i] == b.sortkeys[i]){
				cmp = 0;
			} else if ("undefined" == typeof a.sortkeys[i]){
				cmp = sort_directions[i][1];;
			} else if ("undefined" == typeof b.sortkeys[i]){
				cmp = sort_directions[i][0];;
			} else {
				cmp = a.sortkeys[i].toLocaleLowerCase().localeCompare(b.sortkeys[i].toLocaleLowerCase());
			}
			if (0 < cmp){
				return sort_directions[i][1];
			} else if (0 > cmp){
				return sort_directions[i][0];
			}
		}
		if (a.seq > b.seq){
			return 1;
		} else if (a.seq < b.seq){
			return -1;
		} else {
			return 0;
		};
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

CSL.Factory.Registry.prototype.registerAmbigToken = function (akey,id,ambig_config){
	if ( ! this.ambigcites[akey]){
		this.ambigcites[akey] = new Array();
	};
	if (this.ambigcites[akey].indexOf(id) == -1){
		this.ambigcites[akey].push(id);
	};
	this.registry[id].ambig = akey;
	this.registry[id].disambig = CSL.Factory.cloneAmbigConfig(ambig_config);
};
