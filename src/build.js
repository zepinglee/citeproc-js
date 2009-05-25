dojo.provide("csl.build");


/**
 * First-stage compiler.
 * <p>After instantiation, this object provides a method
 * for creating the tokenized representation of the style
 * used in onward processing.  Note that an alternative
 * to the default E4X parser for XML may be specified
 * when the object is instantiated.  The comment to
 * {@link CSL} provides an overview of the processing flow.</p>
 * @param {String} stylexml A serialized CSL style definition in
 * XML format.
 * @param {String} xmlLingo XML processor to use for parsing.
 * Parsers are defined in the {@link CSL.System.Xml} namespace.
 * @example
 * builder = Build(myxml)
 * @example
 * builder = Build(myxml,"JQuery")
 * @example
 * builder = CSL.Core.Build(myxml);
 * raw_engine = builder.build();
 *
 * @class Raw style generator.
 */
CSL.Core.Build = function(stylexml,xmlLingo) {
	this._builder = _builder;
    this.showXml = showXml; // for testing
	this._getNavi = _getNavi; // exposed for testing
	if (!xmlLingo){
	    //xmlLingo = "JunkyardJavascript";
	    xmlLingo = "E4X";
	}
	var xmlParser = CSL.System.Xml[xmlLingo];
	var xml = xmlParser.parse(stylexml);

	var xmlCommandInterface = CSL.System.Xml[xmlLingo].commandInterface;
	var state = new CSL.Core.Engine(xmlCommandInterface,xml);
	this.state = state;

	/*
	 * First-stage build function.
	 *
	 * This function performs a
	 * depth-first walk of an XML tree, using wrapper functions
	 * drawn from {@link CSL.System.Xml}. This _builder function controls
	 * the recursion loop. Navigation and action-points during the
	 * walk are peformed by an instance of {@link CSL.Core.Build._getNavi}
	 * (see below).
	 *
	 * @param {Object} state An instance of the {@link CSL.Core.Engine}
	 * object, configured with a parsed XML object and a
	 * corresponding set of wrapper functions for manipulating
	 * it.
	 */
	function _builder(state){
		this._build = _build; // exposed for testing
		this.navi = navi; // exposed for testing
		this.getObject = getObject;
		var nodelist = state.build.nodeList;
		var navi = new _getNavi(state);
		function _build(){ // used to accept nodelist as arg
			if (navi.getkids()){
				_build(navi.getXml());
			} else {
				if (navi.getbro()){
					_build(navi.getXml());
				} else {
					while (state.build.nodeList.length > 1) {
						if (navi.remember()){
							_build(navi.getXml());
						}
					}
				}
			}
			return state;
		}
		function getObject(){
			// These startup loops are too complex
			var state = this._build(); // used to have nodelist as arg
			return state;
		}
	};

	/*
	 * Navigation and action for XML tree walk.
	 *
	 * This function performs the three navigation
	 * actions needed for a depth-first tree walk (find
	 * children, find sibling, retrace to parent), and
	 * builds a token list by applying {@link CSL.Factory.XmlToToken}
	 * to the appropriate nodes.
	 *
	 * @param {Object} state The freshly minted state object
	 * from {@link CSL.Core.Engine} that will represent the style.
	 */
	function _getNavi(state){
		this.getkids = getkids;
		this.getbro = getbro;
		this.remember = remember;
		this.getXml = getXml;
		var depth = 0;
		this.depth = depth;

		function remember(){
			depth += -1;
			state.build.nodeList.pop();
			// closing node, process result of children
			var node = state.build.nodeList[depth][1][(state.build.nodeList[depth][0])];
			CSL.Factory.XmlToToken.call(node,state,CSL.END);
			return getbro();
		}
		function getbro(){
			var sneakpeek = state.build.nodeList[depth][1][(state.build.nodeList[depth][0]+1)];
			if (sneakpeek){
				state.build.nodeList[depth][0] += 1;
				return true;
			} else {
				return false;
			}
		}

		function getkids (){
			var currnode = state.build.nodeList[depth][1][state.build.nodeList[depth][0]];
			var sneakpeek = state.build.xmlCommandInterface.children.call(currnode);
			if (state.build.xmlCommandInterface.numberofnodes.call(sneakpeek) == 0){
				// singleton, process immediately
				CSL.Factory.XmlToToken.call(currnode,state,CSL.SINGLETON);
				return false;
			} else {
				// if first node of a span, process it, then descend
				CSL.Factory.XmlToToken.call(currnode,state,CSL.START);
				depth += 1;
				state.build.nodeList.push([0,sneakpeek]);

				return true;
			}
		}

		function getXml(){
			return state.build.nodeList[depth][1];
		}
	}

	/*
	 * Expose tokens for testing.
	 */
	function showXml(){
		return xml;
	}

};


/**
 * Tokenize the CSL style.
 * <p>This method casts a CSL style file as a state
 * object with the properties listed below (see the
 * code of {@link CSL.Core.Engine} for more
 * particulars on the sub-fields inside this object).  The state
 * object is passed to {@link CSL.Core.Configure} for the final
 * preparation of the style engine.</p>
 * <dl class="properties">
 * <dt>build</dt>
 * <dd>Holds scratch variables and
 * stacks used during the first stage of compilation,
 * including the XML command interface wrapper.
 * This area is deleted after the Build phase is complete.
 * </dd>
 * <dt>configure</dt>
 * <dd>Holds stacks used when setting
 * jump points on tokens during the second stage of
 * compilation.  This area is deleted after the Configure
 * phase is complete.
 * </dd>
 * <dt>registry</dt>
 * <dd>Persistent item registry providing bibliography
 * sort order and disambiguated title hints for use by
 * rendering functions.</dd>
 * <dt>opt</dt>
 * <dd>Holds global configuration options,
 * the hash of localized terms, and output rendering
 * functions.  It also contains scratch variables used
 * to pass state information from an opening tag and its children
 * to the relevant closing tag.
 * </dd>
 * <dt>citation</dt>
 * <dd>Holds the token list and output
 * queue for the <code>&lt;citation&gt;</code> object defined in the CSL
 * style file.
 *   <dl class="properties">
 *   <dt>tokens</dt>
 *   <dd>The token list representing the citation definition
 *   of the style.</dd>
 *   <dt>opt</dt>
 *   <dd>Holds the output queue
 *   (<code>formatted</code>) for this formatting area,
 *   and configuration options specific to <code>&lt;citation&gt;</code>.</dd>
 *   </dl>
 * </dd>
 * <dt>bibliography</dt>
 * <dd>Holds the token list and output
 * queue for the <code>&lt;bibliography&gt;</code> object defined in CSL.
 *   <dl class="properties">
 *   <dt>tokens</dt>
 *   <dd>The token list representing the bibliography definition
 *   of the style.</dd>
 *   <dt>opt</dt>
 *   <dd>Holds the output queue
 *   (<code>formatted</code>) and configuration options specific
 *   to <code>&lt;bibliography&gt;</code>.</dd>
 *   </dl>
 * </dd>
 * <dt>citation-sortkey</dt>
 * <dd>Holds the token list and output
 * queue for the <code>&lt;sort&gt;</code> object (if any) defined in
 * the CSL <code>&lt;citation&gt;</code> object.  This is
 * called by, and the keys are registered in, the persistent
 * item registry.
 *   <dl class="properties">
 *   <dt>tokens</dt>
 *   <dd>The token list representing the sort key definition.</dd>
 *   <dt>opt</dt>
 *   <dd>Holds the output queue
 *   (<code>formatted</code>) and configuration options specific
 *   to sort key generation.  This should suppress all output
 *   decorations, supplying only a plain text string for use
 *   as the item sort key.</dd>
 *   </dl>
 * </dd>
 * <dt>bibliography-sortkey</dt>
 * <dd>Holds the token list and output
 * queue for the <code>&lt;sort&gt;</code> object (if any) defined in
 * the CSL <code>&lt;bibliography&gt;</code> object.  This is
 * called by, and the keys are registered in, the persistent
 * item registry.
 *   <dl class="properties">
 *   <dt>tokens</dt>
 *   <dd>The token list representing the sort key definition.</dd>
 *   <dt>opt</dt>
 *   <dd>Holds the output queue
 *   (<code>formatted</code>) and configuration options specific
 *   to sort key generation.  This should suppress all output
 *   decorations, supplying only a plain text string for use
 *   as the item sort key.</dd>
 *   </dl>
 * </dd>
 * </dl>
 * @function
 */
CSL.Core.Build.prototype.build = function(sys,locale){
	this.state.sys = sys;
	this.state.opt.locale = locale;
	var engine = new this._builder(this.state);
	var ret = engine.getObject();
	ret.registry = new CSL.Factory.Registry(ret);
	return ret;
};
