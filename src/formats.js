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
	// format_init:  Initialization hook.  Defined function is run
	// when the format is selected, with the temporary scratch object
	// as the sole argument.
	//
	"format_init": function(tmp){},
	//
	// items_add:  Formatting registry data insertion hook.  Hook to be
	// used by output modes that must maintain information on a per-item
	// basis.  Defined function is run once for each updateItems invocation
	// on the processor API, with the temporary scratch object as the
	// first argument, and an array of items to be inserted as the
	// second.
	//
	"items_add": function(tmp,items_array){},
	//
	// items_delete: Formatting registry data deletion hook.  Hook to be
	// used by output modes that must maintain information on a per-item
	// basis.  Defined function is run once for each updateItems invocation
	// on the processor API, iwth the temporary scratch object as the
	// first argument, and a hash of item IDs to be deleted as the second.
	//
	"items_delete": function(tmp,items_hash){},
	//
	// text_escape: Format-specific function for escaping text destined
	// for output.  Takes the temporary scratch object and the text to be
	// escaped as arguments.  Function will be run only once across each
	// portion of text to be escaped, it need not be idempotent.
	//
	"text_escape": function(tmp,text){return text;},
	"@font-style/italic":"<i>%%STRING%%</i>",
	"@font-style/oblique":"<em>%%STRING%%</em>",
	"@font-style/normal":"<span style=\"font-style:normal\">%%STRING%%</span>",
	"@font-variant/small-caps":"<span style=\"font-variant:small-caps\">%%STRING%%</span>",
	"@font-variant/normal":false,
	"@font-weight/bold":"<b>%%STRING%%</b>",
	"@font-weight/normal":false,
	"@font-weight/light":false,
	"@text-decoration/none":false,
	"@text-decoration/underline":"<span style=\"text-decoration:underline\">%%STRING%%</span>",
	"@vertical-align/baseline":false,
	"@vertical-align/sup":"<sup>%%STRING%%</sup>",
	"@vertical-align/sub":"<sub>%%STRING%%</sub>",
	"@text-case/lowercase":CSL.Output.Formatters.lowercase,
	"@text-case/uppercase":CSL.Output.Formatters.uppercase,
	"@text-case/capitalize-first":CSL.Output.Formatters.capitalize_first,
	"@text-case/capitalize-all":CSL.Output.Formatters.capitalize_all,
	"@text-case/title":CSL.Output.Formatters.title_capitalization,
	"@text-case/sentence":CSL.Output.Formatters.sentence_capitalization,
	"@quotes/true":function(state,str){
		return state.getTerm("open-quote") + str + state.getTerm("close-quote");
	},
	"@quotes/inner":function(state,str){
		return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
	},
	"@parens/true":function(state,str){
		return state.getTerm("open-paren") + str + state.getTerm("close-paren");
	},
	"@parens/inner":function(state,str){
		return state.getTerm("open-inner-paren") + str + state.getTerm("close-inner-paren");
	},
	"@display/block":"<span class=\"csl-bib-block\">%%STRING%%</span>",
	"@bibliography/wrapper": function(state,str){
		var cls = ["csl-bib-body"].concat(state.bibliography.opt["csl-bib-body"]).join(" ");
		var line_height = "";
		if (state.bibliography.opt["bib-line-spacing"]){
			line_height = (100*state.bibliography.opt["bib-line-spacing"]);
			line_height =  " style=\"line-height:"+line_height+"%\"";
		};
		return "<ul class=\""+cls+"\""+line_height+">\n"+str+"</ul>";
	},
	"@bibliography/entry": function(state,str){
		var cls = ["csl-bib-entry"].concat(state.bibliography.opt["csl-bib-entry"]).join(" ");
		var margin_bottom = "";
		if (state.bibliography.opt["bib-entry-spacing"] > 1){
			margin_bottom = (1.1*(state.bibliography.opt["bib-entry-spacing"]-1));
			margin_bottom = " style=\"margin-bottom:"+margin_bottom+"em\"";
		};
		return "<li class=\""+cls+"\""+margin_bottom+">"+str+"</li>\n";
	},
	"@bibliography/first": function(state,str){
		//
		// The "first field" object could have a suffix ending
		// in a space.  The space needs to be placed beyond the
		// end of the span tag or it may vanish.
		//
		var start = str.length;
		for (var c=str.length; c>-1; c += -1){
			if (str[c] != " "){
				start = c;
				break;
			};
		};
		if (state.bibliography.opt["csl-bib-first"].length){
			var cls = state.bibliography.opt["csl-bib-first"].join(" ");
			return "<span class=\""+cls+"\">"+str.slice(0,start)+"</span>"+str.slice(start,str.length);
		} else {
			return str;
		};
	},
	"@bibliography/other": function(state,str){
		//
		// See above.
		//
		var end = str.length;
		for (var c=0; c<(str.length-1); c += 1){
			if (str[c] != " "){
				end = (c+1);
				break;
			};
		};
		if (state.bibliography.opt["csl-bib-other"].length){
			var cls = state.bibliography.opt["csl-bib-other"].join(" ");
			return str.slice(0,end)+"<span class=\""+cls+"\">"+str.slice(end,str.length)+"</span>";
		} else {
			return str;
		};
	}
};

CSL.Output.Formats = new CSL.Output.Formats();