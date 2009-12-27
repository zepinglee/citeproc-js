/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
if (!CSL) {
   load("./src/csl.js");
}


/**
 * String stack object.
 * <p>Numerous string stacks are used to track nested
 * parameters at runtime.  This class provides methods
 * that remove some of the aggravation of managing
 * them.</p>
 * @class
 */
CSL.Stack = function(val,literal){
	this.mystack = new Array();
	if (literal || val){
		this.mystack.push(val);
	};
};

/**
 * Push a value onto the stack.
 * <p>This just does what it says.</p>
 */
CSL.Stack.prototype.push = function(val,literal){
	if (literal || val){
		this.mystack.push(val);
	} else {
		this.mystack.push("");
	}
};

/**
 * Clear the stack
 */
CSL.Stack.prototype.clear = function(){
	this.mystack = new Array();
};

/**
 * Replace the top value on the stack.
 * <p>This removes some ugly syntax from the
 * main code.</p>
 */
CSL.Stack.prototype.replace = function(val,literal){
	//
	// safety fix after a bug was chased down.  Rhino
	// JS will process a negative index without error (!).
	if (this.mystack.length == 0){
		throw "Internal CSL processor error: attempt to replace nonexistent stack item with "+val;
	}
	if (literal || val){
		this.mystack[(this.mystack.length-1)] = val;
	} else {
		this.mystack[(this.mystack.length-1)] = "";
	}
};


/**
 * Remove the top value from the stack.
 * <p>Just does what it says.</p>
 */
CSL.Stack.prototype.pop = function(){
	return this.mystack.pop();
};


/**
 * Return the top value on the stack.
 * <p>Removes a little hideous complication from
 * the main code.</p>
 */
CSL.Stack.prototype.value = function(){
	return this.mystack.slice(-1)[0];
};


/**
 * Return length (depth) of stack.
 * <p>Used to identify if there is content to
 * be handled on the stack</p>
 */
CSL.Stack.prototype.length = function(){
	return this.mystack.length;
};
