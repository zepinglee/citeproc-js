CSL.NameOutput.prototype.joinPersons = function (blobs) {
	var ret;
	//
	if (FIND_ETAL_CONFIG === ???) {
		ret = this._joinPersonsEtAl(...);
	} else if (FIND_ELLIPSIS_CONFIG === ???) {
		ret = this._joinPersonsEllipsis(...);
	} else {
		ret = this._joinPersonsAll(...);
	}
	return ret;
};


CSL.NameOutput.prototype.joinInstitutions = function (blobs) {
	//
	return this._join(blobs, this.name.delimiter);
};


CSL.NameOutput.prototype.joinPersonsAndInstitutions = function (blobs) {
	//
	return this._join(blobs, this.name.delimiter);
};


CSL.NameOutput.prototype.joinFreetersAndAffiliates = function (blobs) {
	//
	return this._join(blobs, false, false, this.institution.with);
};


CSL.NameOutput.prototype._joinPersonsEtAl = function (blobs) {
	//
    var blob = this._join(blobs, this.name.delimiter);
};


CSL.NameOutput.prototype._joinPersonsEllipsis = function (blobs) {
	//
    var blob = this._join(blobs, this.name.delimiter, this.name.ellipsis, this.name.ellipsis);
};


CSL.NameOutput.prototype._joinPersonsAll = function (blobs) {
	//
	var blob = this._join(blobs, this.name.delimiter, this.name.single, this.name.multiple);
};


CSL.NameOutput.prototype._join = function (blobs, delimiter, single, multiple) {
	// Eliminate false and empty blobs
	for (var i = 0, ilen = blobs.length) {
		if (!blobs[i] || !blobs[i].blobs.length) {
			blobs = blobs.slice(0, i).concat(blobs.slice(i + 1));
		}
	}
	if (!blobs.length) {
		return false;
	} else if (single && blobs.length === 2) {
		blobs = [blobs[0], single, blobs[1]];
	} else {
		if (multiple) {
			var delimiter_offset = 2;
		} else {
			var delimiter_offset = 1;
		}
		for (var i = 0, ilen = blobs.length - delimiter_offset; i < ilen; i += 1) {
			blobs[i].strings.suffix += delimiter;
		}
		if (multiple) {
			blobs = blobs.slice(0, -1).push(multiple).concat(blobs.slice(-1))
		}
	}
	this.state.output.openLevel();
	var output = this.state.output.current.value();
	for (var i = 0, ilen = blobs.length; i < ilen; i += 1) {
		this.state.output.append(blobs[i]);
	}
	return output.pop();
};
