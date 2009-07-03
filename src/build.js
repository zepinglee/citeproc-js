dojo.provide("csl.build");


CSL.Engine = function(sys,style,lang) {
	this.sys = sys;
	if ("string" != typeof style){
		style = "";
	}
	this.opt = new CSL.Engine.Opt();
	this.tmp = new CSL.Engine.Tmp();
	this.build = new CSL.Engine.Build();
	this.fun = new CSL.Engine.Fun();
	this.configure = new CSL.Engine.Configure();
	this.citation = new CSL.Engine.Citation();
	this.citation_sort = new CSL.Engine.CitationSort();
	this.bibliography = new CSL.Engine.Bibliography();
	this.bibliography_sort = new CSL.Engine.BibliographySort();

	this.output = new CSL.Output.Queue(this);

	this.cslXml = this.sys.makeXml(style);
	//
	// implicit default, "en"
	this.sys.setLocaleXml();
	if (lang){
		this.sys.setLocaleXml(lang);
	} else {
		lang = "en";
	}
	this.opt.lang = lang;
	this.sys.setLocaleXml( this.cslXml, lang );
	this.locale_terms = this.sys.locale_terms;
	this._buildTokenLists("citation");
	this._buildTokenLists("bibliography");

	this.configureTokenLists(this.citation.tokens);

	this.registry = new CSL.Factory.Registry(this);

	this.splice_delimiter = false;

	this.setOutputFormat("html");
};


CSL.Engine.prototype._buildTokenLists = function(area){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	//default xml namespace = "http://purl.org/net/xbiblio/csl";
	var area_nodes = this.cslXml[area];
	if (!area_nodes.toString()){
		//print("NO AREA NODES");
		return;
	};
	var navi = new this._getNavi( this, area_nodes );
	this.build.area = area;
	this._build(navi);
};


CSL.Engine.prototype._build  = function(navi){
	if (navi.getkids()){
		this._build(navi);
	} else {
		if (navi.getbro()){
			this._build(navi);
		} else {
			while (navi.nodeList.length > 1) {
				if (navi.remember()){
					this._build(navi);
				}
			}
		}
	}
};


CSL.Engine.prototype._getNavi = function(state,myxml){
	this.sys = state.sys;
	this.state = state;
	this.nodeList = new Array();
	this.nodeList.push([0, myxml]);
	this.depth = 0;
};


CSL.Engine.prototype._getNavi.prototype.remember = function(){
	this.depth += -1;
	this.nodeList.pop();
	// closing node, process result of children
	var node = this.nodeList[this.depth][1][(this.nodeList[this.depth][0])];
	CSL.Factory.XmlToToken.call(node,this.state,CSL.END);
	return this.getbro();
};


CSL.Engine.prototype._getNavi.prototype.getbro = function(){
	var sneakpeek = this.nodeList[this.depth][1][(this.nodeList[this.depth][0]+1)];
	if (sneakpeek){
		this.nodeList[this.depth][0] += 1;
		return true;
	} else {
		return false;
	}
};


CSL.Engine.prototype._getNavi.prototype.getkids = function(){
	var currnode = this.nodeList[this.depth][1][this.nodeList[this.depth][0]];
	var sneakpeek = this.sys.xml.children(currnode);
	//var sneakpeek = currnode.children();
	if (this.sys.xml.numberofnodes(sneakpeek) == 0){
		// singleton, process immediately
		CSL.Factory.XmlToToken.call(currnode,this.state,CSL.SINGLETON);
		return false;
	} else {
		// if first node of a span, process it, then descend
		CSL.Factory.XmlToToken.call(currnode,this.state,CSL.START);
		this.depth += 1;
		this.nodeList.push([0,sneakpeek]);
		return true;
	}
};


CSL.Engine.prototype._getNavi.prototype.getNodeListValue = function(){
	return this.nodeList[this.depth][1];
};

CSL.Engine.prototype.setOutputFormat = function(mode){
	this.opt.mode = mode;
	this.fun.decorate = CSL.Factory.Mode(mode);
}

CSL.Engine.prototype.getTerm = function(term,form,plural){
	var ret = "";
	if (!this.locale_terms[term]){
		throw "Error in getTerm: term\""+term+"\" does not exist.";
	}
	if (!form){
		throw "Error in getTerm: must provide a non-nil value as \"form\" argument";
	}
	var forms = [];
	if (form == "symbol"){
		forms = ["symbol","short"];
	} else if (form == "verb-short"){
		forms = ["verb-short","verb"];
	} else if (form != "long"){
		forms = [form];
	}
	forms = forms.concat(["long"]);
	for each (var f in forms){
		if ("undefined" != typeof this.locale_terms[term][f]){
			if ("string" == typeof this.locale_terms[term][f]){
				ret = this.locale_terms[term][f];
			} else {
				if ("number" == typeof plural){
					ret = this.locale_terms[term][f][plural];
				} else {
					ret = this.locale_terms[term][f][0];
				}
			}
			break;
		}
	}
	return ret;
}

CSL.Engine.prototype.configureTokenLists = function(){
	//for each (var area in ["citation", "citation_sort", "bibliography","bibliography_sort"]){
	for each (var area in ["citation","citation_sort","bibliography","bibliography_sort"]){
		for (var pos=(this[area].tokens.length-1); pos>-1; pos--){
			var token = this[area].tokens[pos];
			token["next"] = (pos+1);
			//print("setting: "+(pos+1)+" ("+token.name+")");
			if (token.name && CSL.Lib.Elements[token.name].configure){
				CSL.Lib.Elements[token.name].configure.call(token,this,pos);
			}
		}
	}
	this.version = CSL.Factory.version;
	return this.state;
};
