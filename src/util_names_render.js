CSL.NameOutput.prototype.renderAllNames = function () {
	// Note that et-al/ellipsis parameters are set on the basis
	// of rendering order through the whole cite.
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		if (this.freeters[v].length) {
			this.freeters[v] = this._renderPersonalNames(this.freeters[v], pos);
		}
		if (this.institutions[v].length) {
			pos += 1;
		}
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			this.persons[v][j] = this._renderPersonalNames(this.persons[v][j], pos);
			pos += 1
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
			switch (this.institution.strings["institution-parts"]) {
			case "short":
				if (this.institutions[v][j]["short"].length) {
					var institution = [this._renderOneInstitutionPart(this.institutions[v][j]["short"], this.institutionpart["short"])];
				} else {
					var institution = [this._renderOneInstitutionPart(this.institutions[v][j]["long"], this.institutionpart["long"])];
				}
				break;
			case "short-long":
				var long_style = this._getLongStyle(v, j);
				var institution_short = this._renderOneInstitutionPart(this.institutions[v][j]["short"], this.institutionpart["short"]);
				var institution_long = this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style);
				var institution = [institution_short, institution_long];
				break;
			case "long-short":
				var long_style = this._getLongStyle(v, j);
				var institution_short = this._renderOneInstitutionPart(this.institutions[v][j]["short"], this.institutionpart["short"]);
				var institution_long = this._renderOneInstitutionPart(this.institutions[v][j]["long"], long_style);
				var institution = [institution_long, institution_short];
				break;
			default:
				var institution = [this._renderOneInstitutionPart(this.institutions[v][j]["long"], this.institutionpart["long"])];
				break;
			}
			this.institutions[v][j] = this._join(institution, "");
		}
	}
};

CSL.NameOutput.prototype._renderOneInstitutionPart = function (blobs, style) {
	for (var i = 0, ilen = blobs.length; i < ilen; i += 1) {
		if (blobs[i]) {
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
	// XXX Possibly an adjustment to particles with apostrophe happens here
	// Below, we do need three join groups:
	// - Joins within a name element group (say, space).
	// - Joins between the two name groups (say, ", ").
	// - Join to the suffix (say, ", " or " ").
	// How to express this cleanly?
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
	if (name["comma-suffix"]) {
		var suffix_sep = ", ";
	} else {
		var suffix_sep = " ";
	}
	var romanesque = name.family.match(CSL.ROMANESQUE_REGEXP);
	if (!romanesque) {
		var blob = this._join([non_dropping_particle, family, given], "");
	} else if (name["static-ordering"]) { // entry likes sort order
		var blob = this._join([non_dropping_particle, family, given], " ");
	} else if (this.state.tmp.sort_key_flag) {
		if (this.state.opt["demote-non-dropping-particle"] === "never") {
			var first = this._join([non_dropping_particle, family, dropping_particle], " ");
			var merged = this._join([first, given], sort_sep);
			var blob = this._join([merged, suffix], suffix_sep);
		} else {
			var second = this._join([given, dropping_particle, non_dropping_particle], " ");
			var merged = this._join([family, second], sort_sep);
			var blob = this._join([merged, suffix], suffix_sep);
		}
	} else if (this.name.strings["name-as-sort-order"] === "all" || (this.name.strings["name-as-sort-order"] === "first" && i === 0)) {
		//
		// Discretionary sort ordering and inversions
		//
		if (["always", "display-and-sort"].indexOf(this.state.opt["demote-non-dropping-particle"]) > -1) {
			// Drop non-dropping particle
			var second = this._join([given, dropping_particle, non_dropping_particle], " ");
			var merged = this._join([family, second], sort_sep);
			var blob = this._join([merged, suffix], sort_sep);
		} else {
			// Don't drop particle.
			var first = this._join([non_dropping_particle, family], " ");
			var second = this._join([given, dropping_particle], " ");
			var merged = this._join([first, second], sort_sep);
			var blob = this._join([merged, suffix], sort_sep);
		}
	} else { // plain vanilla
		var second = this._join([dropping_particle, non_dropping_particle, family], " ");
		var merged = this._join([given, second], " ");
		var blob = this._join([merged, suffix], suffix_sep);
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

		// If ends in an apostrophe, is a particle, and is immediately
		// followed by family, merge particle to family.
		if (key === "dropping-particle" 
		    && ["'","\u02bc","\u2019"].indexOf(namepart.slice(-1)) > -1
		    && pos < subsequence.length - 1
		    && subsequence[pos + 1] === "family") {
			preffie = namepart;
			continue;
		}
		// initialize if appropriate
*/

CSL.NameOutput.prototype._normalizeNameInput = function (value) {
	name = {
		family:value.family,
		given:value.given,
		suffix:value.suffix,
		"comma-suffix":value["comma-suffix"],
		"non-dropping-particle":value["non-dropping-particle"],
		"dropping-particle":value["dropping-particle"],
		"static-ordering":value["static-ordering"],
		block_initialize:value.block_initialize
	}
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
	if (this.state.output.append(name["family"], this.family, true)) {
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
	if (name["suffix"].match(/^et.?al[^a-z]$/)) {
		if (this.name.strings["et-al-use-last"]) {
			this.etal_spec[pos] = 2;
		} else {
			this.etal_spec[pos] = 1;
		}
	} else if (this.state.output.append(name["suffix"], "empty", true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._getLongStyle = function (v, i) {
	if (this.institutions[v][i]["short"].length) {
		if (this.institutionpart["long-with-short"]) {
			var long_style = this.institutionpart["long-with-short"];
		} else {
			var long_style = this.institutionpart["long"];
		}
	} else {
		var long_style = this.institutionpart["long"];
	}
	return long_style;
};

CSL.NameOutput.prototype._parseName = function (name) {
	var m, idx;
	// ???
	//if (this.state.opt["parse-names"]
	//	&& name["parse-names"] !== 0) {
	//	state.parseName(name);
	//}
	if (!name["non-dropping-particle"] && name.family) {
		m = name.family.match(/^([[ \'\u2019a-z]+\s+)/);
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

