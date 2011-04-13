// Disambiguate names (the number of names is controlled externally, by successive
// runs of the processor).
CSL.NameOutput.prototype.disambigNames = function () {
	for (var v in this.freeters) {
		this._runDisambigNames(this.freeters, v);
		for (var i = 0, ilen = this.persons[v].length; i < ilen; i += 1) {
			this._runDisambigNames(this.persons[v], i);
		}
	}
};

CSL.NameOutput.prototype._runDisambigNames = function (lst, key) {
	// XXXXX Uh-oh.
	if (key === "freeters"
	for (i = 0, ilen = lst.length; i < ilen; i += 1) {
		//
		// register the name in the global names disambiguation
		// registry
		this.state.registry.namereg.addname("" + this.Item.id, lst[i], i);
		var chk = this.state.tmp.disambig_settings.givens[state.tmp.nameset_counter];
		if ("undefined" === typeof chk) {
			state.tmp.disambig_settings.givens.push([]);
		}
		chk = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][i];
						if ("undefined" === typeof chk) {
							myform = state.output.getToken("name").strings.form;
							myinitials = this.strings["initialize-with"];
							param = state.registry.namereg.evalname("" + Item.id, nameset.names[i], i, 0, myform, myinitials);
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter].push(param);
						}
						//
						// set the display mode default for givennames if required
						myform = state.output.getToken("name").strings.form;
						myinitials = this.strings["initialize-with"];
						paramx = state.registry.namereg.evalname("" + Item.id, nameset.names[i], i, 0, myform, myinitials);
						if (state.tmp.sort_key_flag) {
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][i] = 2;
							param = 2;
						} else if (state.tmp.disambig_request) {
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							val = state.tmp.disambig_settings.givens[state.tmp.nameset_counter][i];
							// This is limited to by-cite disambiguation.
							if (val === 1 && 
								state.opt["givenname-disambiguation-rule"] === "by-cite" && 
								"undefined" === typeof this.strings["initialize-with"]) {
								val = 2;
							}
							param = val;
//							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
							if (state.opt["disambiguate-add-givenname"]) {
								param = state.registry.namereg.evalname("" + Item.id, nameset.names[i], i, param, state.output.getToken("name").strings.form, this.strings["initialize-with"]);
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
							state.tmp.disambig_settings.givens[state.tmp.nameset_counter][i] = param;
						}
					}
};
