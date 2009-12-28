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
var StdRhinoTest = function(myname){
	this.myname = myname;
	this._cache = {};
	this._acache = { "default": {
						 "journal":{
							 "Journal of Irreproducible Results":"J. Irrep. Res."
						 },
						 "series":{
							 "International Rescue Wildlife Series":"I.R. Wildlife Series"
						 },
						 "authority":{
							 "United Nations": "U.N."
						 },
						 "institution":{
							 "Bureau of Gaseous Unformed Stuff":"BoGUS",
							 "Economic Commission for Latin America and the Carribean":"ECLAC"
						 }
					 }
				   };
	this._ids = [];
	if (myname){
		var test = readFile("./tests/std/machines/" + myname + ".json", "UTF-8");
		eval( "this.test = "+test);
		this.result = this.test.result;
		this._setCache();
	}
};

//
// Retrieve properly composed item from phoney database.
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.retrieveItem = function(id){
	return this._cache[id];
};

StdRhinoTest.prototype.getAbbreviations = function(name,vartype){
	return this._acache[name][vartype];
};

StdRhinoTest.prototype.addAbbreviation = function(name,vartype){
	this._acache[name][vartype] = "";
};

//
// Build phoney database.
//
StdRhinoTest.prototype._setCache = function(){
	for each (item in this.test.input){
		this._cache[item.id] = item;
		this._ids.push(item.id);
	}
};


StdRhinoTest.prototype._readTest = function(){
	var test;
	var filename = "std/machines/" + this.myname + ".json";
	//
	// Half of the fix for encoding problem encountered by Sean
	// under OSX.  External strings are _read_ correctly, but an
	// explicit encoding declaration on readFile is needed if
	// they are to be fed to eval.  This may set the implicit
	// UTF-8 binary identifier on the stream, as defined in the
	// ECMAscript specification.  See http://www.ietf.org/rfc/rfc4329.txt
	//
	// Python it's not.  :)
	//
	var teststring = readFile(filename, "UTF-8");
	//
	// Grab test data in an object.
	//
	try {
		eval( "test = "+teststring );
	} catch(e){
		throw e + teststring;
	}
	this.test = test;
};


StdRhinoTest.prototype.run = function(){
	this.style = new CSL.Engine(this,this.test.csl);
	this.style.setAbbreviations("default");
	if (this.test.bibentries){
		for each (var id_set in this.test.bibentries){
			this.style.updateItems(id_set);
		}
	} else {
		this.style.updateItems(this._ids);
	}
	if (this.test.mode == "citation"){
		if (!this.test.citations){
			var citation = [];
			for each (item in this.style.registry.reflist){
				citation.push({"id":item.id});
			}
			this.test.citations = [citation];
		}
		var citations = [];
		for each (var citation in this.test.citations){
			this.style.sortCitationCluster(citation);
			citations.push(this.style.makeCitationCluster(citation));
		}
		var ret = citations.join("\n");
	} else if (this.test.mode == "bibliography"){
		if (this.test.bibsection){
			var ret = this.style.makeBibliography(this.test.bibsection)[1].join("");
		} else {
			var ret = this.style.makeBibliography()[1].join("");
		}
        ret = "<div class=\"csl-bib-body\">\n" + ret + "</div>";
	} else if (this.test.mode == "bibliography-header"){
		var ret = this.style.makeBibliography()[0];
	} else {
		throw "Invalid mode in test file "+this.myname+": "+this.test.mode;
	}
	return ret;
};

//
// Retrieve locale object from filesystem
// (Deployments must provide an instance object with
// this method.)
//
StdRhinoTest.prototype.retrieveLocale = function(lang){
	var ret = readFile( "./locale/locales-"+lang+".xml", "UTF-8");
	// ret = ret.replace(/\s*<\?[^>]*\?>\s*\n/g, "");
	return ret;
};
