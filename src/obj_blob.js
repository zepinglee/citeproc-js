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
CSL.Blob = function(token,str){
	if (token){
		this.strings = new Object();
		for (key in token.strings){
			this.strings[key] = token.strings[key];
		};
		this.decorations = new Array();
		for each (keyset in token.decorations){
			this.decorations.push(keyset.slice());
		}
	} else {
		this.strings = new Object();
		this.strings.prefix = "";
		this.strings.suffix = "";
		this.strings.delimiter = "";
		this.decorations = new Array();
	};
	if ("string" == typeof str){
		this.blobs = str;
	} else {
		this.blobs = new Array();
	};
	this.alldecor = [ this.decorations ];
};


CSL.Blob.prototype.push = function(blob){
	if ("string" == typeof this.blobs){
		throw "Attempt to push blob onto string object";
	} else {
		blob.alldecor = blob.alldecor.concat(this.alldecor);
		//CSL.debug("(blob.push alldecor): "+blob.alldecor);
		this.blobs.push(blob);
	}
};
