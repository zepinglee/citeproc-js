CSL.Engine.prototype.start = new function(){

	if (this.tmp.disambig_request  && ! this.tmp.disambig_override){
		this.tmp.have_collapsed = true;
		this.tmp.disambig_settings = this.tmp.disambig_request;
	} else if (this.registry.registry[Item.id] && ! this.tmp.disambig_override) {
		this.tmp.disambig_request = this.registry.registry[Item.id].disambig;
		this.tmp.disambig_settings = this.registry.registry[Item.id].disambig;
	} else {
		this.tmp.disambig_settings = new CSL.Factory.AmbigConfig();
	}

	this.tmp.names_used = new Array();
	this.tmp.nameset_counter = 0;
	this.tmp.years_used = new Array();

	this.tmp.splice_delimiter = state[this.tmp.area].opt.delimiter;

	state["bibliography_sort"].keys = new Array();
	state["citation_sort"].keys = new Array();
};

CSL.Engine.prototype.end = new function(){

	if (this.tmp.last_suffix_used && this.tmp.last_suffix_used.match(/.*[-.,;:]$/)){
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.prefix.value() && this.tmp.prefix.value().match(/^[,,:;a-z].*/)){
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.last_suffix_used || this.tmp.prefix.value()){
			//
			// forcing the delimiter back to normal if a
			// suffix or prefix touch the join, even if
			// a year-suffix is the only output.
			//
			// XXXX: This should not be necessary.  Any cite matching
			// this condition should be forced to full form anyway.
			//
		this.tmp.splice_delimiter = state[this.tmp.area].opt.delimiter;
	}

	this.tmp.last_suffix_used = this.tmp.suffix.value();
	this.tmp.last_years_used = this.tmp.years_used.slice();
	this.tmp.last_names_used = this.tmp.names_used.slice();

	this.tmp.disambig_request = false;
};
