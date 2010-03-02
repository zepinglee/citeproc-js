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
var CSL = {

	debug: function (str) {
		print(str);
	},

	START: 0,
	END: 1,
	SINGLETON: 2,

	SEEN: 6,
	SUCCESSOR: 3,
	SUCCESSOR_OF_SUCCESSOR: 4,
	SUPPRESS: 5,

	SINGULAR: 0,
	PLURAL: 1,

	LITERAL: true,

	BEFORE: 1,
	AFTER: 2,

	DESCENDING: 1,
	ASCENDING: 2,

	ONLY_FIRST: 1,
	ALWAYS: 2,
	ONLY_LAST: 3,

	FINISH: 1,

	POSITION_FIRST: 0,
	POSITION_SUBSEQUENT: 1,
	POSITION_IBID: 2,
	POSITION_IBID_WITH_LOCATOR: 3,

	AREAS: ["citation", "citation_sort", "bibliography", "bibliography_sort"],

	ABBREVIATE_FIELDS: ["journal", "series", "institution", "authority"],

	MINIMAL_NAME_FIELDS: ["literal", "family"],

	SWAPPING_PUNCTUATION: [".", ",", ";", ":"],

	// update modes
	NONE: 0,
	NUMERIC: 1,
	POSITION: 2,

	COLLAPSE_VALUES: ["citation-number", "year", "year-suffix"],

	ET_AL_NAMES: [
		"et-al-min",
		"et-al-use-first",
		"et-al-subsequent-min",
		"et-al-subsequent-use-first"
	],

	DISAMBIGUATE_OPTIONS: [
		"disambiguate-add-names",
		"disambiguate-add-givenname",
		"disambiguate-add-year-suffix"
	],

	GIVENNAME_DISAMBIGUATION_RULES: [
		"all-names",
		"all-names-with-initials",
		"primary-name",
		"primary-name-with-initials",
		"by-cite"
	],

	NAME_ATTRIBUTES: [
		"and",
		"delimiter-precedes-last",
		"initialize-with",
		"name-as-sort-order",
		"sort-separator",
		"et-al-min",
		"et-al-use-first",
		"et-al-subsequent-min",
		"et-al-subsequent-use-first"
	],

	LOOSE: 0,
	STRICT: 1,

	PREFIX_PUNCTUATION: /[.;:]\s*$/,
	SUFFIX_PUNCTUATION: /^\s*[.;:,\(\)]/,

	NUMBER_REGEXP: /(?:^\d+|\d+$|\d{3,})/, // avoid evaluating "F.2d" as numeric
                                                 // Afterthought: um ... why?
	QUOTED_REGEXP_START: /^"/,
	QUOTED_REGEXP_END: /^"$/,
	//
	// \u0400-\u042f are cyrillic and extended cyrillic capitals
	// this is not fully smart yet.  can't do what this was trying to do
	// with regexps, actually; we want to identify strings with a leading
	// capital letter, and any subsequent capital letters.  Have to compare
	// locale caps version with existing version, character by character.
	// hard stuff, but if it breaks, that's what to do.
	NAME_INITIAL_REGEXP: /^([A-Z\u0080-\u017f\u0400-\u042f])([a-zA-Z\u0080-\u017f\u0400-\u052f]*|)/,
	ROMANESQUE_REGEXP: /[a-zA-Z\u0080-\u017f\u0400-\u052f]/,
	STARTSWITH_ROMANESQUE_REGEXP: /^[&a-zA-Z\u0080-\u017f\u0400-\u052f]/,
	ENDSWITH_ROMANESQUE_REGEXP: /[&a-zA-Z\u0080-\u017f\u0400-\u052f]$/,
	DISPLAY_CLASSES: ["block", "left-margin", "right-inline", "indent"],

	NUMERIC_VARIABLES: ["edition", "volume", "number-of-volumes", "number", "issue", "citation-number"],
	//var x = new Array();
	//x = x.concat(["title","container-title","issued","page"]);
	//x = x.concat(["locator","collection-number","original-date"]);
	//x = x.concat(["reporting-date","decision-date","filing-date"]);
	//x = x.concat(["revision-date"]);
	//NUMERIC_VARIABLES = x.slice();
	DATE_VARIABLES: ["issued", "event", "accessed", "container", "original-date"],

	TAG_ESCAPE: /(<span class=\"no(?:case|decor)\">.*?<\/span>)/,
	TAG_USEALL: /(<[^>]+>)/,

	SKIP_WORDS: ["a", "the", "an"],

	FORMAT_KEY_SEQUENCE: [
		"@strip-periods",
		"@font-style",
		"@font-variant",
		"@font-weight",
		"@text-decoration",
		"@vertical-align",
		"@quotes"
	],

	SUFFIX_CHARS: "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z",
	ROMAN_NUMERALS: [
		[ "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ],
		[ "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc" ],
		[ "", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm" ],
		[ "", "m", "mm", "mmm", "mmmm", "mmmmm"]
	],
	CREATORS: [
		"author",
		"editor",
		"translator",
		"recipient",
		"interviewer",
		"composer",
		"original-author",
		"container-author",
		"collection-editor"
	],

	LANG_BASES: {
		af: "af_ZA",
		ar: "ar_AR",
		bg: "bg_BG",
		ca: "ca_AD",
		cs: "cs_CZ",
		da: "da_DK",
		de: "de_DE",
		el: "el_GR",
		en: "en_US",
		es: "es_ES",
		et: "et_EE",
		fr: "fr_FR",
		he: "he_IL",
		hu: "hu_HU",
		is: "is_IS",
		it: "it_IT",
		ja: "ja_JP",
		ko: "ko_KR",
		mn: "mn_MN",
		nb: "nb_NO",
		nl: "nl_NL",
		pl: "pl_PL",
		pt: "pt_PT",
		ro: "ro_RO",
		ru: "ru_RU",
		sk: "sk_SK",
		sl: "sl_SI",
		sr: "sr_RS",
		sv: "sv_SE",
		th: "th_TH",
		tr: "tr_TR",
		uk: "uk_UA",
		vi: "vi_VN",
		zh: "zh_CN"
	},

	locale: {},

	//
	// Well, that's interesting.  We're going to need fallbacks for
	// these too.  Like terms, a session-persistent record of the
	// locale data is made on CSL, and an ephemeral override record
	// is recorded in the style.  When the locale object is called,
	// the ephemeral record is checked first, and failing that we
	// fall back to the record on CSL before blowing up.
	//
	// So need functions getOpt() and getDate()?
	//
	locale_opts: {},
	locale_dates: {}

};

//SNIP-START

// skip jslint
if (!CSL.System) {
	load("./src/xmle4x.js");
}
// jslint OK
if (!CSL.localeResolve) {
	load("./src/util_locale.js");
}
// jslint OK
if (!CSL.Mode) {
	load("./src/util_processor.js");
}
// jslint OK
if (!CSL.cloneAmbigConfig) {
	load("./src/util_disambig.js");
}
// jslint OK
if (!CSL.XmlToToken) {
	load("./src/util_nodes.js");
}
if (!CSL.Engine) {
	load("./src/build.js");
}
if (!CSL.Output) {
	load("./src/queue.js");
}
if (!CSL.Engine.Opt) {
	load("./src/state.js");
}
if (!CSL.makeCitationCluster) {
	load("./src/cmd_cite.js");
}
if (!CSL.makeBibliography) {
	load("./src/cmd_bibliography.js");
}
if (!CSL.setCitationId) {
	load("./src/util_integration.js");
}
if (!CSL.updateItems) {
	load("./src/cmd_update.js");
}
if (!CSL.Node) {
	load("./src/node_bibliography.js");
    load("./src/node_choose.js");
    load("./src/node_citation.js");
    load("./src/node_date.js");
    load("./src/node_datepart.js");
    load("./src/node_elseif.js");
    load("./src/node_else.js");
    load("./src/node_etal.js");
    load("./src/node_group.js");
    load("./src/node_if.js");
    load("./src/node_info.js");
    load("./src/node_institution.js");
    load("./src/node_institutionpart.js");
    load("./src/node_key.js");
    load("./src/node_label.js");
    load("./src/node_layout.js");
    load("./src/node_macro.js");
    load("./src/node_name.js");
    load("./src/node_namepart.js");
    load("./src/node_names.js");
    load("./src/node_number.js");
    load("./src/node_sort.js");
    load("./src/node_substitute.js");
    load("./src/node_text.js");
}
if (!CSL.Node.names) {
	load("./src/libnames.js");
}
if (!CSL.Attributes) {
	load("./src/attributes.js");
}
if (!CSL.Stack) {
	load("./src/stack.js");
}
if (!CSL.Parallel) {
	load("./src/util_parallel.js");
}
if (!CSL.Abbrev) {
	load("./src/util_abbrev.js");
}
if (!CSL.Token) {
	load("./src/obj_token.js");
}
if (!CSL.AmbigConfig) {
	load("./src/obj_ambigconfig.js");
}
if (!CSL.Blob) {
	load("./src/obj_blob.js");
}
if (!CSL.NumericBlob) {
	load("./src/obj_number.js");
}
if (!CSL.Util) {
	load("./src/util.js");
}
if (!CSL.Util.fixDateNode) {
	load("./src/util_datenode.js");
}
if (!CSL.Util.Names) {
	load("./src/util_names.js");
}
if (!CSL.Util.Institutions) {
	load("./src/util_institutions.js");
}
if (!CSL.Util.Dates) {
	load("./src/util_dates.js");
}
if (!CSL.Util.Sort) {
	load("./src/util_sort.js");
}
if (!CSL.Util.substituteStart) {
	load("./src/util_substitute.js");
}
if (!CSL.Util.Suffixator) {
	load("./src/util_number.js");
}
if (!CSL.Util.PageRangeMangler) {
	load("./src/util_page.js");
}
if (!CSL.Util.FlipFlopper) {
	load("./src/util_flipflop.js");
}
if (!CSL.Output.Formatters) {
	load("./src/formatters.js");
}
if (!CSL.Output.Formats) {
	load("./src/formats.js");
}
if (!CSL.Registry) {
	load("./src/registry.js");
}
if (!CSL.Registry.NameReg) {
	load("./src/disambig_names.js");
}
if (!CSL.Registry.CitationReg) {
	load("./src/disambig_citations.js");
}
if (!CSL.Registry.prototype.disambiguateCites) {
	load("./src/disambig_cites.js");
}

//SNIP-END
