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
var CSL = new function () {

	this.debug = function(str){
		print(str);
	};

	this.START = 0;
	this.END = 1;
	this.SINGLETON = 2;
	this.SEEN = 6;

	this.SUCCESSOR = 3;
	this.SUCCESSOR_OF_SUCCESSOR = 4;
	this.SUPPRESS = 5;

	this.SINGULAR = 0;
	this.PLURAL = 1;

	this.LITERAL = true;

	this.BEFORE = 1;
	this.AFTER = 2;

	this.DESCENDING = 1;
	this.ASCENDING = 2;

	this.ONLY_FIRST = 1;
	this.ALWAYS = 2;
	this.ONLY_LAST = 3;

	this.FINISH = 1;

	this.POSITION_FIRST = 0;
	this.POSITION_SUBSEQUENT = 1;
	this.POSITION_IBID = 2;
	this.POSITION_IBID_WITH_LOCATOR = 3;

	this.COLLAPSE_VALUES = ["citation-number","year","year-suffix"];

	this.ET_AL_NAMES = ["et-al-min","et-al-use-first"];
	this.ET_AL_NAMES = this.ET_AL_NAMES.concat( ["et-al-subsequent-min","et-al-subsequent-use-first"] );

	this.DISAMBIGUATE_OPTIONS = ["disambiguate-add-names","disambiguate-add-givenname"];
	this.DISAMBIGUATE_OPTIONS.push("disambiguate-add-year-suffix");
	this.GIVENNAME_DISAMBIGUATION_RULES = [];
	this.GIVENNAME_DISAMBIGUATION_RULES.push("all-names");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("all-names-with-initials");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("primary-name");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("primary-name-with-initials");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("by-cite");

	this.NAME_ATTRIBUTES = [];
	this.NAME_ATTRIBUTES.push("and");
    this.NAME_ATTRIBUTES.push("delimiter-precedes-last");
	this.NAME_ATTRIBUTES.push("initialize-with");
	this.NAME_ATTRIBUTES.push("name-as-sort-order");
	this.NAME_ATTRIBUTES.push("sort-separator");
	this.NAME_ATTRIBUTES.push("et-al-min");
	this.NAME_ATTRIBUTES.push("et-al-use-first");
    this.NAME_ATTRIBUTES.push("et-al-subsequent-min");
    this.NAME_ATTRIBUTES.push("et-al-subsequent-use-first");

	this.LOOSE = 0;
	this.STRICT = 1;

	this.PREFIX_PUNCTUATION = /.*[.;:]\s*$/;
	this.SUFFIX_PUNCTUATION = /^\s*[.;:,\(\)].*/;

	this.NUMBER_REGEXP = /(?:^\d+|\d+$|\d{3,})/; // avoid evaluating "F.2d" as numeric
	this.QUOTED_REGEXP = /^".+"$/;
	//
	// \u0400-\u042f are cyrillic and extended cyrillic capitals
	// this is not fully smart yet.  can't do what this was trying to do
	// with regexps, actually; we want to identify strings with a leading
	// capital letter, and any subsequent capital letters.  Have to compare
	// locale caps version with existing version, character by character.
	// hard stuff, but if it breaks, that's what to do.
	this.NAME_INITIAL_REGEXP = /^([A-Z\u0080-\u017f\u0400-\u042f])([a-zA-Z\u0080-\u017f\u0400-\u052f]*|).*/;
	this.ROMANESQUE_REGEXP = /.*[a-zA-Z\u0080-\u017f\u0400-\u052f].*/;
	this.STARTSWITH_ROMANESQUE_REGEXP = /^[&a-zA-Z\u0080-\u017f\u0400-\u052f].*/;
	this.ENDSWITH_ROMANESQUE_REGEXP = /.*[&a-zA-Z\u0080-\u017f\u0400-\u052f]$/;
	this.GROUP_CLASSES = ["block","left-margin","right-inline","indent"];

	var x = new Array();
	x = x.concat(["edition","volume","number-of-volumes","number"]);
	x = x.concat(["issue","title","container-title","issued","page"]);
	x = x.concat(["locator","collection-number","original-date"]);
	x = x.concat(["reporting-date","decision-date","filing-date"]);
	x = x.concat(["revision-date"]);
	this.NUMERIC_VARIABLES = x.slice();
	this.DATE_VARIABLES = ["issued","event","accessed","container","original-date"];

	this.TAG_ESCAPE = /(<span class=\"no(?:case|decor)\">.*?<\/span>)/;
	this.TAG_USEALL = /(<[^>]+>)/;

	this.SKIP_WORDS = ["a","the","an"];

	var x = new Array();
	x = x.concat(["@strip-periods","@font-style","@font-variant"]);
	x = x.concat(["@font-weight","@text-decoration","@vertical-align"]);
	x = x.concat(["@quotes","@display"]);
	this.FORMAT_KEY_SEQUENCE = x.slice();
	this.SUFFIX_CHARS = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
	this.ROMAN_NUMERALS = [
		[ "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ],
		[ "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc" ],
		[ "", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm" ],
		[ "", "m", "mm", "mmm", "mmmm", "mmmmm"]
	];
	this.CREATORS = ["author","editor","translator","recipient","interviewer"];
	this.CREATORS = this.CREATORS.concat(["composer"]);
	this.CREATORS = this.CREATORS.concat(["original-author"]);
	this.CREATORS = this.CREATORS.concat(["container-author","collection-editor"]);

	this.LANG_BASES = new Object();
	this.LANG_BASES["af"] = "af_ZA";
	this.LANG_BASES["ar"] = "ar_AR";
	this.LANG_BASES["bg"] = "bg_BG";
	this.LANG_BASES["ca"] = "ca_AD";
	this.LANG_BASES["cs"] = "cs_CZ";
	this.LANG_BASES["da"] = "da_DK";
	this.LANG_BASES["de"] = "de_DE";
	this.LANG_BASES["el"] = "el_GR";
	this.LANG_BASES["en"] = "en_US";
	this.LANG_BASES["es"] = "es_ES";
	this.LANG_BASES["et"] = "et_EE";
	this.LANG_BASES["fr"] = "fr_FR";
	this.LANG_BASES["he"] = "he_IL";
	this.LANG_BASES["hu"] = "hu_HU";
	this.LANG_BASES["is"] = "is_IS";
	this.LANG_BASES["it"] = "it_IT";
	this.LANG_BASES["ja"] = "ja_JP";
	this.LANG_BASES["ko"] = "ko_KR";
	this.LANG_BASES["mn"] = "mn_MN";
	this.LANG_BASES["nb"] = "nb_NO";
	this.LANG_BASES["nl"] = "nl_NL";
	this.LANG_BASES["pl"] = "pl_PL";
	this.LANG_BASES["pt"] = "pt_PT";
	this.LANG_BASES["ro"] = "ro_RO";
	this.LANG_BASES["ru"] = "ru_RU";
	this.LANG_BASES["sk"] = "sk_SK";
	this.LANG_BASES["sl"] = "sl_SI";
	this.LANG_BASES["sr"] = "sr_RS";
	this.LANG_BASES["sv"] = "sv_SE";
	this.LANG_BASES["th"] = "th_TH";
	this.LANG_BASES["tr"] = "tr_TR";
	this.LANG_BASES["uk"] = "uk_UA";
	this.LANG_BASES["vi"] = "vi_VN";
	this.LANG_BASES["zh"] = "zh_CN";

	this.locale = new Object();

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
	this.locale_opts = new Object();
	this.locale_dates = new Object();

    this.localeRegistry = {
		"af":"locales-af-AZ.xml",
		"af":"locales-af-ZA.xml",
		"ar":"locales-ar-AR.xml",
		"bg":"locales-bg-BG.xml",
		"ca":"locales-ca-AD.xml",
		"cs":"locales-cs-CZ.xml",
		"da":"locales-da-DK.xml",
		"de":"locales-de-AT.xml",
		"de":"locales-de-CH.xml",
		"de":"locales-de-DE.xml",
		"el":"locales-el-GR.xml",
		"en":"locales-en-US.xml",
		"es":"locales-es-ES.xml",
		"et":"locales-et-EE.xml",
		"fr":"locales-fr-FR.xml",
		"he":"locales-he-IL.xml",
		"hu":"locales-hu-HU.xml",
		"is":"locales-is-IS.xml",
		"it":"locales-it-IT.xml",
		"ja":"locales-ja-JP.xml",
		"ko":"locales-ko-KR.xml",
		"mn":"locales-mn-MN.xml",
		"nb":"locales-nb-NO.xml",
		"nl":"locales-nl-NL.xml",
		"pl":"locales-pl-PL.xml",
		"pt":"locales-pt-BR.xml",
		"pt":"locales-pt-PT.xml",
		"ro":"locales-ro-RO.xml",
		"ru":"locales-ru-RU.xml",
		"sk":"locales-sk-SK.xml",
		"sl":"locales-sl-SI.xml",
		"sr":"locales-sr-RS.xml",
		"sv":"locales-sv-SE.xml",
		"th":"locales-th-TH.xml",
		"tr":"locales-tr-TR.xml",
		"uk":"locales-uk-UA.xml",
		"vi":"locales-vi-VN.xml",
		"zh":"locales-zh-CN.xml",
		"zh":"locales-zh-TW.xml"
	};
};

//SNIP-START

if (!CSL.System){
	load("./src/xmle4x.js");
}
if (!CSL.localeResolve){
	load("./src/util_locale.js");
}
if (!CSL.Mode){
	load("./src/util_processor.js");
}
if (!CSL.cloneAmbigConfig){
	load("./src/util_disambig.js");
}
if (!CSL.XmlToToken){
	load("./src/util_nodes.js");
}
if (!CSL.Engine){
	load("./src/build.js");
}
if (!CSL.Output){
	load("./src/queue.js");
}
if (!CSL.Engine.Opt){
	load("./src/state.js");
}
if (!CSL.makeCitationCluster){
	load("./src/cmd_cite.js");
}
if (!CSL.makeBibliography){
	load("./src/cmd_bibliography.js");
}
if (!CSL.updateItems){
	load("./src/cmd_update.js");
}
if (!CSL.Node){
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
if (!CSL.Node.names){
	load("./src/libnames.js");
}
if (!CSL.Attributes){
	load("./src/attributes.js");
}
if (!CSL.Stack){
	load("./src/stack.js");
}
if (!CSL.Parallel){
	load("./src/util_parallel.js");
}
if (!CSL.Abbrev){
	load("./src/util_abbrev.js");
}
if (!CSL.Token){
	load("./src/obj_token.js");
}
if (!CSL.AmbigConfig){
	load("./src/obj_ambigconfig.js");
}
if (!CSL.Blob){
	load("./src/obj_blob.js");
}
if (!CSL.NumericBlob){
	load("./src/obj_number.js");
}
if (!CSL.Util){
	load("./src/util.js");
}
if (!CSL.Util.Names){
	load("./src/util_names.js");
}
if (!CSL.Util.Institutions){
	load("./src/util_institutions.js");
}
if (!CSL.Util.Dates){
	load("./src/util_dates.js");
}
if (!CSL.Util.Sort){
	load("./src/util_sort.js");
}
if (!CSL.Util.substituteStart){
	load("./src/util_substitute.js");
}
if (!CSL.Util.Suffixator){
	load("./src/util_number.js");
}
if (!CSL.Util.PageRangeMangler){
	load("./src/util_page.js");
}
if (!CSL.Util.FlipFlopper){
	load("./src/util_flipflop.js");
}
if (!CSL.Output.Formatters){
	load("./src/formatters.js");
}
if (!CSL.Output.Formats){
	load("./src/formats.js");
}
if (!CSL.Registry){
	load("./src/registry.js");
}
if (!CSL.Registry.prototype.NameReg){
	load("./src/disambig_names.js");
}
if (!CSL.Registry.prototype.disambiguateCites){
	load("./src/disambig_cites.js");
}

//SNIP-END
