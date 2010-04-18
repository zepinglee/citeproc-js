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

CSL.Util.fixDateNode = function (parent, pos, node) {
	var form, variable, datexml, subnode, partname, attr, val, prefix, suffix, children, key, cchildren, kkey, display;
	form = this.sys.xml.getAttributeValue(node, "form");
	if (!form) {
		return parent;
	}

	variable = this.sys.xml.getAttributeValue(node, "variable");
	prefix = this.sys.xml.getAttributeValue(node, "prefix");
	suffix = this.sys.xml.getAttributeValue(node, "suffix");
	display = this.sys.xml.getAttributeValue(node, "display");
	//
	// Xml: Copy a node
	//
	datexml = this.sys.xml.nodeCopy(this.state.getDate(form));
	//
	// Xml: Set attribute
	//
	this.sys.xml.setAttribute(datexml, 'variable', variable);
	//
	// Xml: Set flag
	//
	if (prefix) {
		//
		// Xml: Set attribute
		//
		this.sys.xml.setAttribute(datexml, "prefix", prefix);
	}
	if (suffix) {
		//
		// Xml: Set attribute
		//
		this.sys.xml.setAttribute(datexml, "suffix", suffix);
	}
	if (display) {
		//
		// Xml: Set attribute
		//
		this.sys.xml.setAttribute(datexml, "display", display);
	}
	//
	// Step through any date-part children of the layout date node,
	// and lay their attributes onto the corresponding node in the
	// locale template node copy.
	//
	children = this.sys.xml.children(node);
	for (key in children) {
		subnode = children[key];
		if ("date-part" === this.sys.xml.nodename(subnode)) {
			partname = this.sys.xml.getAttributeValue(subnode, "name");
			cchildren = this.sys.xml.attributes(subnode);
			for (attr in cchildren) {
				if (cchildren.hasOwnProperty(attr)) {
					if (attr == "@name") {
						continue;
					}
					val = cchildren[attr];
					this.sys.xml.setAttributeOnNodeIdentifiedByNameAttribute(datexml, "date-part", partname, attr, val);
				}
			}
		}
	}
	//
	// Xml: Delete attribute
	//
	this.sys.xml.deleteAttribute(datexml, 'form');
	if ("year" === this.sys.xml.getAttributeValue(node, "date-parts")) {

		//
		// Xml: Find one node by attribute and delete
		//
		this.sys.xml.deleteNodeByNameAttribute(datexml, 'month');
		//
		// Xml: Find one node by attribute and delete
		//
		this.sys.xml.deleteNodeByNameAttribute(datexml, 'day');


	} else if ("year-month" === this.sys.xml.getAttributeValue(node, "date-parts")) {
		//
		// Xml: Find one node by attribute and delete
		//
		this.sys.xml.deleteNodeByNameAttribute(datexml, 'day');
	}
	return this.sys.xml.insertChildNodeAfter(parent, node, pos, datexml);
};
