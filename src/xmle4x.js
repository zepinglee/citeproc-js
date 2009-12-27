/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
CSL.System = {};
CSL.System.Xml = {};
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
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var ret = new Object();
	var attrs = myxml.attributes();
	for each (var attr in attrs){
		var key = "@"+attr.localName();
		//
		// Needed in rhino
		//
		if (key.slice(0,5) == "@e4x_"){
			continue;
		}
		var value = attr;
		ret[key] = value;
	}
	return ret;
};


CSL.System.Xml.E4X.prototype.content = function(myxml){
	return myxml.toString();
};


CSL.System.Xml.E4X.prototype.namespace = {
	"xml":"http://www.w3.org/XML/1998/namespace"
}

CSL.System.Xml.E4X.prototype.numberofnodes = function(myxml){
	return myxml.length();
};

CSL.System.Xml.E4X.prototype.getAttributeName = function(attr){
	return attr.localName();
}

CSL.System.Xml.E4X.prototype.getAttributeValue = function(myxml,name,namespace){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//
	// Oh, okay, I get it.  The syntax does not lend itself to parameterization,
	// but one of the elements is a variable, so it can be set before
	// the call.  Jeez but this feels ugly.  Does work, though.
	//
	if (namespace){
		var ns = new Namespace(this.namespace[namespace]);
		var ret = myxml.@ns::[name].toString();
	} else {
		if (name){
			var ret = myxml.attribute(name).toString();
		} else {
			var ret = myxml.toString();
		}
	}
	return ret;
}

CSL.System.Xml.E4X.prototype.getNodeValue = function(myxml,name){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (name){
		return myxml[name].toString();
	} else {
		return myxml.toString();
	}
}

CSL.System.Xml.E4X.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function(myxml,nodename,attrname,attr,val){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (attr[0] != '@'){
		attr = '@'+attr;
	}
	myxml[nodename].(@name == attrname)[0][attr] = val;
}

CSL.System.Xml.E4X.prototype.deleteNodeByNameAttribute = function(myxml,val){
	delete myxml.*.(@name==val)[0];
}

CSL.System.Xml.E4X.prototype.deleteAttribute = function(myxml,attr){
	delete myxml["@"+attr];
}

CSL.System.Xml.E4X.prototype.setAttribute = function(myxml,attr,val){
	myxml['@'+attr] = val;
}

CSL.System.Xml.E4X.prototype.nodeCopy = function(myxml){
	return myxml.copy();
}

CSL.System.Xml.E4X.prototype.getNodesByName = function(myxml,name,nameattrval){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var ret = myxml.descendants(name);
	if (nameattrval){
		ret = ret.(@name == nameattrval);
	}
	return ret;
}

CSL.System.Xml.E4X.prototype.nodeNameIs = function(myxml,name){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (myxml.localName().toString() == name){
		return true;
	}
	return false;
}

CSL.System.Xml.E4X.prototype.makeXml = function(myxml){
	if ("xml" == typeof myxml){
		// print("forcing serialization of xml to fix up namespacing");
		myxml = myxml.toXMLString();
	};
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var xml = new Namespace("http://www.w3.org/XML/1998/namespace");
	if (myxml){
		// print("deserializing xml");
		myxml = myxml.replace(/\s*<\?[^>]*\?>\s*\n*/g, "");
		myxml = new XML(myxml);
	} else {
		// print("no xml");
		myxml = new XML();
	}
	return myxml;
};
