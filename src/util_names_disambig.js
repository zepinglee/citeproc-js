// Disambiguate names (the number of names is controlled externally, by successive
// runs of the processor).
CSL.NameOutput.prototype.disambigNames = function () {
	var pos = this.nameset_base;
	for (var i = 0, ilen = this.variables.length; i < ilen; i += 1) {
		var v = this.variables[i];
	print("A: "+this.freeters[v]);
		this._runDisambigNames(this.freeters[v], pos);
	print("  B");
		// We're skipping institutions, so +2
		this.state.tmp.disambig_settings.givens.push([]);
		pos += 2;
		for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
			this._runDisambigNames(this.persons[v][j], pos);
			pos += 1;
		}
	}
};

CSL.NameOutput.prototype._runDisambigNames = function (lst, pos) {
	for (var i = 0, ilen = lst.length; i < ilen; i += 1) {
		print("NAME: "+i+" "+lst[i].family+" offset: "+this.nameset_offset);
		//
		// register the name in the global names disambiguation
		// registry
		this.state.registry.namereg.addname("" + this.Item.id, lst[i], i);
		var chk = this.state.tmp.disambig_settings.givens[pos];
		if ("undefined" === typeof chk) {
			this.state.tmp.disambig_settings.givens.push([]);
		}
		print("  yy: "+pos+" "+i+" // ("+this.state.tmp.disambig_settings.givens+")");
		chk = this.state.tmp.disambig_settings.givens[pos][i];
		print("  zz");
		if ("undefined" === typeof chk) {
			var myform = this.name.strings.form;
			var myinitials = this.name.strings["initialize-with"];
			var param = this.state.registry.namereg.evalname("" + this.Item.id, lst[i], i, 0, myform, myinitials);
			this.state.tmp.disambig_settings.givens[pos].push(param);
		}
		//
		// set the display mode default for givennames if required
		var myform = this.name.strings.form;
		var myinitials = this.name.strings["initialize-with"];
		var paramx = this.state.registry.namereg.evalname("" + this.Item.id, lst[i], i, 0, myform, myinitials);
		if (this.state.tmp.sort_key_flag) {
			this.state.tmp.disambig_settings.givens[pos][i] = 2;
			var param = 2;
		} else if (this.state.tmp.disambig_request) {
			//
			// fix a request for initials that makes no sense.
			// can't do this in disambig, because the availability
			// of initials is not a global parameter.
			var val = this.state.tmp.disambig_settings.givens[pos][i];
			// This is limited to by-cite disambiguation.
			if (val === 1 && 
				this.state.opt["givenname-disambiguation-rule"] === "by-cite" && 
				"undefined" === typeof this.name.strings["initialize-with"]) {
				val = 2;
			}
			var param = val;
			if (this.state.opt["disambiguate-add-givenname"]) {
				param = this.state.registry.namereg.evalname("" + this.Item.id, lst[i], i, param, this.name.strings.form, this.name.strings["initialize-with"]);
			}
		} else {
			//
			// it clicks.  here is where we will put the
			// call to the names register, to get the floor value
			// for an individual name.
			//
			var param = paramx;
		}
		// Need to save off the settings based on subsequent
		// form, when first cites are rendered.  Otherwise you
		// get full form names everywhere.
		if (!this.state.tmp.just_looking && this.item && this.item.position === CSL.POSITION_FIRST) {
			var param = paramx;
		}
		if (!this.state.tmp.sort_key_flag) {
			this.state.tmp.disambig_settings.givens[pos][i] = param;
		}
	}
};
