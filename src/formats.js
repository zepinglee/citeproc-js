/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
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
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
dojo.provide("csl.formats");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * Output specifications.
 * @class
 */
CSL.Output.Formats = function(){};

/**
 * HTML output format specification.
 * <p>The headline says it all.  The source code for this
 * object can be used as a template for producing other
 * output modes.</p>
 */
CSL.Output.Formats.prototype.html = {
	//
	// tmp: Scratch area for this output format.
	//
	"tmp": new Object(),
	//
	// format_init:  Initialization hook.  Defined function is run
	// when the format is selected, with the temporary scratch object
	// as the sole argument.
	//
	"format_init": function(){
		this.tmp["hello"] = "Hello";
	},
	//
	// items_add:  Formatting registry data insertion hook.  Hook to be
	// used by output modes that must maintain information on a per-item
	// basis.  Defined function is run once for each updateItems invocation
	// on the processor API, with the temporary scratch object as the
	// first argument, and an array of items to be inserted as the
	// second.
	//
	"items_add": function(items_array){},
	//
	// items_delete: Formatting registry data deletion hook.  Hook to be
	// used by output modes that must maintain information on a per-item
	// basis.  Defined function is run once for each updateItems invocation
	// on the processor API, iwth the temporary scratch object as the
	// first argument, and a hash of item IDs to be deleted as the second.
	//
	"items_delete": function(items_hash){},
	//
	// text_escape: Format-specific function for escaping text destined
	// for output.  Takes the temporary scratch object and the text to be
	// escaped as arguments.  Function will be run only once across each
	// portion of text to be escaped, it need not be idempotent.
	//
	"text_escape": function(text){
		return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	},
	"@font-style/italic":"<i>%%STRING%%</i>",
	"@font-style/oblique":"<em>%%STRING%%</em>",
	"@font-style/normal":"<span style=\"font-style:normal;\">%%STRING%%</span>",
	"@font-variant/small-caps":"<span style=\"font-variant:small-caps;\">%%STRING%%</span>",
	"@passthrough/true":CSL.Output.Formatters.passthrough,
	"@font-variant/normal":false,
	"@font-weight/bold":"<b>%%STRING%%</b>",
	"@font-weight/normal":false,
	"@font-weight/light":false,
	"@text-decoration/none":false,
	"@text-decoration/underline":"<span style=\"text-decoration:underline;\">%%STRING%%</span>",
	"@vertical-align/baseline":false,
	"@vertical-align/sup":"<sup>%%STRING%%</sup>",
	"@vertical-align/sub":"<sub>%%STRING%%</sub>",
	//"@text-case/lowercase":CSL.Output.Formatters.lowercase,
	//"@text-case/uppercase":CSL.Output.Formatters.uppercase,
	//"@text-case/capitalize-first":CSL.Output.Formatters.capitalize_first,
	//"@text-case/capitalize-all":CSL.Output.Formatters.capitalize_all,
	//"@text-case/title":CSL.Output.Formatters.title_capitalization,
	//"@text-case/sentence":CSL.Output.Formatters.sentence_capitalization,
	"@strip-periods/true":CSL.Output.Formatters.strip_periods,
	"@strip-periods/false":function(state,string){return string;},
	"@quotes/true":function(state,str){
		if ("undefined" == typeof str){
			return state.getTerm("open-quote");
		};
		return state.getTerm("open-quote") + str + state.getTerm("close-quote");
	},
	"@quotes/inner":function(state,str){
		if ("undefined" == typeof str){
			//
			// Most right by being wrong (for apostrophes)
			//
			return state.getTerm("close-inner-quote");
		};
		return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
	},
	// "@display/block":"<span class=\"csl-bib-block\">%%STRING%%</span>",
	"@bibliography/body": function(state,str){
		return "<div class=\"csl-bib-body\">\n"+str+"</div>";
	},
	"@bibliography/entry": function(state,str){
		return "  <div class=\"csl-entry\">"+str+"</div>\n";
	},
	"@display/block": function(state,str){
		return "\n\n    <div class=\"csl-entry-heading\">" + str + "</div>\n";
	},
	"@display/left-margin": function(state,str){
		return "\n    <div class=\"csl-left-label\">" + str + "</div>\n";
	},
	"@display/right-inline": function(state,str){
		return "    <div class=\"csl-item\">" + str + "</div>\n  ";
	},
	"@display/indent": function(state,str){
		return "    <div class=\"csl-block-indent\">" + str + "</div>\n  ";
	}
};

CSL.Output.Formats = new CSL.Output.Formats();
