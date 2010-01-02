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
CSL.Engine.prototype.sortCitationCluster = function(rawList){
	var inputList = [];
};

CSL.Engine.prototype.processCitationCluster = function(citation,citationsPre,citationsPost){
	this.setCitationId(citation);
	var inputList = [];
	for each (var item in citation.citationItems){
		var Item = this.sys.retrieveItem(item.id);
	    var newitem = [Item,item];
		inputList.push(newitem);
	};
	if (inputList && inputList.length > 1 && this["citation_sort"].tokens.length > 0){
		for (var k in inputList){
			citation.citationItems[k].sortkeys = CSL.getSortKeys.call(this,inputList[k][0],"citation_sort");
		};
		inputList.sort(this.citation.srt.compareCompositeKeys);
	};
	// XXXXX: something additional will need to happen around here.
	this.parallel.StartCitation();
	var str = CSL.getCitationCluster.call(this,inputList);
	return str;
}

CSL.Engine.prototype.makeCitationCluster = function(rawList){
	var inputList = [];
	for each (var item in rawList){
		var Item = this.sys.retrieveItem(item.id);
	    var newitem = [Item,item];
		inputList.push(newitem);
	};
	if (inputList && inputList.length > 1 && this["citation_sort"].tokens.length > 0){
		for (var k in inputList){
			rawList[k].sortkeys = CSL.getSortKeys.call(this,inputList[k][0],"citation_sort");
		};
		inputList.sort(this.citation.srt.compareCompositeKeys);
	};
	this.parallel.StartCitation();
	var str = CSL.getCitationCluster.call(this,inputList);
	return str;
};


/**
 * Get the undisambiguated version of a cite, without decorations
 * <p>This is used internally by the Registry.</p>
 */
CSL.getAmbiguousCite = function(Item,disambig){
	if (disambig){
		this.tmp.disambig_request = disambig;
	} else {
		this.tmp.disambig_request = false;
	}
	this.tmp.area = "citation";
	this.tmp.suppress_decorations = true;
	this.tmp.force_subsequent = true;
	CSL.getCite.call(this,Item);
	this.tmp.force_subsequent = false;
	var ret = this.output.string(this,this.output.queue);
	this.tmp.suppress_decorations = false;
	if (false){
		CSL.debug("ok");
	}
	return ret;
}

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

CSL.getSpliceDelimiter = function(last_collapsed){
	if (last_collapsed && ! this.tmp.have_collapsed && this["citation"].opt["after-collapse-delimiter"]){
		this.tmp.splice_delimiter = this["citation"].opt["after-collapse-delimiter"];
	}
	return this.tmp.splice_delimiter;
};

/*
 * Compose individual cites into a single string, with
 * flexible inter-cite splicing.
 */
CSL.getCitationCluster = function (inputList){
	this.tmp.area = "citation";
	var delimiter = "";
	var result = "";
	var objects = [];
	this.tmp.last_suffix_used = "";
	this.tmp.last_names_used = new Array();
	this.tmp.last_years_used = new Array();


	var myparams = new Array();

	for (var pos in inputList){
		var Item = inputList[pos][0];
		var item = inputList[pos][1];
		var last_collapsed = this.tmp.have_collapsed;
		var params = new Object();

		CSL.getCite.call(this,Item,item);

		if (pos == (inputList.length-1)){
			this.parallel.ComposeSet();
		}
		//
		// XXXXX: capture these parameters to an array, which
		// will be of the same length as this.output.queue,
		// corresponding to each element.
		//
		params.splice_delimiter = CSL.getSpliceDelimiter.call(this,last_collapsed);
		if (item && item["author-only"]){
			this.tmp.suppress_decorations = true;
		}
		params.suppress_decorations = this.tmp.suppress_decorations;
		params.have_collapsed = this.tmp.have_collapsed;
		myparams.push(params);
	};

	this.parallel.PruneOutputQueue();
	//
	// output.queue is a simple array.  do a slice
	// of it to get each cite item, setting params from
	// the array that was built in the preceding loop.
	//
	var myblobs = this.output.queue.slice();
	for (var qpos in myblobs){

		this.output.queue = [myblobs[qpos]];

		this.tmp.suppress_decorations = myparams[qpos].suppress_decorations;
		this.tmp.splice_delimiter = myparams[qpos].splice_delimiter;
		this.tmp.have_collapsed = myparams[qpos].have_collapsed;

		var composite = this.output.string(this,this.output.queue);
		this.tmp.suppress_decorations = false;
		// meaningless assignment
		// this.tmp.handle_ranges = false;
		if (item && item["author-only"]){
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
	result += this.output.renderBlobs(objects)[0];
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
CSL.getCite = function(Item,item){
	this.parallel.StartCite(Item,item);
	CSL.citeStart.call(this,Item);
	var next = 0;
	while(next < this[this.tmp.area].tokens.length){
		next = CSL.tokenExec.call(this,this[this.tmp.area].tokens[next],Item,item);
    }
	CSL.citeEnd.call(this,Item);
	this.parallel.CloseCite(this);
};

CSL.citeStart = function(Item){
	this.tmp.have_collapsed = true;
	this.tmp.render_seen = false;
	if (this.tmp.disambig_request  && ! this.tmp.disambig_override){
		this.tmp.disambig_settings = this.tmp.disambig_request;
	} else if (this.registry.registry[Item.id] && ! this.tmp.disambig_override) {
		this.tmp.disambig_request = this.registry.registry[Item.id].disambig;
		this.tmp.disambig_settings = this.registry.registry[Item.id].disambig;
	} else {
		this.tmp.disambig_settings = new CSL.AmbigConfig();
	}
	this.tmp.names_used = new Array();
	this.tmp.nameset_counter = 0;
	this.tmp.years_used = new Array();

	this.tmp.splice_delimiter = this[this.tmp.area].opt.delimiter;

	this["bibliography_sort"].keys = new Array();
	this["citation_sort"].keys = new Array();

	this.tmp.count_offset_characters = false;
	this.tmp.offset_characters = 0;
	//
	// Oh ... shucks.  This is difficult.  We need to be able to
	// unwind this thing, so the derived values should really go into
	// registry, and the max be taken each time the data is delivered
	// back to the client.  Sucks, but will be robust and amazing that
	// way, so that's what we should do.
	//
};

CSL.citeEnd = function(Item){

	if (this.tmp.last_suffix_used && this.tmp.last_suffix_used.match(/.*[-.,;:]$/)){
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.prefix.value() && this.tmp.prefix.value().match(/^[,,:;a-z].*/)){
		this.tmp.splice_delimiter = " ";
	}

	this.tmp.last_suffix_used = this.tmp.suffix.value();
	this.tmp.last_years_used = this.tmp.years_used.slice();
	this.tmp.last_names_used = this.tmp.names_used.slice();

	this.tmp.disambig_request = false;
	if (!this.tmp.suppress_decorations && this.tmp.offset_characters){
		this.registry.registry[Item.id].offset = this.tmp.offset_characters;
	}
};
