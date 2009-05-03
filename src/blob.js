dojo.provide("csl.blob");

CSL.Factory.Blob = function(token,str){
	if (token){
		this.strings = token.strings;
		this.decorations = token.decorations;
	} else {
		this.strings = new Object();
	};
	if ("string" == typeof str){
		this.blobs = str;
	} else {
		this.blobs = new Array();
	};
};

