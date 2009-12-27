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
CSL.localeResolve = function(langstr){
	var ret = new Object();
	if ("undefined" == typeof langstr){
		langstr = "en_US";
	};
	var langlst = langstr.split(/[-_]/);
	ret.base = CSL.LANG_BASES[langlst[0]];
	if (langlst.length == 1 || langlst[1] == "x"){
		ret.best = ret.base.replace("_","-");
	} else {
		ret.best = langlst.slice(0,2).join("-");
	};
	ret.bare = langlst[0];
	return ret;
};

//
// XXXXX: Got it.  The locales objects need to be reorganized,
// with a top-level local specifier, and terms, opts, dates
// below.
//
CSL.localeSet = function(sys,myxml,lang_in,lang_out){

	lang_in = lang_in.replace("_","-");
	lang_out = lang_out.replace("_","-");

	if (!this.locale[lang_out]){
		this.locale[lang_out] = new Object();
		this.locale[lang_out].terms = new Object();
		this.locale[lang_out].opts = new Object();
		this.locale[lang_out].dates = new Object();
	}
	//
	// Xml: Test if node is "locale" (nb: ns declarations need to be invoked
	// on every access to the xml object; bundle this with the functions
	//
	var locale = sys.xml.makeXml();
	if (sys.xml.nodeNameIs(myxml,'locale')){
		locale = myxml;
	} else {
		//
		// Xml: get a list of all "locale" nodes
		//
		for each (var blob in sys.xml.getNodesByName(myxml,"locale")){
			//
			// Xml: get locale xml:lang
			//
			if (sys.xml.getAttributeValue(blob,'lang','xml') == lang_in){
				locale = blob;
				break;
			}
		}
	}
	//
	// Xml: get a list of term nodes within locale
	//

	for each (var term in sys.xml.getNodesByName(locale,'term')){
		//
		// Xml: get string value of attribute
		//
		var termname = sys.xml.getAttributeValue(term,'name');
		if ("undefined" == typeof this.locale[lang_out].terms[termname]){
			this.locale[lang_out].terms[termname] = new Object();
		};
		var form = "long";
		//
		// Xml: get string value of attribute
		//
		if (sys.xml.getAttributeValue(term,'form')){
			form = sys.xml.getAttributeValue(term,'form');
		}
		//
		// Xml: test of existence of node
		//
		if (sys.xml.getNodesByName(term,'multiple').length()){
			this.locale[lang_out].terms[termname][form] = new Array();
			//
			// Xml: get string value of attribute, plus
			// Xml: get string value of node content
			//
			this.locale[lang_out].terms[sys.xml.getAttributeValue(term,'name')][form][0] = sys.xml.getNodeValue(term,'single');
			//
			// Xml: get string value of attribute, plus
			// Xml: get string value of node content
			//
			this.locale[lang_out].terms[sys.xml.getAttributeValue(term,'name')][form][1] = sys.xml.getNodeValue(term,'multiple');
		} else {
			//
			// Xml: get string value of attribute, plus
			// Xml: get string value of node content
			//
			this.locale[lang_out].terms[sys.xml.getAttributeValue(term,'name')][form] = sys.xml.getNodeValue(term);
		}
	}
	//
	// Xml: get list of nodes by node type
	//
	for each (var styleopts in sys.xml.getNodesByName(locale,'style-options')){
		//
		// Xml: get list of attributes on a node
		//
		for each (var attr in sys.xml.attributes(styleopts) ) {
			//
			// Xml: get string value of attribute
			//
			if (sys.xml.getNodeValue(attr) == "true"){
				//
				// Xml:	get local name of attribute
				//
				this.locale[lang_out].opts[sys.xml.nodename(attr)] = true;
			} else {
				this.locale[lang_out].opts[sys.xml.nodename(attr)] = false;
			};
		};
	};
	//
	// Xml: get list of nodes by type
	//
	for each (var date in sys.xml.getNodesByName(locale,'date')){
		//
		// Xml: get string value of attribute
		//
		this.locale[lang_out].dates[ sys.xml.getAttributeValue( date, "form") ] = date;
	};
};

