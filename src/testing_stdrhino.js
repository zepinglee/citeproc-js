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
dojo.provide("csl.testing_stdrhino");

/**
 * Retrieval methods for standard tests.
 */
var StdRhinoTest = function(myname){
	this.myname = myname;
	this._cache = {};
	this._ids = [];
	if (myname){
		var test = readFile("./std/machines/" + myname + ".json", "UTF-8");
		eval( "this.test = "+test);
		this.result = this.test.result;
		this._setCache();
	}
};

//
// Retrieve properly composed item from phoney database.
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.retrieveItem = function(id){
	return this._cache[id];
};

//
// Retrieve properly composed items from phoney database.
// (Deployments must provide an instance object with
// this method.)
//
//StdRhinoTest.prototype.retrieveItems = function(ids){
//	var ret = [];
//	for each (var id in ids){
//		ret.push(this.retrieveItem(id));
//	}
//	return ret;
//};


//
// Build phoney database.
//
StdRhinoTest.prototype._setCache = function(){
	for each (item in this.test.input){
		this._cache[item.id] = item;
		this._ids.push(item.id);
	}
};


StdRhinoTest.prototype._readTest = function(){
	var test;
	var filename = "std/machines/" + this.myname + ".json";
	//
	// Half of the fix for encoding problem encountered by Sean
	// under OSX.  External strings are _read_ correctly, but an
	// explicit encoding declaration on readFile is needed if
	// they are to be fed to eval.  This may set the implicit
	// UTF-8 binary identifier on the stream, as defined in the
	// ECMAscript specification.  See http://www.ietf.org/rfc/rfc4329.txt
	//
	// Python it's not.  :)
	//
	var teststring = readFile(filename, "UTF-8");
	//
	// Grab test data in an object.
	//
	try {
		eval( "test = "+teststring );
	} catch(e){
		throw e + teststring;
	}
	this.test = test;
};


StdRhinoTest.prototype.run = function(){
	this.style = new CSL.Engine(this,this.test.csl);
	this.style.setContainerTitleAbbreviations(this.test.abbreviations);
	if (this.test.bibentries){
		for each (var id_set in this.test.bibentries){
			this.style.updateItems(id_set);
		}
	} else {
		this.style.updateItems(this._ids);
	}
	if (this.test.mode == "citation"){
		if (!this.test.citations){
			var citation = [];
			for each (item in this.style.registry.reflist){
				citation.push([item.id,{}]);
			}
			this.test.citations = [citation];
		}
		var citations = [];
		for each (var citation in this.test.citations){
			citations.push(this.style.makeCitationCluster(citation));
		}
		var ret = citations.join("\n");
	} else if (this.test.mode == "bibliography"){
		if (this.test.bibsection){
			var ret = this.style.makeBibliography(this.test.bibsection)[1].join("");
		} else {
			var ret = this.style.makeBibliography()[1].join("");
		}
        ret = "<div class=\"csl-bib-body\">\n" + ret + "</div>";
	} else if (this.test.mode == "bibliography-header"){
		var ret = this.style.makeBibliography()[0];
	} else {
		throw "Invalid mode in test file "+this.myname+": "+this.test.mode;
	}
	return ret;
};

//
// Retrieve locale object from filesystem
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.retrieveLocale = function(lang){
	var ret = readFile( "./locale/"+CSL.localeRegistry[lang], "UTF-8");
	// ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	return ret;
};
