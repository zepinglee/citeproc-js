CSL.NameOutput.prototype.joinPersons = function (blobs, variable, index) {
	var ret;
	//
	if (this.etal_spec[variable][index] === 1) {
		ret = this._joinPersonsEtAl(blobs, this.name.delimiter);
	} else if (this.etal_spec[variable][index] === 2) {
		ret = this._join(blobs, this.name.delimiter, this.name.ellipsis_single, this.name.ellipsis_multiple);
	} else {
		ret = this._join(blobs, this.name.delimiter, this.name.and_single, this.name.and_multiple);
	}
	return ret;
};


CSL.NameOutput.prototype.joinPersonsAndInstitutions = function (blobs) {
	//
	return this._join(blobs, this.name.delimiter);
};


CSL.NameOutput.prototype.joinFreetersAndAffiliates = function (blobs) {
	// Nothing, one or two, never more
	return this._join(blobs, false, this.institution.with_single, this.institution.with_multiple);
};


CSL.NameOutput.prototype._joinPersonsEtAl = function (blobs) {
	//
    var blob = this._join(blobs, this.name.delimiter);
	if (!blob) {
		ret = false;
	}
	this.state.output.openLevel();
	this.state.append(blob, CSL.LITERAL);
	if (blobs.length > 1) {
		this.state.output.append(this.name.etal_multiple);
	} else if (blobs.length === 1) {
		this.state.output.append(this.name.etal_single);
	}
	this.state.output.closeLevel();
	ret = this.state.output.current.pop();
	return ret;
};


CSL.NameOutput.prototype._join = function (blobs, delimiter, single, multiple) {
	if (!blobs) {
		return false;
	}
	// Eliminate false and empty blobs
	for (var i = blobs.length - 1; i > -1; i += -1) {
		print("CCC: "+blobs[i].length)
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
	for (var i = 0, ilen = blobs.length; i < ilen; i += 1) {
		return this.state.output.makeblob(blobs[i]);
	}
	return this.state.output.current.pop();
};
