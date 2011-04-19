CSL.NameOutput.prototype.setCommonTerm = function () {
	var variables = this.variables;
	var varnames = variables.slice();
	varnames.sort();
	this.common_term = varnames.join("");

	// When no varnames are on offer
	if (!this.common_term) {
		return false;
	}

	var has_term = false;
	if (this.label) {
		if (this.label.before) {
			has_term = this.state.getTerm(this.common_term, this.label.before.strings.form, 0);
		} else if (this.label.after) {
			has_term = this.state.getTerm(this.common_term, this.label.after.strings.form, 0);
		}
	}

	if (!this.state.locale[this.state.opt.lang].terms[this.common_term]
		|| !has_term
		|| this.variables.length < 2) {

		this.common_term = false;
		return;
	}
	var pos = this.nameset_base;
	var offset = 0;
	for (var i = 0, ilen = this.variables.length - 1; i < ilen; i += 1) {
		var v = this.variables[i];
		// For freeters & institutions
		offset += 2;
		offset += this.persons[v].length;
	}
	//offset = (offset/this.variables.length);
	for (var i = 0, ilen = this.variables.length - 1; i < ilen; i += 1) {
		var v = this.variables[i];
		var vv = this.variables[i + 1];
		if (!this._compareNamesets(this.freeters[v], this.freeters[vv])
			|| this.etal_spec[pos] !== this.etal_spec[pos + offset]) {

			this.common_term = false;
			return;
		}
		// Skipping institutions, so add an extra 1
		pos += (1 + offset + 1);
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			if (!this._compareNamesets(this.persons[v][j], this.persons[vv][j])
				|| this.etal_spec[pos] !== this.etal_spec[pos + offset]) {
				this.common_term = false;
				return;
			}
			pos += (1 + offset);
		}
	}
};

CSL.NameOutput.prototype._compareNamesets = function (base_nameset, nameset) {
	if (base_nameset.length !== nameset.length) {
		return false;
	}
	for (var i = 0, ilen = nameset.length; i < ilen; i += 1) {
		name = nameset[i];
		for (j = 0, jlen = CSL.NAME_PARTS.length; j < jlen; j += 1) {
			part = CSL.NAME_PARTS[j];
			if (!base_nameset[i] || base_nameset[i][part] != nameset[i][part]) {
				return false;
			}
		}
	}
	return true;
};
