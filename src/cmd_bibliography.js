/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
CSL.Engine.prototype.makeBibliography = function(bibsection){
	var debug = false;
	if (debug){
		for each (tok in this.bibliography.tokens){
			CSL.debug("bibtok: "+tok.name);
		}
		CSL.debug("---");
		for each (tok in this.citation.tokens){
			CSL.debug("cittok: "+tok.name);
		}
		CSL.debug("---");
		for each (tok in this.bibliography_sort.tokens){
			CSL.debug("bibsorttok: "+tok.name);
		}
	}
	var ret = CSL.getBibliographyEntries.call(this,bibsection);
	var params = {
		"maxoffset":0,
		"entryspacing":1,
		"linespacing":1
	};
	var maxoffset = 0;
	for each (var item in this.registry.reflist){
		if (item.offset > params.maxoffset){
			params.maxoffset = item.offset;
		};
	};
	if (this.bibliography.opt.hangingindent){
		params.hangingindent = this.bibliography.opt.hangingindent;
	}
	if (this.bibliography.opt.entryspacing){
		params.entryspacing = this.bibliography.opt.entryspacing;
	}
	if (this.bibliography.opt.linespacing){
		params.linespacing = this.bibliography.opt.linespacing;
	}
	return [params,ret];
};

/*
 * Compose individual cites into a single string.
 */
CSL.getBibliographyEntries = function (bibsection){
	var ret = [];
	this.tmp.area = "bibliography";
	var input = this.retrieveItems(this.registry.getSortedIds());
	this.tmp.disambig_override = true;
	function eval_string(a,b){
		if (a == b){
			return true;
		}
		return false;
	}
	function eval_list(a,lst){
		for each (var b in lst){
			if (eval_string(a,b)){
				return true;
			}
		}
		return false;
	}
	function eval_spec(a,b){
		if ((a == "none" || !a) && !b){
			return true;
		}
		if ("string" == typeof b){
			return eval_string(a,b);
		} else {
			return eval_list(a,b);
		}
	}
	for each (var item in input){
		if (bibsection){
			var include = true;
			if (bibsection.include){
				//
				// Opt-in: these are OR-ed.
				//
				include = false;
				for each (spec in bibsection.include){
					if (eval_spec(spec.value,item[spec.field])){
						include = true;
						break;
					}
				}
			} else if (bibsection.exclude){
				//
				// Opt-out: these are also OR-ed.
				//
				var anymatch = false;
				for each (spec in bibsection.exclude){
					if (eval_spec(spec.value,item[spec.field])){
						anymatch = true;
						break;
					}
				}
				if (anymatch){
					include = false;
				}
			} else if (bibsection.select){
				//
				// Multiple condition opt-in: these are AND-ed.
				//
				include = false;
				var allmatch = true;
				for each (spec in bibsection.select){
					if (!eval_spec(spec.value,item[spec.field])){
						allmatch = false;
					}
				}
				if (allmatch){
					include = true;
				}
			}
			if (bibsection.quash){
				//
				// Stop criteria: These are AND-ed.
				//
				var allmatch = true;
				for each (spec in bibsection.quash){
					if (!eval_spec(spec.value,item[spec.field])){
						allmatch = false;
					}
				}
				if (allmatch){
					include = false;
				}
			}
			if ( !include ){
				continue;
			}
		}
		if (false){
			CSL.debug("BIB: "+item.id);
		}
		var bib_entry = new CSL.Token("group",CSL.START);
		bib_entry.decorations = [["@bibliography","entry"]];
		this.output.startTag("bib_entry",bib_entry);
		CSL.getCite.call(this,item);
		this.output.endTag(); // closes bib_entry
		ret.push(this.output.string(this,this.output.queue)[0]);
	}
	this.tmp.disambig_override = false;
	return ret;
};
