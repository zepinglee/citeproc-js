CSL.NameOutput.prototype.constrainNames = function () {
	// cut-names stuff
	this._setNamesCutCount();
	// figure out how many names to include, in light of the disambig params
	//
	// Ooooooh, ugly. We can't map these reliably to a sequence. What to do?
	// Sort the list of variables before evaluation? Really SHOULD be set
	// out in rendering order, for rational disambiguation progress.
	//
	// Damn.
	for (var v in this.freeters) {
		// Constrain independent authors here
		this._imposeNameConstraints(this.freeters, this.freeters_count, v, "freeters");
	}
	for (var v in this.persons) {
		// Constrain institutions here
		this._imposeNameConstraints(this.institutions, this.institutions_count, v, "institutions");
		this.persons[v] = this.persons[v].slice(0, this.institutions[v].length);
		for (var j = 0, jlen = this.persons.length; j < jlen; j += 1) {
			// Constrain affiliated authors here
			this._imposeNameConstraints(this.persons[v], this.persons_count[v], j, "persons");
		}
	}
};

CSL.NameOutput.prototype._imposeNameConstraints = function (lst, count, key, type) {
	// display_names starts as the original length of this list of names.
	var display_names = lst[key];
	var discretionary_names_length = this.state.tmp["et-al-min"];
	// Mappings, to allow existing disambiguation machinery to
	// remain untouched.
	if ("freeters" === type) {
		var pos = 0;
	} else if ("institutions" === key) {
		var pos = 1;
	} else {
		var pos = key + 2;
	}
	if (this.state.tmp.suppress_decorations) {
		if (this.state.tmp.disambig_request) {
			// Oh. Trouble.
			// state.tmp.nameset_counter is the number of the nameset
			// in the disambiguation try-sequence. Ouch.
			discretionary_names_length = this.state.tmp.disambig_request.names[pos];
		} else if (count[key] >= this.state.tmp["et-al-min"]) {
			discretionary_names_length = this.state.tmp["et-al-use-first"];
		}
	} else {
		if (this.state.tmp.disambig_request 
			&& this.state.tmp.disambig_request.names[pos] > this.state.tmp["et-al-use-first"]) {
			
			if (count[key] < this.state.tmp["et-al-min"]) {
				discretionary_names_length = count[key];
			} else {
				discretionary_names_length = this.state.tmp.disambig_request.names[pos];
			}
		} else if (count[key] >= this.state.tmp["et-al-min"]) {
			discretionary_names_length = this.state.tmp["et-al-use-first"];
		}
		// XXXX: This is a workaround. Under some conditions.
		// Where namesets disambiguate on one of the two names
		// dropped here, it is possible for more than one
		// in-text citation to be close (and indistinguishable)
		// matches to a single bibliography entry.
		//
		// 
		if (this.state.tmp["et-al-use-last"] && discretionary_names_length > (this.state.tmp["et-al-min"] - 2)) {
			discretionary_names_length = this.state.tmp["et-al-min"] - 2;
		}
	}
	var sane = this.state.tmp["et-al-min"] >= this.state.tmp["et-al-use-first"];
	var overlength = count[key] > discretionary_names_length;
	// This var is used to control contextual join, and
	// lies about the number of names when forceEtAl is true,
	// unless normalized.
	if (discretionary_names_length > count[key]) {
		// Use actual truncated list length, to avoid overrun.
		discretionary_names_length = display_names.length;
	}
	// forceEtAl is relevant when the author list is
	// truncated to eliminate clutter.
	if (sane && overlength) {
		if (this.name["et-al-use-last"]) {
			display_names = display_names.slice(0, discretionary_names_length).concat(display_names.slice(-1));
		} else {
			display_names = display_names.slice(0, discretionary_names_length);
		}
	}
};

CSL.NameOutput.prototype._setNamesCutCount = function () {
	if (this.name["suppress-min"]
		&& (this.state.tmp.area === "bibliography"
			|| (this.state.tmp.area === "citation"
				&& this.state.opt.xclass === "note"))) {
		
		for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
			var v = this.variables[i];
			if (this.freeters.length) {
				this.state.tmp.names_cut.counts[v] = this.state.tmp["et-al-use-first"];
			}
		}
	}
};



// More on personal names, I think
// Who knows?
/*
					state.tmp.disambig_settings.names[state.tmp.nameset_counter] = display_names.length;
					local_count += display_names.length;

					state.tmp.names_used.push({names:display_names,etal:et_al});

					if (!state.tmp.suppress_decorations
						&& state.tmp.last_names_used.length === state.tmp.names_used.length
						&& state.tmp.area === "citation") {
						// lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
						lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
						//lastones = state.tmp.last_names_used;
						currentones = state.tmp.names_used[state.tmp.nameset_counter];
						//currentones = state.tmp.names_used;
						compset = [currentones, lastones];
						if (CSL.Util.Names.compareNamesets(lastones,currentones)) {
							state.tmp.same_author_as_previous_cite = true;
						}
					}

					if (!state.tmp.suppress_decorations && (state[state.tmp.area].opt.collapse === "year" || state[state.tmp.area].opt.collapse === "year-suffix" || state[state.tmp.area].opt.collapse === "year-suffix-ranged")) {
						//
						// This is fine, but the naming of the comparison
						// function is confusing.  This is just checking whether the
						// current name is the same as the last name rendered
						// in the last cite, and it works.  Set a toggle if the
						// test fails, so we can avoid further suppression in the
						// cite.
						//

						//if (state.tmp.last_names_used.length === state.tmp.names_used.length) {
						if (state.tmp.same_author_as_previous_cite) {
							continue;
						} else {
							state.tmp.have_collapsed = false;
						}
					} else {
						state.tmp.have_collapsed = false;
					}

					//
					// "name" is the format for the outermost nesting of a nameset
					// "inner" is a format consisting only of a delimiter, used for
					// joining all but the last name in the set together.


 */



// More refugee code from node_names.js
/*
				for  (namesetIndex = 0; namesetIndex < len; namesetIndex += 1) {
					nameset = namesets[namesetIndex];
					if (!state.tmp.disambig_request) {
						state.tmp.disambig_settings.givens[state.tmp.nameset_counter] = [];
					}
				}

 */