dojo.provide("csl.retrieval");
if (!CSL){
	load("./src/csl.js");
}

/**
 * Static functions for retrieving field content.
 * <p>What goes here will depend on the environment
 * in which this is deployed.  Functions take an item
 * and a fieldname as argument.</p>
 * @namespace Retrieval
 */
CSL.System.Retrieval = function(){};

CSL.System.Retrieval.GetInput = function(){
	this.input = new Object();
};

CSL.System.Retrieval.GetInput.prototype.setInput = function(state,item){
	this.input[item.id] = item;
}

CSL.System.Retrieval.GetInput.prototype.getInput = function(name){
	var ret = new Array();
	if ("object" == typeof name && name.length){
		for each (filename in name){
			if (this.input[filename]){
				ret.push(this.input[filename]);
			} else {
				var datastring = readFile("data/" + filename + ".txt");
				eval( "obj = " + datastring );
				CSL.System.Tests.fixNames([obj],filename);
				this.input[filename] = obj;
				ret.push(obj);
			}
		}
	} else if ("object" == typeof name){
		if (this.input[filename]){
			ret.push(this.input[filename]);
		} else {
			var datastring = readFile("data/" + filename + ".txt");
			this.input[filename] = obj;
			eval( "obj = " + datastring );
			CSL.System.Tests.fixNames([obj],filename);
			ret.push(obj);
		}
	} else {
		throw "Failure reading test data file, WTF?";
	}
	return ret;
}

/**
 * Get locale data for a specific language and return
 * as a token list.
 */
CSL.System.Retrieval.getLocaleObjects = function(lang,locale){
	//
	// we're a static function, so this refers to the
	// global object
	if ( ! locale ){
		try {
			var locale = readFile( "./locale/"+localeRegistry()[lang] );
		} catch (e){
			throw "Unable to load locale for "+lang+".";
		}
	}
	var builder = new CSL.Core.Build(locale);
	builder.build();
	return builder.state.opt.term;

	function localeRegistry (){
		return {
		"af":"locales-af-AZ.xml",
		"af":"locales-af-ZA.xml",
		"ar":"locales-ar-AR.xml",
		"bg":"locales-bg-BG.xml",
		"ca":"locales-ca-AD.xml",
		"cs":"locales-cs-CZ.xml",
		"da":"locales-da-DK.xml",
		"de":"locales-de-AT.xml",
		"de":"locales-de-CH.xml",
		"de":"locales-de-DE.xml",
		"el":"locales-el-GR.xml",
		"en":"locales-en-US.xml",
		"es":"locales-es-ES.xml",
		"et":"locales-et-EE.xml",
		"fr":"locales-fr-FR.xml",
		"he":"locales-he-IL.xml",
		"hu":"locales-hu-HU.xml",
		"is":"locales-is-IS.xml",
		"it":"locales-it-IT.xml",
		"ja":"locales-ja-JP.xml",
		"ko":"locales-ko-KR.xml",
		"mn":"locales-mn-MN.xml",
		"nb":"locales-nb-NO.xml",
		"nl":"locales-nl-NL.xml",
		"pl":"locales-pl-PL.xml",
		"pt":"locales-pt-BR.xml",
		"pt":"locales-pt-PT.xml",
		"ro":"locales-ro-RO.xml",
		"ru":"locales-ru-RU.xml",
		"sk":"locales-sk-SK.xml",
		"sl":"locales-sl-SI.xml",
		"sr":"locales-sr-RS.xml",
		"sv":"locales-sv-SE.xml",
		"th":"locales-th-TH.xml",
		"tr":"locales-tr-TR.xml",
		"uk":"locales-uk-UA.xml",
		"vi":"locales-vi-VN.xml",
		"zh":"locales-zh-CN.xml",
		"zh":"locales-zh-TW.xml"
		};
	};
};

var _slashRe = /^(.*?)\b([0-9]{1,4})(?:([\-\/\.\u5e74])([0-9]{1,2}))?(?:([\-\/\.\u6708])([0-9]{1,4}))?\b(.*?)$/;
var _yearRe = /^(.*?)\b((?:circa |around |about |c\.? ?)?[0-9]{1,4}(?: ?B\.? ?C\.?(?: ?E\.?)?| ?C\.? ?E\.?| ?A\.? ?D\.?)|[0-9]{3,4})\b(.*?)$/i;
var _monthRe = null;
var _dayRe = null;

/**
 * Convert a string to an hash object
 * <p>Object has the following content:
 * <dl>
 *   <dt>day</dt><dd>integer form of the day</dd>
 *   <dt>month</dt><dd>integer form of the month (indexed from 0, not 1)</dd>
 *   <dt>year</dt><dd>4 digit year (or, year + BC/AD/etc.)</dd>
 *   <dt>part</dt><dd>anything that does not fall under any of the above categories
 *          (e.g., "Summer," etc.)</dd>
 * </dl>
 * <p>Note: the returned object is *not* a JS Date object</p>
 *
 * <p>(shamelessly lifted from Zotero source)</p>
 */
CSL.System.Retrieval.strToDate = function(string) {
	var date = new Object();

	// skip empty things
	if(!string) {
		return date;
	}

	string = string.toString().replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/, " ");

	// first, directly inspect the string
	var m = _slashRe.exec(string);
	var pre = m[1];
	var num1 = m[2];
	var div1_2 = m[3];
	var num2 = m[4];
	var div2_3 = m[5];
	var num3 = m[6];
	var post = m[7];
	if(m){
		var sane = (!m[5] || m[3] == m[5] || (m[3] == "\u5e74" && m[5] == "\u6708"));
		var got_data = ((m[2] && m[4] && m[6]) || (!m[1] && !m[7]));
		if (sane && got_data){
			// figure out date based on parts
			if(num1.length == 3 || num1.length == 4 || div1_2 == "\u5e74") {
				// ISO 8601 style date (big endian)
				date.year = num1;
				date.month = num2;
				date.day = num3;
			} else {
				// local style date (middle or little endian)
				date.year = num3;
				//
				// XXXX This is going to need some help
				var country = "US";
				if(country == "US" ||	// The United States
				   country == "FM" ||	// The Federated States of Micronesia
				   country == "PW" ||	// Palau
				   country == "PH") {	// The Philippines
					date.month = num1;
					date.day = num2;
				} else {
					date.month = num2;
					date.day = num1;
				}
			}

			if(date.year) {
				date.year = parseInt(date.year, 10);
			}

			if(date.day) {
				date.day = parseInt(date.day, 10);
			}

			if(date.month) {
				date.month = parseInt(date.month, 10);

				if(date.month > 12) {
					// swap day and month
					var tmp = date.day;
					date.day = date.month;
					date.month = tmp;
				}
			}

			if((!date.month || date.month <= 12) && (!date.day || date.day <= 31)) {
				if(date.year && date.year < 100) {	// for two digit years, determine proper
													// four digit year
					var today = new Date();
					var year = today.getFullYear();
					var twoDigitYear = year % 100;
					var century = year - twoDigitYear;

					if(date.year <= twoDigitYear) {
						// assume this date is from our century
						date.year = century + date.year;
					} else {
						// assume this date is from the previous century
						date.year = century - 100 + date.year;
					}
				}

				// subtract one for JS style
				if(date.month){
					date.month--;
				}
				date.part = pre+post;
			} else {
				//
				// give up; we failed the sanity check
				date = {"part":string};
			}
		} else {
			date.part = string;
		}
	} else {
		date.part = string;
	}

	// couldn't find something with the algorithms; use regexp
	// YEAR
	if(!date.year) {
		var m = _yearRe.exec(date.part);
		if(m) {
			date.year = num1;
			date.part = pre+d1_2;
		}
	}

	// MONTH
	if(!date.month) {
		// compile month regular expression
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
			'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// If using a non-English bibliography locale, try those too
		if (Zotero.CSL.Global.locale != 'en-US') {
			months = months.concat(Zotero.CSL.Global.getMonthStrings("short"));
		}
		if(!_monthRe) {
			_monthRe = new RegExp("^(.*)\\b("+months.join("|")+")[^ ]*(?: (.*)$|$)", "i");
		}

		var m = _monthRe.exec(date.part);
		if(m) {
			// Modulo 12 in case we have multiple languages
			date.month = months.indexOf(m[2][0].toUpperCase()+m[2].substr(1).toLowerCase()) % 12;
			date.part = m[1]+m[3];
		}
	}

	// DAY
	if(!date.day) {
		// compile day regular expression
		if(!_dayRe) {
			var daySuffixes = Zotero.getString("date.daySuffixes").replace(/, ?/g, "|");
			_dayRe = new RegExp("\\b([0-9]{1,2})(?:"+daySuffixes+")?\\b(.*)", "i");
		}

		var m = _dayRe.exec(date.part);
		if(m) {
			var day = parseInt(m[1], 10);
			// Sanity check
			if (day <= 31) {
				date.day = day;
				if(m.index > 0) {
					date.part = date.part.substr(0, m.index);
					if(m[2]) {
						date.part += " "+m[2];;
					}
				} else {
					date.part = m[2];
				}
			}
		}
	}

	// clean up date part
	if(date.part) {
		date.part = date.part.replace(/^[^A-Za-z0-9]+/, "").replace(/[^A-Za-z0-9]+$/, "");
		if(!date.part.length) {
			date.part = undefined;
		}
	}
	return date;
};



