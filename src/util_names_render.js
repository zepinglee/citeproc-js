CSL.NameOutput.prototype.renderAllNames = function () {
	// Note that et-al/ellipsis parameters are set on the basis
	// of rendering order through the whole cite.
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		print("freeters: "+this.freeters[v].length+" for "+v);
		this.freeters[v] = this._renderPersonalNames(this.freeters[v], pos);
		// Because pos is not relevant to institutions. They are rendered
		// individually below, but "institutions" as a nameset is irrelevant
		// to this function.
		pos += 2;
		for (var j = 0, jlen = this.institutions[v].length; j < jlen; j += 1) {
			this.institutions[v][j] = this.renderInstitutionNames(this.institutions[v][j]);
			this.persons[v][j] = this._renderPersonalNames(this.persons[v][j], pos);
			pos += 1
		}
	}
};

CSL.NameOutput.prototype.renderInstitutionNames = function (value) {
	// This is a straightforward rendering of the institution
	// name; the fancy business with ellipsis or et al comes later,
	// at the join stage.
	//
	// XXXX Actually needs the splitting mechanisms added here.
	this.state.output.openLevel("empty");
	this.state.output.append(value.literal);
	this.state.output.closeLevel("empty");
	var ret = this.state.output.pop();
	return ret;
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
	var given = this._givenName(name);
	var suffix = this._nameSuffix(name);
	if (this._isShort(pos, i)) {
		dropping_particle = false;
		given = false;
		suffix = false;
	}
	var sort_sep = this.name["sort-separator"];
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
	this.state.output.append(blob, "literal", true);
	var ret = this.state.output.pop();
	return ret;
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
		if ("given" === key) {
			if (1 === state.tmp.disambig_settings.givens[state.tmp.nameset_counter][(this.namenum + this.nameoffset)] && !name.block_initialize) {
				initialize_with = state.output.getToken("name").strings["initialize-with"];
				namepart = CSL.Util.Names.initializeWith(state, namepart, initialize_with);
			} else {
				namepart = CSL.Util.Names.unInitialize(state, namepart);
			}
		}
*/

CSL.NameOutput.prototype._normalizeNameInput = function (value) {
	name = {
		family:value.family,
		given:value.given,
		suffix:value.suffix,
		"comma-suffix":value["comma-suffix"],
		"non-dropping-particle":value["non-dropping-particle"],
		"dropping-particle":value["dropping-particle"]
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

CSL.NameOutput.prototype._givenName = function (name) {
	if (this.state.output.append(name["given"], this.given, true)) {
		return this.state.output.pop();
	}
	return false;
};

CSL.NameOutput.prototype._nameSuffix = function (name) {
	if (this.state.output.append(name["suffix"], "empty", true)) {
		return this.state.output.pop();
	}
	return false;
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

// From orgs section
/*
						// org
						// set the number of names to be _intended_ for rendering,
						// in the first nameset, if personal, for subsequent slicing.
						if (namesetIndex === 0 && (state.tmp.area === "bibliography" || (state.tmp.area === "citation" && state.opt.xclass === "note"))) {
							state.tmp.names_cut.counts[nameset.variable] = 1;
						}
						use_first = state.output.getToken("institution").strings["use-first"];
						if (!use_first && namesetIndex === 0) {
							use_first = state.output.getToken("institution").strings["substitute-use-first"];
						}
						if (!use_first) {
							use_first = 0;
						}
						append_last = state.output.getToken("institution").strings["use-last"];
						if (use_first || append_last) {
							s = display_names.slice();
							display_names = [];
							display_names = s.slice(0, use_first);
							s = s.slice(use_first);
							if (append_last) {
								if (append_last > s.length) {
									append_last = s.length;
								}
								if (append_last) {
									display_names = display_names.concat(s.slice((s.length - append_last)));
								}
							}
						}

 */
