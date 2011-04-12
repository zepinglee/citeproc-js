CSL.NameOutput.prototype.constrainNames = function () {
	// Help >!<
	// cut-names stuff
	this._setNamesCutCount();
	// figure out how many names to include, in light of the disambig params
	var sane = this.state.tmp["et-al-min"] >= this.state.tmp["et-al-use-first"];
	for (var v in this.freeters) {
		// Constrain independent authors here
		this._imposeNameConstraints(this.freeters, v);
	}
	for (var v in this.persons) {
		// Constrain institutions here
		for (var j = 0, jlen = this.persons.length; j < jlen; j += 1) {
			// Constrain affiliated authors here
			this._imposeNameConstraints(this.persons[v], j);
		}
	}
};

CSL.NameOutput.prototype._imposeNameConstraints = function () {
	var discretionary_names_length = this.state.tmp["et-al-min"];
};
/*
	// Push this a _ function below
	//
	// if there is anything on name request, we assume that
	// it was configured correctly via state.names_request
	// by the function calling the renderer.
	discretionary_names_length = state.tmp["et-al-min"];
	//
	// Invoke names constraint
	//
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
	// chop the lists
};
*/

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

/*

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

// Stuff about disambiguation ...
/*
					llen = nameset.names.length;
					for (ppos = 0; ppos < llen; ppos += 1) {
						//
						// register the name in the global names disambiguation
						// registry
						state.registry.namereg.addname("" + Item.id, nameset.names[ppos], ppos);
						chk = state.tmp.disambig_settings.givens[state.tmp.nameset_counter];
						if ("undefined" === typeof chk) {
							state.tmp.disambig_settings.givens.push([]);
						}
						chk = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos];
						if ("undefined" === typeof chk) {
							myform = state.output.getToken("name").strings.form;
							myinitials = this.strings["initialize-with"];
							param = state.registry.namereg.evalname("" + Item.id, nameset.names[ppos], ppos, 0, myform, myinitials);
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter].push(param);
						}
						//
						// set the display mode default for givennames if required
						myform = state.output.getToken("name").strings.form;
						myinitials = this.strings["initialize-with"];
						paramx = state.registry.namereg.evalname("" + Item.id, nameset.names[ppos], ppos, 0, myform, myinitials);
						if (state.tmp.sort_key_flag) {
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos] = 2;
							param = 2;
						} else if (state.tmp.disambig_request) {
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							val = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos];
							// This is limited to by-cite disambiguation.
							if (val === 1 && 
								state.opt["givenname-disambiguation-rule"] === "by-cite" && 
								"undefined" === typeof this.strings["initialize-with"]) {
								val = 2;
							}
							param = val;
//							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
							if (state.opt["disambiguate-add-givenname"]) {
								param = state.registry.namereg.evalname("" + Item.id, nameset.names[ppos], ppos, param, state.output.getToken("name").strings.form, this.strings["initialize-with"]);
							}
						} else {
							//
							// it clicks.  here is where we will put the
							// call to the names register, to get the floor value
							// for an individual name.
							//
							param = paramx;
						}
						// Need to save off the settings based on subsequent
						// form, when first cites are rendered.  Otherwise you
						// get full form names everywhere.
						if (!state.tmp.just_looking && item && item.position === CSL.POSITION_FIRST) {
							param = paramx;
						}
						if (!state.tmp.sort_key_flag) {
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][ppos] = param;
						}
					}
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