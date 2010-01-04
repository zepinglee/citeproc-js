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
var StdRhinoTest = function(myname){
	this.myname = myname;
	this._cache = {};
	this._acache = { "default": {
						 "journal":{
							 "Journal of Irreproducible Results":"J. Irrep. Res."
						 },
						 "series":{
							 "International Rescue Wildlife Series":"I.R. Wildlife Series"
						 },
						 "authority":{
							 "United Nations": "U.N."
						 },
						 "institution":{
							 "Bureau of Gaseous Unformed Stuff":"BoGUS",
							 "Economic Commission for Latin America and the Carribean":"ECLAC"
						 }
					 }
				   };
	this._ids = [];
	if (myname){
		var test = readFile("./tests/std/machines/" + myname + ".json", "UTF-8");
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

StdRhinoTest.prototype.getAbbreviations = function(name,vartype){
	return this._acache[name][vartype];
};

StdRhinoTest.prototype.addAbbreviation = function(name,vartype){
	this._acache[name][vartype] = "";
};

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
	var ret = new Array();
	this.style = new CSL.Engine(this,this.test.csl);
	this.style.setAbbreviations("default");
	if (this.test.bibentries){
		for each (var id_set in this.test.bibentries){
			this.style.updateItems(id_set);
		}
	} else {
		this.style.updateItems(this._ids);
	}
	if (this.test.mode == "citation"){
		if (!this.test.citation_items && !this.test.citations){
			var citation = [];
			for each (item in this.style.registry.reflist){
				citation.push({"id":item.id});
			}
			this.test.citation_items = [citation];
		}
		var citations = [];
		if (this.test.citation_items){
			for each (var citation in this.test.citation_items){
				// sortCitationCluster(), we hardly knew ya
				// this.style.sortCitationCluster(citation);
				citations.push(this.style.makeCitationCluster(citation));
			}
		} else if (this.test.citations){
			for each (var citation in this.test.citations.slice(0,-1)){
				this.style.processCitationCluster(citation[0],citation[1],citation[2]);
			};
			var citation = this.test.citations.slice(-1)[0];
			var result = this.style.processCitationCluster(citation[0],citation[1],citation[2]);
		};
		var indexMap = new Object();
		for (var pos in result){
			indexMap[""+result[pos][0]] = pos;
		};
		for (var cpos in this.style.registry.citationreg.citationByIndex){
			var citation = this.style.registry.citationreg.citationByIndex[cpos];
			if (indexMap[""+cpos]){
				citations.push(">>["+cpos+"] "+result[indexMap[cpos]][1]);
			} else {
				citations.push("..["+cpos+"] "+this.style._processCitationCluster.call(this.style,this.style.registry.citationreg.citationByIndex[cpos].sortedItems));
			}
		};
		ret = citations.join("\n");
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
	var ret = readFile( "./locale/locales-"+lang+".xml", "UTF-8");
	// ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	return ret;
};
