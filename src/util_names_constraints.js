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


/*
						// set the number of names to be _intended_ for rendering,
						// in the first nameset, if personal, for subsequent slicing.
						if (namesetIndex === 0 && !suppress_min && (state.tmp.area === "bibliography" || (state.tmp.area === "citation" && state.opt.xclass === "note"))) {
							state.tmp.names_cut.counts[nameset.variable] = state.tmp["et-al-use-first"];
						}

						sane = state.tmp["et-al-min"] >= state.tmp["et-al-use-first"];
						if (state.tmp["et-al-use-last"] && state.tmp["et-al-min"] >= state.tmp["et-al-use-first"] + 2) {
							apply_ellipsis = true;
						} else {
							apply_ellipsis = false;
						}
						//
						// if there is anything on name request, we assume that
						// it was configured correctly via state.names_request
						// by the function calling the renderer.
						discretionary_names_length = state.tmp["et-al-min"];

						//
						// Invoke names constraint
						//
						suppress_condition = suppress_min && display_names.length >= suppress_min;
						if (suppress_condition) {
							continue;
						}

						//
						// if rendering for display, do not honor a disambig_request
						// to set names length below et-al-use-first, and do not
						// truncate unless number of names is equal to or greater
						// than et-al-min
						//
						if (state.tmp.suppress_decorations) {
							if (state.tmp.disambig_request) {
								discretionary_names_length = state.tmp.disambig_request.names[state.tmp.nameset_counter];
							} else if (display_names.length >= state.tmp["et-al-min"]) {
								discretionary_names_length = state.tmp["et-al-use-first"];
							}
						} else {
							if (state.tmp.disambig_request && state.tmp.disambig_request.names[state.tmp.nameset_counter] > state.tmp["et-al-use-first"]) {
								if (display_names.length < state.tmp["et-al-min"]) {
									discretionary_names_length = display_names.length;
								} else {
									discretionary_names_length = state.tmp.disambig_request.names[state.tmp.nameset_counter];
								}
							} else if (display_names.length >= state.tmp["et-al-min"]) {
								discretionary_names_length = state.tmp["et-al-use-first"];
							}
							// XXXX: This is a workaround. Under some conditions.
							// Where namesets disambiguate on one of the two names
							// dropped here, it is possible for more than one
							// in-text citation to be close (and indistinguishable)
							// matches to a single bibliography entry.
							//
							// 
							if (state.tmp["et-al-use-last"] && discretionary_names_length > (state.tmp["et-al-min"] - 2)) {
								discretionary_names_length = state.tmp["et-al-min"] - 2;
							}
						}
						overlength = display_names.length > discretionary_names_length;
						// This var is used to control contextual join, and
						// lies about the number of names when forceEtAl is true,
						// unless normalized.
						if (discretionary_names_length > display_names.length) {
							discretionary_names_length = display_names.length;
						}
						et_al = false;
						and_term = "";
						// forceEtAl is relevant when the author list is
						// truncated to eliminate clutter.
						if (sane && (overlength || state.tmp.forceEtAl)) {
							if (! state.tmp.sort_key_flag) {
								et_al = et_al_pers;
								//et_al = state.output.getToken("etal").strings.et_al_term;

								// XXXXX: temporary hack to exhibit existing context-sensitive
								// et al. join behavior.
								if (discretionary_names_length > 1) {
									state.output.getToken("et-al-pers").strings.prefix = state.output.getToken("et-al-pers").strings["prefix-multiple"];
								} else {
									state.output.getToken("et-al-pers").strings.prefix = state.output.getToken("et-al-pers").strings["prefix-single"];
								}
							}
							if (apply_ellipsis) {
								state.tmp.use_ellipsis = true;
								display_names = display_names.slice(0, discretionary_names_length).concat(display_names.slice(-1));
							} else {
								display_names = display_names.slice(0, discretionary_names_length);
							}
						} else {
							if (!state.tmp.sort_key_flag) {
								if (display_names.length > 1) {
									if (state.output.getToken("name").strings.and) {
										and_term = state.output.getToken("name").strings.and;
									}
								}
							}
						}
						state.output.formats.value().name.strings.delimiter = and_term;

 */

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