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
CSL.System.Xml.E4X.prototype.parse = function(xml){
	default xml namespace = "http://purl.org/net/xbiblio/csl";
	return XML( this.clean(xml) );
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
