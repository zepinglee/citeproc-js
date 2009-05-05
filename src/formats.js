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
	"@font-style/normal":false,
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
	"@quotes/true":"&ldquo;%%STRING%%&rdquo;",
	"@quotes/left":"&ldquo;%%STRING%%",
	"@quotes/right":"%%STRING%%&rdquo;",
	"@squotes/true":"&lsquo;%%STRING%%&rsquo;",
	"@squotes/left":"&lsquo;%%STRING%%",
	"@squotes/right":"%%STRING%%&rsquo;"
};

CSL.Output.Formats = new CSL.Output.Formats();