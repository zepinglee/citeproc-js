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
if ("undefined" == typeof dojo){
	var dojo = new Object();
	dojo.provide = function(ignoreme){};
};
dojo.provide("csl.csl");


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
CSL = new function () {

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
	this.NAME_INITIAL_REGEXP = /^([A-Z\u0400-\u042f])([A-Z\u0400-\u042f])*.*$/;

	this.GROUP_CLASSES = ["block","left-margin","right-inline","indent"];

	var x = new Array();
	x = x.concat(["edition","volume","number-of-volumes","number"]);
	x = x.concat(["issue","title","container-title","issued","page"]);
	x = x.concat(["locator","collection-number","original-date"]);
	x = x.concat(["reporting-date","decision-date","filing-date"]);
	x = x.concat(["revision-date"]);
	this.NUMERIC_VARIABLES = x.slice();
	this.DATE_VARIABLES = ["issued","event","accessed","container","original-date"];

	this.TAG_ESCAPE = /(<ok>.*?<\/ok>)/;
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

if (!CSL.Engine){
	load("./src/build.js");
}
if (!CSL.Engine.Opt){
	load("./src/state.js");
}
if (!CSL.makeStyle){
	load("./src/commands.js");
}
if (!CSL.Engine.prototype.getAmbiguousCite){
	load("./src/render.js");
}
if (!CSL.Lib){
	load("./src/lib.js");
}
if (!CSL.Lib.Elements){
	load("./src/elements.js");
}
if (!CSL.Lib.Elements.names){
	load("./src/libnames.js");
}
if (!CSL.Lib.Attributes){
	load("./src/attributes.js");
}
if (!CSL.System){
	load("./src/system.js");
}
if (!CSL.System.Xml){
	load("./src/xml.js");
}
if (!CSL.System.Xml.E4X){
	load("./src/xmle4x.js");
}
if (!CSL.Factory){
	load("./src/factory.js");
}
if (!CSL.Factory.Stack){
	load("./src/stack.js");
}
if (!CSL.Factory.Token){
	load("./src/token.js");
}
if (!CSL.Factory.AmbigConfig){
	load("./src/ambigconfig.js");
}
if (!CSL.Factory.Blob){
	load("./src/blob.js");
}
if (!CSL.Util){
	load("./src/util.js");
}
if (!CSL.Util.Names){
	load("./src/util_names.js");
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
	load("./src/util_mangle_number.js");
}
if (!CSL.Util.PageRangeMangler){
	load("./src/util_mangle_page.js");
}
if (!CSL.Util.FlipFlopper){
	load("./src/util_flipflop.js");
}
if (!CSL.Output){
	load("./src/output.js");
}
if (!CSL.Output.Number){
	load("./src/range.js");
}
if (!CSL.Output.Formatters){
	load("./src/formatters.js");
}
if (!CSL.Output.Formats){
	load("./src/formats.js");
}
if (!CSL.Output.Queue){
	load("./src/queue.js");
}
if (!CSL.Factory.Registry){
	load("./src/registry.js");
}
if (!CSL.Factory.Registry.prototype.NameReg){
	load("./src/namereg.js");
}
if (!CSL.Factory.Registry.prototype.disambiguateCites){
	load("./src/disambiguate.js");
}

//SNIP-END
