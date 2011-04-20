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

CSL.NameOutput.prototype.truncatePersonalNameLists = function () {
	// XXX Before truncation, make a note of the original number
	// of names, for use in et-al evaluation.
	this.freeters_count = {};
	this.persons_count = {};
	this.institutions_count = {};
	// By key is okay here, as we don't care about sequence.
	for (var v in this.freeters) {
		if (this.state.tmp.cut_var === v) {
			var cutinfo = this.state.tmp.names_cut;
			this.freeters[v] = this.freeters[v].slice(cutinfo.counts[v]);
		}
		this.freeters_count[v] = this.freeters[v].length;
		this.freeters[v] = this._truncateNameList(this.freeters, v);
	}
	for (var v in this.persons) {
		this.institutions_count[v] = this.institutions[v].length;
		this._truncateNameList(this.institutions, v);
		this.persons[v] = this.persons[v].slice(0, this.institutions[v].length);
		this.persons_count[v] = [];
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			if (this.state.tmp.cut_var === v) {
				var cutinfo = this.state.tmp.names_cut;
				this.persons[v][j] = this.persons[v][j].slice(cutinfo.counts[v]);
			}
			this.persons_count[v][j] = this.persons[v][j].length;
			this.persons[v][j] = this._truncateNameList(this.persons, v, j);
		}
	}
};

CSL.NameOutput.prototype._truncateNameList = function (container, variable, index) {
	if ("undefined" === typeof index) {
		var lst = container[variable];
	} else {
		var lst = container[variable][index];
	}
	if (this.state.opt.max_number_of_names 
		&& lst.length > 50 
		&& lst.length > (this.state.opt.max_number_of_names + 2)) {
		
		lst = lst.slice(0, this.state.opt.max_number_of_names + 2);
	}
	return lst;
}
