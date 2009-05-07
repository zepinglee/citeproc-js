dojo.provide("csl.blob");

CSL.Factory.Blob = function(token,str){
	if (token){
		this.strings = new Object();
		for (key in token.strings){
			this.strings[key] = token.strings[key];
		};
		this.decorations = new Array();
		for each (keyset in token.decorations){
			this.decorations.push(keyset.slice());
		}
		//this.decorations = token.decorations;
	} else {
		this.strings = new Object();
		this.decorations = new Array();
	};
	if ("string" == typeof str){
		this.blobs = str;
	} else {
		this.blobs = new Array();
	};
	this.alldecor = [ this.decorations ];
};


CSL.Factory.Blob.prototype.push = function(blob){
	if ("string" == typeof this.blobs){
		throw "Attempt to push blob onto string object";
	} else {
		blob.alldecor = blob.alldecor.concat(this.alldecor);
		this.blobs.push(blob);
	}
};
