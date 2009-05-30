dojo.provide("csl.xmle4x");

if (!CSL) {
	load("./src/csl.js");
}

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
	var otherns = {};
	//otherns["http://www.w3.org/XML/1998/namespace"] = "xml";
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var myxml = XML( this.clean(myxml) );
	//
	// bare spidermonkey does not groke the xml namespace.
	//
	//var xml = new Namespace( "xml" );
	//myxml.addNamespace("http://www.w3.org/XML/1998/namespace");
	//var xml = new Namespace("http://www.w3.org/XML/1998/namespace");
	//print("my language: "+myxml.@xml::lang);
	//print( myxml.attributes() );
	//for each (var attr in myxml.attributes()){
	//	print(attr.name());
	//}
	return myxml;
};


/**
 * Called on a node.
 */
CSL.System.Xml.E4X.prototype.commandInterface = new function(){
	this.children = children;
	this.nodename = nodename;
	this.attributes = attributes;
	this.content = content;
	this.numberofnodes = numberofnodes;

	function children(){
		return this.children();
	};
	function nodename(){
		return this.localName();
	}
	function attributes(){
		var ret = new Object();
		var attrs = this.attributes();
		for (var idx in attrs){
			var key = "@"+attrs[idx].localName();
			var value = attrs[idx].toString();
			ret[key] = value;
		}
		if (this.localName() == "style" || this.localName() == "locale"){
			var xml = new Namespace("http://www.w3.org/XML/1998/namespace");
			//print("my language: "+this.@xml::lang.toString());
			var lang = this.@xml::lang.toString();
			if (lang){
				ret["@lang"] = lang;
			}
		}
		return ret;
	}
	function content(){
		return this.toString();
	}
	function numberofnodes(){
		return this.length();
	}
};


CSL.System.Xml.E4X = new CSL.System.Xml.E4X();
