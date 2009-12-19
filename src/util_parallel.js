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
// XXXXX: note to self, the parallels machinery should be completely
// disabled when sorting of citations is requested.
//
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
 * Initializes the parallel cite tracking arrays
 */
CSL.parallel = function(){
	// scratch variables for handling parallel citations
	// (1) an array of JS objects, one object per cite,
	// one field per variable.  Fields are a JS object
	// with a value string and a blob.  This array is used for
	// identifying parallel sets, and for culling blobs
	// in confirmed parallel cites.
	// (working stack and confirmed stack)
	this.one_set = new CSL.Stack();
	this.all_sets = new CSL.Stack();
	// (3) toggle to avoid fruitless efforts to find parallel
	// cites.
	this.try_cite = true;
	this.in_progress = false;
};

CSL.parallel.prototype.StartCitation = function(){
	this.all_sets.clear();
	this.one_set.clear();
	this.in_series = false;
};

/**
 * Sets up an empty variables tracking object.
 *
 */
CSL.parallel.prototype.StartCite = function(Item){
	this.try_cite = true;
	for each (var x in ["title", "container-title","volume","page"]){
		if (!Item[x]){
			this.try_cite = false;
			if (this.in_series){
				this.all_sets.push(this.one_set.value());
				this.one_set.clear();
				this.in_series = false;
			};
			break;
		};
	};
	this.cite = new Object();
};

/**
 * Initializes scratch object and variable name string
 * for tracking a single variable.
 */
CSL.parallel.prototype.StartVariable = function (variable){
	if (this.try_cite){
		this.variable = variable;
		this.data = new Object();
		this.data.value = "";
	};
};

/**
 * Adds a blob to the the scratch object.
 */
CSL.parallel.prototype.AddBlobPointer = function (blob){
	if (this.try_cite){
		print("adding blob");
		this.data.pos = blob.blobs.length;
		this.data.blob = blob;
	}
}

/**
 * Adds string data to the current variable
 * in the variables tracking object.
 */
CSL.parallel.prototype.AppendToVariable = function(str){
	if (this.try_cite){
		this.data.value += "::"+str;
	};
};

/**
 * Merges scratch object to the current cite object.
 * Checks variable content, and possibly deletes the
 * variables tracking object to abandon parallel cite processing
 * for this cite.  [??? careful with the logic here, current
 * item can't necessarily be discarded; it might be the first
 * member of an upcoming sequence ???]
 */
//
// XXXXX: this also needs to assure that the persistent
// cite elements are contiguous.
//
CSL.parallel.prototype.CloseVariable = function(){
	this.cite[this.variable] = this.data;
		if (this.one_set.mystack.length > 1){
			//
			// this will be repetitive.  shouldn't this be set in
			// another context, when the one_set stack is extended?
			//
			var prev = this.one_set.mystack[(this.one_set.mystack.length-2)];
			if (this.data.value != prev[this.data.variable]){
				// evaluation takes place later, at close of cite.
				this.try_cite = false;
				this.in_series = false;
			};
		};
};

/**
 * Merges current cite object to the
 * tracking array, and evaluate maybe.
 */
CSL.parallel.prototype.CloseCite = function(){
	this.one_set.push(this.cite);
	if (!this.try_cite){
		this.ComposeSet();
	};
};

/**
 * Move variables tracking array into the array of
 * composed sets.
 */
CSL.parallel.prototype.ComposeSet = function(){
	if (this.one_set.mystack.length > 1){
		this.all_sets.push( this.one_set.mystack.slice() );
	};
	this.one_set.clear();
};

/**
 * Mangle the queue as appropropriate.
 */
CSL.parallel.prototype.PruneOutputQueue = function(queue,citation){
	return;
	//
	// XXXXX: also mark the entry as "parallel" on the citation
	// object.
	//
	for each (var series in this.all_sets.mystack){
		for each (var cite in series){
			print("got a set: "+cite);
			for each (var varname in ["title","container-title"]){
				print("checking "+cite[varname].blob);
				//
				// By golly, it really does work.  How about that.
				//
				if (cite[varname] && cite[varname].blob){
					cite[varname].blob.blobs = cite[varname].blob.blobs.slice(0,cite[varname].pos).concat(cite[varname].blob.blobs.slice((cite[varname].pos+1)));
					print(varname+" ok");
				};
			};
		}
	};
};

CSL.parallel = new CSL.parallel();
