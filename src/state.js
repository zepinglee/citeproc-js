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
dojo.provide("csl.state");


CSL.Engine.Opt = function (){
	this.has_disambiguate = false;
	this.mode = "html";
	this.dates = new Object();
	this["locale-sort"] = false;
	this["locale-primary"] = false;
	this["locale-secondary"] = false;
};


CSL.Engine.Tmp = function (){
	//
	// scratch variable to display the total
	// number of names in all rendered variables
	// in a cite.  initialized to zero by the
	// citation element, incremented by each
	// name variable actually rendered
	this.names_max = new CSL.Factory.Stack();
	this.names_base = new CSL.Factory.Stack();
	this.givens_base = new CSL.Factory.Stack();
	//
	// this holds the field values collected by the @value
	// and @variable attributes, for processing by the
	// element functions.
	this.value = new Array();
	/**
	 * Object to hold the decorations declared by a name-part
	 * element.
	 */
	this.namepart_decorations = new Object();
	/**
	 * String variable to hold the type of a name-part
	 * element.
	 */
	this.namepart_type = false;
	//
	// scratch variable to flag whether we are processing
	// a citation or a bibiliography.  this diverts token and
	// configuration to the appropriateo objects inside
	// state.  the default is "citation".
	this.area = "citation";
	//
	// controls the implicit conditional wrappers applied
	// to top-level elements inside a names substitute span.
	// false by default, names start tag pushes a new true level,
	// names end tag pops it.  Output value check in @variable
	// function of attributes.js sets level to false.  closing names
	// tag maps a false value to superior level.
	this.can_substitute = new CSL.Factory.Stack( 0, CSL.LITERAL);
	//
	// notes whether the formatted elements of a date span
	// rendered anything.  controls whether literal fallback
	// is used.
	this.element_rendered_ok = false;
	//
	// element_trace keeps a record of rendered elements.
	// used to implement author-only.
	//
	this.element_trace = new CSL.Factory.Stack("style");
	//
	// counter for total namesets
	this.nameset_counter = 0;
	//
	/////  this.fun.check_for_output = CSL.Factory.check_for_output;
	//
	// stack flag used for term handling.  Set to true
	// if at least one variable has tried to render, and
	// no variables had content.
	this.term_sibling = new CSL.Factory.Stack( undefined, CSL.LITERAL);
	//
	// boolean flag used to control first-letter capitalization
	// of terms.  Set to true if any item preceding the term
	// being handled has rendered successfully, otherwise
	// false.
	this.term_predecessor = false;
	//
	// stack flag used to control jumps in the closing
	// token of a conditional.
	this.jump = new CSL.Factory.Stack(0,CSL.LITERAL);
	//
	// holds string parameters for group formatting, between
	// the start of a group and the closing token.
	this.decorations = new CSL.Factory.Stack();
	//
	// token store stack.
	this.tokenstore_stack = new CSL.Factory.Stack();

	// XXXXX: superceded
	// this.name_quash = new Object();
	//
	// for collapsing
	this.last_suffix_used = "";
	this.last_names_used = new Array();
	this.last_years_used = new Array();
	this.years_used = new Array();
	this.names_used = new Array();
	//
	// scratch stack containing initialize-with strings or null values
	this.initialize_with = new CSL.Factory.Stack();
	//
	// this is used to set a requested set of
	// disambiguation parameters in the output.
	// for the array elements, the base array
	// (either zero for each nameset, or full-up
	// if givens are already used) is set
	// during names processing, if no value
	// is set in the processor before a rendering
	// run.  to simplify things for the calling
	// function, these are just bog-standard arrays,
	// and can be safely overwritten.
	this.disambig_request = false;
	//
	// scratch variable to toggle an attempt to set a
	// name in sort order rather than display
	// order.
	this["invert-name"] = false;
	//
	// suppress decorations (used for generating
	// sort keys and disambiguation keys)
	this.suppress_decorations = false;
	//
	// empty settings array, used to report settings used
	// if disambig_request is not set at runtime
	this.disambig_settings = new CSL.Factory.AmbigConfig();
	//
	// sort key array
	this.bib_sort_keys = new Array();
	//
	// holds the prefix between the start of a group
	// and the closing token.
	this.prefix = new CSL.Factory.Stack("",CSL.LITERAL);
	//
	// holds the suffix between the start of a group
	// and the closing token.
	this.suffix = new CSL.Factory.Stack("",CSL.LITERAL);
	//
	// holds the group delimiter between the start of a group
	// and the closing token.
	this.delimiter = new CSL.Factory.Stack("",CSL.LITERAL);
};


CSL.Engine.Fun = function (){
	//
	// matcher
	this.match = new  CSL.Util.Match();
	//
	// utility to get standard suffixes for disambiguation
	this.suffixator = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
	//
	// utility to romanize a numeric value
	this.romanizer = new CSL.Util.Romanizer();
	//
	// utility to make an ordinal form of a number
	this.ordinalizer = new CSL.Util.Ordinalizer();
	//
	// utility to make the long ordinal form of a number, if possible
	this.long_ordinalizer = new CSL.Util.LongOrdinalizer();
};


CSL.Engine.Build = function (){
	/**
	 * Alternate et-al term
	 * <p>Holds the localization key of the alternative term
	 * to be used for et-al in a names environment.  Reduced
	 * to a term object when the element tag is processed during
	 * Build.</p>
	 */
	this["alternate-term"] = false;
	//
	// flags that we are in the bibliography area.
	// used by sort.
	this.in_bibliography = false;
	//
	// scratch variable to alter behaviour when processing
	// locale files
	this.in_style = false;
	//
	// used to ignore info
	this.skip = false;
	//
	// the macro ATTRIBUTE stores a macro name on this
	// scratch variable anywhere outside the layout area
	// during build.  The macro name is picked up when
	// the token is encountered inside the layout area,
	// either through a direct call, or as part of a nested
	// macro expansion, and the macro content is exploded
	// into the token list.
	this.postponed_macro = false;
	//
	// used especially for controlling macro expansion
	// during Build.
	this.layout_flag = false;
	//
	// (was buffer_name)
	// scratch variable to hold the name of a macro
	// or a term until its children have been collected.
	this.name = false;
	//
	// scratch variable to hold the value of a form
	// attribute until other attributes needed for
	// processing have been collected.
	this.form = false;
	this.term = false;
	//
	// the macros themselves are discarded after Build
	this.macro = new Object();
	//
	// the macro build stack.  used to raise an error
	// when macros would attempt to call themselves.
	this.macro_stack = new Array();
	//
	// stores the content of an XML text node during processing
	this.text = false;
	//
	// this is a scratch variable for holding an attribute
	// value during processing
	this.lang = false;
	//
	// should be able to run uninitialized; may attract some
	// cruft this way.
	this.area = "citation";
	//
	// controls the application of implicit conditional wrappers
	// to top-level elements inside a names substitute span.
	// zero by default, build of names tag pushes a
	// new level with value 1.  group start tag increments by 1,
	// group end tag decrements by 1.  conditional wrappers are
	// only applied if value is exactly 1.
	this.substitute_level = new CSL.Factory.Stack( 0, CSL.LITERAL);
	this.render_nesting_level = 0;
	this.render_seen = false;
};


CSL.Engine.Configure = function (){
	//
	// the fail and succeed arrays are used for stack
	// processing during configure.
	this.fail = new Array();
	this.succeed = new Array();
};


CSL.Engine.Citation = function (){
	/**
	 * Citation options area.
	 * <p>Holds a mixture of persistent and ephemeral
	 * options and scratch data used during processing of
	 * a citation.</p>
	 */
	this.opt = new Object();
	this.tokens = new Array();
	/**
	 * Default values.
	 * <p>The various et-al values are set globally,
	 * and the appropriate value is set by the names start
	 * tag at runtime, depending on whether the Item is a
	 * first or a subsequent reference.</p>
	 */
	this.opt["et-al-min"] = 0;
	this.opt["et-al-use-first"] = 1;
	this.opt["et-al-subsequent-min"] = false;
	this.opt["et-al-subsequent-use-first"] = false;
	//
	// configuration array to hold the collapse
	// options, if any.
	this.opt.collapse = new Array();
	//
	// disambiguate options
	this.opt["disambiguate-add-names"] = false;
	this.opt["disambiguate-add-givenname"] = false;
	this.opt["near-note-distance"] = 5;
};


CSL.Engine.Bibliography = function (){
	/**
	 * Bibliography options area.
	 * <p>Holds a mixture of persistent and ephemeral
	 * options and scratch data used during processing of
	 * a bibliography.</p>
	 */
	this.opt = new Object();
	this.tokens = new Array();

	/**
	 * Default values.
	 * <p>The various et-al values are set globally,
	 * and the appropriate value is set by the names start
	 * tag at runtime, depending on whether the Item is a
	 * first or a subsequent reference.</p>
	 */
	this.opt["et-al-min"] = 0;
	this.opt["et-al-use-first"] = 1;
	this.opt["et-al-subsequent-min"] = 0;
	this.opt["et-al-subsequent-use-first"] = 1;

	this.opt.collapse = new Array();
	this.opt["disambiguate-add-names"] = false;
	this.opt["disambiguate-add-givenname"] = false;
};


CSL.Engine.BibliographySort = function (){
	this.tokens = new Array();
	this.opt = new Object();
	this.opt.sort_directions = new Array();
	this.keys = new Array();
};


CSL.Engine.CitationSort = function (){
	this.tokens = new Array();
	this.opt = new Object();
	this.opt.sort_directions = new Array();
	this.keys = new Array();
};
