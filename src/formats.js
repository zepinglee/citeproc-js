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
	// text_escape: Format-specific function for escaping text destined
	// for output.  Takes the text to be escaped as sole argument.  Function
	// will be run only once across each portion of text to be escaped, it
	// need not be idempotent.
	//
	"text_escape": function(text){
		return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	},
	"@font-style/italic":"<i>%%STRING%%</i>",
	"@font-style/oblique":"<em>%%STRING%%</em>",
	"@font-style/normal":"<span style=\"font-style:normal;\">%%STRING%%</span>",
	"@font-variant/small-caps":"<span style=\"font-variant:small-caps;\">%%STRING%%</span>",
	"@passthrough/true":CSL.Output.Formatters.passthrough,
	"@font-variant/normal":false,
	"@font-weight/bold":"<b>%%STRING%%</b>",
	"@font-weight/normal":false,
	"@font-weight/light":false,
	"@text-decoration/none":false,
	"@text-decoration/underline":"<span style=\"text-decoration:underline;\">%%STRING%%</span>",
	"@vertical-align/baseline":false,
	"@vertical-align/sup":"<sup>%%STRING%%</sup>",
	"@vertical-align/sub":"<sub>%%STRING%%</sub>",
	"@strip-periods/true":CSL.Output.Formatters.strip_periods,
	"@strip-periods/false":function(state,string){return string;},
	"@quotes/true":function(state,str){
		if ("undefined" == typeof str){
			return state.getTerm("open-quote");
		};
		return state.getTerm("open-quote") + str + state.getTerm("close-quote");
	},
	"@quotes/inner":function(state,str){
		if ("undefined" == typeof str){
			//
			// Most right by being wrong (for apostrophes)
			//
			return state.getTerm("close-inner-quote");
		};
		return state.getTerm("open-inner-quote") + str + state.getTerm("close-inner-quote");
	},
	"@bibliography/body": function(state,str){
		return "<div class=\"csl-bib-body\">\n"+str+"</div>";
	},
	"@bibliography/entry": function(state,str){
		return "  <div class=\"csl-entry\">"+str+"</div>\n";
	},
	"@display/block": function(state,str){
		return "\n\n    <div class=\"csl-entry-heading\">" + str + "</div>\n";
	},
	"@display/left-margin": function(state,str){
		return "\n    <div class=\"csl-left-label\">" + str + "</div>\n";
	},
	"@display/right-inline": function(state,str){
		return "    <div class=\"csl-item\">" + str + "</div>\n  ";
	},
	"@display/indent": function(state,str){
		return "    <div class=\"csl-block-indent\">" + str + "</div>\n  ";
	}
};

CSL.Output.Formats = new CSL.Output.Formats();
