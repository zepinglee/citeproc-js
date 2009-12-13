//
// This should use stack.  In fact, it should be an
// extension of stack.
//

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.parallelStartCitation = function(){};

/**
 * Adds an empty JS data object to the variables tracking array,
 * and adds an empty array to the blobs tracking array.
 */
CSL.parallelStartCite = function(){};

/**
 * Adds a field entry on the current JS data object in the
 * variables tracking array, and a blob pointer to the
 * current cite array in the blobs tracking array.
 */
CSL.parallelProcessVariable = function (){};

/**
 * Analyze variables and values to identify parallel series'
 * in a front-to-back pass over the variables array, then mangle
 * the queue as appropropriate in a back-to-front pass over the
 * blobs array.
 */
CSL.parallelEndCitation = function(){};
