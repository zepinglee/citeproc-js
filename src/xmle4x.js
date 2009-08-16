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
dojo.provide("csl.xmle4x");

/**
 * Functions for parsing an XML object using E4X.
 */
CSL.System.Xml.E4X = function(){};



/**
 * E4X can't handle XML declarations, so we lose them here.
 */
CSL.System.Xml.E4X.prototype.clean = function(xml){
	xml = xml.replace(/<\?[^?]+\?>/g,"");
	xml = xml.replace(/<![^>]+>/g,"");
	xml = xml.replace(/^\s+/g,"");
	xml = xml.replace(/\s+$/g,"");
	return xml;
};


/**
 * Make an E4X object from a style.
 */
CSL.System.Xml.E4X.prototype.parse = function(myxml){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	myxml = new XML( this.clean(myxml) );
	return myxml;
};


/**
 * Methods to call on a node.
 */
CSL.System.Xml.E4X.prototype.children = function(myxml){
	var ret = myxml.children();
	return ret;
};

CSL.System.Xml.E4X.prototype.nodename = function(myxml){
	return myxml.localName();
};

CSL.System.Xml.E4X.prototype.attributes = function(myxml){
	var ret = new Object();
	var attrs = myxml.attributes();
	for (var idx in attrs){
		var key = "@"+attrs[idx].localName();
		var value = attrs[idx].toString();
		ret[key] = value;
	}
	if (myxml.localName() == "style" || myxml.localName() == "locale"){
		var xml = new Namespace("http://www.w3.org/XML/1998/namespace");
		//print("my language: "+this.@xml::lang.toString());
		var lang = myxml.@xml::lang.toString();
		if (lang){
			ret["@lang"] = lang;
		}
	}
	return ret;
};


CSL.System.Xml.E4X.prototype.content = function(myxml){
	return myxml.toString();
};


CSL.System.Xml.E4X.prototype.numberofnodes = function(myxml){
	return myxml.length();
};

CSL.System.Xml.E4X.prototype.makeXml = function(str){
	// this is where this should happen
	str = str.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	var ret = new XML(str);
	return ret;
};

//
// Retrieve locale object from filesystem
// (Deployments must provide an instance object with
// this method.)
//
CSL.System.Xml.E4X.prototype.getLang = function(lang){
	var ret = readFile( "./locale/"+CSL.localeRegistry[lang], "UTF-8");
	ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	return ret;
};

