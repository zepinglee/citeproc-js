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
 * Return a citation "cluster" as a string.
 * Accepts a list of cite data objects as a single argument.
 * Objects in the list contain a mandatory "id" field
 * and optional supplementary fields.
 * See
 * <a href="http://gsl-nagoya-u.net/http/pub/citeproc-doc.html#makecitationcluster">the
 * processor manual</a> for details.
 * @param {Array} rawList
 */
CSL.Engine.prototype.makeCitationCluster = function(rawList){
	var inputList = [];
	for each (var item in rawList){
		var Item = this.sys.retrieveItem(item.id);
		var newitem = CSL.composeItem(Item,item);
		inputList.push(newitem);
	}
	if (inputList && inputList.length > 1 && this["citation_sort"].tokens.length > 0){
		for (var k in inputList){
			inputList[k].sortkeys = CSL.getSortKeys.call(this,inputList[k],"citation_sort");
		}
		inputList.sort(this.citation.srt.compareKeys);
	};
	var str = CSL.getCitationCluster.call(this,inputList);
	return str;
};


/**
 * Return an array of two elements, consisting of an object
 * containing formatting
 * parameters, and a bibliography string.
 * Accepts a JSON object containing
 * one of the three optional fields "select", "include"
 * or "exclude", and possibly also a "quash" field.
 * Each of these optional fields is composed as
 * an array of match objects.
 * See
 * <a href="http://gsl-nagoya-u.net/http/pub/citeproc-doc.html#makebibliography">the
 * processor manual</a> for details.
 * @param {Object} bibsection
 *
 */
CSL.Engine.prototype.makeBibliography = function(bibsection){
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
	var ret = CSL.getBibliographyEntries.call(this,bibsection);
	var params = {
		"maxoffset":0,
		"entryspacing":1,
		"linespacing":1
	};
	var maxoffset = 0;
	for each (var item in this.registry.reflist){
		if (item.offset > params.maxoffset){
			params.maxoffset = item.offset;
		};
	};
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

/**
 * Register a sequence of items in the processor.
 * Accepts a list of item IDs that uniquely
 * identify items available in the processor
 * environment.  IDs in the list are strings.
 * See
 * <a href="http://gsl-nagoya-u.net/http/pub/citeproc-doc.html#updateitems">the
 * processor manual</a> for details.
 * @param {Array} idList
 */
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
