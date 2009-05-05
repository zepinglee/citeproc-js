dojo.provide("csl.blob");

CSL.Factory.Blob = function(token,str){
	if (token){
		this.strings = {};
		for each (key in token.strings){
			this.strings[key] = token.strings[key];
		};
		this.decorations = [];
		for each (keyset in token.decorations){
			this.decorations.push(keyset.slice());
		}
		//this.decorations = token.decorations;
	} else {
		this.strings = {};
		this.decorations = [];
	};
	if ("string" == typeof str){
		this.blobs = str;
	} else {
		this.blobs = new Array();
	};
};
