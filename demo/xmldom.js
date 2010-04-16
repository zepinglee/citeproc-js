var ActiveXObject;
var XMLHttpRequest;
var DOMParser;
var CSL_IS_IE;
var CSL_CHROME = function () {
	if ("undefined" == typeof DOMParser || CSL_IS_IE) {
		CSL_IS_IE = true;
		DOMParser = function() {};
		DOMParser.prototype.parseFromString = function(str, contentType) {
			if ("undefined" != typeof ActiveXObject) {
				var xmldata = new ActiveXObject('MSXML.DomDocument');
				xmldata.async = false;
				xmldata.loadXML(str);
				return xmldata;
			} else if ("undefined" != typeof XMLHttpRequest) {
				var xmldata = new XMLHttpRequest;
				if (!contentType) {
					contentType = 'application/xml';
				}
				xmldata.open('GET', 'data:' + contentType + ';charset=utf-8,' + encodeURIComponent(str), false);
				if(xmldata.overrideMimeType) {
					xmldata.overrideMimeType(contentType);
				}
				xmldata.send(null);
				return xmldata.responseXML;
			}
		};
		this.hasAttributes = function (node) {
			return true;
		};
		this.importNode = function (doc, srcElement) {
			var imported, pos, len, attribute;
			imported = doc.createElement (srcElement.nodeName);
			if (this.hasAttributes(srcElement)) {
				for (pos = 0, len = srcElement.attributes.length; pos < len; pos += 1) {
					attribute = srcElement.attributes[pos];
						imported.setAttribute(attribute.name, attribute.value);
				}
			}
			if (imported.firstChild) {
				imported.innerHTML = srcElement.innerHTML;
			}
			return imported;
		};
	} else {
		this.hasAttributes = function (node) {
			return node["hasAttributes"]();
		};
		this.importNode = function (doc, srcElement) {
			var ret = doc.importNode(srcElement, true);
			return ret;
		};
	}
	this.parser = new DOMParser();
	var inst_txt = "<docco><institution institution-parts=\"long\" delimiter=\", \" substitute-use-first=\"1\" use-last=\"1\"/></docco>";
	var inst_doc = this.parser.parseFromString(inst_txt, "application/xml");
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
	if (myxml && this.hasAttributes(myxml)) {
		attrs = myxml.attributes;
		for (pos = 0, len=attrs.length; pos < len; pos += 1) {
			attr = attrs[pos];
			ret["@" + attr.name] = attr.value;
		}
	}
	return ret;
};
CSL_CHROME.prototype.content = function (myxml) {
	var ret = myxml.textContent;
	return ret;
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
	if (myxml && this.hasAttributes(myxml) && myxml.getAttribute(name)) {
		ret = myxml.getAttribute(name);
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
CSL_CHROME.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function (myxml,nodename,partname,attrname,val) {
	var pos, len, xml, nodes, node;
	if (attrname[0] === '@'){
		attrname = attrname.slice(1);
	}
	nodes = myxml.getElementsByTagName(nodename);
	for (pos = 0, len = nodes.length; pos < len; pos += 1) {
		node = nodes[pos];
		if (node.getAttribute("name") != partname) {
			continue;
		}
		node.setAttribute(attrname, val);
	}
}
CSL_CHROME.prototype.deleteNodeByNameAttribute = function (myxml,val) {
	var pos, len, node, nodes;
	nodes = myxml.childNodes;
	for (pos = 0, len = nodes.length; pos < len; pos += 1) {
		node = nodes[pos];
		if (!node || node.nodeType == node.TEXT_NODE) {
			continue;
		}
		if (this.hasAttributes(node) && node.attributes.name.value == val) {
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
		node = nodes.item(pos);
		if (nameattrval && !(this.hasAttributes(node) && node.attributes.name && node.attributes.name.value == nameattrval)) {
			continue;
		}
		ret.push(node);
	}
	return ret;
}
CSL_CHROME.prototype.nodeNameIs = function (myxml,name) {
	if (name == myxml.nodeName) {
		return true;
	}
	return false;
}
CSL_CHROME.prototype.makeXml = function (myxml) {
	var ret, topnode;
	if (!myxml) {
		myxml = "<docco><bogus/></docco>";
	}
	var nodetree = this.parser.parseFromString(myxml, "application/xml");
	return nodetree.firstChild;
};
CSL_CHROME.prototype.insertChildNodeAfter = function (parent,node,pos,datexml) {
	var myxml, xml;
	myxml = this.importNode(node.ownerDocument, datexml);
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
			theinstitution = this.importNode(myxml.ownerDocument, this.institution);
			thename = name[0];
			thenames.insertBefore(theinstitution, thename.nextSibling);
		}
	}
};
