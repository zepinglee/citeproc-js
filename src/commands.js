/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
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
			CSL.debug("bibtok: "+tok.name);
		}
		CSL.debug("---");
		for each (tok in this.citation.tokens){
			CSL.debug("cittok: "+tok.name);
		}
		CSL.debug("---");
		for each (tok in this.bibliography_sort.tokens){
			CSL.debug("bibsorttok: "+tok.name);
		}
	}
	var ret = this._bibliography_entries.call(this);
	var params = {
		"maxoffset":0,
		"entryspacing":1,
		"linespacing":1
	};
	var maxoffset = 0;
	for each (var item in this.registry.reflist){
		if (item.offset > maxoffset){
			maxoffset = item.offset;
		};
	};
	if (maxoffset){
		CSL.debug("Max char offset for second-field-align etc: "+maxoffset);
		params.maxoffset = maxoffset;
	}
	if (this.bibliography.opt.hangingindent){
		params.hangingindent = this.bibliography.opt.hangingindent;
	}
	if (this.bibliography.opt.entryspacing){
		params.entryspacing = this.bibliography.opt.entryspacing;
	}
	if (this.bibliography.opt.linespacing){
		params.linespacing = this.bibliography.opt.linespacing;
	}
	return [params,ret];
};


CSL.Engine.prototype.updateItems = function(idList){
	var debug = false;
	if (debug){
		CSL.debug("--> init <--");
	};
	this.registry.init(idList);
	if (debug){
		CSL.debug("--> dodeletes <--");
	};
	this.registry.dodeletes(this.registry.myhash);
	if (debug){
		CSL.debug("--> doinserts <--");
	};
	this.registry.doinserts(this.registry.mylist);
	if (debug){
		CSL.debug("--> dorefreshes <--");
	};
	this.registry.dorefreshes();
	if (debug){
		CSL.debug("--> rebuildlist <--");
	};
	this.registry.rebuildlist();
	if (debug){
		CSL.debug("--> setdisambigs <--");
	};
	this.registry.setdisambigs();
	if (debug){
		CSL.debug("--> setsortkeys <--");
	};
	this.registry.setsortkeys();
	if (debug){
		CSL.debug("--> sorttokens <--");
	};
	this.registry.sorttokens();
	if (debug){
		CSL.debug("--> renumber <--");
	};
	this.registry.renumber();
	if (debug){
		CSL.debug("--> yearsuffix <--");
	};
	this.registry.yearsuffix();

	return this.registry.getSortedIds();
};
