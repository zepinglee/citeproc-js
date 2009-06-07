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

