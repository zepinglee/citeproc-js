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
if(dojo){ 
    dojo.provide("csl.xmljs");
};

if (!CSL) {
	load("./src/csl.js");
}

/**
 * A barebones parser for CSL format files.
 * <p>This parser was the end product of difficulties I
 * experienced in working out the basics of the E4X XML
 * parser.  It is unnecessary where E4X is available,
 * but I've retained it as a demonstration of how the
 * body code works.  It's not really meant for production
 * use (it's slower than E4X, and one could probably construct
 * a valid CSL style file that would break it).</p>
 */
CSL.System.Xml.JunkyardJavascript = function(){};


/*
 * Clean the XML string in preparation for parsing.
 *
 * Most parser implementations will have something like this.
 * In most cases it will be a lot less complex, though.
 */
CSL.System.Xml.JunkyardJavascript.prototype.clean = function(xml) {
	xml = xml.replace(/\n/g,"");
	xml = xml.replace(/\>\s+/g,">");
	xml = xml.replace(/\s+\</g,"<");
	var xmllist = xml.split(/(<[^>]+>)/);
	var newlist = new Array();
	var i;
	var tag = false;
	var tagname = false;
	for (i=0; i<xmllist.length; i++) {
		if (xmllist[i]) {
			newlist.push(xmllist[i]);
		}
	}
	xmllist = newlist;
	newlist = new Array();
	for (i=0; i<xmllist.length; i++){
		tag = xmllist[i];
		if (tag[0] == "<" && (tag[1] == "?" || tag[1] == "!")){
			continue;
		}
		// only validate XML tag type things
		if (tag[0] == "<"){
			try {
				tagname = tag.match(/^.(\/*[a-zA-Z]+).*/)[1];
			} catch(e) {
				throw "CSL.System.Xml: bad XML markup: "+e;
			}
		}
		newlist.push(tag);
	}
	return newlist;
};


/*
 * Parse the XML string into a navigable object.
 *
 * This is where you would invoke your parser.
 */
CSL.System.Xml.JunkyardJavascript.prototype.parse = function(xml){
	xml = this.clean(xml);
	var token = new Array();
	token.name = this.getName(xml[0]);
	token.attributes = this.getAttributes(xml[0]);
	token = this._makeToken(token,xml);
	return [token];
};


/*
 * Command interface.
 *
 * These are the navigation and content retrieval functions
 * that are needed by the citeproc-js navigation machinery.
 * If you implement these, you're ready to go.
 */
CSL.System.Xml.JunkyardJavascript.prototype.commandInterface = new function(){
	this.children = children;
	this.nodename = nodename;
	this.attributes = attributes;
	this.content = content;
	this.numberofnodes = numberofnodes;

	function children(){
		// it's like, you know, [[],[[],[]],[]]
		return this.slice(0);
	};

	function nodename(){
		return this.name;
	}

	function attributes(){
		return this.attributes;
	}
	function content(){
		return this.text;
	}
	// called on a list of children
	// as represented in this XML parsing
	// imiplementation
	function numberofnodes(){
		return this.length;
	}

};


/*
 * Everything below here is just internal jiggery-pokery
 * specific to JunkyardJavascript.
 */


CSL.System.Xml.JunkyardJavascript.prototype._makeToken = function(token,xml){
	xml = xml.slice(1,(xml.length-1));
	var pos = 0;
	while (pos <xml.length){
		if (this.isEndtag(xml[pos])){
			pos += 1;
			continue;
		}
		var newtoken = new Array();
		newtoken.name = this.getName(xml[pos]);
		newtoken.attributes = this.getAttributes(xml[pos]);
		if (!newtoken.name){
			newtoken.name = null;
			newtoken.attributes = new Object();
			newtoken.text = xml[pos];
		} else {
			var span = this.getSpan(xml.slice(pos));
			if (span && span.length){
				newtoken = this._makeToken(newtoken,span);
				pos += (span.length-1);
			};
		};
		token.push(newtoken);
		pos += 1;
	};
	return token;
};


CSL.System.Xml.JunkyardJavascript.prototype.getName = function(tag){
		var m = tag.match(/<\/*(?:[a-z]+:){0,1}([-a-z]+).*/);
		if (!m){
			return false;
		}
		return m[1];
};


CSL.System.Xml.JunkyardJavascript.prototype.getAttributes = function(tag){
	var attributes = new Object();
	var match;
	var rex = /([-:a-z]+)\s*=\s*(\\*\")(.*?[^\\])\2\s*/;
	tag = tag.replace(/^[^\s]+\s*/,"");
	tag = tag.replace(/[^\"]+$/,"");
	while (tag.match(rex)) {
		var attr = false;
		var args = false;
		match = tag.match(rex);
		attr = match[1];
		attr = attr.replace(/^[-a-z]+:/,"");
		attr = "@"+attr;
		args = match[3];
		//args = match[3].split(/\s+/);
		attributes[attr] = args;
		tag = tag.substr((match[0].length-1));
	}
	return attributes;
};


CSL.System.Xml.JunkyardJavascript.prototype.isEndtag = function(tag){
	if ("/" == tag.substr(1,1)){
		return true;
	}
	return false;
};


CSL.System.Xml.JunkyardJavascript.prototype.isSingleton = function(tag){
	if ("<" != tag[0] || "/" == tag.substr((tag.length-2),1)){
		return true;
	};
	return false;
};


CSL.System.Xml.JunkyardJavascript.prototype.getSpan =	function(xml){
	var i;
	var end = 0;
	var depth = 0;
	var firsttag = this.getName(xml[0]);
	if (this.isSingleton(xml[0])){
		return new Array();
	}
	for (i=0; i<xml.length; i++){
		if (firsttag == this.getName(xml[i])){
			if (this.isEndtag(xml[i])){
				depth += -1;
			} else {
				depth += 1;
			}
		}

		if (depth == 0){
			end = i;
			break;
		}
	}
	return xml.slice(0,(end+1));
};


CSL.System.Xml.JunkyardJavascript.prototype.stripParent = function(xml){
	return xml.slice(1,(xml.length-1));
};


CSL.System.Xml.JunkyardJavascript = new CSL.System.Xml.JunkyardJavascript();
