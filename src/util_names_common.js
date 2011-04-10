CSL.NameOutput.prototype.setCommonTerm = function (variables) {
	var varnames = variables.slice();
	varnames.sort();
	this.common_term = varnames.join("");
	if (!state.locale[state.opt.lang].terms[this.common_term]
		|| !this.state.getTerm(varnames.join(""), "long", 0)) {

		this.common_term = false;
		return;
	}
	var count = 0;
	var other_namesets = [];
	for (var variable in this.varnames) {
		// Nameset is all out of order, but that doesn't matter in this context.
		var nameset = this.freeters[variable].concat(this.persons[variable]).concat(this.institutions[variable]);
		if (count === 0) {
			var base_nameset = nameset;
		} else {
			other_namesets.push(nameset);
		}
		count += 1;
	}
	for (var i = 0, ilen = other_namesets.length, i < ilen; i += 1 ) {
		if (!CSL.Util.Names.compareNamesets(base_nameset, other_namesets[i])) {
			this.common_term = false;
			return;
		}
	}
	if (!other_namesets.length) {
		this.common_term = false;
		return;
	}
};

CSL.NameOutput.prototype.compareNamesets = function (base_nameset, nameset) {
	var name, pos, len, part, ppos, llen;
	if (!base_nameset.names || !nameset.names || base_nameset.names.length !== nameset.names.length || base_nameset.etal !== nameset.etal) {
		return false;
	}
	len = nameset.names.length;
	for (pos = 0; pos < len; pos += 1) {
		name = nameset.names[pos];
		llen = CSL.NAME_PARTS.length;
		for (ppos = 0; ppos < llen; ppos += 1) {
			part = CSL.NAME_PARTS[ppos];
			if (!base_nameset.names[pos] || base_nameset.names[pos][part] != name[part]) {
				return false;
			}
		}
	}
	return true;
};
