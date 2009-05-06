dojo.provide("csl.queue");
if (!CSL) {
   load("./src/csl.js");
}


/**
 * Output queue object.
 * @class
 */
CSL.Output.Queue = function(state){
	this.state = state;
	this.queue = new Array();
	this.empty = new CSL.Factory.Token("empty");
	var tokenstore = {};
	tokenstore["empty"] = this.empty;
	this.formats = new CSL.Factory.Stack( tokenstore );
	this.current = new CSL.Factory.Stack( this.queue );
	this.suppress_join_punctuation = false;
};

CSL.Output.Queue.prototype.getToken = function(name){
	var ret = this.formats.value()[name];
	return ret;
};

// Store a new output format token based on another
CSL.Output.Queue.prototype.addToken = function(name,modifier,token){
	var newtok = new CSL.Factory.Token("output");
	if ("string" == typeof token){
		token = this.formats.value()[token];
	}
	if (token && token.strings){
		for (attr in token.strings){
			newtok.strings[attr] = token.strings[attr];
		}
		newtok.decorations = token.decorations;

	}
	if ("string" == typeof modifier){
		newtok.strings.delimiter = modifier;
	}
	this.formats.value()[name] = newtok;
};

//
// newFormat adds a new bundle of formatting tokens to
// the queue's internal stack of such bundles
CSL.Output.Queue.prototype.pushFormats = function(tokenstore){
	if (!tokenstore){
		tokenstore = new Object();
	}
	tokenstore["empty"] = this.empty;
	this.formats.push(tokenstore);
};


CSL.Output.Queue.prototype.popFormats = function(tokenstore){
	this.formats.pop();
};

CSL.Output.Queue.prototype.startTag = function(name,token){
	var tokenstore = {};
	tokenstore[name] = token;
	this.pushFormats( tokenstore );
	this.openLevel(name);
}

CSL.Output.Queue.prototype.endTag = function(){
	this.closeLevel();
	this.popFormats();
}

//
// newlevel adds a new blob object to the end of the current
// list, and adjusts the current pointer so that subsequent
// appends are made to blob list of the new object.

CSL.Output.Queue.prototype.openLevel = function(token){
	if (!this.formats.value()[token]){
		throw "CSL processor error: call to nonexistent format token \""+token+"\"";
	}
	//print("newlevel: "+token);
	//
	// delimiter, prefix, suffix, decorations from token
	var blob = new CSL.Factory.Blob(this.formats.value()[token]);
	var curr = this.current.value();
	curr.push( blob );
	this.current.push( blob.blobs );
};

/**
 * "merge" used to be real complicated, now it's real simple.
 */
CSL.Output.Queue.prototype.closeLevel = function(name){
	//print("merge");
	this.current.pop();
}

//
// append does the same thing as newlevel, except
// that the blob it pushes has text content,
// and the current pointer is not moved after the push.

CSL.Output.Queue.prototype.append = function(str,tokname){
	//print("append: "+str);
	var blob = false;
	if (!tokname){
		var token = this.formats.value()["empty"];
	} else if (tokname == "literal"){
		var token = true;
		blob = str;
	} else if ("string" == typeof tokname){
		var token = this.formats.value()[tokname];
	} else {
		var token = tokname;
	}
	if (!token){
		throw "CSL processor error: unknown format token name: "+tokname;
	}
	if (!blob){
		blob = new CSL.Factory.Blob(token,str);
	}
	var curr = this.current.value();
	var bloblist = this.state.fun.flipflopper.compose(blob);
	for each (var blobbie in bloblist){
		curr.push( blobbie );
	}
	//curr.push( blob );
	this.state.tmp.term_predecessor = true;
}

CSL.Output.Queue.prototype.string = function(state,blobs,blob){
	//print("string");
	var ret;
	ret = { "str": [], "obj": [] };
	if (blobs.length == 1 && "string" == blobs[0].blobs){
		ret["str"] = blobs[0];
	} else {
		for each (var blobjr in blobs){
			var strPlus = {"str":"","obj":[]};
			if ("string" == typeof blobjr.blobs){
				if ("number" == typeof blobjr.num){
					strPlus["obj"] = blobjr;
				} else {
					strPlus["str"] = blobjr.blobs;
				}
			} else {
				strPlus = this.string(state,blobjr.blobs,blobjr);
			};
			//
			// If there is a suffix, or any decorations, trailing rangeable
			// objects must be rendered and appended immediately here.
			//
			if (strPlus["obj"].length && (blobjr.strings.suffix || (blobjr.decorations && blobjr.decorations.length))){
				strPlus["str"] = strPlus["str"] + state.output.renderBlobs(strPlus["obj"]);
				strPlus["obj"] = [];
			}
			if (strPlus["str"]){
				if (!state.tmp.suppress_decorations){
					for each (var params in blobjr.decorations){
						strPlus["str"] = state.fun.decorate[params[0]][params[1]](strPlus["str"]);
					}
				}
				strPlus["str"] = blobjr.strings.prefix + strPlus["str"] + blobjr.strings.suffix;
				ret["str"].push(strPlus["str"]);
			}
			//
			// this passes rangeable objects through
			ret["obj"] = ret["obj"].concat(strPlus["obj"]);
		};
		if (blob) {
			ret["str"] = ret["str"].join(blob.strings.delimiter);
		} else {
			if (state.tmp.handle_ranges){
				ret["str"] = ret["str"].join("");
			} else {
				ret = ret["str"].join("");
			}
		}
	};
	this.queue = new Array();
	this.current.mystack = new Array();
	this.current.mystack.push( this.queue );
	return ret;
};

CSL.Output.Queue.prototype.clearlevel = function(){
	var blobs = this.current.value();
	for (var i=(blobs.length-1); i > -1; i--){
		blobs.pop();
	}
};

CSL.Output.Queue.prototype.renderBlobs = function(blobs){
	var state = this.state;
	var ret = "";
	for (var i=0; i < blobs.length; i++){
		if (blobs[i].checkNext){
			blobs[i].checkNext(blobs[(i+1)]);
		}
	}
	for each (var blob in blobs){
		if ("string" == typeof blob){
			//throw "Attempt to render string as rangeable blob"
			ret += blob;
		} else if (blob.status != CSL.SUPPRESS){
			// print("doing rangeable blob");
			//var str = blob.blobs;
			var str = blob.formatter.format(blob.num);
			if (!state.tmp.suppress_decorations){
				for each (var params in blob.decorations){
					str = state.fun.decorate[params[0]][params[1]](str);
				}
			}
			str = blob.strings.prefix + str + blob.strings.suffix;
			if (blob.status == CSL.END){
				//
				// XXXXX needs to be drawn from the object
				ret += blob.range_prefix;
			} else if (blob.status == CSL.SUCCESSOR){
				ret += blob.successor_prefix;
			} else if (blob.status == CSL.START){
				ret += blob.splice_prefix;
			}
			ret += str;
		}
	}
	return ret;
};
