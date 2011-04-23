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

/*global CSL: true */

CSL.NameOutput.prototype.renderAllNames = function () {
	// Note that et-al/ellipsis parameters are set on the basis
	// of rendering order through the whole cite.
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.freeters[v].length) {
			this.freeters[v] = this._renderPersonalNames(this.freeters[v], pos);
			pos += 1;
		}
		if (this.institutions[v].length) {
			pos += 1;
		}
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			this.persons[v][j] = this._renderPersonalNames(this.persons[v][j], pos);
			pos += 1;
		}
	}
	this.renderInstitutionNames();
};

CSL.NameOutput.prototype.renderInstitutionNames = function () {
	// Institutions are split to string list as
	// this.institutions[v]["long"] and this.institutions[v]["short"]
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			var institution, institution_short, institution_long, short_style, long_style;
			switch (this.institution.strings["institution-parts"]) {
			case "short":
				if (this.institutions[v][j]["short"].length) {
					short_style = this._getShortStyle();
					institution = [this._renderOneInstitutionPart(this.institutions[v][j]["short"], short_style)];
				} else {
					long_style = this._getLongStyle(v, j);
					institution = [this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style)];
				}
				break;
			case "short-long":
				long_style = this._getLongStyle(v, j);
				short_style = this._getShortStyle();
				institution_short = this._renderOneInstitutionPart(this.institutions[v][j]["short"], short_style);
				institution_long = this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style);
				institution = [institution_short, institution_long];
				break;
			case "long-short":
				long_style = this._getLongStyle(v, j);
				short_style = this._getShortStyle();
				institution_short = this._renderOneInstitutionPart(this.institutions[v][j]["short"], short_style);
				institution_long = this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style);
				institution = [institution_long, institution_short];
				break;
			default:
				long_style = this._getLongStyle(v, j);
				institution = [this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style)];
				break;
			}
			this.institutions[v][j] = this._join(institution, "");
		}
	}
};

CSL.NameOutput.prototype._renderOneInstitutionPart = function (blobs, style) {
	for (var i = 0, ilen = blobs.length; i < ilen; i += 1) {
		if (blobs[i]) {
			//this.state.output.append(blobs[i], style, true);
			this.state.output.append(blobs[i], style, true);
			blobs[i] = this.state.output.pop();
		}
	}
	return this._join(blobs, this.name.strings.delimiter);
};

CSL.NameOutput.prototype._renderPersonalNames = function (values, pos) {
	//
	var ret = false;
	if (values.length) {
		var names = [];
		for (var i = 0, ilen = values.length; i < ilen; i += 1) {
			var val = values[i];
			names.push(this._renderOnePersonalName(val, pos, i));
		}
		ret = this.joinPersons(names, pos);
	}
	return ret;
};

CSL.NameOutput.prototype._renderOnePersonalName = function (value, pos, i) {
	// Extract name parts. With a rusty pair of piers if necessary.
	var name = this._normalizeNameInput(value);
	var dropping_particle = this._droppingParticle(name);
	var family = this._familyName(name);
	var non_dropping_particle = this._nonDroppingParticle(name);
	var given = this._givenName(name, pos, i);
	var suffix = this._nameSuffix(name, pos);
	if (this._isShort(pos, i)) {
		dropping_particle = false;
		given = false;
		suffix = false;
	}
	var sort_sep = this.name.strings["sort-separator"];
	var suffix_sep;
	if (name["comma-suffix"]) {
		suffix_sep = ", ";
	} else {
		suffix_sep = " ";
	}
	var romanesque = name.family.match(CSL.ROMANESQUE_REGEXP);
	var blob, merged, first, second;
	if (!romanesque) {
		blob = this._join([non_dropping_particle, family, given], "");
	} else if (name["static-ordering"]) { // entry likes sort order
		blob = this._join([non_dropping_particle, family, given], " ");
	} else if (this.state.tmp.sort_key_flag) {
		if (this.state.opt["demote-non-dropping-particle"] === "never") {
			first = this._join([non_dropping_particle, family, dropping_particle], " ");
			merged = this._join([first, given], sort_sep);
			blob = this._join([merged, suffix], suffix_sep);
		} else {
			second = this._join([given, dropping_particle, non_dropping_particle], " ");
			merged = this._join([family, second], sort_sep);
			blob = this._join([merged, suffix], suffix_sep);
		}
	} else if (this.name.strings["name-as-sort-order"] === "all" || (this.name.strings["name-as-sort-order"] === "first" && i === 0)) {
		//
		// Discretionary sort ordering and inversions
		//
		if (["always", "display-and-sort"].indexOf(this.state.opt["demote-non-dropping-particle"]) > -1) {
			// Drop non-dropping particle
			second = this._join([given, dropping_particle, non_dropping_particle], " ");
			merged = this._join([family, second], sort_sep);
			blob = this._join([merged, suffix], sort_sep);
		} else {
			// Don't drop particle.
			first = this._join([non_dropping_particle, family], " ");
			second = this._join([given, dropping_particle], " ");
			merged = this._join([first, second], sort_sep);
			blob = this._join([merged, suffix], sort_sep);
		}
	} else { // plain vanilla
		if (name["dropping-particle"] && name.family && !name["non-dropping-particle"]) {
			if (["'","\u02bc","\u2019"].indexOf(name["dropping-particle"].slice(-1)) > -1) {
				name.family = name["dropping-particle"] + name.family;
				name["dropping-particle"] = undefined;
				dropping_particle = false;
				family = this._familyName(name);
			}
		}
		second = this._join([dropping_particle, non_dropping_particle, family], " ");
		merged = this._join([given, second], " ");
		blob = this._join([merged, suffix], suffix_sep);
	}
	// notSerious
	//this.state.output.append(blob, "literal", true);
	//var ret = this.state.output.pop();
	return blob;
};

CSL.NameOutput.prototype._isShort = function (pos, i) {
	if (0 === this.state.tmp.disambig_settings.givens[pos][i]) {
		return true;
	} else {
		return false;
	}
};

/*
		// Do not include given name, dropping particle or suffix in strict short form of name

		// initialize if appropriate
*/

CSL.NameOutput.prototype._normalizeNameInput = function (value) {
	var name = {
		family:value.family,
		given:value.given,
		suffix:value.suffix,
		"comma-suffix":value["comma-suffix"],
		"non-dropping-particle":value["non-dropping-particle"],
		"dropping-particle":value["dropping-particle"],
		"static-ordering":value["static-ordering"],
		"parse-names":value["parse-names"],
		block_initialize:value.block_initialize
	};
	this._parseName(name);
	return name;
};


/*
				len = CSL.DECORABLE_NAME_PARTS.length;
				for (pos = 0; pos < len; pos += 1) {
					namepart = CSL.DECORABLE_NAME_PARTS[pos];
					if (!state.output.getToken(namepart)) {
						state.output.addToken(namepart);
					}
				}
				state.output.addToken("dropping-particle", false, state.output.getToken("family"));
				state.output.addToken("non-dropping-particle", false, state.output.getToken("family"));
				state.output.addToken("suffix", false, state.output.getToken("family"));
				state.output.getToken("suffix").decorations = [];

*/

CSL.NameOutput.prototype._nonDroppingParticle = function (name) {
	if (this.state.output.append(name["non-dropping-particle"], this.family, true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._droppingParticle = function (name) {
	if (this.state.output.append(name["dropping-particle"], this.family, true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._familyName = function (name) {
	if (this.state.output.append(name.family, this.family, true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._givenName = function (name, pos, i) {

	if (name.family && 1 === this.state.tmp.disambig_settings.givens[pos][i] && !name.block_initialize) {
		var initialize_with = this.name.strings["initialize-with"];
		name.given = CSL.Util.Names.initializeWith(this.state, name.given, initialize_with);
	} else {
		name.given = CSL.Util.Names.unInitialize(this.state, name.given);
	}

	if (this.state.output.append(name.given, this.given, true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._nameSuffix = function (name, pos) {
	if (name.suffix && name.suffix.match(/^et.?al[^a-z]$/)) {
		if (this.name.strings["et-al-use-last"]) {
			this.etal_spec[pos] = 2;
		} else {
			this.etal_spec[pos] = 1;
		}
	} else if (this.state.output.append(name.suffix, "empty", true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._getLongStyle = function (v, i) {
	var long_style, short_style;
	if (this.institutions[v][i]["short"].length) {
		if (this.institutionpart["long-with-short"]) {
			long_style = this.institutionpart["long-with-short"];
		} else {
			long_style = this.institutionpart["long"];
		}
	} else {
		long_style = this.institutionpart["long"];
	}
	if (!long_style) {
		long_style = new CSL.Token();
	}
	if (!long_style.decorations) {
		long_style.decorations = [];
	}
	long_style.decorations = this.institution.decorations.concat(long_style.decorations);
	return long_style;
};

CSL.NameOutput.prototype._getShortStyle = function () {
	var short_style;
	if (this.institutionpart["short"]) {
		short_style = this.institutionpart["short"];
	} else {
		short_style = new CSL.Token();
	}
	if (!short_style.decorations) {
		short_style.decorations = [];
	}
	short_style.decorations = this.institution.decorations.concat(short_style.decorations);
	return short_style;
};

CSL.NameOutput.prototype._parseName = function (name) {
	var m, idx;
	if (!name["parse-names"] && "undefined" !== typeof name["parse-names"]) {
		return name;
	}
	// ???
	//if (this.state.opt["parse-names"]
	//	&& name["parse-names"] !== 0) {
	//	state.parseName(name);
	//}
	if (name.family && !name.given && name.isInstitution) {
		name.literal = name.family;
		name.family = undefined;
		name.isInstitution = undefined;
	}
	var noparse;
	if (name.family 
		&& (name.family.slice(0, 1) === '"' && name.family.slice(-1) === '"')
		|| (!name["parse-names"] && "undefined" !== typeof name["parse-names"])) {
		noparse = true;
		name["parse-names"] = 0;
	} else {
		noparse = false;
	}
	if (!name["non-dropping-particle"] && name.family && !noparse) {
		m = name.family.match(/^([ \'\u2019a-z]+\s+)/);
		if (m) {
			name.family = name.family.slice(m[1].length);
			name["non-dropping-particle"] = m[1].replace(/\s+$/, "");

		}
	}
	if (!name.suffix && name.given) {
		m = name.given.match(/(\s*,!*\s*)/);
		if (m) {
			idx = name.given.indexOf(m[1]);
			if (name.given.slice(idx, idx + m[1].length).replace(/\s*/g, "").length === 2) {
				name["comma-suffix"] = true;
			}
			name.suffix = name.given.slice(idx + m[1].length);
			name.given = name.given.slice(0, idx);
		}
	}
	if (!name["dropping-particle"] && name.given) {
		m = name.given.match(/^(\s+[ \'\u2019a-z]*[a-z])$/);
		if (m) {
			name.given = name.given.slice(0, m[1].length * -1);
			name["dropping-particle"] = m[2].replace(/^\s+/, "");
		}
	}
};

// Institution rendering
/*
	state.output.openLevel("institution");
	len = display_names.length;
	for (pos = 0; pos < len; pos += 1) {
		name = display_names[pos];
		institution = state.output.getToken("institution");
		value = name.literal;
		if (state.transform.institution[value]) {
			token_long = state.output.mergeTokenStrings("institution-long", "institution-if-short");
		} else {
			token_long = state.output.getToken("institution-long");
		}
		token_short = state.output.getToken("institution-short");
		parts = institution.strings["institution-parts"];
		if ("short" === parts) {
			state.transform.output(state, value, token_short, token_long, true);
		} else if ("short-long" === parts) {
			state.transform.output(state, value, token_short);
			state.output.append(value, token_long);
		} else if ("long-short" === parts) {
			state.output.append(value, token_long);
			state.transform.output(state, value, token_short);
		} else {
			state.output.append(value, token_long);
		}
	}
	// institution
	state.output.closeLevel();
*/

