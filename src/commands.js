dojo.provide("csl.commands");

/**
 * This module provides the commands used to instantiate
 * and control the processor.
 */
CSL.makeStyle = function(sys,xml,lang){
	var engine = new CSL.Engine(sys,xml,lang);
	return engine;
};

/**
 * Compose a citation "cluster".
 * <p>Accepts an Item object or a list of Item objects as a
 * single argument.  Citation clusters are typically used in the
 * body of a document.  Because locator information may be
 * needed to correctly render cites within a cluster, the
 * argument should be a list of actual objects, rather
 * than item keys.  (The code in {@link CSL.System.Retrieval}
 * does recognize keys, but this is intended only for testing
 * purposes.)</p>
 */
CSL.Engine.prototype.makeCitationCluster = function(rawList){
	var inputList = [];
	for each (var item in rawList){
		var Item = this.sys.retrieveItem(item[0]);
		//this.registry.insert(this,Item);
		//
		// This method will in future only be used for rendering.
		// Assume that all items in rawList exist in registry.
		// this.registry.insert(this,Item);
		var newitem = this.composeItem([Item,item[1]]);
		inputList.push(newitem);
	}
	//
	// don't bother sorting unless there is more than one item.
	// "sortkeys" will need to be changed if CSL decides to make
	// it a variable name.
	if (inputList && inputList.length > 1 && this["citation_sort"].tokens.length > 0){
		var srt = new CSL.Factory.Registry.Comparifier(this,"citation_sort");
		for (var k in inputList){
			inputList[k].sortkeys = this.getSortKeys(inputList[k],"citation_sort");
		}
		inputList.sort(srt.compareKeys);
	};

	//
	// sort thingie goes here
	//
	this.tmp.last_suffix_used = "";
	this.tmp.last_names_used = new Array();
	this.tmp.last_years_used = new Array();
	var str = this._unit_of_reference.call(this,inputList);
	return str;
};


/**
 * Compose a bibliography.
 * <p>Returns the bibliography for the session as
 * a single string.  Entries in the bibliography are
 * sorted according to the system locale, with
 * disambiguation adjustments requested by the style.</p>
 */
CSL.Engine.prototype.makeBibliography = function(){
	var debug = false;
	if (debug){
		for each (tok in this.bibliography.tokens){
			print("bibtok: "+tok.name);
		}
		print("---");
		for each (tok in this.citation.tokens){
			print("cittok: "+tok.name);
		}
		print("---");
		for each (tok in this.bibliography_sort.tokens){
			print("bibsorttok: "+tok.name);
		}
	}
	return this._bibliography_entries.call(this);
};


CSL.Engine.prototype.updateItems = function(idList){
	if (debug){
		print("a");
	};
	this.registry.init(idList);
	if (debug){
		print("b");
	};
	this.registry.dodeletes(this.registry.myhash);
	if (debug){
		print("c");
	};
	this.registry.doinserts(this.registry.mylist);
	if (debug){
		print("d");
	};
	this.registry.dorefreshes();
	if (debug){
		print("e");
	};
	this.registry.rebuildlist();
	if (debug){
		print("f");
	};
	this.registry.setdisambigs();
	if (debug){
		print("g");
	};
	this.registry.setsortkeys();
	if (debug){
		print("h");
	};
	this.registry.sorttokens();
	if (debug){
		print("i");
	};
	this.registry.renumber();
	if (debug){
		print("j");
	};
	this.registry.yearsuffix();
};
