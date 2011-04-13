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

CSL.NameOutput = function(state, Item, item, variables) {
	print("(1)");
	this.state = state;
	this.Item = Item;
	this.item = item;
	this.nameset_base = 0;
};

CSL.NameOutput.prototype.init = function (names) {
	if (this.nameset_offset) {
		this.nameset_base = this.nameset_base + this.nameset_offset;
	}
	this.nameset_offset = 0;
	this.names = names;
	this.variables = names.variables;
	this.suppress = {
		persons:false,
		institutions:false,
		freeters:false
	}
	this["et-al"] = undefined;
	this["with"] = undefined;
	this.name = undefined;
};

CSL.NameOutput.prototype.outputNames = function () {
	var variables = this.variables;
	print("(2)");
	this.getEtAlConfig();
	print("(3)");
	this.divideAndTransliterateNames();
	print("(4)");
	this.truncatePersonalNameLists();
	print("(5)");
	this.constrainNames();
	print("(6)");
	this.setEtAlParameters();
	print("(7)");
	this.setCommonTerm();
	print("(8)");
	this.renderAllNames();
	print("(9)");
	var blob_list = [];
	for (var i = 0, ilen = variables.length; i < ilen; i += 1) {
		var variable = variables[i];
		var affiliates = false;
		for (var j = 0, jlen = this.institutions.length; j < jlen; j += 1) {
			var affiliates = this.joinPersonsAndInstitutions([this.persons[j], this.institutions[j]]);
		}
		var institutions = this.joinInstitutions(affiliates);
		var varblob = this.joinFreetersAndAffiliates([this.freeters[variable], institutions]);
		if (varblob) {
			blob_list.push(varblob);
		}
	}
	print("(10)");
	this.state.output.openLevel("empty");
	print("(11)");
	for (var i = 0, ilen = blob_list.length; i < ilen; i += 1) {
		// notSerious
		this.state.output.append(blob_list[i], "literal", true);
	}
	print("(12)");
	this.state.output.closeLevel("empty");
	print("(13)");
	var blob = this.state.output.pop();
	print("(14)");
	this.state.output.append(blob, this.names);
	print("(15)");
};

/*
CSL.NameOutput.prototype.suppressNames = function() {
	suppress_condition = suppress_min && display_names.length >= suppress_min;
	if (suppress_condition) {
		continue;
	}
}
*/
