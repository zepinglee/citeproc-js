//
// This should use stack.  In fact, it should be an
// extension of stack.
//

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.parallelStartCitation = function(){
	this.tmp.parallel_variable_sets.clear();
	this.tmp.parallel_blob_sets.clear();
	this.tmp.parallel_variable_set.clear();
	this.tmp.parallel_blob_set.clear();
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
		var myvars = new Object();
		this.tmp.parallel_variable_set.push(myvars);
		var myblobs = new Array();
		this.tmp.parallel_blob_set.push(myblobs);
	} else {
		CSL.parallelComposeSet.call(this);
	};
};

/**
 * Adds a field entry on the current JS data object in the
 * variables tracking array, and a blob pointer to the
 * current cite array in the blobs tracking array.
 */
CSL.parallelProcessVariable = function (){};

/**
 * Move working data to composed sets, for analysis
 * after the full citation has been composed.
 */
CSL.parallelComposeSet = function(){
	if (this.tmp.parallel_variable_set.mystack.length > 1){
		this.tmp.parallel_variable_sets.push( this.tmp.parallel_variable_set.mystack.slice() );
		this.tmp.parallel_blob_sets.push( this.tmp.parallel_blob_set.mystack.slice() );
		this.tmp.parallel_variable_set.clear();
		this.tmp.parallel_blob_set.clear();
	};
};

/**
 * Analyze variables and values to identify parallel series'
 * in a front-to-back pass over the variables array, then mangle
 * the queue as appropropriate in a back-to-front pass over the
 * blobs array.
 */
CSL.parallelPruneOutputQueue = function(){};
