dojo.provide("csl.render");


/**
 * Get the undisambiguated version of a cite, without decorations
 * <p>This is used internally by the Registry.</p>
 */
CSL.Engine.prototype.getAmbiguousCite = function(Item,disambig){
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

CSL.Engine.prototype.composeItem = function(item){
	var newItem = {};
	//var Item = this.sys.retrieveItem(item[0]);
	for (var i in item[0]){
		newItem[i] = item[0][i];
	}
	for (var i in item[1]){
		newItem[i] = item[1][i];
	}
	return newItem;
};

/**
 * Get the sort key of an item, without decorations
 * <p>This is used internally by the Registry.</p>
 */
CSL.Engine.prototype.getSortKeys = function(Item,key_type){
	if (false){
		print("KEY TYPE: "+key_type);
	}
	var area = this.tmp.area;
	var strip_prepositions = CSL.Util.Sort.strip_prepositions;
	this.tmp.area = key_type;
	this.tmp.disambig_override = true;
	this.tmp.disambig_request = false;
	this.tmp.suppress_decorations = true;
	this._cite.call(this,Item);
	this.tmp.suppress_decorations = false;
	this.tmp.disambig_override = false;
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
CSL.Engine.prototype.getAmbigConfig = function(){
	var config = this.tmp.disambig_request;
	if (!config){
		config = this.tmp.disambig_settings;
	}
	var ret = CSL.Factory.cloneAmbigConfig(config);
	return ret;
};


/**
 * Return max values for disambiguation
 */
CSL.Engine.prototype.getMaxVals = function(){
	return this.tmp.names_max.mystack.slice();
};

/**
 * Return min value for disambiguation
 */
CSL.Engine.prototype.getMinVal = function(){
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
//
// XXXXX: The handling of delimiters needs cleanup.
// Is the tmp.delimiter stack used for *anything*?
//
CSL.Engine.prototype.getSpliceDelimiter = function(last_collapsed){
	if (last_collapsed && ! this.tmp.have_collapsed && this["citation"].opt["after-collapse-delimiter"]){
		this.tmp.splice_delimiter = this["citation"].opt["after-collapse-delimiter"];
	}
	return this.tmp.splice_delimiter;
};

/**
 * Return available modes for disambiguation
 */
CSL.Engine.prototype.getModes = function(){
	var ret = new Array();
	if (this[this.tmp.area].opt["disambiguate-add-names"]){
		ret.push("names");
	}
	var dagopt = this[this.tmp.area].opt["disambiguate-add-givenname"];
	var gdropt = this[this.tmp.area].opt["givenname-disambiguation-rule"];
	//
	// what the heck.  whatever.  use by-cite disambiguation
	// for everything, for starters.  why not.
	//
	// hmm.  don't need any name expansion with the primary-name
	// disambiguate-add-givenname, so no givens in that case.
	if (dagopt){
		if (!gdropt || ("string" == typeof gdropt && "primary-name" != gdropt.slice(0,12))){
			ret.push("givens");
		};
	}
	return ret;
};


/*
 * Compose individual cites into a single string.  (This requires
 * further work to accomodate various adjustments to inter-cite
 * splicing.  There are lots of possibilities, which will require
 * careful planning.)
 */
CSL.Engine.prototype._bibliography_entries = function (){
	this.tmp.area = "bibliography";
	var input = this.sys.retrieveItems(this.registry.getSortedIds());
	this.tmp.disambig_override = true;
	this.output.addToken("bibliography_joiner","\n");
	this.output.openLevel("bibliography_joiner");
	var bib_wrapper = new CSL.Factory.Token("group",CSL.START);
	bib_wrapper.decorations = [["@bibliography","wrapper"]];
	this.output.startTag("bib_wrapper",bib_wrapper);
	for each (item in input){
		if (false){
			print("BIB: "+item.id);
		}
		var bib_entry = new CSL.Factory.Token("group",CSL.START);
		bib_entry.decorations = [["@bibliography","entry"]];
		this.output.startTag("bib_entry",bib_entry);
		this._cite.call(this,item);
		this.output.endTag(); // closes bib_entry
	}
	this.output.endTag(); // closes bib_wrapper
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
CSL.Engine.prototype._unit_of_reference = function (inputList){
	this.tmp.area = "citation";
	var delimiter = "";
	var result = "";
	var objects = [];

	for each (var Item in inputList){
		var last_collapsed = this.tmp.have_collapsed;
		this._cite(Item);
		//
		// This will produce a stack with one
		// layer, and exactly one or two items.
		// We merge these as we go along, to get
		// the joins right for the pairs.
		//delimiter = this.getSpliceDelimiter(last_collapsed);
		//this.tmp.delimiter.replace(delimiter);
		this.getSpliceDelimiter(last_collapsed);
		//this.tmp.delimiter.replace(delimiter);
		this.tmp.handle_ranges = true;
		if (Item["author-only"]){
			this.tmp.suppress_decorations = true;
		}
		var composite = this.output.string(this,this.output.queue);
		this.tmp.suppress_decorations = false;
		this.tmp.handle_ranges = false;
		if (Item["author-only"]){
			return composite;
		}
		if (objects.length && "string" == typeof composite[0]){
			composite.reverse();
			objects.push(this.tmp.splice_delimiter + composite.pop());
		} else {
			composite.reverse();
			var compie = composite.pop();
			if ("undefined" != typeof compie){
				objects.push(compie);
			};
		}
		composite.reverse();
		for each (var obj in composite){
			if ("string" == typeof obj){
				objects.push(this.tmp.splice_delimiter + obj);
				continue;
			}
			var compie = composite.pop();
			if ("undefined" != typeof compie){
				objects.push(compie);
			};
		};
	};
	result += this.output.renderBlobs(objects);
	if (result){
		result = this.citation.opt.layout_prefix + result + this.citation.opt.layout_suffix;
		if (!this.tmp.suppress_decorations){
			for each (var params in this.citation.opt.layout_decorations){
				result = this.fun.decorate[params[0]][params[1]](this,result);
			};
		};
	};
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
CSL.Engine.prototype._cite = function(Item){
	this.start(Item);
	var next = 0;
	while(next < this[this.tmp.area].tokens.length){
		next = this._render(this[this.tmp.area].tokens[next],Item);
    }
	this.end();
};

/*
 * Render one style token.
 *
 * This is called on a token, with the state object
 * and an Item object as arguments.
 */
CSL.Engine.prototype._render = function(token,Item){
    var next = token.next;
	var maybenext = false;
	if (false){
		print("---> Token: "+token.name+" ("+token.tokentype+") in "+this.tmp.area+", "+this.output.current.mystack.length);
		//print("       next is: "+next+", success is: "+token.succeed+", fail is: "+token.fail);
	}

	if (token.evaluator){
	    next = token.evaluator(token,this,Item);
    };
	for each (var exec in token.execs){
	    maybenext = exec.call(token,this,Item);
		if (maybenext){
			next = maybenext;
		};
	};
	if (false){
		print(token.name+" ("+token.tokentype+") ---> done");
	}
	return next;
};

CSL.Engine.prototype.start = function(Item){
	this.tmp.have_collapsed = true;
	this.tmp.render_seen = false;
	if (this.tmp.disambig_request  && ! this.tmp.disambig_override){
		this.tmp.disambig_settings = this.tmp.disambig_request;
	} else if (this.registry.registry[Item.id] && ! this.tmp.disambig_override) {
		this.tmp.disambig_request = this.registry.registry[Item.id].disambig;
		this.tmp.disambig_settings = this.registry.registry[Item.id].disambig;
	} else {
		this.tmp.disambig_settings = new CSL.Factory.AmbigConfig();
	}
	this.tmp.names_used = new Array();
	this.tmp.nameset_counter = 0;
	this.tmp.years_used = new Array();

	this.tmp.splice_delimiter = this[this.tmp.area].opt.delimiter;

	this["bibliography_sort"].keys = new Array();
	this["citation_sort"].keys = new Array();
};

CSL.Engine.prototype.end = function(){

	if (this.tmp.last_suffix_used && this.tmp.last_suffix_used.match(/.*[-.,;:]$/)){
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.prefix.value() && this.tmp.prefix.value().match(/^[,,:;a-z].*/)){
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.last_suffix_used || this.tmp.prefix.value()){
			//
			// forcing the delimiter back to normal if a
			// suffix or prefix touch the join, even if
			// a year-suffix is the only output.
			//
			// XXXX: This should not be necessary.  Any cite matching
			// this condition should be forced to full form anyway.
			//
		this.tmp.splice_delimiter = state[this.tmp.area].opt.delimiter;
	}

	this.tmp.last_suffix_used = this.tmp.suffix.value();
	this.tmp.last_years_used = this.tmp.years_used.slice();
	this.tmp.last_names_used = this.tmp.names_used.slice();

	this.tmp.disambig_request = false;
};
