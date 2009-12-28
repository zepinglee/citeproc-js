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
//
// XXXXX: note to self, the parallels machinery should be completely
// disabled when sorting of citations is requested.
//
//
// XXXXX: also mark the entry as "parallel" on the citation
// object.
//
//
// XXXXX: thinking forward a bit, we're going to need a means
// of snooping and mangling delimiters.  Inter-cite delimiters
// can be easily applied; it's just a matter of adjusting
// this.tmp.splice_delimiter (?) on the list of attribute
// bundles after a cite or set of cites is completed.
// That happens in cmd_cite.js.  We also need to do two
// things: (1) assure that volume, number, journal and
// page are contiguous within the cite, with no intervening
// rendered variables [done]; and (2) strip affixes to the series,
// so that the sole splice string is the delimiter.  This
// latter will need a walk of the output tree, but it's
// doable.
//
// The advantage of doing things this way is that
// the parallels machinery is encapsulated in a set of
// separate functions that do not interact with cite
// composition.
//

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.Parallel = function(){
	this.one_set = new CSL.Stack();
	this.all_sets = new CSL.Stack();
	this.try_cite = true;
	this.use_parallels = true;
};

CSL.Parallel.prototype.isMid = function(variable){
	return ["volume","container-title","issue","page"].indexOf(variable) > -1;
}

CSL.Parallel.prototype.StartCitation = function(){
	if (this.use_parallels){
		this.all_sets.clear();
		this.one_set.clear();
		this.in_series = false;
	};
};

/**
 * Sets up an empty variables tracking object.
 *
 */
CSL.Parallel.prototype.StartCite = function(Item,item){
	if (this.use_parallels){
		if (item){
			item.parallel = false;
		};
		this.try_cite = true;
		for each (var x in ["title", "container-title","volume","page"]){
			if (!Item[x]){
				this.try_cite = false;
				if (this.in_series){
					this.all_sets.push(this.one_set.value());
					this.one_set.clear();
					this.in_series = false;
				};
				break;
			};
		};
		this.cite = new Object();
		this.cite.top = new Array();
		this.cite.mid = new Array();
		this.cite.end = new Array();
		this.cite.item = item;
		this.target = "top";
	};
};

/**
 * Initializes scratch object and variable name string
 * for tracking a single variable.
 */
CSL.Parallel.prototype.StartVariable = function (variable){
	if (this.use_parallels && this.try_cite){
		this.variable = variable;
		this.data = new Object();
		this.data.value = "";
		this.data.blobs = new Array();
		var is_mid = this.isMid(variable);
		if (this.target == "top" && is_mid){
			this.target = "mid";
		} else if (this.target == "mid" && !is_mid){
			this.target = "end";
		} else if (this.target == "end" && is_mid){
			this.try_cite = false;
			this.in_series = false;
		};
		this.cite[this.target].push(variable);
	};
};

/**
 * Adds a blob to the the scratch object.  Invoked through
 * state.output.append().  The pointer is used to snip
 * the target blob out of the output queue if appropriate,
 * after parallels detection is complete.
 */
CSL.Parallel.prototype.AppendBlobPointer = function (blob){
	if (this.use_parallels && this.try_cite && blob && blob.blobs){
		this.data.blobs.push([blob,blob.blobs.length]);
	};
};

/**
 * Adds string data to the current variable
 * in the variables tracking object.
 */
CSL.Parallel.prototype.AppendToVariable = function(str){
	if (this.use_parallels && this.try_cite){
		this.data.value += "::"+str;
	};
};

/**
 * Merges scratch object to the current cite object.
 * Checks variable content, and possibly deletes the
 * variables tracking object to abandon parallel cite processing
 * for this cite.  [??? careful with the logic here, current
 * item can't necessarily be discarded; it might be the first
 * member of an upcoming sequence ???]
 */
CSL.Parallel.prototype.CloseVariable = function(){
	if (this.use_parallels && this.try_cite){
		this.cite[this.variable] = this.data;
		if (this.one_set.mystack.length > 0){
			var prev = this.one_set.mystack[(this.one_set.mystack.length-1)];
			if (!this.isMid(this.variable) && this.data.value != prev[this.variable].value){
				// evaluation takes place later, at close of cite.
				this.try_cite = false;
				this.in_series = false;
			};
		};
	};
};

/**
 * Merges current cite object to the
 * tracking array, and evaluate maybe.
 */
CSL.Parallel.prototype.CloseCite = function(state){
	if (this.use_parallels){
		if (this.try_cite){
			if (this.one_set.mystack.length && state[state.tmp.area].opt["year-suffix-delimiter"]){
				state.tmp.splice_delimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
			}
		} else {
			this.ComposeSet();
		};
		this.one_set.push(this.cite);
	};
};

/**
 * Move variables tracking array into the array of
 * composed sets.
 */
CSL.Parallel.prototype.ComposeSet = function(){
	if (this.use_parallels){
		if (this.one_set.mystack.length > 1){
			this.all_sets.push( this.one_set.mystack.slice() );
		};
		this.one_set.clear();
	};
};

/**
 * Mangle the queue as appropropriate.
 */
CSL.Parallel.prototype.PruneOutputQueue = function(item){
	if (this.use_parallels){
		for each (var series in this.all_sets.mystack){
			for (var pos=0; pos<series.length; pos++){
				var cite = series[pos];
				if (pos == 0){
					this.purgeVariableBlobs(cite,cite.end);
				} else {
					if ("object" == typeof this.cite.item){
						this.cite.item.parallel = true;
					}
					if (pos == (series.length-1) && series.length > 2){
						this.purgeVariableBlobs(cite,cite.top.concat(cite.end));
					} else {
						this.purgeVariableBlobs(cite,cite.top);
					};
				};
			};
		};
	};
};

CSL.Parallel.prototype.purgeVariableBlobs = function(cite,varnames){
	if (this.use_parallels){
		for each (var varname in varnames){
			if (cite[varname]){
				for each (var b in cite[varname].blobs){
					b[0].blobs = b[0].blobs.slice(0,b[1]).concat(b[0].blobs.slice((b[1]+1)));
				};
			};
		};
	};
};

