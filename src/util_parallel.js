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
	this.tmp.parallel_variable_sets.clear();
	this.tmp.parallel_variable_set.clear();
};

/**
 * Adds an empty JS data object to the variables tracking array,
 * and adds an empty array to the blobs tracking array.
 */
CSL.parallelStartCite = function(Item){
	this.tmp.parallel_try_cite = true;
	for each (var x in ["container-title","title","volume","page"]){
		if (!Item[x]){
			this.tmp.parallel_try_cite = false;
			break;
		};
	};
	if (this.tmp.parallel_try_cite){
		//
		// XXXXX: myvars should contain all cite elements, with
		// values, for comparison with previous cites.  Hmm.  Why
		// not just analyze the items array fed to makeCitationCluster?
		//
		var myvars = new Object();
		this.tmp.parallel_variable_set.push(myvars);
	} else {
		CSL.parallelComposeSet.call(this);
	};
};

/**
 * Adds a field entry on the current JS data object in the
 * variables tracking array, and a blob pointer to the
 * current cite array in the blobs tracking array.
 */
CSL.parallelStartVariable = function (variable){
	if (this.tmp.parallel_try_cite){
		var mydata = new Object();
		mydata.blob = this.output.current.mystack[(this.output.current.mystack.length-1)];
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
CSL.parallelPruneOutputQueue = function(){
	for each (var cite in this.tmp.parallel_variable_sets.mystack){
		for each (var varname in ["title","container-title"]){
			if (cite[varname] && cite[varname].blob.blobs){
				print(varname+" ok");
			};
		};
	};
};
