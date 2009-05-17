dojo.provide("csl.state");
if (!CSL) {
	load("./src/csl.js");
}

/**
 * State object for storing options and tokens.
 * <p>A container for objects passed between functions
 * during processing.</p>
 * @param {Class} xmlCommandInterface The appropriate
 * XML DOM interface class from {@link CSL.System.Xml}.
 * @class
 * @param {XML} xml A parsed XML object or XMLList.
 */
CSL.Core.Engine = function (xmlCommandInterface,nodelist){
	this.init = new Array();
	this.stop = new Array();
	/**
	 * Global options.
	 * <p>Available in Render.</p>
	 */
	this.opt = new Object();
	/**
	 * Scratch variables and stacks.
	 * <p>Available in Render.</p>
	 */
	this.tmp = new Object();
	/**
	 * Generic functions.
	 * <p>Available in Render.</p>
	 */
	this.fun = new Object();
	this.fun.retriever = new CSL.System.Retrieval.GetInput();
	/**
	 * Build-time scratch area.
	 * <p>Discarded after Build is complete.</p>
	 */
	this.build = new Object();
	/**
	 * Alternate et-al term
	 * <p>Holds the localization key of the alternative term
	 * to be used for et-al in a names environment.  Reduced
	 * to a term object when the element tag is processed during
	 * Build.</p>
	 */
	this.build["alternate-term"] = false;
	/**
	 * Configure-time scratch area.
	 * <p>Discarded after Configure is complete.</p>
	 */
	this.configure = new Object();
	/**
	 * Item registry.
	 * <p>A persistent item registry.  Each cite
	 * item is registered here before its first
	 * rendering. The registry can be queried for
	 * sort order information (for producing
	 * bibliographies) and for disambiguation
	 * hints (needed for producing citations
	 * in all styles, and for bibliographies in
	 * many styles).  This registry does not
	 * carry all details of a citation; only the
	 * essential details needed to establish
	 * sort order and determine disambiguation
	 * handling is held here.
	 */
	// XXXXX MOVED to build.js.  Registry now installed
	// after initial build phase, so that comparison
	// function can be instantiated with sort key
	// configuration derived from initial token scan.
	//
	// this.registry = new CSL.Factory.Registry();
	//
	/**
	 * Citation area.
	 * <p>Holds the options and token list for the style
	 * citation format (the form of a reference to be
	 * used in the body of a document).</p>
	 */
	this.citation = new Object();
	/**
	 * Citation options area.
	 * <p>Holds a mixture of persistent and ephemeral
	 * options and scratch data used during processing of
	 * a citation.</p>
	 */
	this.citation.opt = new Object();
	this.citation.tokens = new Array();
	/**
	 * Bibliography area.
	 * <p>Holds the options and token list for the
	 * style bibliography entry format (the form of
	 * a source reference to be used in a bibliography
	 * included in a document).</p>
	 */
	this.bibliography = new Object();
	/**
	 * Bibliography options area.
	 * <p>Holds a mixture of persistent and ephemeral
	 * options and scratch data used during processing of
	 * a bibliography.</p>
	 */
	this.bibliography.opt = new Object();
	this.bibliography.tokens = new Array();
	/**
	 * Default values.
	 * <p>The various et-al values are set globally,
	 * and the appropriate value is set by the names start
	 * tag at runtime, depending on whether the Item is a
	 * first or a subsequent reference.</p>
	 */
	this.citation.opt["et-al-min"] = 0;
	this.citation.opt["et-al-use-first"] = 1;
	this.citation.opt["et-al-subsequent-min"] = false;
	this.citation.opt["et-al-subsequent-use-first"] = false;

	this.bibliography.opt["et-al-min"] = 0;
	this.bibliography.opt["et-al-use-first"] = 1;
	this.bibliography.opt["et-al-subsequent-min"] = 0;
	this.bibliography.opt["et-al-subsequent-use-first"] = 1;
	/**
	 * Bibliography sort area.
	 * <p>Holds the options and token list for the
	 * style bibliography sort key format.</p>
	 */
	this.bibliography_sort = new Object();
	this.citation_sort = new Object();
	/**
	 * Sort options area.
	 * <p>Holds a mixture of persistent and ephemeral
	 * options and scratch data used during processing of
	 * a bibliography.</p>
	 */
	//
	// XXXXX Hmm.  This needs to be subdivided, with
	// separate rendering areas for each key.  Should
	// permit an arbitrary number of keys, so the whole
	// structure needs to be generated programmatically.
	// Either that, or (MUCH more sensible!) wrap the
	// rendering tokens in a key element that stores the
	// strings separately.  Ah, that's much better.
	// So the key element will not be a noop.

	this.bibliography_sort.tokens = new Array();
	this.bibliography_sort.opt = new Object();
	this.bibliography_sort.opt.sort_directions = new Array();
	this.bibliography_sort.keys = new Array();

	this.citation_sort.tokens = new Array();
	this.citation_sort.opt = new Object();
	this.citation_sort.opt.sort_directions = new Array();
	this.citation_sort.keys = new Array();

	//
	// the language setting will not be needed for processing,
	// but the compiled object should be able to report it.
	this.opt.lang = false;
	//
	// terms are needed globally for rendering, so this
	// is saved into opt.
	this.opt.term = new Object();
	//
	// configuration array to hold the collapse
	// options, if any.
	this.citation.opt.collapse = new Array();
	this.bibliography.opt.collapse = new Array();
	//
	// disambiguate options
	this.citation.opt["disambiguate-add-names"] = false;
	this.citation.opt["disambiguate-add-givenname"] = false;
	this.bibliography.opt["disambiguate-add-names"] = false;
	this.bibliography.opt["disambiguate-add-givenname"] = false;
	//
	// scratch variable to display the total
	// number of names in all rendered variables
	// in a cite.  initialized to zero by the
	// citation element, incremented by each
	// name variable actually rendered
	this.tmp.names_max = new CSL.Factory.Stack();
	this.tmp.names_base = new CSL.Factory.Stack();
	this.tmp.givens_base = new CSL.Factory.Stack();

	//
	// flags that we are in the bibliography area.
	// used by sort.
	this.build.in_bibliography = false;
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
	this.tmp.disambig_request = false;
	//
	// scratch variable to toggle an attempt to set a
	// name in sort order rather than display
	// order.
	this.tmp["name-as-sort-order"] = false;
	//
	// suppress decorations (used for generating
	// sort keys and disambiguation keys)
	this.tmp.suppress_decorations = false;
	//
	// empty settings array, used to report settings used
	// if disambig_request is not set at runtime
	this.tmp.disambig_settings = new CSL.Factory.AmbigConfig();
	//
	// sort key array
	this.tmp.bib_sort_keys = new Array();
	//
	// holds the prefix between the start of a group
	// and the closing token.
	this.tmp.prefix = new CSL.Factory.Stack("",CSL.LITERAL);
	//
	// holds the suffix between the start of a group
	// and the closing token.
	this.tmp.suffix = new CSL.Factory.Stack("",CSL.LITERAL);
	//
	// holds the group delimiter between the start of a group
	// and the closing token.
	this.tmp.delimiter = new CSL.Factory.Stack("",CSL.LITERAL);
	//
	// reinitialize scratch variables used by names
	this.fun.names_reinit = CSL.Util.Names.reinit;
	//
	// reduce a name to an initial.
	this.fun.initialize_with = CSL.Util.Names.initialize_with;
	//
	// "deep" copy of nested array in very specific format
	this.fun.clone_ambig_config = CSL.Factory.cloneAmbigConfig;
	//
	// scratch stack containing initialize-with strings or null values
	this.tmp.initialize_with = new CSL.Factory.Stack();
	//
	// return a common term iff namesets are all identical
	// and a common term for them exists
	this.fun.get_common_term = CSL.Util.Names.getCommonTerm;
	//
	// utility to get standard suffixes for disambiguation
	this.fun.suffixator = new CSL.Util.Disambiguate.Suffixator(CSL.SUFFIX_CHARS);
	this.fun.romanizer = new CSL.Util.Disambiguate.Romanizer();
	//
	// flip-flopper for inline markup
	this.fun.flipflopper = new CSL.Util.FlipFlopper();
	//
	// token store stack.
	this.tmp.tokenstore_stack = new CSL.Factory.Stack();

	this.tmp.name_quash = new Object();
	//
	// for collapsing
	this.tmp.last_suffix_used = "";
	this.tmp.last_names_used = new Array();
	this.tmp.last_years_used = new Array();
	this.tmp.years_used = new Array();
	this.tmp.names_used = new Array();
	this.splice_delimiter = false;
	//
	// substituting flag.  triggers creation of a special conditional
	// wrapper around text tags when in force.
	this.tmp.names_substituting = false;
	//
	// counter for total namesets
	this.tmp.nameset_counter = 0;
	//
	// function to mark output.  used to satisfy requirement
	// that terms cannot render by themselves unless no
	// attempt has been made to render a non-term variable
	// within the same group or citation.
	this.fun.mark_output = CSL.Factory.mark_output;
	//
	// stack flag used for term handling.  Set to true
	// if at least one variable has tried to render, and
	// no variables had content.
	this.tmp.term_sibling = new CSL.Factory.Stack( undefined, CSL.LITERAL);
	//
	// boolean flag used to control first-letter capitalization
	// of terms.  Set to true if any item preceding the term
	// being handled has rendered successfully, otherwise
	// false.
	this.tmp.term_predecessor = false;
	//
	// stack flag used to control jumps in the closing
	// token of a conditional.
	this.tmp.jump = new CSL.Factory.Stack(0,CSL.LITERAL);
	//
	// holds string parameters for group formatting, between
	// the start of a group and the closing token.
	this.tmp.decorations = new CSL.Factory.Stack();
	//
	// decorate contains font and formatting functions
	// that are fixed during configure and used during
	// render
	this.fun.decorate = false;
	//
	// scratch variable to flag whether we are processing
	// a citation or a bibiliography.  this diverts token and
	// configuration to the appropriateo objects inside
	// state.  the default is "citation".
	this.tmp.area = "citation";
	//
	// should be able to run uninitialized; may attract some
	// cruft this way.
	this.build.area = "citation";
	//
	// this holds the field values collected by the @value
	// and @variable attributes, for processing by the
	// element functions.
	this.tmp.value = new Array();
	/**
	 * Object to hold the decorations declared by a name-part
	 * element.
	 */
	this.tmp.namepart_decorations = new Object();
	/**
	 * String variable to hold the type of a name-part
	 * element.
	 */
	this.tmp.namepart_type = false;
	/**
	 * Output queue.
	 * <p>A special list stack for the final collation
	 * and output of strings.</p>
	 */
	this.output = new CSL.Output.Queue(this);
	//
	// the fail and succeed arrays are used for stack
	// processing during configure.
	this.configure.fail = new Array();
	this.configure.succeed = new Array();
	//
	// We're not going to need this after the first phase
	this.build.xmlCommandInterface = xmlCommandInterface;
	//
	// stores the content of an XML text node during processing
	this.build.text = false;
	//
	// this is a scratch variable for holding an attribute
	// value during processing
	this.build.lang = false;
	//
	// this holds the class of the style (w/bib, author-date)
	this.opt["class"] = false;
	//
	// scratch variable to alter behaviour when processing
	// locale files
	this.build.in_style = false;
	//
	// used to ignore info
	this.build.skip = false;
	//
	// the macro ATTRIBUTE stores a macro name on this
	// scratch variable anywhere outside the layout area
	// during build.  The macro name is picked up when
	// the token is encountered inside the layout area,
	// either through a direct call, or as part of a nested
	// macro expansion, and the macro content is exploded
	// into the token list.
	this.build.postponed_macro = false;
	//
	// used especially for controlling macro expansion
	// during Build.
	this.build.layout_flag = false;
	//
	// (was stack.buffer)
	// this is a stack for collecting child tokens
	// during processing of macro ELEMENTS and locale
	// term ELEMENTS.
	this.build.children = new Array();
	//
	// (was buffer_name)
	// scratch variable to hold the name of a macro
	// or a term until its children have been collected.
	this.build.name = false;
	//
	// scratch variable to hold the value of a form
	// attribute until other attributes needed for
	// processing have been collected.
	this.build.form = false;
	this.build.term = false;
	//
	// the macros themselves are discarded after Build
	this.build.macro = new Object();
	//
	// the macro build stack.  used to raise an error
	// when macros would attempt to call themselves.
	this.build.macro_stack = new Array();
	//
	// XML-wise node navigation is needed only during Build.
	this.build.nodeList = new Array();
	this.build.nodeList.push([0, nodelist]);
};
