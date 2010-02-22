/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
	params.bibstart = this.fun.decorate.bibstart;
	params.bibend = this.fun.decorate.bibend;
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
		var res = this.output.string(this,this.output.queue)[0];
		if (!res){
			res = "[CSL STYLE ERROR: reference with no printed form.]";
		} else {
			ret.push(res);
		}
	}
	this.tmp.disambig_override = false;
	return ret;
};
