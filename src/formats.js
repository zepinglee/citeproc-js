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
	"@font-family":"<span style=\"font-family:%%PARAM%%\">%%STRING%%</span>",
	"@font-style/italic":"<i>%%STRING%%</i>",
	"@font-style/normal":"<span style=\"font-style:normal\">%%STRING%%</span>",
	"@font-style/oblique":"<em>%%STRING%%</em>",
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
	"@quotes/true":"“%%STRING%%”",
	//"@quotes/left":"&ldquo;%%STRING%%",
	//"@quotes/right":"%%STRING%%&rdquo;",
	//"@quotes/noop":"%%STRING%%",
	"@squotes/true":"‘%%STRING%%’",
	//"@squotes/left":"&lsquo;%%STRING%%",
	//"@squotes/right":"%%STRING%%&rsquo;",
	//"@squotes/noop":"%%STRING%%",
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
		var cls = ["csl-bib-first"].concat(state.bibliography.opt["csl-bib-first"]).join(" ");
		return "<span class=\""+cls+"\">"+str.slice(0,start)+"</span>"+str.slice(start,str.length);
	},
	"@bibliography/other": function(state,str){
		//
		// See above.
		//
		var end = str.length;
		for (var c=0; c<str.length; c += 1){
			if (str[c] != " "){
				end = c;
				break;
			};
		};
		var cls = ["csl-bib-other"].concat(state.bibliography.opt["csl-bib-other"]).join(" ");
		return str.slice(0,end)+"<span class=\""+cls+"\">"+str.slice(end,str.length)+"</span>";
	}
};

CSL.Output.Formats = new CSL.Output.Formats();