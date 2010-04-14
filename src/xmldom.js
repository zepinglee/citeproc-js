/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 */

/**
 * Functions for parsing an XML object using E4X.
 */

CSL.System.Xml.DOM = function () {
	this.parser = new DOMParser();
	var inst_txt = "<docco><institution institution-parts=\"long\" delimiter=\", \" substitute-use-first=\"1\" use-last=\"1\"/></docco>";
	var inst_doc = this.parser.parseFromString(inst_txt, "text/xml");
	var inst_node = inst_doc.getElementsByTagName("institution");
	this.institution = inst_node.item(0);
	this.ns = "http://purl.org/net/xbiblio/csl";
};

/**
 * No need for cleaning with the DOM, I think.  This will probably just be a noop.
 * But first, let's get XML mode switching up and running.
 */
CSL.System.Xml.DOM.prototype.clean = function (xml) {
	xml = xml.replace(/<\?[^?]+\?>/g, "");
	xml = xml.replace(/<![^>]+>/g, "");
	xml = xml.replace(/^\s+/, "");
	xml = xml.replace(/\s+$/, "");
	xml = xml.replace(/^\n*/, "");
	return xml;
};


/**
 * Methods to call on a node.
 */
CSL.System.Xml.DOM.prototype.children = function (myxml) {
	var children, pos, len, ret;
	if (myxml) {
		ret = [];
		children = myxml.childNodes;
		for (pos = 0, len = children.length; pos < len; pos += 1) {
			if (children[pos].nodeName != "#text") {
				ret.push(children[pos]);
			}
		}
		return ret;
	} else {
		return [];
	}
};

CSL.System.Xml.DOM.prototype.nodename = function (myxml) {
	var ret = myxml.nodeName;
	return ret;
};

CSL.System.Xml.DOM.prototype.attributes = function (myxml) {
	var ret, attrs, attr, key, xml, pos, len;
	ret = new Object();
	if (myxml && myxml.hasAttributes()) {
		attrs = myxml.attributes;
		for (pos = 0, len=attrs.length; pos < len; pos += 1) {
			attr = attrs[pos];
			ret["@" + attr.name] = attr.value;
		}
	}
	return ret;
};


CSL.System.Xml.DOM.prototype.content = function (myxml) {
	return myxml.textContent;
};


CSL.System.Xml.DOM.prototype.namespace = {
	"xml":"http://www.w3.org/XML/1998/namespace"
}

CSL.System.Xml.DOM.prototype.numberofnodes = function (myxml) {
	if (myxml) {
		return myxml.length;
	} else {
		return 0;
	}
};

CSL.System.Xml.DOM.prototype.getAttributeName = function (attr) {
	var ret = attr.name;
	return ret;
}

CSL.System.Xml.DOM.prototype.getAttributeValue = function (myxml,name,namespace) {
	var ret = "";
	if (myxml && myxml.hasAttributes() && myxml.attributes[name]) {
		ret = myxml.attributes[name].value;
	}
	return ret;
}

//
// Can't this be, you know ... simplified?
//
CSL.System.Xml.DOM.prototype.getNodeValue = function (myxml,name) {
	var ret = "";
	//if (myxml && myxml.hasAttributes && myxml.hasAttributes() && myxml.attributes.name.value == "contributor") {
		//ret = "";
	//	alert(myxml.childNodes.length);
	//}
	//else
	if (name){
		var vals = myxml.getElementsByTagName(name);
		if (vals.length > 0) {
			ret = vals[0].textContent;
		}
	} else {
		ret = myxml;
	}
	if (ret && ret.childNodes && (ret.childNodes.length == 0 || (ret.childNodes.length == 1 && ret.firstChild.nodeName == "#text"))) {
		ret = myxml.textContent;
	}
	return ret;
}

CSL.System.Xml.DOM.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function (myxml,nodename,attrname,attr,val) {
	var xml;
	alert("Todo (1)");
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (attr[0] != '@'){
		attr = '@'+attr;
	}
	myxml[nodename].(@name == attrname)[0][attr] = val;
}

CSL.System.Xml.DOM.prototype.deleteNodeByNameAttribute = function (myxml,val) {
	alert("Todo (2)");
	delete myxml.*.(@name==val)[0];
}

CSL.System.Xml.DOM.prototype.deleteAttribute = function (myxml,attr) {
	alert("Todo (3)");
	delete myxml["@"+attr];
}

CSL.System.Xml.DOM.prototype.setAttribute = function (myxml,attr,val) {
	var attribute;
	if (!myxml.ownerDocument) {
		myxml = myxml.firstChild;
	}
	attribute = myxml.ownerDocument.createAttribute(attr);
	myxml.setAttribute(attr, val);
    return false;
}

CSL.System.Xml.DOM.prototype.nodeCopy = function (myxml) {
	alert("Todo (5)");
	return myxml.copy();
}

CSL.System.Xml.DOM.prototype.getNodesByName = function (myxml,name,nameattrval) {
	var ret, nodes, node, pos, len;
	ret = [];
	nodes = myxml.getElementsByTagName(name);
	for (pos = 0, len = nodes.length; pos < len; pos += 1) {
		node = nodes[pos];
		if (nameattrval && !(node.hasAttributes() && node.attributes.name && node.attributes.name.value == nameattrval)) {
			continue;
		}
		ret.push(node);
	}
	return ret;
}

CSL.System.Xml.DOM.prototype.nodeNameIs = function (myxml,name) {
	if (myxml.nodeName == "#document" && myxml.firstChild.nodeName == name) {
		return true;
	}
	if (name == myxml.nodeName) {
		return true;
	}
	return false;
}

CSL.System.Xml.DOM.prototype.makeXml = function (myxml) {
	var ret, topnode;
	if (!myxml) {
		myxml = "<bogus/>";
	}
	var nodetree = this.parser.parseFromString(myxml, "text/xml");
	return nodetree;
};

CSL.System.Xml.DOM.prototype.insertChildNodeAfter = function (parent,node,pos,datexml) {
	alert("Todo (6)");
	var myxml, xml;
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	myxml = XML(datexml.toXMLString());
	parent.insertChildAfter(node,myxml);
	delete parent.*[pos];
	return parent;
};

CSL.System.Xml.DOM.prototype.addInstitutionNodes = function(myxml) {
	var names, thenames, institution, theinstitution, name, thename, xml, pos, len;
	names = myxml.getElementsByTagName("names");
	for (pos = 0, len = names.length; pos < len; pos += 1) {
		thenames = names[pos];
		name = thenames.getElementsByTagName("name");
		if (name.length == 0) {
			continue;
		}
		institution = thenames.getElementsByTagName("institution");
		if (institution.length == 0) {
			theinstitution = myxml.importNode(this.institution, true);
			thename = name[0];
			thenames.insertBefore(theinstitution, thename.nextSibling);
		}
	}
};

