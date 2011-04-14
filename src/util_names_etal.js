CSL.NameOutput.prototype.setEtAlParameters = function () {
	//
	this.etal_spec = [];
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
		this._setEtAlParameter("freeters", v);
		this._setEtAlParameter("institutions", v);
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			this._setEtAlParameter("persons", v, j);
		}
	}
};

CSL.NameOutput.prototype._setEtAlParameter = function (type, v, j) {
	if ("undefined" === typeof j) {
		var lst = this[type][v];
		var count = this[type + "_count"][v];
	} else {
		var lst = this[type][v][j];
		var count = this[type + "_count"][v][j];
	}
	if (lst.length < count) {
		if (this.etal_use_last) {
			this.etal_spec.push(2);
		} else {
			this.etal_spec.push(1);
		}
	} else {
		this.etal_spec.push(0);
	}
};



/*
	if (this.state.tmp["et-al-use-last"] && this.state.tmp["et-al-min"] >= this.state.tmp["et-al-use-first"] + 2) {
		apply_ellipsis = true;
	} else {
		apply_ellipsis = false;
	}
 */