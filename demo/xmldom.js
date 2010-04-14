var CSL_CHROME = function () {
	this.parser = new DOMParser();
	var inst_txt = "<docco><institution institution-parts=\"long\" delimiter=\", \" substitute-use-first=\"1\" use-last=\"1\"/></docco>";
	var inst_doc = this.parser.parseFromString(inst_txt, "text/xml");
	var inst_node = inst_doc.getElementsByTagName("institution");
	this.institution = inst_node.item(0);
	this.ns = "http://purl.org/net/xbiblio/csl";
};
CSL_CHROME.prototype.clean = function (xml) {
	xml = xml.replace(/<\?[^?]+\?>/g, "");
	xml = xml.replace(/<![^>]+>/g, "");
	xml = xml.replace(/^\s+/, "");
	xml = xml.replace(/\s+$/, "");
	xml = xml.replace(/^\n*/, "");
	return xml;
};
CSL_CHROME.prototype.children = function (myxml) {
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
CSL_CHROME.prototype.nodename = function (myxml) {
	var ret = myxml.nodeName;
	return ret;
};
CSL_CHROME.prototype.attributes = function (myxml) {
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
CSL_CHROME.prototype.content = function (myxml) {
	return myxml.textContent;
};
CSL_CHROME.prototype.namespace = {
	"xml":"http://www.w3.org/XML/1998/namespace"
}
CSL_CHROME.prototype.numberofnodes = function (myxml) {
	if (myxml) {
		return myxml.length;
	} else {
		return 0;
	}
};
CSL_CHROME.prototype.getAttributeName = function (attr) {
	var ret = attr.name;
	return ret;
}
CSL_CHROME.prototype.getAttributeValue = function (myxml,name,namespace) {
	var ret = "";
	if (myxml && myxml.hasAttributes() && myxml.attributes[name]) {
		ret = myxml.attributes[name].value;
	}
	return ret;
}
CSL_CHROME.prototype.getNodeValue = function (myxml,name) {
	var ret = "";
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
CSL_CHROME.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function (myxml,nodename,attrname,attr,val) {
	var xml;
	alert("Todo (1)");
}
CSL_CHROME.prototype.deleteNodeByNameAttribute = function (myxml,val) {
	var pos, len, node, nodes;
	nodes = myxml.childNodes;
	for (pos = 0, len = nodes.length; pos < len; pos += 1) {
		node = nodes[pos];
		if (!node || node.nodeType == node.TEXT_NODE) {
			continue;
		}
		if (node.hasAttributes() && node.attributes.name.value == val) {
			myxml.removeChild(nodes[pos]);
		}
	}
}
CSL_CHROME.prototype.deleteAttribute = function (myxml,attr) {
	myxml.removeAttribute(attr);
}
CSL_CHROME.prototype.setAttribute = function (myxml,attr,val) {
	var attribute;
	if (!myxml.ownerDocument) {
		myxml = myxml.firstChild;
	}
	attribute = myxml.ownerDocument.createAttribute(attr);
	myxml.setAttribute(attr, val);
    return false;
}
CSL_CHROME.prototype.nodeCopy = function (myxml) {
	var cloned_node = myxml.cloneNode(true);
	return cloned_node;
}
CSL_CHROME.prototype.getNodesByName = function (myxml,name,nameattrval) {
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
CSL_CHROME.prototype.nodeNameIs = function (myxml,name) {
	if (myxml.nodeName == "#document" && myxml.firstChild.nodeName == name) {
		return true;
	}
	if (name == myxml.nodeName) {
		return true;
	}
	return false;
}
CSL_CHROME.prototype.makeXml = function (myxml) {
	var ret, topnode;
	if (!myxml) {
		myxml = "<bogus/>";
	}
	var nodetree = this.parser.parseFromString(myxml, "text/xml");
	return nodetree;
};
CSL_CHROME.prototype.insertChildNodeAfter = function (parent,node,pos,datexml) {
	var myxml, xml;
	myxml = node.ownerDocument.importNode(datexml, true);
	parent.replaceChild(myxml, node);
	return parent;
};
CSL_CHROME.prototype.addInstitutionNodes = function(myxml) {
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
