/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights
 * Reserved.
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
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */

CSL.NameOutput.prototype.divideAndTransliterateNames = function (Item, variables) {
	var Item = this.Item;
	var variables = this.variables;
	this.varnames = variables.slice();
	this.freeters = {};
	this.persons = {};
	this.institutions = {};
	for (var i = 0, ilen = variables.length; i < ilen; i += 1) {
		var v = variables[i];
		var values = this._normalizeVariableValue(Item, v);
		this._getFreeters(v, values);
		this.nameset_offset += 1;
		this._getPersonsAndInstitutions(v, values);
		// Institutions is one nameset (i.e. increment by adding an institution and
		// its affiliated authors)
		this.nameset_offset += 1;
		this.nameset_offset += this.persons[v].length;
	}
};

CSL.NameOutput.prototype._normalizeVariableValue = function (Item, variable) {
	if ("string" === typeof Item[variable]) {
		var names = [{literal: Item[variable]}];
	} else {
		var names = Item[variable].slice();
	}
	// Transliteration happens here, if at all.
	for (var i = 0, ilen = names.length; i < ilen; i += 1) {
		if (names[i].literal) {
		}
		this._parseName(names[i]);
		var name = this.state.transform.name(this.state, names[i], this.state.opt["locale-pri"]);
		names[i] = name;
	}
	return names;
};

CSL.NameOutput.prototype._getFreeters = function (variable, values) {
	this._markCutVariableAndCut(variable, values);
	this.freeters[variable] = [];
	for (var i = values.length - 1; i > -1; i += -1) {
		if (this.isPerson(values[i])) {
			this.freeters[variable].push(values.pop());
		} else {
			break;
		}
	}
	this.freeters[variable].reverse();
};

CSL.NameOutput.prototype._getPersonsAndInstitutions = function (variable, values) {
	this.persons[variable] = [];
	this.institutions[variable] = [];
	var persons = [];
	// XXXX This is all wrong ...
	// Need to iterate over variables
	// Need to always clear
	var institution = false;
	for (var i = values.length - 1; i > -1; i += -1) {
		if (this.isPerson(values[i])) {
			persons.push(values[i]);
		} else {
			//this._markCutVariableAndCut(variable, persons);
			this.persons[variable].push(persons);
			this.institutions[variable].push(values[i]);
			persons = [];
			institution = true;
		}
	}
};

CSL.NameOutput.prototype._markCutVariableAndCut = function (variable, values) {
	// See util_namestruncate.js for code that uses this cut variable.
	if (values.length
		&& (this.state.tmp.area === "bibliography" 
			|| this.state.tmp.area === "bibliography_sort" 
			|| (this.state.tmp.area && this.state.opt.xclass === "note"))) {
	
		if (!this.state.tmp.cut_var
			&& this.name["et-al-min"] === 1 
			&& this.name["et-al-use-first"] === 1) {
			
			this.state.tmp.cut_var = namesets[0].variable;
		}

		// Slice off subsequent namesets in the initial name
		// rendered, when the same name is rendered a second time.
		// Useful for robust per-author listings.
		if (this.state.tmp.cut_var && cutinfo.used === this.state.tmp.cut_var) {
			var ilen = cutinfo.variable[this.state.tmp.cut_var].length - 1;
			for (var i = ilen; i > -1; i += -1) {
				obj = cutinfo.variable[this.state.tmp.cut_var][i];
				obj[0].blobs = obj[0].blobs.slice(0, obj[1]).concat(obj[0].blobs.slice(obj[1] + 1));
			}
		}
	}
};
