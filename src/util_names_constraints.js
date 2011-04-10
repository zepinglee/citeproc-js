// What on earth does this need to do?
	var section = ["persons", "institutions", "freeters"];
	this.nameConstraint = {
		persons: [],
		institutions: 0,
		freeters = 0
	};
	for (var i = 0, ilen = 3; i < ilen; i += 1) {
		if ("persons" === section[i]) {
			for (var j, jlen = this.persons.length; j < jlen; j += 1) {
				this.nameConstraint[section[i]] = this._getNameConstraint(this.persons[j]);
			}
		} else {
			this.nameConstraint[section[i]] = this._getNameConstraint(this[section]);
		}
	}
