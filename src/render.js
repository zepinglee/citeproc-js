dojo.provide("csl.render");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * Get the undisambiguated version of a cite, without decorations
 * <p>This is used internally by the Registry.</p>
 */
CSL.Core.Engine.prototype.getAmbiguousCite = function(Item,disambig){
	if (disambig){
		this.tmp.disambig_request = disambig;
	} else {
		this.tmp.disambig_request = false;
	}
	this.tmp.area = "citation";
	this.tmp.suppress_decorations = true;
	this.tmp.force_subsequent = true;
	this._cite.call(this,Item);
	this.tmp.force_subsequent = false;
	var ret = this.output.string(this,this.output.queue);
	this.tmp.suppress_decorations = false;
	if (false){
		print("ok");
	}
	return ret;
}


/**
 * Get the sort key of an item, without decorations
 * <p>This is used internally by the Registry.</p>
 */
CSL.Core.Engine.prototype.getSortKeys = function(Item,key_type){
	if (false){
		print("KEY TYPE: "+key_type);
	}
	var area = this.tmp.area;
	var strip_prepositions = CSL.Util.Sort.strip_prepositions;
	this.tmp.area = key_type;
	this.tmp.disambig_request = false;
	this.tmp.suppress_decorations = true;
	this._cite.call(this,Item);
	this.tmp.suppress_decorations = false;
	for (var i in this[key_type].keys){
		this[key_type].keys[i] = strip_prepositions(this[key_type].keys[i]);
	}
	if (false){
		print("sort keys ("+key_type+"): "+this[key_type].keys);
	}
	this.tmp.area = area;
	return this[key_type].keys;
};

/**
 * Return current base configuration for disambiguation
 */
CSL.Core.Engine.prototype.getAmbigConfig = function(){
	var config = this.tmp.disambig_request;
	if (!config){
		config = this.tmp.disambig_settings;
	}
	var ret = this.fun.clone_ambig_config(config);
	return ret;
};


/**
 * Return max values for disambiguation
 */
CSL.Core.Engine.prototype.getMaxVals = function(){
	return this.tmp.names_max.mystack.slice();
};

/**
 * Return min value for disambiguation
 */
CSL.Core.Engine.prototype.getMinVal = function(){
	return this.tmp["et-al-min"];
};

/**
 * Return delimiter for use in join
 * <p>Splice evaluation is done during cite
 * rendering, and this method returns the
 * result.  Evaluation requires three items
 * of information from the preceding cite, if
 * one is present: the names used; the years
 * used; and the suffix appended to the
 * citation.  These details are copied into
 * the state object before processing begins,
 * and are cleared by the processor on
 * completion of the run.</p>
 */
CSL.Core.Engine.prototype.getSpliceDelimiter = function(){
	return this.tmp.splice_delimiter;
};

/**
 * Return available modes for disambiguation
 */
CSL.Core.Engine.prototype.getModes = function(){
	var ret = new Array();
	if (this[this.tmp.area].opt["disambiguate-add-names"]){
		ret.push("names");
	}
	if (this[this.tmp.area].opt["disambiguate-add-givenname"]){
		ret.push("givens");
	}
	return ret;
};


/*
 * Compose individual cites into a single string.  (This requires
 * further work to accomodate various adjustments to inter-cite
 * splicing.  There are lots of possibilities, which will require
 * careful planning.)
 */
CSL.Core.Engine.prototype._bibliography_entries = function (){
	this.tmp.area = "bibliography";
	var input = this.fun.retriever.getInput(this.registry.getSortedIds());
	this.tmp.disambig_override = true;
	this.output.addToken("bibliography","\n");
	this.output.openLevel("bibliography");
	for each (item in input){
		if (false){
			print("BIB: "+item.id);
		}
		this._cite.call(this,item);
		//this.output.squeeze();
	}
	this.output.closeLevel();
	this.tmp.disambig_override = false;
	return this.output.string(this,this.output.queue);
};

/*
 * Compose individual cites into a single string.  (This requires
 * further work to accomodate various adjustments to inter-cite
 * splicing.  There are lots of possibilities, which will require
 * careful planning.)
 */
CSL.Core.Engine.prototype._unit_of_reference = function (inputList){
	this.tmp.area = "citation";
	var delimiter = "";

	var result = "";

	var objects = [];

	for each (var Item in inputList){
		this._cite(Item);
		//
		// This will produce a stack with one
		// layer, and exactly one or two items.
		// We merge these as we go along, to get
		// the joins right for the pairs.
		delimiter = this.getSpliceDelimiter();
		this.tmp.delimiter.replace(delimiter);
		this.tmp.handle_ranges = true;
		var composite = this.output.string(this,this.output.queue);
		this.tmp.handle_ranges = false;
		//
		// At last!  Ready to compose trailing blobs.
		// We convert "string" output object to an array
		// before collapsing blobs.
		if (composite["str"]){
			if (objects.length){
				objects.push(this.tmp.splice_delimiter);
			}
			objects.push(composite["str"]);
		}
		if (composite["obj"].length){
			if (objects.length && !composite["str"]){
				for each (var obj in composite["obj"]){
					obj.splice_prefix = this.tmp.splice_delimiter;
					if (this[this.tmp.area].opt["year-suffix-delimiter"]){
						obj.successor_prefix = this[this.tmp.area].opt["year-suffix-delimiter"];
					} else {
						obj.successor_prefix = this.tmp.splice_delimiter;
					}
				}
			}
			objects = objects.concat(composite["obj"]);
		}
	}
	result += this.output.renderBlobs(objects);
	result = this.citation.opt.layout_prefix + result + this.citation.opt.layout_suffix;
	if (!this.tmp.suppress_decorations){
		for each (var params in this.citation.opt.layout_decorations){
			result = this.fun.decorate[params[0]][params[1]](result);
		}
	}
	return result;
};


/*
 * Render a single cite item.
 *
 * This is called on the state object, with a single
 * Item as input.  It iterates exactly once over the style
 * citation tokens, and leaves the result of rendering in
 * the top-level list in the relevant *.opt.output
 * stack, as a list item consisting of a single string.
 *
 * (This might be dual-purposed for generating individual
 * entries in a bibliography.)
 */
CSL.Core.Engine.prototype._cite = function(Item){
	for each (var func in this.init){
		func(this,Item);
	}
	var next = 0;
	while(next < this[this.tmp.area].tokens.length){
		next = this._render(this[this.tmp.area].tokens[next],Item);
    }
	for each (func in this.stop){
		func(this,Item);
	}
};


/*
 * Render one style token.
 *
 * This is called on a token, with the state object
 * and an Item object as arguments.
 */
CSL.Core.Engine.prototype._render = function(token,Item){
    var next = token.next;
	var maybenext = false;
	if (false){
		print("---> Token: "+token.name+" ("+token.tokentype+") in "+this.tmp.area);
		print("       next is: "+next+", success is: "+token.succeed+", fail is: "+token.fail);
	}
	if (token.evaluator){
	    next = token.evaluator.call(token,this,Item);
    };
	for each (var exec in token.execs){
	    maybenext = exec.call(token,this,Item);
		if (maybenext){
			next = maybenext;
		};
	};
	if (false){
		print("---> done");
	}
	return next;
};
