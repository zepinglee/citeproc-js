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
//
// This should use stack.  In fact, it should be an
// extension of stack.
//

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.parallelStartCitation = function(){
	// %%: definitely right
	this.tmp.parallel_variable_sets.clear();
	this.tmp.parallel_variable_set.clear();
};

//
// XXXXX: thinking forward a bit, we're going to need a means
// of snooping and mangling delimiters.  Inter-cite delimiters
// can be easily applied; it's just a matter of adjusting
// this.tmp.splice_delimiter (?) on the list of attribute
// bundles after a cite or set of cites is completed.
// That happens in cmd_cite.js.  We also need to do two
// things: (1) assure that volume, number, journal and
// page are contiguous within the cite, with no intervening
// rendered variables; and (2) strip affixes to the series,
// so that the sole splice string is the delimiter.  This
// latter will need a walk of the output tree, but it's
// doable.
//
// The advantage of doing things this way is that
// the parallels machinery is encapsulated in a set of
// separate functions that do not interact with cite
// composition.
//

/**
 * Adds an empty JS data object to the variables tracking array,
 * and adds an empty array to the blobs tracking array.
 */
CSL.parallelStartCite = function(Item){
	// %%: seems ok
	this.tmp.parallel_try_cite = true;
	for each (var x in ["title", "container-title","volume","page"]){
		if (!Item[x]){
			this.tmp.parallel_try_cite = false;
			break;
		};
	};
	if (this.tmp.parallel_try_cite){
		var myvars = new Object();
		// this new object is tentative.
		this.tmp.parallel_variable_set.push(myvars);
	};
};

/**
 * Adds a field entry on the current JS data object in the
 * variables tracking array.
 */
CSL.parallelStartVariable = function (variable){
	// can we do any further filtering here?
	// actually, this is where _all_ of the filtering
	// happens, isn't it; we can filter as we go along.
	if (this.tmp.parallel_try_cite){
		var mydata = new Object();
		mydata.blob = this.output.current.value();
		mydata.pos = mydata.blob.blobs.length;
		this.tmp.parallel_data = mydata;
		this.tmp.parallel_variable = variable;
	};
};

CSL.parallelSetVariable = function(){
	if (this.tmp.parallel_try_cite){
		var res = this.tmp.parallel_data.blob.blobs[this.tmp.parallel_data.pos];
		if (res && res.blobs && res.blobs.length){
			this.tmp.parallel_variable_set.value()[this.tmp.parallel_variable] = this.tmp.parallel_data;
		};
	};
};

CSL.parallelCloseCite = function(){
	// %%: compose the set only when the series fails.
	// (also run at the end of the citation cluster.)
	if (!this.tmp.parallel_try_cite){
		CSL.parallelComposeSet.call(this);
	};
};

/**
 * Move working data to composed sets, for analysis
 * after the full citation has been composed.
 */
CSL.parallelComposeSet = function(){
	if (this.tmp.parallel_variable_set.mystack.length > 1){
		this.tmp.parallel_variable_sets.push( this.tmp.parallel_variable_set.mystack.slice() );
		this.tmp.parallel_variable_set.clear();
	};
};

/**
 * Analyze variables and values to identify parallel series'
 * in a front-to-back pass over the variables array, then mangle
 * the queue as appropropriate in a back-to-front pass over the
 * blobs array.
 */
CSL.parallelPruneOutputQueue = function(citation){
	//
	// XXXXX: also mark the entry as "parallel" on the citation
	// object.
	//
	for each (var cite in this.tmp.parallel_variable_sets.mystack){
		for (var varname in ["title","container-title"]){
			if (cite[varname] && cite[varname].blob){
				print(varname+" ok");
			};
		};
	};
};
