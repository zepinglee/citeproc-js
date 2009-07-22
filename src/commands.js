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
		this.registry.insert(this,Item);
		//
		// This method will in future only be used for rendering.
		// Assume that all items in rawList exist in registry.
		// this.registry.insert(this,Item);
		var newitem = this.composeItem([Item,item[1]]);
		inputList.push(newitem);
	}
	//
	// don't bother sorting unless there is more than one item.
	// this is really ugly and hackish.  uses a hashed reference
	// tacked onto the end of an array to squeeze the object
	// ID into the sorted list.
	if (inputList && inputList.length > 1 && this["citation_sort"].tokens.length > 0){
		var newlist = new Array();
		var keys_list = new Array();
		for each (var Item in inputList){
			var keys = this.getSortKeys(Item,"citation_sort");
			keys["cheaters_hack"] = Item;
			keys_list.push(keys);
		}
		var srt = new CSL.Factory.Registry.Comparifier(this,"citation_sort");
		keys_list.sort(srt.compareKeys);
		for each (key in keys_list){
			newlist.push(key.cheaters_hack);
		}
		//
		// XXXXX this is all one-time, one-way, slice probably isn't needed here?
		inputList = newlist;
	}

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


CSL.Engine.prototype.insertItems = function(rawList){
	for each (var item in rawList){
		var Item = this.sys.retrieveItem(item);
		this.registry.insert(this,Item);
	};
};

CSL.Engine.prototype.updateItems = function(idList){
	this.registry.init();
	this.registry.getdeletes();
	this.registry.getinserts();
	this.registry.delnames();
	this.registry.delambigs();
	this.registry.delhash();
	this.registry.addtohash();
	this.registry.buildlist();
	this.registry.renumber();
	this.registry.setdisambigs();
	this.registry.setsortkeys();
	this.registry.setsorttokens();
	this.registry.renumber();
};
