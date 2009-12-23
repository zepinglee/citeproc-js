if ("undefined" == typeof dojo){
	var dojo = new Object();
	dojo.provide = function(ignoreme){};
};
dojo.provide("csl.load");
var CSL = new function () {
	this.debug = function(str){
		print(str);
	};
	this.START = 0;
	this.END = 1;
	this.SINGLETON = 2;
	this.SEEN = 6;
	this.SUCCESSOR = 3;
	this.SUCCESSOR_OF_SUCCESSOR = 4;
	this.SUPPRESS = 5;
	this.SINGULAR = 0;
	this.PLURAL = 1;
	this.LITERAL = true;
	this.BEFORE = 1;
	this.AFTER = 2;
	this.DESCENDING = 1;
	this.ASCENDING = 2;
	this.ONLY_FIRST = 1;
	this.ALWAYS = 2;
	this.ONLY_LAST = 3;
	this.FINISH = 1;
	this.POSITION_FIRST = 0;
	this.POSITION_SUBSEQUENT = 1;
	this.POSITION_IBID = 2;
	this.POSITION_IBID_WITH_LOCATOR = 3;
	this.COLLAPSE_VALUES = ["citation-number","year","year-suffix"];
	this.ET_AL_NAMES = ["et-al-min","et-al-use-first"];
	this.ET_AL_NAMES = this.ET_AL_NAMES.concat( ["et-al-subsequent-min","et-al-subsequent-use-first"] );
	this.DISAMBIGUATE_OPTIONS = ["disambiguate-add-names","disambiguate-add-givenname"];
	this.DISAMBIGUATE_OPTIONS.push("disambiguate-add-year-suffix");
	this.GIVENNAME_DISAMBIGUATION_RULES = [];
	this.GIVENNAME_DISAMBIGUATION_RULES.push("all-names");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("all-names-with-initials");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("primary-name");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("primary-name-with-initials");
	this.GIVENNAME_DISAMBIGUATION_RULES.push("by-cite");
	this.NAME_ATTRIBUTES = [];
	this.NAME_ATTRIBUTES.push("and");
    this.NAME_ATTRIBUTES.push("delimiter-precedes-last");
	this.NAME_ATTRIBUTES.push("initialize-with");
	this.NAME_ATTRIBUTES.push("name-as-sort-order");
	this.NAME_ATTRIBUTES.push("sort-separator");
	this.NAME_ATTRIBUTES.push("et-al-min");
	this.NAME_ATTRIBUTES.push("et-al-use-first");
    this.NAME_ATTRIBUTES.push("et-al-subsequent-min");
    this.NAME_ATTRIBUTES.push("et-al-subsequent-use-first");
	this.LOOSE = 0;
	this.STRICT = 1;
	this.PREFIX_PUNCTUATION = /.*[.;:]\s*$/;
	this.SUFFIX_PUNCTUATION = /^\s*[.;:,\(\)].*/;
	this.NUMBER_REGEXP = /(?:^\d+|\d+$|\d{3,})/; // avoid evaluating "F.2d" as numeric
	this.QUOTED_REGEXP = /^".+"$/;
	this.NAME_INITIAL_REGEXP = /^([A-Z\u0080-\u017f\u0400-\u042f])([a-zA-Z\u0080-\u017f\u0400-\u052f]*|).*/;
	this.ROMANESQUE_REGEXP = /.*[a-zA-Z\u0080-\u017f\u0400-\u052f].*/;
	this.STARTSWITH_ROMANESQUE_REGEXP = /^[&a-zA-Z\u0080-\u017f\u0400-\u052f].*/;
	this.ENDSWITH_ROMANESQUE_REGEXP = /.*[&a-zA-Z\u0080-\u017f\u0400-\u052f]$/;
	this.GROUP_CLASSES = ["block","left-margin","right-inline","indent"];
	var x = new Array();
	x = x.concat(["edition","volume","number-of-volumes","number"]);
	x = x.concat(["issue","title","container-title","issued","page"]);
	x = x.concat(["locator","collection-number","original-date"]);
	x = x.concat(["reporting-date","decision-date","filing-date"]);
	x = x.concat(["revision-date"]);
	this.NUMERIC_VARIABLES = x.slice();
	this.DATE_VARIABLES = ["issued","event","accessed","container","original-date"];
	this.TAG_ESCAPE = /(<span class=\"no(?:case|decor)\">.*?<\/span>)/;
	this.TAG_USEALL = /(<[^>]+>)/;
	this.SKIP_WORDS = ["a","the","an"];
	var x = new Array();
	x = x.concat(["@strip-periods","@font-style","@font-variant"]);
	x = x.concat(["@font-weight","@text-decoration","@vertical-align"]);
	x = x.concat(["@quotes","@display"]);
	this.FORMAT_KEY_SEQUENCE = x.slice();
	this.SUFFIX_CHARS = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
	this.ROMAN_NUMERALS = [
		[ "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix" ],
		[ "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc" ],
		[ "", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm" ],
		[ "", "m", "mm", "mmm", "mmmm", "mmmmm"]
	];
	this.CREATORS = ["author","editor","translator","recipient","interviewer"];
	this.CREATORS = this.CREATORS.concat(["composer"]);
	this.CREATORS = this.CREATORS.concat(["original-author"]);
	this.CREATORS = this.CREATORS.concat(["container-author","collection-editor"]);
	this.LANG_BASES = new Object();
	this.LANG_BASES["af"] = "af_ZA";
	this.LANG_BASES["ar"] = "ar_AR";
	this.LANG_BASES["bg"] = "bg_BG";
	this.LANG_BASES["ca"] = "ca_AD";
	this.LANG_BASES["cs"] = "cs_CZ";
	this.LANG_BASES["da"] = "da_DK";
	this.LANG_BASES["de"] = "de_DE";
	this.LANG_BASES["el"] = "el_GR";
	this.LANG_BASES["en"] = "en_US";
	this.LANG_BASES["es"] = "es_ES";
	this.LANG_BASES["et"] = "et_EE";
	this.LANG_BASES["fr"] = "fr_FR";
	this.LANG_BASES["he"] = "he_IL";
	this.LANG_BASES["hu"] = "hu_HU";
	this.LANG_BASES["is"] = "is_IS";
	this.LANG_BASES["it"] = "it_IT";
	this.LANG_BASES["ja"] = "ja_JP";
	this.LANG_BASES["ko"] = "ko_KR";
	this.LANG_BASES["mn"] = "mn_MN";
	this.LANG_BASES["nb"] = "nb_NO";
	this.LANG_BASES["nl"] = "nl_NL";
	this.LANG_BASES["pl"] = "pl_PL";
	this.LANG_BASES["pt"] = "pt_PT";
	this.LANG_BASES["ro"] = "ro_RO";
	this.LANG_BASES["ru"] = "ru_RU";
	this.LANG_BASES["sk"] = "sk_SK";
	this.LANG_BASES["sl"] = "sl_SI";
	this.LANG_BASES["sr"] = "sr_RS";
	this.LANG_BASES["sv"] = "sv_SE";
	this.LANG_BASES["th"] = "th_TH";
	this.LANG_BASES["tr"] = "tr_TR";
	this.LANG_BASES["uk"] = "uk_UA";
	this.LANG_BASES["vi"] = "vi_VN";
	this.LANG_BASES["zh"] = "zh_CN";
	this.locale = new Object();
	this.locale_opts = new Object();
	this.locale_dates = new Object();
    this.localeRegistry = {
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
dojo.provide("csl.queue");
CSL.Output = {};
CSL.Output.Queue = function(state){
	this.state = state;
	this.queue = new Array();
	this.empty = new CSL.Token("empty");
	var tokenstore = {};
	tokenstore["empty"] = this.empty;
	this.formats = new CSL.Stack( tokenstore );
	this.current = new CSL.Stack( this.queue );
	this.suppress_join_punctuation = false;
};
CSL.Output.Queue.prototype.getToken = function(name){
	var ret = this.formats.value()[name];
	return ret;
};
// Store a new output format token based on another
CSL.Output.Queue.prototype.addToken = function(name,modifier,token){
	var newtok = new CSL.Token("output");
	if ("string" == typeof token){
		token = this.formats.value()[token];
	}
	if (token && token.strings){
		for (attr in token.strings){
			newtok.strings[attr] = token.strings[attr];
		}
		newtok.decorations = token.decorations;
	}
	if ("string" == typeof modifier){
		newtok.strings.delimiter = modifier;
	}
	this.formats.value()[name] = newtok;
};
//
// newFormat adds a new bundle of formatting tokens to
// the queue's internal stack of such bundles
CSL.Output.Queue.prototype.pushFormats = function(tokenstore){
	if (!tokenstore){
		tokenstore = new Object();
	}
	tokenstore["empty"] = this.empty;
	this.formats.push(tokenstore);
};
CSL.Output.Queue.prototype.popFormats = function(tokenstore){
	this.formats.pop();
};
CSL.Output.Queue.prototype.startTag = function(name,token){
	var tokenstore = new Object();
	tokenstore[name] = token;
	this.pushFormats( tokenstore );
	this.openLevel(name);
}
CSL.Output.Queue.prototype.endTag = function(){
	this.closeLevel();
	this.popFormats();
}
//
// newlevel adds a new blob object to the end of the current
// list, and adjusts the current pointer so that subsequent
// appends are made to blob list of the new object.
CSL.Output.Queue.prototype.openLevel = function(token){
	if (!this.formats.value()[token]){
		throw "CSL processor error: call to nonexistent format token \""+token+"\"";
	}
	var blob = new CSL.Blob(this.formats.value()[token]);
	if (this.state.tmp.count_offset_characters && blob.strings.prefix.length){
		// this.state.tmp.offset_characters += blob.strings.prefix.length;
		this.state.tmp.offset_characters += blob.strings.prefix;
	}
	if (this.state.tmp.count_offset_characters && blob.strings.suffix.length){
		// this.state.tmp.offset_characters += blob.strings.suffix.length;
		this.state.tmp.offset_characters += blob.strings.suffix;
	}
	var curr = this.current.value();
	curr.push( blob );
	this.current.push( blob );
};
CSL.Output.Queue.prototype.closeLevel = function(name){
	this.current.pop();
}
//
// append does the same thing as newlevel, except
// that the blob it pushes has text content,
// and the current pointer is not moved after the push.
CSL.Output.Queue.prototype.append = function(str,tokname){
	if ("undefined" == typeof str){
		return;
	};
	if ("number" == typeof str){
		str = ""+str;
	}
	if (this.state.tmp.element_trace && this.state.tmp.element_trace.value() == "suppress-me"){
		return;
	}
	var blob = false;
	if (!tokname){
		var token = this.formats.value()["empty"];
	} else if (tokname == "literal"){
		var token = true;
	} else if ("string" == typeof tokname){
		var token = this.formats.value()[tokname];
	} else {
		var token = tokname;
	}
	if (!token){
		throw "CSL processor error: unknown format token name: "+tokname;
	}
	if ("string" == typeof str && str.length){
		this.last_char_rendered = str.slice(-1);
	}
	blob = new CSL.Blob(token,str);
	if (this.state.tmp.count_offset_characters && blob.strings.prefix){
		this.state.tmp.offset_characters += blob.strings.prefix.length;
	}
	if (this.state.tmp.count_offset_characters && blob.strings.suffix){
		this.state.tmp.offset_characters += blob.strings.suffix.length;
	}
	var curr = this.current.value();
	if ("string" == typeof blob.blobs){
		this.state.tmp.term_predecessor = true;
	}
	if (this.state.tmp.count_offset_characters){
		if ("string" == typeof str){
			this.state.tmp.offset_characters += blob.strings.prefix.length;
			this.state.tmp.offset_characters += blob.strings.suffix.length;
			this.state.tmp.offset_characters += blob.blobs.length;
		} else if ("undefined" != str.num){
			this.state.tmp.offset_characters += str.strings.prefix.length;
			this.state.tmp.offset_characters += str.strings.suffix.length;
			this.state.tmp.offset_characters += str.formatter.format(str.num).length;
		}
	}
	CSL.parallel.AppendBlobPointer(curr);
	if ("string" == typeof str){
		curr.push( blob );
		if (blob.strings["text-case"]){
			//
			// This one is _particularly_ hard to follow.  It's not obvious,
			// but the blob already contains the input string at this
			// point, as blob.blobs -- it's a terminal node, as it were.
			// The str variable also contains the input string, but
			// that copy is not used for onward processing.  We have to
			// apply our changes to the blob copy.
			//
			blob.blobs = CSL.Output.Formatters[blob.strings["text-case"]](this.state,str);
		};
		this.state.fun.flipflopper.init(str,blob);
		//CSL.debug("(queue.append blob decorations): "+blob.decorations);
		this.state.fun.flipflopper.processTags();
	} else {
		curr.push( str );
	}
}
//
// Maybe the way to do this is to take it by layers, and
// analyze a FLAT list of blobs returned during recursive
// execution.  If the list is all numbers and there is no
// group decor, don't touch it.  If it ends in numbers,
// set the group delimiter on the first in the series,
// and join the strings with the group delimiter.  If it
// has numbers followed by strings, render each number
// in place, and join with the group delimiter.  Return
// the mixed flat list, and recurse upward.
//
// That sort of cascade should work, and should be more
// easily comprehensible than this mess.
//
CSL.Output.Queue.prototype.string = function(state,myblobs,blob){
	var blobs = myblobs.slice();
	var ret = new Array();
	if (blobs.length == 0){
		return ret;
	}
	if (!blob){
		CSL.Output.Queue.normalizePrefixPunctuation(blobs);
	}
	var blob_last_chars = new Array();
	if (blob){
		var blob_delimiter = blob.strings.delimiter;
	} else {
		var blob_delimiter = "";
	};
	for (var i in blobs){
		var blobjr = blobs[i];
		if ("string" == typeof blobjr.blobs){
			var last_str = "";
			if (blobjr.strings.suffix){
				last_str = blobjr.strings.suffix;
			} else if (blobjr.blobs){
				last_str = blobjr.blobs;
			};
			//var last_char = last_str[(last_str.length-1)];
			var last_char = last_str.slice(-1);
			if ("number" == typeof blobjr.num){
				ret.push(blobjr);
				blob_last_chars.push(last_char);
			} else if (blobjr.blobs){
				// skip empty strings!!!!!!!!!!!!
				//
				// text_escape is applied by flipflopper.
				//
				var b = blobjr.blobs;
				if (!state.tmp.suppress_decorations){
					for each (var params in blobjr.decorations){
						b = state.fun.decorate[params[0]][params[1]](state,b);
					};
				};
				var use_suffix = blobjr.strings.suffix;
				if (b[(b.length-1)] == "." && use_suffix && use_suffix[0] == "."){
				    use_suffix = use_suffix.slice(1);
				}
				//
				// Handle punctuation/quote swapping for suffix.
				//
				var qres = this.swapQuotePunctuation(b,use_suffix);
				b = qres[0];
				use_suffix = qres[1];
				//
				// because we will rip out portions of the output
				// queue before rendering, group wrappers need
				// to produce no output if they are found to be
				// empty.
				if(b && b.length){
					b = blobjr.strings.prefix + b + use_suffix;
					ret.push(b);
					blob_last_chars.push(last_char);
				}
			};
		} else if (blobjr.blobs.length){
			var res = state.output.string(state,blobjr.blobs,blobjr);
			var addtoret = res[0];
			ret = ret.concat(addtoret);
			blob_last_chars = blob_last_chars.concat(res[1]);
			//blob_last_chars = res[1];
		} else {
			continue;
		}
	};
	var span_split = 0;
	for (var j in ret){
		if ("string" == typeof ret[j]){
			span_split = (parseInt(j,10)+1);
		}
	}
	if (blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)){
		span_split = ret.length;
	}
	var res = state.output.renderBlobs( ret.slice(0,span_split), blob_delimiter, blob_last_chars);
	var blobs_start = res[0];
	blob_last_chars = res[1].slice();
	if (blobs_start && blob && (blob.decorations.length || blob.strings.suffix || blob.strings.prefix)){
		if (!state.tmp.suppress_decorations){
			for each (var params in blob.decorations){
				blobs_start = state.fun.decorate[params[0]][params[1]](state,blobs_start);
			}
		}
		//
		// XXXX: cut-and-paste warning.  same as a code block above.
		//
		var b = blobs_start;
		var use_suffix = blob.strings.suffix;
		if (b[(b.length-1)] == "." && use_suffix && use_suffix[0] == "."){
			use_suffix = use_suffix.slice(1);
		}
		//
		// Handle punctuation/quote swapping for suffix.
		//
		var qres = this.swapQuotePunctuation(b,use_suffix);
		b = qres[0];
		if(b && b.length){
			use_suffix = qres[1];
			b = blob.strings.prefix + b + use_suffix;
		}
		blobs_start = b;
	}
	var blobs_end = ret.slice(span_split,ret.length);
	if (!blobs_end.length && blobs_start){
		ret = [blobs_start];
	} else if (blobs_end.length && !blobs_start) {
		ret = blobs_end;
	} else if (blobs_start && blobs_end.length) {
		ret = [blobs_start].concat(blobs_end);
	}
	if ("undefined" == typeof blob){
		this.queue = new Array();
		this.current.mystack = new Array();
		this.current.mystack.push( this.queue );
		if (state.tmp.suppress_decorations){
			var res = state.output.renderBlobs(ret);
			ret = res[0];
			blob_last_chars = res[1].slice();
		};
	} else if ("boolean" == typeof blob){
		var res = state.output.renderBlobs(ret);
		ret = res[0];
		blob_last_chars = res[1].slice();
	};
	if (blob){
		return [ret,blob_last_chars.slice()];
	} else {
		return ret;
	};
};
CSL.Output.Queue.prototype.clearlevel = function(){
	var blob = this.current.value();
	for (var i=(blob.blobs.length-1); i > -1; i--){
		blob.blobs.pop();
	}
};
CSL.Output.Queue.prototype.renderBlobs = function(blobs,delim,blob_last_chars){
	if (!delim){
		delim = "";
	}
	if (!blob_last_chars){
		blob_last_chars = [];
	};
	var state = this.state;
	var ret = "";
	var ret_last_char = [];
	var use_delim = "";
	var l = blobs.length;
	for (var i=0; i < l; i++){
		if (blobs[i].checkNext){
			blobs[i].checkNext(blobs[(i+1)]);
		}
	}
	for (var i in blobs){
		var blob = blobs[i];
		if (ret){
			use_delim = delim;
		}
		if (blob && "string" == typeof blob){
			//throw "Attempt to render string as rangeable blob"
			if (use_delim && blob_last_chars[(i-1)] == use_delim[0]) {
				//
				// Something for posterity, at the end of a remarkably
				// unproductive day.
				//
				//CSL.debug("  ####################################################");
				//CSL.debug("  ######################## EUREKA ####################");
				//CSL.debug("  ####################################################");
				use_delim = use_delim.slice(1);
			};
			//
			// Handle punctuation/quote swapping for delimiter joins.
			//
			var res = this.swapQuotePunctuation(ret,use_delim);
			ret = res[0];
			use_delim = res[1];
			ret += use_delim;
			ret += blob;
			ret_last_char = blob_last_chars.slice(-1);
		} else if (blob.status != CSL.SUPPRESS){
			// CSL.debug("doing rangeable blob");
			//var str = blob.blobs;
			var str = blob.formatter.format(blob.num);
			if (blob.strings["text-case"]){
				str = CSL.Output.Formatters[blob.strings["text-case"]](this.state,str);
			}
			if (!state.tmp.suppress_decorations){
				for each (var params in blob.decorations){
					str = state.fun.decorate[params[0]][params[1]](state,str);
				};
			};
			//if (!suppress_decor){
				str = blob.strings.prefix + str + blob.strings.suffix;
			//}
			if (blob.status == CSL.END){
				ret += blob.range_prefix;
			} else if (blob.status == CSL.SUCCESSOR){
				ret += blob.successor_prefix;
			} else if (blob.status == CSL.START){
				ret += blob.splice_prefix;
			};
			ret += str;
			//ret_last_char = blob_last_chars.slice((blob_last_chars.length-1),blob_last_chars.length);
			ret_last_char = blob_last_chars.slice(-1);
		};
	};
	return [ret,ret_last_char];
};
CSL.Output.Queue.prototype.swapQuotePunctuation = function(ret,use_delim){
	if (ret.length && this.state.getOpt("punctuation-in-quote") && this.state.opt.close_quotes_array.indexOf(ret[(ret.length-1)]) > -1){
		if (use_delim){
			var pos = use_delim.indexOf(" ");
			if (pos > -1){
				var pre_quote = use_delim.slice(0,pos);
				use_delim = use_delim.slice(pos);
			} else {
				var pre_quote = use_delim;
				use_delim = "";
			};
			ret = ret.slice(0,(ret.length-1)) + pre_quote + ret.slice((ret.length-1));
		};
	};
	return [ret,use_delim];
};
CSL.Output.Queue.normalizePrefixPunctuation = function(blobs){
	var punct = "";
	if ("object" == typeof blobs[0] && blobs[0].blobs.length){
		CSL.Output.Queue.normalizePrefixPunctuation(blobs[0].blobs);
	}
	if ("object" == typeof blobs){
		for (var pos=(blobs.length-1); pos > 0; pos += -1){
			if (!blobs[pos].blobs){
				continue;
			}
			var m = blobs[pos].strings.prefix.match(/^([!.?])(.*)/);
			if (m){
				blobs[pos].strings.prefix = m[2];
				if (["!",".","?"].indexOf(blobs[(pos-1)].strings.suffix.slice(-1)) > -1){
					blobs[(pos-1)].strings.suffix += m[1];
				}
			};
			if ("object" == typeof blobs[pos] && blobs[pos].blobs.length){
				CSL.Output.Queue.normalizePrefixPunctuation(blobs[pos].blobs);
			}
		};
	};
};
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
	for each (var date in sys.xml.getNodesByName(locale,'date')){
		//
		// Xml: get string value of attribute
		//
		this.locale[lang_out].dates[ sys.xml.getAttributeValue( date, "form") ] = date;
	};
};
CSL.substituteOne = function(template) {
	return function(state,list) {
		if (!list){
			return "";
		} else if ("string" == typeof list){
			return template.replace("%%STRING%%",list);
		};
		CSL.debug("USING is_delimiter (1) ... WHY?");
		var decor = template.split("%%STRING%%");
		var ret = [{"is_delimiter":true,"value":decor[0]}].concat(list);
		ret.push({"is_delimiter":true,"value":decor[1]});
		return ret;
	};
};
CSL.substituteTwo = function(template) {
	return function(param) {
		var template2 = template.replace("%%PARAM%%", param);
		return function(state,list) {
			if ("string" == typeof list){
				return template2.replace("%%STRING%%",list);
			}
			CSL.debug("USING is_delimiter (2) ... WHY?");
			var decor = template2.split("%%STRING");
			var ret = [{"is_delimiter":true,"value":decor[0]}].concat(list);
			ret.push({"is_delimiter":true,"value":decor[1]});
			return ret;
		};
	};
};
CSL.Mode = function(mode){
	var decorations = new Object();
	var params = CSL.Output.Formats[mode];
	for (var param in params) {
		if ("@" != param[0]){
			decorations[param] = params[param];
			continue;
		}
		var func = false;
		var val = params[param];
		var args = param.split('/');
		if (typeof val == "string" && val.indexOf("%%STRING%%") > -1)  {
			if (val.indexOf("%%PARAM%%") > -1) {
				func = CSL.substituteTwo(val);
			} else {
				func = CSL.substituteOne(val);
			}
		} else if (typeof val == "boolean" && !val) {
			func = CSL.Output.Formatters.passthrough;
		} else if (typeof val == "function") {
			func = val;
		} else {
			throw "CSL.Compiler: Bad "+mode+" config entry for "+param+": "+val;
		}
		if (args.length == 1) {
			decorations[args[0]] = func;
		} else if (args.length == 2) {
			if (!decorations[args[0]]) {
				decorations[args[0]] = new Object();
			}
			decorations[args[0]][args[1]] = func;
		}
	}
	return decorations;
};
CSL.setDecorations = function(state,attributes){
	var ret = new Array();
	for each (var key in CSL.FORMAT_KEY_SEQUENCE){
		if (attributes[key]){
			ret.push([key,attributes[key]]);
			delete attributes[key];
		}
	}
	return ret;
};
CSL.cloneAmbigConfig = function(config){
	var ret = new Object();
	ret["names"] = new Array();
	ret["givens"] = new Array();
	ret["year_suffix"] = false;
	ret["disambiguate"] = false;
	for (var i in config["names"]){
		var param = config["names"][i];
		ret["names"][i] = param;
	}
	for (var i in config["givens"]){
		var param = new Array();
		for (var j in config["givens"][i]){
			// condition at line 312 of disambiguate.js protects against negative
			// values of j
			param.push(config["givens"][i][j]);
		};
		ret["givens"].push(param);
	};
	ret["year_suffix"] = config["year_suffix"];
	ret["disambiguate"] = config["disambiguate"];
	return ret;
};
CSL.tokenExec = function(token,Item){
    var next = token.next;
	var maybenext = false;
	if (false){
		CSL.debug("---> Token: "+token.name+" ("+token.tokentype+") in "+this.tmp.area+", "+this.output.current.mystack.length);
	}
	if (token.evaluator){
	    next = token.evaluator(token,this,Item);
    };
	for each (var exec in token.execs){
	    maybenext = exec.call(token,this,Item);
		if (maybenext){
			next = maybenext;
		};
	};
	if (false){
		CSL.debug(token.name+" ("+token.tokentype+") ---> done");
	}
	return next;
};
CSL.expandMacro = function(macro_key_token){
	var mkey = macro_key_token.postponed_macro;
	if (this.build.macro_stack.indexOf(mkey) > -1){
		throw "CSL processor error: call to macro \""+mkey+"\" would cause an infinite loop";
	} else {
		this.build.macro_stack.push(mkey);
	}
	var start_token = new CSL.Token("group",CSL.START);
	start_token.decorations = this.decorations;
	for (var i in macro_key_token.strings){
		start_token.strings[i] = macro_key_token.strings[i];
	}
	var newoutput = function(state,Item){
		//state.output.openLevel(this);
		state.output.startTag("group",this);
		//state.tmp.decorations.push(this.decorations);
	};
	start_token["execs"].push(newoutput);
	this[this.build.area].tokens.push(start_token);
	var macroxml = this.sys.xml.getNodesByName( this.cslXml, 'macro', mkey);
	if (!this.sys.xml.getNodeValue( macroxml) ){
		throw "CSL style error: undefined macro \""+mkey+"\"";
	}
	var navi = new this._getNavi( this, macroxml );
	CSL.buildStyle.call(this,navi);
	var end_token = new CSL.Token("group",CSL.END);
	var mergeoutput = function(state,Item){
		//
		// rendering happens inside the
		// merge method, by applying decorations to
		// each token to be merged.
		state.output.endTag();
		//state.output.closeLevel();
	};
	end_token["execs"].push(mergeoutput);
	this[this.build.area].tokens.push(end_token);
	this.build.macro_stack.pop();
};
CSL.XmlToToken = function(state,tokentype){
	var name = state.sys.xml.nodename(this);
	if (state.build.skip && state.build.skip != name){
		return;
	}
	if (!name){
		var txt = state.sys.xml.content(this);
		if (txt){
			state.build.text = txt;
		}
		return;
	}
	if ( ! CSL.Node[state.sys.xml.nodename(this)]){
		throw "Undefined node name \""+name+"\".";
	}
	var attrfuncs = new Array();
	var attributes = state.sys.xml.attributes(this);
	var decorations = CSL.setDecorations.call(this,state,attributes);
	var token = new CSL.Token(name,tokentype);
	for (var key in attributes){
		try {
			CSL.Attributes[key].call(token,state,""+attributes[key]);
		} catch (e) {
			if (e == "TypeError: Cannot call method \"call\" of undefined"){
				throw "Unknown attribute \""+key+"\" in node \""+name+"\" while processing CSL file";
			} else {
				throw "CSL processor error, "+key+" attribute: "+e;
			}
		}
	}
	token.decorations = decorations;
	var target = state[state.build.area].tokens;
	CSL.Node[name].build.call(token,state,target);
};
dojo.provide("csl.build");
CSL.Engine = function(sys,style,lang) {
	this.sys = sys;
	this.sys.xml = new CSL.System.Xml.E4X();
	if ("string" != typeof style){
		style = "";
	};
	CSL.parallel.use_parallels = true;
	this.opt = new CSL.Engine.Opt();
	this.tmp = new CSL.Engine.Tmp();
	this.build = new CSL.Engine.Build();
	this.fun = new CSL.Engine.Fun();
	this.configure = new CSL.Engine.Configure();
	this.citation_sort = new CSL.Engine.CitationSort();
	this.bibliography_sort = new CSL.Engine.BibliographySort();
	this.citation = new CSL.Engine.Citation(this);
	this.bibliography = new CSL.Engine.Bibliography();
	this.output = new CSL.Output.Queue(this);
	this.dateput = new CSL.Output.Queue(this);
	this.cslXml = this.sys.xml.makeXml(style);
	this.opt["initialize-with-hyphen"] = true;
	this.setStyleAttributes();
	lang = this.opt["default-locale"][0];
	var langspec = CSL.localeResolve(lang);
	this.opt.lang = langspec.best;
	if (!CSL.locale[langspec.best]){
		var localexml = sys.xml.makeXml( sys.retrieveLocale(langspec.best) );
		CSL.localeSet.call(CSL,sys,localexml,langspec.best,langspec.best);
	}
	this.locale = new Object();
	var locale = sys.xml.makeXml();
	if (!this.locale[langspec.best]){
		CSL.localeSet.call(this,sys,this.cslXml,"",langspec.best);
		CSL.localeSet.call(this,sys,this.cslXml,langspec.bare,langspec.best);
		CSL.localeSet.call(this,sys,this.cslXml,langspec.best,langspec.best);
	}
	this._buildTokenLists("citation");
	this._buildTokenLists("bibliography");
	this.configureTokenLists();
	this.registry = new CSL.Registry(this);
	this.splice_delimiter = false;
	this.fun.flipflopper = new CSL.Util.FlipFlopper(this);
	this.setCloseQuotesArray();
	this.fun.ordinalizer.init(this);
	this.fun.long_ordinalizer.init(this);
	this.fun.page_mangler = CSL.Util.PageRangeMangler.getFunction(this);
	this.setOutputFormat("html");
};
CSL.Engine.prototype.setCloseQuotesArray = function(){
	var ret = [];
	ret.push(this.getTerm("close-quote"));
	ret.push(this.getTerm("close-inner-quote"));
	ret.push('"');
	ret.push("'");
	this.opt.close_quotes_array = ret;
};
CSL.Engine.prototype._buildTokenLists = function(area){
	var area_nodes = this.sys.xml.getNodesByName(this.cslXml, area);
	if (!this.sys.xml.getNodeValue( area_nodes)){
		return;
	};
	var navi = new this._getNavi( this, area_nodes );
	this.build.area = area;
	CSL.buildStyle.call(this,navi);
};
CSL.Engine.prototype.setStyleAttributes = function(){
	var dummy = new Object();
	dummy["name"] = this.sys.xml.nodename( this.cslXml );
	for each (var attr in this.sys.xml.attributes( this.cslXml) ){
		CSL.Attributes[("@"+this.sys.xml.getAttributeName(attr))].call(dummy,this,this.sys.xml.getAttributeValue(attr));
	}
}
CSL.buildStyle  = function(navi){
	if (navi.getkids()){
		CSL.buildStyle.call(this,navi);
	} else {
		if (navi.getbro()){
			CSL.buildStyle.call(this,navi);
		} else {
			while (navi.nodeList.length > 1) {
				if (navi.remember()){
					CSL.buildStyle.call(this,navi);
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
	var node = this.nodeList[this.depth][1][(this.nodeList[this.depth][0])];
	CSL.XmlToToken.call(node,this.state,CSL.END);
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
	if (this.sys.xml.numberofnodes(sneakpeek) == 0){
		// singleton, process immediately
		CSL.XmlToToken.call(currnode,this.state,CSL.SINGLETON);
		return false;
	} else {
		// if first node of a span, process it, then descend
		CSL.XmlToToken.call(currnode,this.state,CSL.START);
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
	this.fun.decorate = CSL.Mode(mode);
	if (!this.output[mode]){
		this.output[mode] = new Object();
		this.output[mode].tmp = new Object();
	};
};
CSL.Engine.prototype.setContainerTitleAbbreviations = function(abbrevs){
	this.opt["container-title-abbreviations"] = abbrevs;
};
CSL.Engine.prototype.getTerm = function(term,form,plural){
	var ret = CSL.Engine._getField(CSL.LOOSE,this.locale[this.opt.lang].terms,term,form,plural);
	if (typeof ret == "undefined"){
		ret = CSL.Engine._getField(CSL.STRICT,CSL.locale[this.opt.lang].terms,term,form,plural);
	};
	return ret;
};
CSL.Engine.prototype.getDate = function(form){
	if (this.locale[this.opt.lang].dates[form]){
		return this.locale[this.opt.lang].dates[form];
	} else {
		return CSL.locale[this.opt.lang].dates[form];
	}
};
CSL.Engine.prototype.getOpt = function(arg){
	if ("undefined" != typeof this.locale[this.opt.lang].opts[arg]){
		return this.locale[this.opt.lang].opts[arg];
	} else {
		return CSL.locale[this.opt.lang].opts[arg];
	}
};
CSL.Engine.prototype.getVariable = function(Item,varname,form,plural){
	return CSL.Engine._getField(CSL.LOOSE,Item,varname,form,plural);
};
CSL.Engine.prototype.getDateNum = function(ItemField,partname){
	if ("undefined" == typeof ItemField){
		return 0;
	} else {
		return ItemField[partname];
	};
};
CSL.Engine._getField = function(mode,hash,term,form,plural){
	var ret = "";
	if (!hash[term]){
		if (mode == CSL.STRICT){
			throw "Error in _getField: term\""+term+"\" does not exist.";
		} else {
			return undefined;
		}
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
		if ("string" == typeof hash[term]){
			ret = hash[term];
		} else if ("undefined" != typeof hash[term][f]){
			if ("string" == typeof hash[term][f]){
				ret = hash[term][f];
			} else {
				if ("number" == typeof plural){
					ret = hash[term][f][plural];
				} else {
					ret = hash[term][f][0];
				}
			}
			break;
		}
	}
	return ret;
}
CSL.Engine.prototype.configureTokenLists = function(){
	var dateparts_master = ["year","month","day"];
	for each (var area in ["citation","citation_sort","bibliography","bibliography_sort"]){
		for (var pos=(this[area].tokens.length-1); pos>-1; pos--){
			var token = this[area].tokens[pos];
			if ("date" == token.name && CSL.END == token.tokentype){
				var dateparts = [];
			}
			if ("date-part" == token.name && token.strings.name){
				for each (var part in dateparts_master){
					if (part == token.strings.name){
						dateparts.push(token.strings.name);
					};
				};
			};
			if ("date" == token.name && CSL.START == token.tokentype){
				dateparts.reverse();
				token.dateparts = dateparts;
			}
			token["next"] = (pos+1);
			//CSL.debug("setting: "+(pos+1)+" ("+token.name+")");
			if (token.name && CSL.Node[token.name].configure){
				CSL.Node[token.name].configure.call(token,this,pos);
			}
		}
	}
	this.version = CSL.version;
	return this.state;
};
CSL.Engine.prototype.getTextSubField = function(value,locale_type,use_default){
	var lst = value.split(/\s*:([-a-zA-Z]+):\s*/);
	value = undefined;
	var opt = this.opt[locale_type];
	for each (var o in opt){
		if (o && lst.indexOf(o) > -1 && lst.indexOf(o) % 2){
			value = lst[(lst.indexOf(o)+1)];
			break;
		}
	}
	if (!value && use_default){
		value = lst[0];
	}
	return value;
};
CSL.Engine.prototype.getNameSubFields = function(names){
	var pos = -1;
	var ret = new Array();
	var mode = "locale-name";
	var use_static_ordering = false;
	if (this.tmp.area.slice(-5) == "_sort"){
		mode = "locale-sort";
	}
	for (var name in names){
		//
		// clone the name object so we can trample on the content.
		//
		var newname = new Object();
		for (var i in names[name]){
			newname[i] = names[name][i];
		}
		var addme = true;
		var updateme = false;
		for each (var part in ["literal", "family"]){
			var p = newname[part];
			if (p){
				//
				// Add a static-ordering toggle for non-roman, non-Cyrillic
				// names.  Operate only on primary names (those that do not
				// have a language subtag).
				//
				if (newname[part].length && newname[part][0] != ":"){
					if (newname["static-ordering"]){
						use_static_ordering = true;
					} else if (!newname[part].match(CSL.ROMANESQUE_REGEXP)){
						use_static_ordering = true;
					} else {
						use_static_ordering = false;
					};
				};
				newname["static-ordering"] = use_static_ordering;
				var m = p.match(/^:([-a-zA-Z]+):\s+(.*)/);
				if (m){
					addme = false;
					for each (var o in this.opt[mode]){
						if (m[1] == o){
							updateme = true;
							newname[part] = m[2];
							break;
						};
					};
					if (!updateme){
						if (this.opt.lang){
							//
							// Fallback to style default language.
							//
							if (this.opt.lang.indexOf("-") > -1) {
								var newopt = this.opt.lang.slice(0,this.opt.lang.indexOf("-"));
							} else {
								var newopt = this.opt.lang;
							}
							if (m[1] == newopt){
								updateme = true;
								newname[part] = m[2];
								if (newname[part].match(CSL.ROMANESQUE_REGEXP)){
									newname["static-ordering"] = false;
								};
							};
						};
					};
				};
			};
		};
		if (addme){
			ret.push(newname);
			pos += 1;
		} else if (updateme){
			//
			// A true update rather than an overwrite
			// of the pointer.
			//
			for (var i in newname){
				ret[pos][i] = newname[i];
			}
		}
	};
	return ret;
};
CSL.Engine.prototype.retrieveItems = function(ids){
	var ret = [];
	for each (var id in ids){
		ret.push(this.sys.retrieveItem(id));
	}
	return ret;
};
CSL.Engine.prototype.dateParseArray = function( date_obj ){
	var ret = new Object();
	for (var field in date_obj){
		if (field == "date-parts"){
			var dp = date_obj["date-parts"];
			if ( dp.length > 1 ){
				if ( dp[0].length != dp[1].length){
					print("CSL data error: element mismatch in date range input.");
				}
			}
			var parts = ["year", "month", "day"];
			var exts = ["","_end"];
			for (var dpos in dp){
				for (var ppos in parts){
					ret[(parts[ppos]+exts[dpos])] = dp[dpos][ppos];
				}
			}
		} else {
			ret[field] = date_obj[field];
		}
	}
	return ret;
}
CSL.Engine.prototype.dateParseRaw = function(txt){
	var years = {};
	years["\u660E\u6CBB"] = 1867;
	years["\u5927\u6B63"] = 1911;
	years["\u662D\u548C"] = 1925;
	years["\u5E73\u6210"] = 1988;
	var m = txt.match(/(\u6708|\u5E74)/g,"-");
	if (m){
		txt = txt.replace(/\u65E5$/,"");
		txt = txt.replace(/(\u6708|\u5E74)/g,"-");
		txt = txt.replace(/〜/g,"/");
		var lst = txt.split(/(\u5E73\u6210|\u662D\u548C|\u5927\u6B63|\u660E\u6CBB)([0-9]+)/);
		var l = lst.length;
		for	(var pos=1; pos<l; pos+=3){
			lst[(pos+1)] = years[lst[(pos)]] + parseInt(lst[(pos+1)]);
			lst[pos] = "";
		}
		txt = lst.join("");
		txt = txt.replace(/\s*-\s*$/,"").replace(/\s*-\s*\//,"/");
	}
	var yearlast = "(?:[?0-9]{1,2}%%NUMD%%){0,2}[?0-9]{4}(?![0-9])";
	var yearfirst = "[?0-9]{4}(?:%%NUMD%%[?0-9]{1,2}){0,2}(?![0-9])";
	var number = "[?0-9]{1,3}";
	var rangesep = "[%%DATED%%]";
	var fuzzychar = "[?~]";
	var chars = "[a-zA-Z]+";
	var rex = "("+yearfirst+"|"+yearlast+"|"+number+"|"+rangesep+"|"+fuzzychar+"|"+chars+")";
	var rexdash = RegExp( rex.replace(/%%NUMD%%/g,"-").replace(/%%DATED%%/g,"-") );
	var rexdashslash = RegExp( rex.replace(/%%NUMD%%/g,"-").replace(/%%DATED%%/g,"\/") );
	var rexslashdash = RegExp( rex.replace(/%%NUMD%%/g,"\/").replace(/%%DATED%%/g,"-") );
	txt = txt.replace(/\.\s*$/,"");
	txt = txt.replace(/\.(?! )/,"");
	var slash = txt.indexOf("/");
	var dash = txt.indexOf("-");
	var seasonstrs = ["spr","sum","fal","win"];
	var seasonrexes = [];
	for each (var seasonstr in seasonstrs){
		seasonrexes.push( RegExp(seasonstr+".*") );
	}
	var datestrs = "jan feb mar apr may jun jul aug sep oct nov dec";
	datestrs = datestrs.split(" ");
	var daterexes = [];
	for each (var datestr in datestrs){
		daterexes.push( RegExp(datestr+".*") );
	}
	var number = "";
	var note = "";
	var thedate = {};
	if (txt.match(/^".*"$/)){
		thedate["literal"] = txt.slice(1,-1);
		return thedate;
	}
	if (slash > -1 && dash > -1){
		var slashcount = txt.split("/");
		if (slashcount.length > 3){
			var range_delim = "-";
			var date_delim = "/";
			var lst = txt.split( rexslashdash );
		} else {
			var range_delim = "/";
			var date_delim = "-";
			var lst = txt.split( rexdashslash );
		}
	} else {
		txt = txt.replace("/","-");
		var range_delim = "-";
		var date_delim = "-";
		var lst = txt.split( rexdash );
	};
	var ret = [];
	for each (item in lst) {
		var m = item.match(/^\s*([-\/]|[a-zA-Z]+|[-~?0-9]+)\s*$/);
	    if (m) {
			ret.push(m[1]);
		}
	}
	var delim_pos = ret.indexOf(range_delim);
	var delims = [];
	var isrange = false;
	if (delim_pos > -1){
		delims.push( [0,delim_pos] );
		delims.push( [(delim_pos+1),ret.length] );
		isrange = true;
	} else {
		delims.push([0,ret.length]);
	}
	var suff = "";
	for each (delim in delims){
		//
		// Process each element ...
		//
		var date = ret.slice(delim[0],delim[1]);
		for each (element in date){
			//
			// If it's a numeric date, process it.
			//
			if (element.indexOf(date_delim) > -1) {
				this.parseNumericDate(thedate,date_delim,suff,element);
				continue;
			}
			//
			// If it's an obvious year, record it.
			//
			if (element.match(/[0-9]{4}/)){
				thedate["year"+suff] = element.replace(/^0*/,"");
				continue;
			}
			//
			// If it's a month, record it.
			//
			var breakme = false;
			for (pos in daterexes){
				if (element.toLocaleLowerCase().match(daterexes[pos])){
					thedate["month"+suff] = ""+(parseInt(pos,10)+1);
					breakme = true;
					break;
				};
			};
			if (breakme){
				continue;
			}
			//
			// If it's a number, make a note of it
			//
			if (element.match(/^[0-9]+$/)){
				number = parseInt(element,10);
			}
			//
			// If it's a BC or AD marker, make a year of
			// any note.  Separate, reverse the sign of the year
			// if it's BC.
			//
			if (element.toLocaleLowerCase().match(/^bc.*/) && number){
				thedate["year"+suff] = ""+(number*-1);
				number = "";
				continue;
			}
			if (element.toLocaleLowerCase().match(/^ad.*/) && number){
				thedate["year"+suff] = ""+number;
				number = "";
				continue;
			}
			//
			// If it's a season, record it.
			//
			breakme = false;
			for (pos in seasonrexes){
				if (element.toLocaleLowerCase().match(seasonrexes[pos])){
					thedate["season"+suff] = ""+(parseInt(pos,10)+1);
					breakme = true;
					break;
				};
			};
			if (breakme){
				continue;
			}
			//
			// If it's a fuzzy marker, record it.
			//
			if (element == "~" || element == "?" || element == "c" || element.match(/cir.*/)){
				thedate.fuzzy = ""+1;
				continue;
			}
			//
			// If it's cruft, make a note of it
			//
			if (element.toLocaleLowerCase().match(/(?:mic|tri|hil|eas)/) && !thedate["season"+suff]){
				note = element;
				continue;
			}
		}
		//
		// If at the end of the string there's still a note
		// hanging around, make a day of it.
		//
		if (number){
			thedate["day"+suff] = number;
			number = "";
		}
		//
		// If at the end of the string there's cruft lying
		// around, and the season field is empty, put the
		// cruft there.
		//
		if (note && !thedate["season"+suff]){
			thedate["season"+suff] = note;
			note = "";
		}
		suff = "_end";
	}
	if (isrange){
		for each (var item in ["year", "month", "day", "season"]){
			if (thedate[item] && !thedate[item+"_end"]){
				thedate[item+"_end"] = thedate[item];
			} else if (!thedate[item] && thedate[item+"_end"]){
				thedate[item] = thedate[item+"_end"];
			};
		};
	};
	if (!thedate.year){
		thedate = { "literal": txt };
	}
	return thedate;
};
CSL.Engine.prototype.parseNumericDate = function(ret,delim,suff,txt){
	var lst = txt.split(delim);
	for each (var pos in [0,(lst.length-1)]){
		if (lst.length && lst[pos].length == 4){
			ret["year"+suff] = lst[pos].replace(/^0*/,"");
			if (!pos){
				lst = lst.slice(1);
			} else {
				lst = lst.slice(0,pos);
			}
			break;
		}
	}
	for (pos in lst){
		lst[pos] = parseInt(lst[pos],10);
	}
	if (lst.length == 1){
		ret["month"+suff] = ""+lst[0];
	} else if (lst.length == 2){
		if (lst[0] > 12){
			ret["month"+suff] = ""+lst[1];
			ret["day"+suff] = ""+lst[0];
		} else {
			ret["month"+suff] = ""+lst[0];
			ret["day"+suff] = ""+lst[1];
		};
	};
};
CSL.Engine.prototype.setOpt = function(token, name, value){
	if ( token.name == "style" ){
		this.opt[name] = value;
	} else if ( ["citation","bibliography"].indexOf(token.name) > -1){
		this[token.name].opt[name] = value;
	} else if (["name-form","name-delimiter","names-delimiter"].indexOf(name) == -1){
		token.strings[name] = value;
	}
}
CSL.Engine.prototype.fixOpt = function(token, name, localname){
	if ("citation" == token.name || "bibliography" == token.name){
		if (! this[token.name].opt[name] && "undefined" != this.opt[name]){
			this[token.name].opt[name] = this.opt[name];
		}
	}
	if ("name" == token.name || "names" == token.name){
		if (! token.strings[localname] && "undefined" != typeof this[this.build.area].opt[name]){
			token.strings[localname] = this[this.build.area].opt[name];
		}
	}
}
CSL.Engine.prototype.parseName = function(name){
	if (! name["non-dropping-particle"]){
		var m = name["family"].match(/^([ a-z]+)\s+(.*)/);
		if (m){
			name["non-dropping-particle"] = m[1];
			name["family"] = m[2];
		}
	}
	if (! name["suffix"]){
		var m = name["given"].match(/(.*)\s*,!*\s*(.*)$/);
		if (m){
			name["given"] = m[1];
			name["suffix"] = m[2];
			if (m[2].match(/.*[a-z].*/)){
				name["comma_suffix"] = true;
			}
		}
	}
	if (! name["dropping-particle"]){
		var m = name["given"].match(/^(.*?)\s+([ a-z]+)$/);
		if (m){
			name["given"] = m[1];
			name["dropping-particle"] = m[2];
		}
	}
}
dojo.provide("csl.state");
CSL.Engine.Opt = function (){
	this.has_disambiguate = false;
	this.mode = "html";
	this.dates = new Object();
	this["locale-sort"] = [];
	this["locale-pri"] = [];
	this["locale-sec"] = [];
	this["locale-name"] = [];
	this["default-locale"] = ["en"];
	this["et-al-min"] = 0;
	this["et-al-use-first"] = 1;
	this["et-al-subsequent-min"] = false;
	this["et-al-subsequent-use-first"] = false;
};
CSL.Engine.Tmp = function (){
	this.names_max = new CSL.Stack();
	this.names_base = new CSL.Stack();
	this.givens_base = new CSL.Stack();
	this.value = new Array();
	this.namepart_decorations = new Object();
	this.namepart_type = false;
	this.area = "citation";
	this.can_substitute = new CSL.Stack( 0, CSL.LITERAL);
	this.element_rendered_ok = false;
	this.element_trace = new CSL.Stack("style");
	this.nameset_counter = 0;
	this.term_sibling = new CSL.Stack( undefined, CSL.LITERAL);
	this.term_predecessor = false;
	this.jump = new CSL.Stack(0,CSL.LITERAL);
	this.decorations = new CSL.Stack();
	this.tokenstore_stack = new CSL.Stack();
	this.last_suffix_used = "";
	this.last_names_used = new Array();
	this.last_years_used = new Array();
	this.years_used = new Array();
	this.names_used = new Array();
	this.initialize_with = new CSL.Stack();
	this.disambig_request = false;
	this["name-as-sort-order"] = false;
	this.suppress_decorations = false;
	this.disambig_settings = new CSL.AmbigConfig();
	this.bib_sort_keys = new Array();
	this.prefix = new CSL.Stack("",CSL.LITERAL);
	this.suffix = new CSL.Stack("",CSL.LITERAL);
	this.delimiter = new CSL.Stack("",CSL.LITERAL);
};
CSL.Engine.Fun = function (){
	this.match = new  CSL.Util.Match();
	this.suffixator = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
	this.romanizer = new CSL.Util.Romanizer();
	this.ordinalizer = new CSL.Util.Ordinalizer();
	this.long_ordinalizer = new CSL.Util.LongOrdinalizer();
};
CSL.Engine.Build = function (){
	this["alternate-term"] = false;
	this.in_bibliography = false;
	this.in_style = false;
	this.skip = false;
	this.postponed_macro = false;
	this.layout_flag = false;
	this.name = false;
	this.form = false;
	this.term = false;
	this.macro = new Object();
	this.macro_stack = new Array();
	this.text = false;
	this.lang = false;
	this.area = "citation";
	this.substitute_level = new CSL.Stack( 0, CSL.LITERAL);
	this.render_nesting_level = 0;
	this.render_seen = false;
};
CSL.Engine.Configure = function (){
	this.fail = new Array();
	this.succeed = new Array();
};
CSL.Engine.Citation = function (state){
	 // Citation options area.
	 // Holds a mixture of persistent and ephemeral
	 // options and scratch data used during processing of
	 // a citation.</p>
	this.opt = new Object();
	this.tokens = new Array();
	this.srt = new CSL.Registry.Comparifier(state,"citation_sort");
	this.opt.collapse = new Array();
	this.opt["disambiguate-add-names"] = false;
	this.opt["disambiguate-add-givenname"] = false;
	this.opt["near-note-distance"] = 5;
};
CSL.Engine.Bibliography = function (){
	this.opt = new Object();
	this.tokens = new Array();
	this.opt.collapse = new Array();
	this.opt["disambiguate-add-names"] = false;
	this.opt["disambiguate-add-givenname"] = false;
};
CSL.Engine.BibliographySort = function (){
	this.tokens = new Array();
	this.opt = new Object();
	this.opt.sort_directions = new Array();
	this.keys = new Array();
};
CSL.Engine.CitationSort = function (){
	this.tokens = new Array();
	this.opt = new Object();
	this.opt.sort_directions = new Array();
	this.keys = new Array();
};
dojo.provide("csl.cmd_update");
CSL.Engine.prototype.updateItems = function(idList){
	var debug = false;
	if (debug){
		CSL.debug("--> init <--");
	};
	this.registry.init(idList);
	if (debug){
		CSL.debug("--> dodeletes <--");
	};
	this.registry.dodeletes(this.registry.myhash);
	if (debug){
		CSL.debug("--> doinserts <--");
	};
	this.registry.doinserts(this.registry.mylist);
	if (debug){
		CSL.debug("--> dorefreshes <--");
	};
	this.registry.dorefreshes();
	if (debug){
		CSL.debug("--> rebuildlist <--");
	};
	this.registry.rebuildlist();
	if (debug){
		CSL.debug("--> setdisambigs <--");
	};
	this.registry.setdisambigs();
	if (debug){
		CSL.debug("--> setsortkeys <--");
	};
	this.registry.setsortkeys();
	if (debug){
		CSL.debug("--> sorttokens <--");
	};
	this.registry.sorttokens();
	if (debug){
		CSL.debug("--> renumber <--");
	};
	this.registry.renumber();
	if (debug){
		CSL.debug("--> yearsuffix <--");
	};
	this.registry.yearsuffix();
	return this.registry.getSortedIds();
};
dojo.provide("csl.cmd_bibliography");
CSL.Engine.prototype.makeBibliography = function(bibsection){
	var debug = false;
	if (debug){
		for each (tok in this.bibliography.tokens){
			CSL.debug("bibtok: "+tok.name);
		}
		CSL.debug("---");
		for each (tok in this.citation.tokens){
			CSL.debug("cittok: "+tok.name);
		}
		CSL.debug("---");
		for each (tok in this.bibliography_sort.tokens){
			CSL.debug("bibsorttok: "+tok.name);
		}
	}
	var ret = CSL.getBibliographyEntries.call(this,bibsection);
	var params = {
		"maxoffset":0,
		"entryspacing":1,
		"linespacing":1
	};
	var maxoffset = 0;
	for each (var item in this.registry.reflist){
		if (item.offset > params.maxoffset){
			params.maxoffset = item.offset;
		};
	};
	if (this.bibliography.opt.hangingindent){
		params.hangingindent = this.bibliography.opt.hangingindent;
	}
	if (this.bibliography.opt.entryspacing){
		params.entryspacing = this.bibliography.opt.entryspacing;
	}
	if (this.bibliography.opt.linespacing){
		params.linespacing = this.bibliography.opt.linespacing;
	}
	return [params,ret];
};
CSL.getBibliographyEntries = function (bibsection){
	var ret = [];
	this.tmp.area = "bibliography";
	var input = this.retrieveItems(this.registry.getSortedIds());
	this.tmp.disambig_override = true;
	function eval_string(a,b){
		if (a == b){
			return true;
		}
		return false;
	}
	function eval_list(a,lst){
		for each (var b in lst){
			if (eval_string(a,b)){
				return true;
			}
		}
		return false;
	}
	function eval_spec(a,b){
		if ((a == "none" || !a) && !b){
			return true;
		}
		if ("string" == typeof b){
			return eval_string(a,b);
		} else {
			return eval_list(a,b);
		}
	}
	for each (var item in input){
		if (bibsection){
			var include = true;
			if (bibsection.include){
				//
				// Opt-in: these are OR-ed.
				//
				include = false;
				for each (spec in bibsection.include){
					if (eval_spec(spec.value,item[spec.field])){
						include = true;
						break;
					}
				}
			} else if (bibsection.exclude){
				//
				// Opt-out: these are also OR-ed.
				//
				var anymatch = false;
				for each (spec in bibsection.exclude){
					if (eval_spec(spec.value,item[spec.field])){
						anymatch = true;
						break;
					}
				}
				if (anymatch){
					include = false;
				}
			} else if (bibsection.select){
				//
				// Multiple condition opt-in: these are AND-ed.
				//
				include = false;
				var allmatch = true;
				for each (spec in bibsection.select){
					if (!eval_spec(spec.value,item[spec.field])){
						allmatch = false;
					}
				}
				if (allmatch){
					include = true;
				}
			}
			if (bibsection.quash){
				//
				// Stop criteria: These are AND-ed.
				//
				var allmatch = true;
				for each (spec in bibsection.quash){
					if (!eval_spec(spec.value,item[spec.field])){
						allmatch = false;
					}
				}
				if (allmatch){
					include = false;
				}
			}
			if ( !include ){
				continue;
			}
		}
		if (false){
			CSL.debug("BIB: "+item.id);
		}
		var bib_entry = new CSL.Token("group",CSL.START);
		bib_entry.decorations = [["@bibliography","entry"]];
		this.output.startTag("bib_entry",bib_entry);
		CSL.getCite.call(this,item);
		this.output.endTag(); // closes bib_entry
		ret.push(this.output.string(this,this.output.queue)[0]);
	}
	this.tmp.disambig_override = false;
	return ret;
};
dojo.provide("csl.commands");
CSL.Engine.prototype.makeCitationCluster = function(rawList,citation){
	var inputList = [];
	for each (var item in rawList){
		var Item = this.sys.retrieveItem(item.id);
		var newitem = CSL.composeItem(Item,item);
		inputList.push(newitem);
	}
	if (inputList && inputList.length > 1 && this["citation_sort"].tokens.length > 0){
		for (var k in inputList){
			inputList[k].sortkeys = CSL.getSortKeys.call(this,inputList[k],"citation_sort");
		}
		inputList.sort(this.citation.srt.compareKeys);
	};
	var str = CSL.getCitationCluster.call(this,inputList,citation);
	return str;
};
CSL.getAmbiguousCite = function(Item,disambig){
	if (disambig){
		this.tmp.disambig_request = disambig;
	} else {
		this.tmp.disambig_request = false;
	}
	this.tmp.area = "citation";
	this.tmp.suppress_decorations = true;
	this.tmp.force_subsequent = true;
	CSL.getCite.call(this,Item);
	this.tmp.force_subsequent = false;
	var ret = this.output.string(this,this.output.queue);
	this.tmp.suppress_decorations = false;
	if (false){
		CSL.debug("ok");
	}
	return ret;
}
CSL.composeItem = function(Item,params){
	var newItem = {};
	for (var i in Item){
		newItem[i] = Item[i];
	}
	for (var i in params){
		newItem[i] = params[i];
	}
	return newItem;
};
CSL.getSpliceDelimiter = function(last_collapsed){
	if (last_collapsed && ! this.tmp.have_collapsed && this["citation"].opt["after-collapse-delimiter"]){
		this.tmp.splice_delimiter = this["citation"].opt["after-collapse-delimiter"];
	}
	return this.tmp.splice_delimiter;
};
CSL.getCitationCluster = function (inputList,citation){
	this.tmp.area = "citation";
	var delimiter = "";
	var result = "";
	var objects = [];
	this.tmp.last_suffix_used = "";
	this.tmp.last_names_used = new Array();
	this.tmp.last_years_used = new Array();
	CSL.parallel.StartCitation();
	var myparams = new Array();
	for (var pos in inputList){
		var Item = inputList[pos];
		var last_collapsed = this.tmp.have_collapsed;
		var params = new Object();
		CSL.getCite.call(this,Item);
		if (pos == (inputList.length-1)){
			CSL.parallel.ComposeSet();
		}
		//
		// XXXXX: capture these parameters to an array, which
		// will be of the same length as this.output.queue,
		// corresponding to each element.
		//
		params.splice_delimiter = CSL.getSpliceDelimiter.call(this,last_collapsed);
		if (Item["author-only"]){
			this.tmp.suppress_decorations = true;
		}
		params.suppress_decorations = this.tmp.suppress_decorations;
		params.have_collapsed = this.tmp.have_collapsed;
		myparams.push(params);
	};
	CSL.parallel.PruneOutputQueue(this.output.queue,citation);
	var myblobs = this.output.queue.slice();
	for (var qpos in myblobs){
		this.output.queue = [myblobs[qpos]];
		this.tmp.suppress_decorations = myparams[qpos].suppress_decorations;
		this.tmp.splice_delimiter = myparams[qpos].splice_delimiter;
		this.tmp.have_collapsed = myparams[qpos].have_collapsed;
		var composite = this.output.string(this,this.output.queue);
		this.tmp.suppress_decorations = false;
		// meaningless assignment
		// this.tmp.handle_ranges = false;
		if (Item["author-only"]){
			return composite;
		}
		if (objects.length && "string" == typeof composite[0]){
			composite.reverse();
			objects.push(this.tmp.splice_delimiter + composite.pop());
		} else {
			composite.reverse();
			var compie = composite.pop();
			if ("undefined" != typeof compie){
				objects.push(compie);
			};
		}
		composite.reverse();
		for each (var obj in composite){
			if ("string" == typeof obj){
				objects.push(this.tmp.splice_delimiter + obj);
				continue;
			}
			var compie = composite.pop();
			if ("undefined" != typeof compie){
				objects.push(compie);
			};
		};
	};
	result += this.output.renderBlobs(objects)[0];
	if (result){
		result = this.citation.opt.layout_prefix + result + this.citation.opt.layout_suffix;
		if (!this.tmp.suppress_decorations){
			for each (var params in this.citation.opt.layout_decorations){
				result = this.fun.decorate[params[0]][params[1]](this,result);
			};
		};
	};
	return result;
};
CSL.getCite = function(Item){
	CSL.parallel.StartCite(Item);
	CSL.citeStart.call(this,Item);
	var next = 0;
	while(next < this[this.tmp.area].tokens.length){
		next = CSL.tokenExec.call(this,this[this.tmp.area].tokens[next],Item);
    }
	CSL.citeEnd.call(this,Item);
	CSL.parallel.CloseCite(this);
};
CSL.citeStart = function(Item){
	this.tmp.have_collapsed = true;
	this.tmp.render_seen = false;
	if (this.tmp.disambig_request  && ! this.tmp.disambig_override){
		this.tmp.disambig_settings = this.tmp.disambig_request;
	} else if (this.registry.registry[Item.id] && ! this.tmp.disambig_override) {
		this.tmp.disambig_request = this.registry.registry[Item.id].disambig;
		this.tmp.disambig_settings = this.registry.registry[Item.id].disambig;
	} else {
		this.tmp.disambig_settings = new CSL.AmbigConfig();
	}
	this.tmp.names_used = new Array();
	this.tmp.nameset_counter = 0;
	this.tmp.years_used = new Array();
	this.tmp.splice_delimiter = this[this.tmp.area].opt.delimiter;
	this["bibliography_sort"].keys = new Array();
	this["citation_sort"].keys = new Array();
	this.tmp.count_offset_characters = false;
	this.tmp.offset_characters = 0;
};
CSL.citeEnd = function(Item){
	if (this.tmp.last_suffix_used && this.tmp.last_suffix_used.match(/.*[-.,;:]$/)){
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.prefix.value() && this.tmp.prefix.value().match(/^[,,:;a-z].*/)){
		this.tmp.splice_delimiter = " ";
	}
	this.tmp.last_suffix_used = this.tmp.suffix.value();
	this.tmp.last_years_used = this.tmp.years_used.slice();
	this.tmp.last_names_used = this.tmp.names_used.slice();
	this.tmp.disambig_request = false;
	if (!this.tmp.suppress_decorations && this.tmp.offset_characters){
		this.registry.registry[Item.id].offset = this.tmp.offset_characters;
	}
};
CSL.Node = {};
CSL.Node.bibliography = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			CSL.parallel.use_parallels = false;
			state.fixOpt(this,"names-delimiter","delimiter");
			state.fixOpt(this,"name-delimiter","delimiter");
			state.fixOpt(this,"name-form","form");
			state.fixOpt(this,"and","and");
			state.fixOpt(this,"delimiter-precedes-last","delimiter-precedes-last");
			state.fixOpt(this,"initialize-with","initialize-with");
			state.fixOpt(this,"name-as-sort-order","name-as-sort-order");
			state.fixOpt(this,"sort-separator","sort-separator");
			state.fixOpt(this,"et-al-min","et-al-min");
			state.fixOpt(this,"et-al-use-first","et-al-use-first");
			state.fixOpt(this,"et-al-subsequent-min","et-al-subsequent-min");
			state.fixOpt(this,"et-al-subsequent-use-first","et-al-subsequent-use-first");
			state.build.area_return = state.build.area;
			state.build.area = "bibliography";
		}
		if (this.tokentype == CSL.END){
			state.build.area = state.build.area_return;
		}
		target.push(this);
	};
};
CSL.Node.choose = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		if (this.tokentype == CSL.START){
			var func = function(state,Item){ //open condition
				state.tmp.jump.push(undefined, CSL.LITERAL);
			};
		}
		if (this.tokentype == CSL.END){
			var func = function(state,Item){ //close condition
				state.tmp.jump.pop();
			};
		}
		this["execs"].push(func);
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.END){
			state.configure["fail"].push((pos));
			state.configure["succeed"].push((pos));
		} else {
			state.configure["fail"].pop();
			state.configure["succeed"].pop();
		}
	}
};
CSL.Node.citation = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START) {
			state.fixOpt(this,"names-delimiter","delimiter");
			state.fixOpt(this,"name-delimiter","delimiter");
			state.fixOpt(this,"name-form","form");
			state.fixOpt(this,"and","and");
			state.fixOpt(this,"delimiter-precedes-last","delimiter-precedes-last");
			state.fixOpt(this,"initialize-with","initialize-with");
			state.fixOpt(this,"name-as-sort-order","name-as-sort-order");
			state.fixOpt(this,"sort-separator","sort-separator");
			state.fixOpt(this,"et-al-min","et-al-min");
			state.fixOpt(this,"et-al-use-first","et-al-use-first");
			state.fixOpt(this,"et-al-subsequent-min","et-al-subsequent-min");
			state.fixOpt(this,"et-al-subsequent-use-first","et-al-subsequent-use-first");
			state.build.area_return = state.build.area;
			state.build.area = "citation";
		}
		if (this.tokentype == CSL.END) {
			state.build.area = state.build.area_return;
		}
	}
};
CSL.Node.date = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START || this.tokentype == CSL.SINGLETON){
			//
			// If form is set, the date form comes from the locale, and date-part
			// will just tinker with the formatting.
			//
			if (this.strings.form){
				if (state.getDate(this.strings.form)){
					//
					// Xml: Copy a node
					//
					var datexml = state.sys.xml.nodeCopy( state.getDate(this.strings.form) );
					//
					// Xml: Set attribute
					//
					state.sys.xml.setAttribute( datexml, 'variable', this.variables[0] );
					if (this.strings.prefix){
						//
						// Xml: Set attribute
						//
						state.sys.xml.setAttribute( datexml, "prefix", this.strings.prefix);
					}
					if (this.strings.suffix){
						//
						// Xml: Set attribute
						//
						state.sys.xml.setAttribute( datexml, "suffix", this.strings.suffix);
					}
					//
					// Xml: Delete attribute
					//
					state.sys.xml.deleteAttribute(datexml,'form');
					if (this.strings["date-parts"] == "year"){
						//
						// Xml: Find one node by attribute and delete
						//
						state.sys.xml.deleteNodeByNameAttribute(datexml,'month');
						//
						// Xml: Find one node by attribute and delete
						//
						state.sys.xml.deleteNodeByNameAttribute(datexml,'day');
					} else if (this.strings["date-parts"] == "year-month"){
						//
						// Xml: Find one node by attribute and delete
						//
						state.sys.xml.deleteNodeByNameAttribute(datexml,'day');
					}
					//
					// pass this xml object through to state.build for
					// post processing by date-part and in END or at the finish of
					// SINGLETON.  Delete after processing.
					//
					//
					// Xml: Copy node
					//
					state.build.datexml = state.sys.xml.nodeCopy( datexml );
				};
			} else {
				CSL.Util.substituteStart.call(this,state,target);
				var set_value = function(state,Item){
					state.tmp.element_rendered_ok = false;
					state.tmp.donesies = [];
					state.tmp.dateparts = [];
					var dp = [];
					if (this.variables.length && Item[this.variables[0]]){
						CSL.parallel.StartVariable(this.variables[0]);
						var date_obj = Item[this.variables[0]];
						if (date_obj.raw){
							state.tmp.date_object = state.dateParseRaw( date_obj.raw );
						} else if (date_obj["date-parts"]) {
							state.tmp.date_object = state.dateParseArray( date_obj );
						}
						//
						// Call a function here to analyze the
						// data and set the name of the date-part that
						// should collapse for this range, if any.
						//
						// (1) build a filtered list, in y-m-d order,
						// consisting only of items that are (a) in the
						// date-parts and (b) in the *_end data.
						// (note to self: remember that season is a
						// fallback var when month and day are empty)
						for each (var part in this.dateparts){
							if ("undefined" != typeof state.tmp.date_object[(part+"_end")]){
								dp.push(part);
							} else if (part == "month" && "undefined" != typeof state.tmp.date_object["season_end"]) {
								dp.push(part);
							};
						};
						//
						// (2) Reverse the list and step through in
						// reverse order, popping each item if the
						// primary and *_end data match.
						var mypos = -1;
						for (var pos=(dp.length-1); pos>-1; pos += -1){
							var part = dp[pos];
							var start = state.tmp.date_object[part];
							var end = state.tmp.date_object[(part+"_end")];
							if (start != end){
								mypos = pos;
								break;
							};
						};
						//
						// (3) When finished, the first item in the
						// list, if any, is the date-part where
						// the collapse should occur.
						state.tmp.date_collapse_at = dp.slice(0,(mypos+1));
						//
						// The collapse itself will be done by appending
						// string output for the date, less suffix,
						// placing a delimiter on output, then then
						// doing the *_end of the range, dropping only
						// the prefix.  That should give us concise expressions
						// of ranges.
						//
						// Numeric dates should not collapse, though,
						// and should probably use a slash delimiter.
						// Scope for configurability will remain (all over
						// the place), but this will do to get this feature
						// started.
						//
					} else {
						state.tmp.date_object = false;
					}
				};
				this["execs"].push(set_value);
				var newoutput = function(state,Item){
					state.output.startTag("date",this);
					var tok = new CSL.Token("date-part",CSL.SINGLETON);
					//
					// if present, sneak in a literal here and quash the remainder
					// of output from this date.
					//
					if (state.tmp.date_object["literal"]){
						CSL.parallel.AppendToVariable(state.tmp.date_object["literal"]);
						state.output.append(state.tmp.date_object["literal"],tok);
						state.tmp.date_object = {};
					}
					tok.strings.suffix = " ";
				};
				this["execs"].push(newoutput);
			};
		};
		if (this.tokentype == CSL.END || this.tokentype == CSL.SINGLETON){
			if (this.strings.form && state.build.datexml){
				// Apparently this is all that is required to compile
				// the XML chunk into the style.  Same as for macros.
				//
				var datexml = state.build.datexml;
				delete state.build.datexml;
				var navi = new state._getNavi( state, datexml );
				CSL.buildStyle.call(state,navi);
			} else {
				var mergeoutput = function(state,Item){
					state.output.endTag();
					CSL.parallel.CloseVariable();
				};
				this["execs"].push(mergeoutput);
			}
		};
		target.push(this);
		if (this.tokentype == CSL.END){
			CSL.Util.substituteEnd.call(this,state,target);
		};
	};
};
CSL.Node["date-part"] = new function(){
	this.build = build;
	function build(state,target){
		if (!this.strings.form){
			this.strings.form = "long";
		}
		if (state.build.datexml){
			for each (var decor in this.decorations){
				//
				// Xml: find one node by attribute value and set attribute value
				//
				state.sys.xml.setAttributeOnNodeIdentifiedByNameAttribute(state.build.datexml,'date-part',this.strings.name,decor[0],decor[1]);
			};
			for (var attr in this.strings){
				if (attr == "name" || attr == "prefix" || attr == "suffix"){
					continue;
				};
				//
				// Xml: find one node by attribute value and set attribute value
				//
				state.sys.xml.setAttributeOnNodeIdentifiedByNameAttribute(state.build.datexml,'date-part',this.strings.name,attr,this.strings[attr]);
			}
		} else {
			//
			// Set delimiter here, if poss.
			//
			var render_date_part = function(state,Item){
				var value = "";
				var value_end = "";
				state.tmp.donesies.push(this.strings.name);
				if (state.tmp.date_object){
					value = state.tmp.date_object[this.strings.name];
					value_end = state.tmp.date_object[(this.strings.name+"_end")];
				};
				var real = !state.tmp.suppress_decorations;
				var have_collapsed = state.tmp.have_collapsed;
				var invoked = state[state.tmp.area].opt.collapse == "year-suffix" || state[state.tmp.area].opt.collapse == "year-suffix-ranged";
				var precondition = state[state.tmp.area].opt["disambiguate-add-year-suffix"];
				if (real && precondition && invoked){
					state.tmp.years_used.push(value);
					var known_year = state.tmp.last_years_used.length >= state.tmp.years_used.length;
					if (known_year && have_collapsed){
						if (state.tmp.last_years_used[(state.tmp.years_used.length-1)] == value){
							value = false;
						};
					};
				};
				if (value){
					var bc = false;
					var ad = false;
					if ("year" == this.strings.name && parseInt(value,10) < 500 && parseInt(value,10) > 0){
						ad = state.getTerm("ad");
					};
					if ("year" == this.strings.name && parseInt(value,10) < 0){
						bc = state.getTerm("bc");
						value = (parseInt(value,10) * -1);
					};
					CSL.parallel.AppendToVariable(value);
					if (this.strings.form){
						value = CSL.Util.Dates[this.strings.name][this.strings.form](state,value);
						if (value_end){
							value_end = CSL.Util.Dates[this.strings.name][this.strings.form](state,value_end);
						}
					};
					if (state.tmp.date_collapse_at.length){
						//state.output.startTag(this.strings.name,this);
						var ready = true;
						for each (var item in state.tmp.date_collapse_at){
							if (state.tmp.donesies.indexOf(item) == -1){
								ready = false;
								break;
							}
						}
						if (ready){
							if (value_end != "0"){
								state.dateput.append(value_end,this);
							}
							state.output.append(value,this);
							var curr = state.output.current.value();
							curr.blobs[(curr.blobs.length-1)].strings.suffix="";
							state.output.append(this.strings["range-delimiter"],"empty");
							var dcurr = state.dateput.current.value();
							curr.blobs = curr.blobs.concat(dcurr);
							state.dateput.string(state,state.dateput.queue);
							state.tmp.date_collapse_at = [];
						} else {
							state.output.append(value,this);
							if (state.tmp.date_collapse_at.indexOf(this.strings.name) > -1){
								//
								// Use ghost dateput queue
								//
								if (value_end != "0"){
									state.dateput.append(value_end,this);
								}
							}
						}
					} else {
						state.output.append(value,this);
					}
					if (bc){
						state.output.append(bc);
					}
					if (ad){
						state.output.append(ad);
					}
					//state.output.endTag();
				} else if ("month" == this.strings.name) {
					//
					// No value for this target variable
					//
					if (state.tmp.date_object["season"]){
						value = ""+state.tmp.date_object["season"];
						if (value && value.match(/^[1-4]$/)){
							state.output.append(state.getTerm(("season-0"+value)),this);
						} else if (value){
							state.output.append(value,this);
						};
					};
				};
				state.tmp.value = new Array();
				if (!state.opt.has_year_suffix && "year" == this.strings.name){
					if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
						var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
						var number = new CSL.NumericBlob(num,this);
						var formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
						number.setFormatter(formatter);
						state.output.append(number,"literal");
					};
				};
			};
			if ("undefined" == typeof this.strings["range-delimiter"]){
				this.strings["range-delimiter"] = "-";
			}
			this["execs"].push(render_date_part);
			target.push(this);
		};
	};
};
CSL.Node["else-if"] = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		if (this.tokentype == CSL.START){
			//for each (var variable in this.variables){
			//	var func = function(state,Item){
			//		if (Item[variable]){
			//			return true;
			//		}
			//		return false;
			//	};
			//	this["tests"].push(func);
			//};
			if (this.strings.position){
				var tryposition = this.strings.position;
				var func = function(state,Item){
					if (state.tmp.force_subsequent && tryposition < 2){
						return true;
					} else if (Item["position"] && Item["position"] >= tryposition){
						return true;
					};
					return false;
				};
				this.tests.push(func);
			}
			if (! this.evaluator){
				//
				// cut and paste of "any"
				this.evaluator = state.fun.match.any;
			};
		}
		if (this.tokentype == CSL.END){
			var closingjump = function(state,Item){
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this["execs"].push(closingjump);
		};
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			// jump index on failure
			this["fail"] = state.configure["fail"].slice(-1)[0];
			this["succeed"] = this["next"];
			state.configure["fail"][(state.configure["fail"].length-1)] = pos;
		} else {
			// jump index on success
			this["succeed"] = state.configure["succeed"].slice(-1)[0];
			this["fail"] = this["next"];
		}
	}
};
CSL.Node["else"] = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			state.configure["fail"][(state.configure["fail"].length-1)] = pos;
		}
	}
};
CSL.Node["et-al"] = new function(){
	this.build = build;
	function build(state,target){
		var set_et_al_format = function(state,Item){
			state.output.addToken("etal",false,this);
		};
		this["execs"].push(set_et_al_format);
		target.push(this);
	};
};
CSL.Node.group = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START){
			CSL.Util.substituteStart.call(this,state,target);
			if (state.build.substitute_level.value()){
				state.build.substitute_level.replace((state.build.substitute_level.value()+1));
			}
			if (CSL.GROUP_CLASSES.indexOf(this.strings.cls) > -1){
				this.decorations.push(["@display",this.strings.cls]);
			};
			var newoutput = function(state,Item){
				state.output.startTag("group",this);
			};
			//
			// Paranoia.  Assure that this init function is the first executed.
			var execs = new Array();
			execs.push(newoutput);
			this.execs = execs.concat(this.execs);
			var fieldcontentflag = function(state,Item){
				state.tmp.term_sibling.push( undefined, CSL.LITERAL );
			};
			this["execs"].push(fieldcontentflag);
		} else {
			var quashnonfields = function(state,Item){
				var flag = state.tmp.term_sibling.value();
				if (false == flag){
					state.output.clearlevel();
				}
				state.tmp.term_sibling.pop();
				//
				// Heals group quashing glitch with nested groups.
				//
				if (flag && state.tmp.term_sibling.mystack.length > 1){
					state.tmp.term_sibling.replace(true);
				}
			};
			this["execs"].push(quashnonfields);
			var mergeoutput = function(state,Item){
				//
				// rendering happens inside the
				// merge method, by applying decorations to
				// each token to be merged.
				state.output.endTag();
			};
			this["execs"].push(mergeoutput);
		}
		target.push(this);
		if (this.tokentype == CSL.END){
			if (state.build.substitute_level.value()){
				state.build.substitute_level.replace((state.build.substitute_level.value()-1));
			}
			CSL.Util.substituteEnd.call(this,state,target);
		}
	}
};
CSL.Node["if"] = new function(){
	this.build = build;
	this.configure = configure;
	function build (state,target){
		if (this.tokentype == CSL.START){
			//for each (var variable in this.variables){
			//	CSL.debug("outside function: "+variable);
			//	var func = function(state,Item){
			//		CSL.debug("inside function: "+variable);
			//		if (Item[variable]){
			//			CSL.debug("found: "+variable);
			//			return true;
			//		}
			//		return false;
			//	};
			//	this["tests"].push(func);
			//};
			if (this.strings.position){
				var tryposition = this.strings.position;
				var func = function(state,Item){
					if (state.tmp.force_subsequent && tryposition < 2){
						return true;
					} else if (Item["position"] && Item["position"] >= tryposition){
						return true;
					};
					return false;
				};
				this.tests.push(func);
			}
			if (this.strings["near-note-distance-check"]){
				var func = function (state,Item){
					if (state.tmp.force_subsequent){
						return true;
					} else if (!Item["note_distance"]){
					return false;
					} else {
						if (Item["note_distance"] > state.citation.opt["near-note-distance"]){
							return false;
						} else {
							return true;
						};
					};
				};
				this.tests.push(func);
			};
			if (! this.evaluator){
				//
				// cut and paste of "any"
				this.evaluator = state.fun.match.any;
			};
		}
		if (this.tokentype == CSL.END){
			var closingjump = function(state,Item){
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this["execs"].push(closingjump);
		};
		target.push(this);
	}
	function configure(state,pos){
		if (this.tokentype == CSL.START){
			// jump index on failure
			this["fail"] = state.configure["fail"].slice(-1)[0];
			this["succeed"] = this["next"];
		} else {
			// jump index on success
			this["succeed"] = state.configure["succeed"].slice(-1)[0];
			this["fail"] = this["next"];
		}
	}
};
CSL.Node.info = new function(){
	this.build = build;
	function build (state,target){
		if (this.tokentype == CSL.START){
			state.build.skip = "info";
		} else {
			state.build.skip = false;
		}
	};
};
CSL.Node.key = new function(){
	this.build = build;
	function build(state,target){
		var start_key = new CSL.Token("key",CSL.START);
		start_key.strings["et-al-min"] = this.strings["et-al-min"];
		start_key.strings["et-al-use-first"] = this.strings["et-al-use-first"];
		var initialize_done_vars = function(state,Item){
			state.tmp.done_vars = new Array();
		};
		start_key.execs.push(initialize_done_vars);
		var sort_direction = new Array();
		if (this.strings.sort_direction == CSL.DESCENDING){
			sort_direction.push(1);
			sort_direction.push(-1);
		} else {
			sort_direction.push(-1);
			sort_direction.push(1);
		}
		state[state.build.area].opt.sort_directions.push(sort_direction);
		var et_al_init = function(state,Item){
			state.tmp.sort_key_flag = true;
			if (this.strings["et-al-min"]){
				state.tmp["et-al-min"] = this.strings["et-al-min"];
			}
			if (this.strings["et-al-use-first"]){
				state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
			}
		};
		start_key["execs"].push(et_al_init);
		target.push(start_key);
		//
		// ops to initialize the key's output structures
		if (this.variables.length){
			var variable = this.variables[0];
			if (CSL.CREATORS.indexOf(variable) > -1) {
				//
				// Start tag
				var names_start_token = new CSL.Token("names",CSL.START);
				names_start_token.tokentype = CSL.START;
				names_start_token.variables = this.variables;
				CSL.Node.names.build.call(names_start_token,state,target);
				//
				// Middle tag
				var name_token = new CSL.Token("name",CSL.SINGLETON);
				name_token.tokentype = CSL.SINGLETON;
				name_token.strings["name-as-sort-order"] = "all";
				CSL.Node.name.build.call(name_token,state,target);
				//
				// End tag
				var names_end_token = new CSL.Token("names",CSL.END);
				names_end_token.tokentype = CSL.END;
				CSL.Node.names.build.call(names_end_token,state,target);
			} else {
				var single_text = new CSL.Token("text",CSL.SINGLETON);
				if (variable == "citation-number"){
					var output_func = function(state,Item){
						state.output.append(state.registry.registry[Item["id"]].seq.toString(),"empty");
					};
				} else if (CSL.DATE_VARIABLES.indexOf(variable) > -1) {
					var output_func = function(state,Item){
						if (Item[variable]){
							var dp = Item[variable]["date-parts"];
							if (dp && dp[0]){
								if (dp[0].length >0){
									state.output.append(CSL.Util.Dates.year["long"](state,dp[0][0]));
								}
								if (dp[0].length >1){
									state.output.append(CSL.Util.Dates.month["numeric-leading-zeros"](state,dp[0][1]));
								}
								if (dp[0].length >2){
									state.output.append(CSL.Util.Dates.day["numeric-leading-zeros"](state,dp[0][2]));
								}
							}
						};
					};
				} else if ("title" == variable) {
					var output_func = function(state,Item){
						var value = Item[variable];
						if (value){
							value = state.getTextSubField(value,"locale-sort",true);
							state.output.append(value,"empty");
						};
					};
				} else {
					var output_func = function(state,Item){
						state.output.append(Item[variable],"empty");
					};
				};
				single_text["execs"].push(output_func);
				target.push(single_text);
			};
		} else {
			//
			// if it's not a variable, it's a macro
			var token = new CSL.Token("text",CSL.SINGLETON);
			token.postponed_macro = this.postponed_macro;
			CSL.expandMacro.call(state,token);
		}
		//
		// ops to output the key string result to an array go
		// on the closing "key" tag before it is pushed.
		// Do not close the level.
		var end_key = new CSL.Token("key",CSL.END);
		var store_key_for_use = function(state,Item){
			var keystring = state.output.string(state,state.output.queue);
			if (false){
				CSL.debug("keystring: "+keystring+" "+typeof keystring);
			}
			if ("string" != typeof keystring){
				keystring = undefined;
			}
			state[state.tmp.area].keys.push(keystring);
			state.tmp.value = new Array();
		};
		end_key["execs"].push(store_key_for_use);
		var reset_key_params = function(state,Item){
			// state.tmp.name_quash = new Object();
			state.tmp["et-al-min"] = false;
			state.tmp["et-al-use-first"] = false;
			state.tmp.sort_key_flag = false;
		};
		end_key["execs"].push(reset_key_params);
		target.push(end_key);
	};
};
CSL.Node.label = new function(){
	this.build = build;
	function build(state,target){
		if (state.build.name_flag){
			this.strings.label_position = CSL.AFTER;
		} else {
			this.strings.label_position = CSL.BEFORE;
		}
		var set_label_info = function(state,Item){
			state.output.addToken("label",false,this);
		};
		this["execs"].push(set_label_info);
		if (state.build.term){
			var term = state.build.term;
			var plural = 0;
			if (!this.strings.form){
				this.strings.form = "long";
			}
			var form = this.strings.form;
			if ("number" == typeof this.strings.plural){
				plural = this.strings.plural;
				CSL.debug("plural: "+this.strings.plural);
			}
			var output_label = function(state,Item){
				if ("locator" == term){
					myterm = Item["label"];
				}
				if (!myterm){
					myterm = "page";
				}
				var myterm = state.getTerm(myterm,form,plural);
				if (this.strings["include-period"]){
					myterm += ".";
				}
				state.output.append(myterm,this);
			};
			this.execs.push(output_label);
			state.build.plural = false;
			state.build.term = false;
			state.build.form = false;
		}
		target.push(this);
	};
};
CSL.Node.layout = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			state.build.layout_flag = true;
			//
			// done_vars is used to prevent the repeated
			// rendering of variables
			var initialize_done_vars = function(state,Item){
				state.tmp.done_vars = new Array();
				//CSL.debug("== init rendered_name ==");
				state.tmp.rendered_name = false;
			};
			this.execs.push(initialize_done_vars);
			var set_opt_delimiter = function(state,Item){
				// just in case
				state.tmp.sort_key_flag = false;
				state[state.tmp.area].opt.delimiter = "";
				if (this.strings.delimiter){
					state[state.tmp.area].opt.delimiter = this.strings.delimiter;
				};
			};
			this["execs"].push(set_opt_delimiter);
			var reset_nameset_counter = function(state,Item){
				state.tmp.nameset_counter = 0;
			};
			this["execs"].push(reset_nameset_counter);
			state[state.build.area].opt.layout_prefix = this.strings.prefix;
			state[state.build.area].opt.layout_suffix = this.strings.suffix;
			state[state.build.area].opt.layout_delimiter = this.strings.delimiter;
			state[state.build.area].opt.layout_decorations = this.decorations;
			var declare_thyself = function(state,Item){
				state.tmp.term_predecessor = false;
				state.output.openLevel("empty");
			};
			this["execs"].push(declare_thyself);
			target.push(this);
			if (state.build.area == "citation"){
				var prefix_token = new CSL.Token("text",CSL.SINGLETON);
				var func = function(state,Item){
					if (Item["prefix"]){
						var sp = "";
						if (Item["prefix"].match(CSL.ROMANESQUE_REGEXP)){
							var sp = " ";
						}
						state.output.append((Item["prefix"]+sp),this);
					};
				};
				prefix_token["execs"].push(func);
				target.push(prefix_token);
			}
		};
		if (this.tokentype == CSL.END){
			state.build.layout_flag = false;
			if (state.build.area == "citation"){
				var suffix_token = new CSL.Token("text",CSL.SINGLETON);
				var func = function(state,Item){
					if (Item["suffix"]){
						var sp = "";
						if (Item["suffix"].match(CSL.ROMANESQUE_REGEXP)){
							var sp = " ";
						}
						state.output.append((sp+Item["suffix"]),this);
					};
				};
				suffix_token["execs"].push(func);
				target.push(suffix_token);
			}
			var mergeoutput = function(state,Item){
				if (state.tmp.area == "bibliography"){
					if (state.bibliography.opt["second-field-align"]){
						state.output.endTag();  // closes bib_other
					};
				};
				state.output.closeLevel();
			};
			this["execs"].push(mergeoutput);
			target.push(this);
		}
	};
};
CSL.Node.macro = new function(){
	this.build = build;
	function build (state,target){
	};
};
CSL.Node.name = new function(){
	this.build = build;
	function build(state,target){
		state.fixOpt(this,"name-delimiter","delimiter");
		state.fixOpt(this,"name-form","form");
		//
		// Okay, there's a problem with these.  Each of these is set
		// on the name object, but must be accessible at the closing of
		// the enclosing names object.  How did I do this before?
		//
		// Boosting to tmp seems to be the current strategy, and although
		// that's very messy, it does work.  It would be simple enough
		// to extend the function applied to initialize-with below (which
		// tests okay) to the others.  Probably that's the best short-term
		// solution.
		//
		// The boost to tmp could be a boost to build, instead.  That would
		// limit the jiggery-pokery and overhead to the compile phase.
		// Might save a few trees, in aggregate.
		//
		state.fixOpt(this,"and","and");
		state.fixOpt(this,"delimiter-precedes-last","delimiter-precedes-last");
		state.fixOpt(this,"initialize-with","initialize-with");
		state.fixOpt(this,"name-as-sort-order","name-as-sort-order");
		state.fixOpt(this,"sort-separator","sort-separator");
		state.fixOpt(this,"et-al-min","et-al-min");
		state.fixOpt(this,"et-al-use-first","et-al-use-first");
		state.fixOpt(this,"et-al-subsequent-min","et-al-subsequent-min");
		state.fixOpt(this,"et-al-subsequent-use-first","et-al-subsequent-use-first");
		state.build.nameattrs = new Object();
		for each (attrname in CSL.NAME_ATTRIBUTES){
			state.build.nameattrs[attrname] = this.strings[attrname];
		}
		state.build.form = this.strings.form;
		state.build.name_flag = true;
			var set_et_al_params = function(state,Item){
				if (Item.position || state.tmp.force_subsequent){
						if (! state.tmp["et-al-min"]){
							if (this.strings["et-al-subsequent-min"]){
								state.tmp["et-al-min"] = this.strings["et-al-subsequent-min"];
							} else {
								state.tmp["et-al-min"] = this.strings["et-al-min"];
							}
						}
						if (! state.tmp["et-al-use-first"]){
							if (this.strings["et-al-subsequent-use-first"]){
								state.tmp["et-al-use-first"] = this.strings["et-al-subsequent-use-first"];
							} else {
								state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
							}
						}
				} else {
						if (! state.tmp["et-al-min"]){
							state.tmp["et-al-min"] = this.strings["et-al-min"];
						}
						if (! state.tmp["et-al-use-first"]){
							state.tmp["et-al-use-first"] = this.strings["et-al-use-first"];
						}
				}
			};
			this["execs"].push(set_et_al_params);
		var func = function(state,Item){
			state.output.addToken("name",false,this);
		};
		this["execs"].push(func);
		//var set_initialize_with = function(state,Item){
		//	state.tmp["initialize-with"] = this.strings["initialize-with"];
		//};
		//this["execs"].push(set_initialize_with);
		target.push(this);
	};
};
CSL.Node["name-part"] = new function(){
	this.build = build;
	function build(state,target){
		var set_namepart_format = function(state,Item){
			state.output.addToken(state.tmp.namepart_type,false,this);
		};
		this["execs"].push(set_namepart_format);
		target.push(this);
	};
};
CSL.Node.names = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START || this.tokentype == CSL.SINGLETON){
			CSL.Util.substituteStart.call(this,state,target);
			state.build.substitute_level.push(1);
			state.fixOpt(this,"names-delimiter","delimiter");
			var init_names = function(state,Item){
				CSL.parallel.StartVariable("names");
				if (state.tmp.value.length == 0){
					for each (var variable in this.variables){
						if (Item[variable]){
							var filtered_names = state.getNameSubFields(Item[variable]);
							// filtered_names = CSL.Util.Names.rescueNameElements(filtered_names);
							state.tmp.names_max.push(filtered_names.length);
							state.tmp.value.push({"type":variable,"names":filtered_names});
							// saving relevant names separately, for reference
							// in splice collapse and in subsequent-author-substitute
							state.tmp.names_used.push(state.tmp.value.slice());
						}
					};
				}
			};
			this["execs"].push(init_names);
		};
		if (this.tokentype == CSL.START){
			state.build.names_flag = true;
			var init_can_substitute = function(state,Item){
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(init_can_substitute);
			var init_names = function(state,Item){
				// for the purposes of evaluating parallels, we don't really
				// care what the actual variable name of "names" is.
				CSL.parallel.AppendBlobPointer(state.output.current.value());
				state.output.startTag("names",this);
				state.tmp.name_node = state.output.current.value();
			};
			this["execs"].push(init_names);
		};
		if (this.tokentype == CSL.END){
			for each (attrname in CSL.NAME_ATTRIBUTES){
				if (attrname.slice(0,5) == "et-al"){
					continue;
				}
				if ("undefined" != typeof state.build.nameattrs[attrname]){
					this.strings[attrname] = state.build.nameattrs[attrname];
					delete state.build.nameattrs[attrname];
				}
			}
			var handle_names = function(state,Item){
				var namesets = new Array();
				var common_term = CSL.Util.Names.getCommonTerm(state,state.tmp.value);
				if (common_term){
					namesets = state.tmp.value.slice(0,1);
				} else {
					namesets = state.tmp.value;
				}
				//
				// Normalize names for which it is requested
				//
				for each (var nameset in namesets){
					for each (var name in nameset.names){
						if (name["parse-names"]){
							state.parseName(name);
						}
					}
				}
				var local_count = 0;
				var nameset = new Object();
				state.output.addToken("space"," ");
				state.output.addToken("sortsep",state.output.getToken("name").strings["sort-separator"]);
				if (!state.output.getToken("etal")){
					state.output.addToken("etal-join",", ");
					state.output.addToken("etal");
				} else {
					state.output.addToken("etal-join","");
				}
				if (!state.output.getToken("label")){
					state.output.addToken("label");
				}
				if ("undefined" == typeof state.output.getToken("etal").strings.et_al_term){
					state.output.getToken("etal").strings.et_al_term = state.getTerm("et-al","long",0);
				}
				state.output.addToken("commasep",", ");
				for each (namepart in ["given","family","dropping-particle","non-dropping-particle","suffix"]){
					if (!state.output.getToken(namepart)){
						state.output.addToken(namepart);
					}
				}
				for  (var namesetIndex in namesets){
					nameset = namesets[namesetIndex];
					if (!nameset.names.length){
						continue;
					};
					if (!state.tmp.suppress_decorations && (state[state.tmp.area].opt.collapse == "year" || state[state.tmp.area].opt.collapse == "year-suffix" || state[state.tmp.area].opt.collapse == "year-suffix-ranged")){
						//
						// This is fine, but the naming of the comparison
						// function is confusing.  This is just checking whether the
						// current name is the same as the last name rendered
						// in the last cite, and it works.  Set a toggle if the
						// test fails, so we can avoid further suppression in the
						// cite.
						//
						if (state.tmp.last_names_used.length == state.tmp.names_used.length){
							var lastones = state.tmp.last_names_used[state.tmp.nameset_counter];
							var currentones = state.tmp.names_used[state.tmp.nameset_counter];
							var compset = currentones.concat(lastones);
							if (CSL.Util.Names.getCommonTerm(state,compset)){
								continue;
							} else {
								state.tmp.have_collapsed = false;
							}
						}
					}
					if (!state.tmp.disambig_request){
						state.tmp.disambig_settings["givens"][state.tmp.nameset_counter] = new Array();
					}
					//
					// Here is where we maybe truncate the list of
					// names, to satisfy name-count and et-al constraints.
					var display_names = nameset.names.slice();
					var sane = state.tmp["et-al-min"] >= state.tmp["et-al-use-first"];
					//
					// if there is anything on name request, we assume that
					// it was configured correctly via state.names_request
					// by the function calling the renderer.
					var discretionary_names_length = state.tmp["et-al-min"];
					//
					// the names constraint
					//
					var suppress_min = state.output.getToken("name").strings["suppress-min"];
					var suppress_condition = suppress_min && display_names.length >= suppress_min;
					if (suppress_condition){
						continue;
					}
					if (state.tmp.can_block_substitute){
						state.tmp.done_vars.push(nameset.type);
					};
					//
					// if rendering for display, do not honor a disambig_request
					// to set names length below et-al-use-first
					//
					if (state.tmp.suppress_decorations){
						if (state.tmp.disambig_request){
							discretionary_names_length = state.tmp.disambig_request["names"][state.tmp.nameset_counter];
						} else if (display_names.length >= state.tmp["et-al-min"]){
							discretionary_names_length = state.tmp["et-al-use-first"];
						}
					} else {
						if (state.tmp.disambig_request && state.tmp["et-al-use-first"] < state.tmp.disambig_request["names"][state.tmp.nameset_counter]){
							discretionary_names_length = state.tmp.disambig_request["names"][state.tmp.nameset_counter];
						} else if (display_names.length >= state.tmp["et-al-min"]){
							discretionary_names_length = state.tmp["et-al-use-first"];
						}
					}
					var overlength = display_names.length > discretionary_names_length;
					var et_al = false;
					var and_term = "";
					if (sane && overlength){
						if (! state.tmp.sort_key_flag){
							et_al = state.output.getToken("etal").strings.et_al_term;
						}
						display_names = display_names.slice(0,discretionary_names_length);
					} else {
						if (state.output.getToken("name").strings["and"] && ! state.tmp.sort_key_flag && display_names.length > 1){
							and_term = state.output.getToken("name").strings["and"];
						}
					}
					state.tmp.disambig_settings["names"][state.tmp.nameset_counter] = display_names.length;
					local_count += display_names.length;
					//
					// "name" is the format for the outermost nesting of a nameset
					// "inner" is a format consisting only of a delimiter, used for
					// joining all but the last name in the set together.
					var delim = state.output.getToken("name").strings.delimiter;
					state.output.addToken("inner",delim);
					//state.tmp.tokenstore["and"] = new CSL.Token("and");
					state.output.formats.value()["name"].strings.delimiter = and_term;
					for (var i in nameset.names){
						//
						// register the name in the global names disambiguation
						// registry
						state.registry.namereg.addname(Item.id,nameset.names[i],i);
						//
						// set the display mode default for givennames if required
						if (state.tmp.sort_key_flag){
							state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i] = 2;
						} else if (state.tmp.disambig_request){
							//
							// fix a request for initials that makes no sense.
							// can't do this in disambig, because the availability
							// of initials is not a global parameter.
							var val = state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i];
							if (val == 1 && "undefined" == typeof this.strings["initialize-with"]){
								val = 2;
							}
							var param = val;
//							if (state[state.tmp.area].opt["disambiguate-add-givenname"] && state[state.tmp.area].opt["givenname-disambiguation-rule"] != "by-cite"){
							if (state[state.tmp.area].opt["disambiguate-add-givenname"]){
								var param = state.registry.namereg.eval(Item.id,nameset.names[i],i,param,state.output.getToken("name").strings.form,this.strings["initialize-with"]);
							};
						} else {
							//
							// ZZZZZ: it clicks.  here is where we will put the
							// call to the names register, to get the floor value
							// for an individual name.
							//
							var myform = state.output.getToken("name").strings.form;
							var myinitials = this.strings["initialize-with"];
							var param = state.registry.namereg.eval(Item.id,nameset.names[i],i,0,myform,myinitials);
							//CSL.debug("MYFORM: "+myform+", PARAM: "+param);
							//var param = 2;
							//if (state.output.getToken("name").strings.form == "short"){
							//	param = 0;
							//} else if ("string" == typeof state.tmp["initialize-with"]){
							//	param = 1;
							//};
						};
						state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][i] = param;
					}
					//
					// configure label if poss
					var label = false;
					if (state.output.getToken("label").strings.label_position){
						var termname;
						if (common_term){
							termname = common_term;
						} else {
							termname = nameset.type;
						}
						//
						// XXXXX: quick hack.  This should be fixed earlier.
						//
						if (!state.output.getToken("label").strings.form){
							var form = "long";
						} else {
							var form = state.output.getToken("label").strings.form;
						}
						if ("number" == typeof state.output.getToken("label").strings.plural){
							var plural = state.output.getToken("label").strings.plural;
						} else if (nameset.names.length > 1){
							var plural = 1;
						} else {
							var plural = 0;
						}
						label = state.getTerm(termname,form,plural);
					};
					//
					// Nesting levels are opened to control joins with
					// content at the end of the names block
					//
					// Gotcha.  Don't want to use startTag here, it pushes
					// a fresh format token namespace, and we lose our pointer.]
					// Use openLevel (and possibly addToken) instead.
					state.output.openLevel("empty"); // for term join
					if (label && state.output.getToken("label").strings.label_position == CSL.BEFORE){
						state.output.append(label,"label");
					}
					state.output.openLevel("etal-join"); // join for etal
					CSL.Util.Names.outputNames(state,display_names);
					if (et_al){
						state.output.append(et_al,"etal");
					}
					state.output.closeLevel(); // etal
					if (label && state.tmp.name_label_position != CSL.BEFORE){
						state.output.append(label,"label");
					}
					state.output.closeLevel(); // term
					state.tmp.nameset_counter += 1;
				};
				if (state.output.getToken("name").strings.form == "count"){
					state.output.clearlevel();
					state.output.append(local_count.toString());
					state.tmp["et-al-min"] = false;
					state.tmp["et-al-use-first"] = false;
				}
			};
			this["execs"].push(handle_names);
		};
		//
		// Looks disabled.  Delete, I guess.
		//
		if (this.tokentype == CSL.END && state.build.form == "count" && false){
			state.build.form = false;
			var output_name_count = function(state,Item){
				var name_count = 0;
				for each (var v in this.variables){
					if(Item[v] && Item[v].length){
						name_count += Item[v].length;
					}
				}
				state.output.append(name_count.toString());
			};
			this["execs"].push(output_name_count);
		};
		if (this.tokentype == CSL.END){
			var unsets = function(state,Item){
				if (!state.tmp.can_substitute.pop()){
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				CSL.Util.Names.reinit(state,Item);
				state.output.endTag(); // names
				CSL.parallel.CloseVariable();
				state.tmp["et-al-min"] = false;
				state.tmp["et-al-use-first"] = false;
				state.tmp.can_block_substitute = false;
			};
			this["execs"].push(unsets);
			state.build.names_flag = false;
			state.build.name_flag = false;
		}
		target.push(this);
		if (this.tokentype == CSL.END || this.tokentype == CSL.SINGLETON){
			state.build.substitute_level.pop();
			CSL.Util.substituteEnd.call(this,state,target);
		}
	}
};
CSL.Node.number = new function(){
	this.build = build;
	function build(state,target){
		CSL.Util.substituteStart.call(this,state,target);
		//
		// This should push a rangeable object to the queue.
		//
		if (this.strings.form == "roman"){
			this.formatter = state.fun.romanizer;
		} else if (this.strings.form == "ordinal"){
			this.formatter = state.fun.ordinalizer;
		} else if (this.strings.form == "long-ordinal"){
			this.formatter = state.fun.long_ordinalizer;
		}
		//
		// Whether we actually stick a number object on
		// the output queue depends on whether the field
		// contains a pure number.
		//
		var push_number_or_text = function(state,Item){
			var varname = this.variables[0];
			CSL.parallel.StartVariable(this.variables[0]);
			CSL.parallel.AppendToVariable(Item[this.variables[0]]);
			if (varname == "page-range" || varname == "page-first"){
				varname = "page";
			};
			var num = Item[varname];
			if ("undefined" != typeof num) {
				if (this.variables[0] == "page-first"){
					var m = num.split(/\s*(&|,|-)\s*/);
					num = m[0];
				}
				var m = num.match(/\s*([0-9]+).*/);
				if (m){
					num = parseInt( m[1], 10);
					var number = new CSL.NumericBlob( num, this );
					state.output.append(number,"literal");
				} else {
					state.output.append(num, this);
				};
			};
			CSL.parallel.CloseVariable();
		};
		this["execs"].push(push_number_or_text);
		target.push(this);
		CSL.Util.substituteEnd.call(this,state,target);
	};
};
CSL.Node.sort = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			if (state.build.area == "citation"){
				CSL.parallel.use_parallels = false;
			}
			state.build.sort_flag  = true;
			state.build.area_return = state.build.area;
			state.build.area = state.build.area+"_sort";
		};
		if (this.tokentype == CSL.END){
			state.build.area = state.build.area_return;
			state.build.sort_flag  = false;
		}
	};
};
CSL.Node.substitute = new function(){
	this.build = build;
	function build(state,target){
		if (this.tokentype == CSL.START){
			var set_conditional = function(state,Item){
				state.tmp.can_block_substitute = true;
				if (state.tmp.value.length){
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
			};
			this.execs.push(set_conditional);
		};
		target.push(this);
	};
};
CSL.Node.text = new function(){
	this.build = build;
	function build (state,target){
		CSL.Util.substituteStart.call(this,state,target);
		if (this.postponed_macro){
			CSL.expandMacro.call(state,this);
		} else {
			// ...
			//
			// Do non-macro stuff
			var variable = this.variables[0];
			if (variable){
				var func = function(state,Item){
					CSL.parallel.StartVariable(this.variables[0]);
					CSL.parallel.AppendToVariable(Item[this.variables[0]]);
				};
				this["execs"].push(func);
			};
			var form = "long";
			var plural = 0;
			if (this.strings.form){
				form = this.strings.form;
			}
			if (this.strings.plural){
				plural = this.strings.plural;
			}
			if ("citation-number" == variable || "year-suffix" == variable || "citation-label" == variable){
				//
				// citation-number and year-suffix are super special,
				// because they are rangeables, and require a completely
				// different set of formatting parameters on the output
				// queue.
				if (variable == "citation-number"){
					//this.strings.is_rangeable = true;
					if ("citation-number" == state[state.tmp.area].opt["collapse"]){
						this.range_prefix = "-";
					}
					this.successor_prefix = state[state.build.area].opt.layout_delimiter;
					var func = function(state,Item){
						var id = Item["id"];
						if (!state.tmp.force_subsequent){
							if (Item["author-only"]){
								state.tmp.element_trace.replace("do-not-suppress-me");
								var term = CSL.Output.Formatters["capitalize-first"](state,state.getTerm("references","long","singular"));
								state.output.append(term+" ");
								state.tmp.last_element_trace = true;
							};
							if (Item["suppress-author"]){
								if (state.tmp.last_element_trace){
									state.tmp.element_trace.replace("suppress-me");
								};
								state.tmp.last_element_trace = false;
							};
							var num = state.registry.registry[id].seq;
							var number = new CSL.NumericBlob(num,this);
							state.output.append(number,"literal");
						};
					};
					this["execs"].push(func);
				} else if (variable == "year-suffix"){
					state.opt.has_year_suffix = true;
					if (state[state.tmp.area].opt.collapse == "year-suffix-ranged"){
						this.range_prefix = "-";
					}
					if (state[state.tmp.area].opt["year-suffix-delimiter"]){
						this.successor_prefix = state[state.build.area].opt["year-suffix-delimiter"];
					}
					var func = function(state,Item){
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
							//state.output.append(state.registry.registry[Item.id].disambig[2],this);
							var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
							var number = new CSL.NumericBlob(num,this);
							var formatter = new CSL.Util.Suffixator(CSL.SUFFIX_CHARS);
							number.setFormatter(formatter);
							state.output.append(number,"literal");
							//
							// don't ask :)
							// obviously the variable naming scheme needs
							// a little touching up
							var firstoutput = state.tmp.term_sibling.mystack.indexOf(true) == -1;
							var specialdelimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							if (firstoutput && specialdelimiter && !state.tmp.sort_key_flag){
								state.tmp.splice_delimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
							}
						}
					};
					this["execs"].push(func);
				} else if (variable == "citation-label"){
					state.opt.has_year_suffix = true;
					var func = function(state,Item){
						var label = Item["citation-label"];
						if (!label){
							//
							// A shot in the dark
							//
							var myname = state.getTerm("references","short",0);
							for each (var n in CSL.CREATORS){
								if (Item[n]){
									var names = Item[n];
									if (names && names.length){
										var name = names[0];
									}
									if (name && name.family){
										myname = name.family.replace(/\s+/,"");
									} else if (name && name.literal){
										myname = name.literal;
										var m = myname.toLowerCase().match(/^(a|the|an)(.*)/,"");
										if (m){
											myname = m[2];
										}
									}
								}
							}
							var year = "0000";
							if (Item.issued){
								var dp = Item.issued["date-parts"];
								if (dp && dp[0] && dp[0][0]){
									year = ""+dp[0][0];
								}
							}
							label = myname + year;
						};
						var suffix = "";
						if (state.registry.registry[Item.id] && state.registry.registry[Item.id].disambig[2]){
							var num = parseInt(state.registry.registry[Item.id].disambig[2], 10);
							suffix = state.fun.suffixator.format(num);
						};
						label += suffix;
						state.output.append(label,this);
					};
					this["execs"].push(func);
				};
			} else {
				if (state.build.term){
					var term = state.build.term;
					term = state.getTerm(term,form,plural);
					if (this.strings["strip-periods"]){
						term = term.replace(/\./g,"");
					};
					var printterm = function(state,Item){
						// capitalize the first letter of a term, if it is the
						// first thing rendered in a citation (or if it is
						// being rendered immediately after terminal punctuation,
						// I guess, actually).
						if (!state.tmp.term_predecessor){
							//CSL.debug("Capitalize");
							term = CSL.Output.Formatters["capitalize-first"](state,term);
							state.tmp.term_predecessor = true;
						};
						state.output.append(term,this);
					};
					this["execs"].push(printterm);
					state.build.term = false;
					state.build.form = false;
					state.build.plural = false;
				} else if (this.variables.length){
					if (this.variables[0] == "container-title" && form == "short"){
						// Define function to check container title
						var func = function(state,Item){
							var defaultval = state.getVariable(Item,this.variables[0],form);
							var value = "";
							if (state.opt["container-title-abbreviations"]){
								value = state.opt["container-title-abbreviations"][defaultval];
							};
							if (!value){
								value = Item["journalAbbreviation"];
							}
							if (!value){
								value = defaultval;
							}
							state.output.append(value,this);
						};
					} else if (this.variables[0] == "title"){
						if (state.build.area.slice(-5) == "_sort"){
							var func = function(state,Item){
								var value = Item[this.variables[0]];
								if (value){
									value = state.getTextSubField(value,"locale-sort",true);
									state.output.append(value,this);
								};
							};
						} else {
							var func = function(state,Item){
								var value = Item[this.variables[0]];
								if (value){
									var primary = state.getTextSubField(value,"locale-pri",true);
									var secondary = state.getTextSubField(value,"locale-sec");
									if (secondary){
										var primary_tok = new CSL.Token("text",CSL.SINGLETON);
										var secondary_tok = new CSL.Token("text",CSL.SINGLETON);
										for (var i in this.strings){
											secondary_tok.strings[i] = this.strings[i];
											if (i == "suffix"){
												secondary_tok.strings.suffix = "]"+secondary_tok.strings.suffix;
												continue;
											} else if (i == "prefix"){
												secondary_tok.strings.prefix = " ["+secondary_tok.strings.prefix;
											}
											primary_tok.strings[i] = this.strings[i];
										}
										state.output.append(primary,primary_tok);
										state.output.append(secondary,secondary_tok);
									} else {
										state.output.append(primary,this);
									}
								};
							};
						};
					} else if (this.variables[0] == "page-first"){
						var func = function(state,Item){
							var value = state.getVariable(Item,"page",form);
							value = value.replace(/-.*/,"");
							state.output.append(value,this);
						};
					} else if (this.variables[0] == "page"){
						var func = function(state,Item){
							var value = state.getVariable(Item,"page",form);
							value = state.fun.page_mangler(value);
							state.output.append(value,this);
						};
					} else if (["publisher","publisher-place"].indexOf( this.variables[0] > -1)){
						var func = function(state,Item){
							var value = state.getVariable(Item,this.variables[0]);
							if (value){
								value = state.getTextSubField(value,"default-locale",true);
								state.output.append(value,this);
							}
						};
					} else {
						var func = function(state,Item){
							var value = state.getVariable(Item,this.variables[0],form);
							state.output.append(value,this);
						};
					};
					this["execs"].push(func);
				} else if (this.strings.value){
					var func = function(state,Item){
						state.output.append(this.strings.value,this);
					};
					this["execs"].push(func);
				} else {
					var weird_output_function = function(state,Item){
						if (state.tmp.value.length){
							CSL.debug("Weird output pattern.  Can this be revised?");
							for each (var val in state.tmp.value){
								state.output.append(val,this);
							}
							state.tmp.value = new Array();
						}
					};
					this["execs"].push(weird_output_function);
				}
			}
			var func = function(state,Item){
				CSL.parallel.CloseVariable();
			};
			this["execs"].push(func);
			target.push(this);
		};
		CSL.Util.substituteEnd.call(this,state,target);
	};
};
dojo.provide("csl.attributes");
CSL.Attributes = {};
CSL.Attributes["@class"] = function(state,arg){
	state.opt["class"] = arg;
};
CSL.Attributes["@version"] = function(state,arg){
	state.opt["version"] = arg;
}
CSL.Attributes["@value"] = function(state,arg){
	this.strings.value = arg;
};
CSL.Attributes["@name"] = function(state,arg){
	if (this.name == "name-part") {
		//
		// Note that there will be multiple name-part items,
		// and they all need to be collected before doing anything.
		// So this must be picked up when the <name-part/>
		// element is processed, and used as a key on an
		// object holding the formatting attribute functions.
		state.tmp.namepart_type = arg;
	} else {
		this.strings.name = arg;
	};
};
CSL.Attributes["@form"] = function(state,arg){
	this.strings.form = arg;
};
CSL.Attributes["@date-parts"] = function(state,arg){
	this.strings["date-parts"] = arg;
};
CSL.Attributes["@range-delimiter"] = function(state,arg){
	this.strings["range-delimiter"] = arg;
};
CSL.Attributes["@macro"] = function(state,arg){
	this.postponed_macro = arg;
};
CSL.Attributes["@term"] = function(state,arg){
	if (this.name == "et-al"){
		if (CSL.locale[state.opt.lang].terms[arg]){
			this.strings.et_al_term = state.getTerm(arg,"long",0);
		} else {
			this.strings.et_al_term = arg;
		}
	} else {
		state.build.term = arg;
	}
};
CSL.Attributes["@xmlns"] = function(state,arg){};
CSL.Attributes["@lang"] = function(state,arg){
	if (arg){
		state.build.lang = arg;
	}
};
CSL.Attributes["@type"] = function(state,arg){
		var func = function(state,Item){
			var types = arg.split(/\s+/);
			var ret = [];
			for each (var type in types){
				ret.push(Item.type == type);
			}
			return ret;
		};
		this["tests"].push(func);
};
CSL.Attributes["@variable"] = function(state,arg){
	this.variables = arg.split(/\s+/);
	if ("label" == this.name && this.variables[0]){
		state.build.term = this.variables[0];
	} else if (["names","date","text","number"].indexOf(this.name) > -1) {
		//
		// An oddity of variable handling is that this.variables
		// is actually ephemeral; the full list of variables is
		// held in the inner var, and pushed into this.variables
		// conditionally in order to suppress repeat renderings of
		// the same item variable.
		//
		// Do not suppress repeat renderings of dates.
		//
		var set_variable_names = function(state,Item){
			var variables = this.variables.slice();
			this.variables = [];
			for each (var variable in variables){
				if (state.tmp.done_vars.indexOf(variable) == -1){
					this.variables.push(variable);
				};
			};
		};
		this.execs.push(set_variable_names);
		var check_for_output = function(state,Item){
			var output = false;
			for each (var variable in this.variables){
				if ("object" == typeof Item[variable]){
					for (i in Item[variable]){
						output = true;
						break;
					}
				} else if ("string" == typeof Item[variable] && Item[variable]){
					output = true;
				} else if ("number" == typeof Item[variable]){
					output = true;
				}
				if (output){
					break;
				}
			}
			if (output){
				state.tmp.term_sibling.replace( true );
				state.tmp.can_substitute.replace(false, CSL.LITERAL);
			} else {
				if (undefined == state.tmp.term_sibling.value()) {
					state.tmp.term_sibling.replace( false, CSL.LITERAL );
				};
			};
			//if (output){
			//	CSL.debug("Output! "+this.variables);
			//} else {
			//	CSL.debug("No output! "+this.variables);
			//}
		};
		this.execs.push(check_for_output);
	} else if (["if", "else-if"].indexOf(this.name) > -1){
		var check_for_variable_value = function(state,Item){
			var ret = [];
			for each(variable in this.variables){
				var x = false;
				if (Item[variable]){
					if ("number" == typeof Item[variable] || "string" == typeof Item[variable]){
						x = true;
					} else if ("object" == typeof Item[variable]){
						if (Item[variable].length){
							x = true;
						} else {
							//
							// this will turn true only for hash objects
							// that have at least one attribute.
							//
							for (var i in Item[variable]){
								x = true;
								break;
							};
						};
					};
				};
				ret.push(x);
			};
			return ret;
		};
		this.tests.push(check_for_variable_value);
	};
};
CSL.Attributes["@suffix"] = function(state,arg){
	this.strings.suffix = arg;
};
CSL.Attributes["@prefix"] = function(state,arg){
	this.strings.prefix = arg;
};
CSL.Attributes["@delimiter"] = function(state,arg){
	this.strings.delimiter = arg;
};
CSL.Attributes["@match"] = function(state,arg){
	if (this.tokentype == CSL.START){
		if ("none" == arg){
			var evaluator = state.fun.match.none;
		} else if ("any" == arg){
			var evaluator = state.fun.match.any;
		} else if ("all" == arg){
			var evaluator = state.fun.match.all;
		} else {
			throw "Unknown match condition \""+arg+"\" in @match";
		}
		this.evaluator = evaluator;
	};
};
CSL.Attributes["@uncertain-date"] = function(state,arg){
	var variables = arg.split(/\s+/);
	for each (var variable in variables){
		var func = function(state,Item){
			if (Item[variable] && Item[variable].circa){
				return true;
			}
			return false;
		};
		this["tests"].push(func);
	};
};
CSL.Attributes["@is-numeric"] = function(state,arg){
	var variables = arg.split(/\s+/);
	for each (var variable in variables){
		var func = function(state,Item){
			if (CSL.NUMERIC_VARIABLES.indexOf(variable) == -1){
				return false;
			}
			var val = Item[variable];
			if (typeof val == "undefined"){
				return false;
			}
			if (typeof val == "number"){
				val = val.toString();
			}
			if (typeof val != "string"){
				return false;
			}
			if (val.match(CSL.QUOTED_REGEXP)){
				return false;
			}
			if (val.match(CSL.NUMBER_REGEXP)){
				return true;
			}
			return false;
		};
		this["tests"].push(func);
	};
};
CSL.Attributes["@names-min"] = function(state,arg){
	this.strings["et-al-min"] = parseInt(arg, 10);
};
CSL.Attributes["@names-use-first"] = function(state,arg){
	this.strings["et-al-use-first"] = parseInt(arg,10);
};
CSL.Attributes["@sort"] = function(state,arg){
	if (arg == "descending"){
		this.strings.sort_direction = CSL.DESCENDING;
	}
}
CSL.Attributes["@plural"] = function(state,arg){
	if ("always" == arg){
		this.strings.plural = 1;
	} else if ("never" == arg){
		this.strings.plural = 0;
	};
};
CSL.Attributes["@locator"] = function(state,arg){
};
CSL.Attributes["@position"] = function(state,arg){
	if (arg == "subsequent"){
		this.strings.position = CSL.POSITION_SUBSEQUENT;
	} else if (arg == "ibid") {
		this.strings.position = CSL.POSITION_IBID;
	} else if (arg == "ibid-with-locator"){
		this.strings.position = CSL.POSITION_IBID_WITH_LOCATOR;
	} else if (arg == "near-note"){
		this.strings["near-note-distance-check"] = true;
	};
};
CSL.Attributes["@disambiguate"] = function(state,arg){
	if (this.tokentype == CSL.START && ["if","else-if"].indexOf(this.name) > -1){
		if (arg == "true"){
			state.opt.has_disambiguate = true;
			var func = function(state,Item){
				if (state.tmp.disambig_settings["disambiguate"]){
					return true;
				}
				return false;
			};
			this["tests"].push(func);
		};
	};
};
CSL.Attributes["@givenname-disambiguation-rule"] = function(state,arg){
	if (CSL.GIVENNAME_DISAMBIGUATION_RULES.indexOf(arg) > -1) {
		state[this.name].opt["givenname-disambiguation-rule"] = arg;
	};
};
CSL.Attributes["@collapse"] = function(state,arg){
	if (arg){
		state[this.name].opt.collapse = arg;
	};
};
CSL.Attributes["@names-delimiter"] = function(state,arg){
	state.setOpt(this,"names-delimiter", arg);
}
CSL.Attributes["@name-form"] = function(state,arg){
	state.setOpt(this,"name-form", arg);
}
CSL.Attributes["@name-delimiter"] = function(state,arg){
	state.setOpt(this,"name-delimiter", arg);
}
CSL.Attributes["@et-al-min"] = function(state,arg){
	state.setOpt(this,"et-al-min", parseInt(arg, 10));
};
CSL.Attributes["@et-al-use-first"] = function(state,arg){
	state.setOpt(this,"et-al-use-first", parseInt(arg, 10));
};
CSL.Attributes["@et-al-subsequent-min"] = function(state,arg){
	state.setOpt(this,"et-al-subsequent-min", parseInt(arg, 10));
};
CSL.Attributes["@et-al-subsequent-use-first"] = function(state,arg){
	state.setOpt(this,"et-al-subsequent-use-first", parseInt(arg, 10));
};
CSL.Attributes["@truncate-min"] = function(state,arg){
	this.strings["truncate-min"] = parseInt(arg,10);
};
CSL.Attributes["@suppress-min"] = function(state,arg){
	this.strings["suppress-min"] = parseInt(arg,10);
};
CSL.Attributes["@and"] = function(state,arg){
	var myarg = "&";
	if ( "text" == arg) {
		var and = state.getTerm("and","long",0);
		myarg = and;
	}
	state.setOpt(this,"and",myarg);
};
CSL.Attributes["@delimiter-precedes-last"] = function(state,arg){
	state.setOpt(this,"delimiter-precedes-last",arg);
};
CSL.Attributes["@initialize-with"] = function(state,arg){
	state.setOpt(this,"initialize-with",arg);
};
CSL.Attributes["@name-as-sort-order"] = function(state,arg){
	state.setOpt(this,"name-as-sort-order",arg);
};
CSL.Attributes["@sort-separator"] = function(state,arg){
	state.setOpt(this,"sort-separator",arg);
};
CSL.Attributes["@year-suffix-delimiter"] = function(state,arg){
	state[this.name].opt["year-suffix-delimiter"] = arg;
};
CSL.Attributes["@after-collapse-delimiter"] = function(state,arg){
	state[this.name].opt["after-collapse-delimiter"] = arg;
};
CSL.Attributes["@subsequent-author-substitute"] = function(state,arg){
	state[this.name].opt["subsequent-author-substitute"] = arg;
};
CSL.Attributes["@disambiguate-add-names"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["disambiguate-add-names"] = true;
	};
};
CSL.Attributes["@disambiguate-add-givenname"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["disambiguate-add-givenname"] = true;
	};
};
CSL.Attributes["@disambiguate-add-year-suffix"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["disambiguate-add-year-suffix"] = true;
	};
};
CSL.Attributes["@second-field-align"] = function(state,arg){
	if (arg == "flush" || arg == "margin"){
		state[this.name].opt["second-field-align"] = arg;
	};
};
CSL.Attributes["@hanging-indent"] = function(state,arg){
	if (arg == "true"){
		state[this.name].opt["hangingindent"] = 2;
	};
};
CSL.Attributes["@line-spacing"] = function(state,arg){
	if (arg && arg.match(/^[.0-9]+$/)){
			state[this.name].opt["linespacing"] = parseFloat(arg,10);
	};
};
CSL.Attributes["@entry-spacing"] = function(state,arg){
	if (arg && arg.match(/^[.0-9]+$/)){
			state[this.name].opt["entryspacing"] = parseFloat(arg,10);
	};
};
CSL.Attributes["@near-note-distance"] = function(state,arg){
	state[this.name].opt["near-note-distance"] = parseInt(arg,10);
};
CSL.Attributes["@page-range-format"] = function(state,arg){
	state.opt["page-range-format"] = arg;
};
CSL.Attributes["@text-case"] = function(state,arg){
	this.strings["text-case"] = arg;
};
CSL.Attributes["@page-range-format"] = function(state,arg){
	state.opt["page-range-format"] = arg;
}
CSL.Attributes["@default-locale"] = function(state,arg){
	var lst = arg;
	lst = lst.split(/-x-(sort|pri|sec|name)-/);
	var l = lst.length;
	for (var pos=1; pos<l; pos += 2){
		state.opt[("locale-"+lst[pos])].push(lst[(pos+1)].replace(/^\s*/g,"").replace(/\s*$/g,""));
	};
	if (l){
		state.opt["default-locale"] = lst.slice(0,1);
	} else {
		state.opt["default-locale"] = ["en"];
	}
}
CSL.Attributes["@demote-non-dropping-particle"] = function(state,arg){
	state.opt["demote-non-dropping-particle"] = arg;
}
CSL.Attributes["@initialize-with-hyphen"] = function(state,arg){
	if (arg == "false"){
		state.opt["initialize-with-hyphen"] = false;
	}
}
dojo.provide("csl.xmle4x");
CSL.System = {};
CSL.System.Xml = {};
CSL.System.Xml.E4X = function(){};
CSL.System.Xml.E4X.prototype.clean = function(xml){
	xml = xml.replace(/<\?[^?]+\?>/g,"");
	xml = xml.replace(/<![^>]+>/g,"");
	xml = xml.replace(/^\s+/g,"");
	xml = xml.replace(/\s+$/g,"");
	return xml;
};
CSL.System.Xml.E4X.prototype.children = function(myxml){
	var ret = myxml.children();
	return ret;
};
CSL.System.Xml.E4X.prototype.nodename = function(myxml){
	return myxml.localName();
};
CSL.System.Xml.E4X.prototype.attributes = function(myxml){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var ret = new Object();
	var attrs = myxml.attributes();
	for each (var attr in attrs){
		var key = "@"+attr.localName();
		//
		// Needed in rhino
		//
		if (key.slice(0,5) == "@e4x_"){
			continue;
		}
		var value = attr;
		ret[key] = value;
	}
	return ret;
};
CSL.System.Xml.E4X.prototype.content = function(myxml){
	return myxml.toString();
};
CSL.System.Xml.E4X.prototype.namespace = {
	"xml":"http://www.w3.org/XML/1998/namespace"
}
CSL.System.Xml.E4X.prototype.numberofnodes = function(myxml){
	return myxml.length();
};
CSL.System.Xml.E4X.prototype.getAttributeName = function(attr){
	return attr.localName();
}
CSL.System.Xml.E4X.prototype.getAttributeValue = function(myxml,name,namespace){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (namespace){
		var ns = new Namespace(this.namespace[namespace]);
		var ret = myxml.@ns::[name].toString();
	} else {
		if (name){
			var ret = myxml.attribute(name).toString();
		} else {
			var ret = myxml.toString();
		}
	}
	return ret;
}
CSL.System.Xml.E4X.prototype.getNodeValue = function(myxml,name){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (name){
		return myxml[name].toString();
	} else {
		return myxml.toString();
	}
}
CSL.System.Xml.E4X.prototype.setAttributeOnNodeIdentifiedByNameAttribute = function(myxml,nodename,attrname,attr,val){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (attr[0] != '@'){
		attr = '@'+attr;
	}
	myxml[nodename].(@name == attrname)[0][attr] = val;
}
CSL.System.Xml.E4X.prototype.deleteNodeByNameAttribute = function(myxml,val){
	delete myxml.*.(@name==val)[0];
}
CSL.System.Xml.E4X.prototype.deleteAttribute = function(myxml,attr){
	delete myxml["@"+attr];
}
CSL.System.Xml.E4X.prototype.setAttribute = function(myxml,attr,val){
	myxml['@'+attr] = val;
}
CSL.System.Xml.E4X.prototype.nodeCopy = function(myxml){
	return myxml.copy();
}
CSL.System.Xml.E4X.prototype.getNodesByName = function(myxml,name,nameattrval){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var ret = myxml.descendants(name);
	if (nameattrval){
		ret = ret.(@name == nameattrval);
	}
	return ret;
}
CSL.System.Xml.E4X.prototype.nodeNameIs = function(myxml,name){
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	if (myxml.localName().toString() == name){
		return true;
	}
	return false;
}
CSL.System.Xml.E4X.prototype.makeXml = function(myxml){
	if ("xml" == typeof myxml){
		// print("forcing serialization of xml to fix up namespacing");
		myxml = myxml.toXMLString();
	};
	default xml namespace = "http://purl.org/net/xbiblio/csl"; with({});
	var xml = new Namespace("http://www.w3.org/XML/1998/namespace");
	if (myxml){
		// print("deserializing xml");
		myxml = myxml.replace(/\s*<\?[^>]*\?>\s*\n*/g, "");
		myxml = new XML(myxml);
	} else {
		// print("no xml");
		myxml = new XML();
	}
	return myxml;
};
dojo.provide("csl.stack");
if (!CSL) {
}
CSL.Stack = function(val,literal){
	this.mystack = new Array();
	if (literal || val){
		this.mystack.push(val);
	};
};
CSL.Stack.prototype.push = function(val,literal){
	if (literal || val){
		this.mystack.push(val);
	} else {
		this.mystack.push("");
	}
};
CSL.Stack.prototype.clear = function(){
	this.mystack = new Array();
};
CSL.Stack.prototype.replace = function(val,literal){
	if (this.mystack.length == 0){
		throw "Internal CSL processor error: attempt to replace nonexistent stack item with "+val;
	}
	if (literal || val){
		this.mystack[(this.mystack.length-1)] = val;
	} else {
		this.mystack[(this.mystack.length-1)] = "";
	}
};
CSL.Stack.prototype.pop = function(){
	return this.mystack.pop();
};
CSL.Stack.prototype.value = function(){
	return this.mystack.slice(-1)[0];
};
CSL.Stack.prototype.length = function(){
	return this.mystack.length;
};
//
// XXXXX: note to self, the parallels machinery should be completely
// disabled when sorting of citations is requested.
//
//
// XXXXX: also mark the entry as "parallel" on the citation
// object.
//
//
// XXXXX: thinking forward a bit, we're going to need a means
// of snooping and mangling delimiters.  Inter-cite delimiters
// can be easily applied; it's just a matter of adjusting
// this.tmp.splice_delimiter (?) on the list of attribute
// bundles after a cite or set of cites is completed.
// That happens in cmd_cite.js.  We also need to do two
// things: (1) assure that volume, number, journal and
// page are contiguous within the cite, with no intervening
// rendered variables [done]; and (2) strip affixes to the series,
// so that the sole splice string is the delimiter.  This
// latter will need a walk of the output tree, but it's
// doable.
//
// The advantage of doing things this way is that
// the parallels machinery is encapsulated in a set of
// separate functions that do not interact with cite
// composition.
//
CSL.parallel = function(){
	this.one_set = new CSL.Stack();
	this.all_sets = new CSL.Stack();
	this.try_cite = true;
	this.use_parallels = true;
};
CSL.parallel.prototype.isMid = function(variable){
	return ["volume","container-title","issue","page"].indexOf(variable) > -1;
}
CSL.parallel.prototype.StartCitation = function(){
	if (this.use_parallels){
		this.all_sets.clear();
		this.one_set.clear();
		this.in_series = false;
	};
};
CSL.parallel.prototype.StartCite = function(Item){
	if (this.use_parallels){
		this.try_cite = true;
		for each (var x in ["title", "container-title","volume","page"]){
			if (!Item[x]){
				this.try_cite = false;
				if (this.in_series){
					this.all_sets.push(this.one_set.value());
					this.one_set.clear();
					this.in_series = false;
				};
				break;
			};
		};
		this.cite = new Object();
		this.cite.top = new Array();
		this.cite.mid = new Array();
		this.cite.end = new Array();
		this.target = "top";
	};
};
CSL.parallel.prototype.StartVariable = function (variable){
	if (this.use_parallels && this.try_cite){
		this.variable = variable;
		this.data = new Object();
		this.data.value = "";
		this.data.blobs = new Array();
		var is_mid = this.isMid(variable);
		if (this.target == "top" && is_mid){
			this.target = "mid";
		} else if (this.target == "mid" && !is_mid){
			this.target = "end";
		} else if (this.target == "end" && is_mid){
			this.try_cite = false;
			this.in_series = false;
		};
		this.cite[this.target].push(variable);
	};
};
CSL.parallel.prototype.AppendBlobPointer = function (blob){
	if (this.use_parallels && this.try_cite && blob && blob.blobs){
		this.data.blobs.push([blob,blob.blobs.length]);
	};
};
CSL.parallel.prototype.AppendToVariable = function(str){
	if (this.use_parallels && this.try_cite){
		this.data.value += "::"+str;
	};
};
CSL.parallel.prototype.CloseVariable = function(){
	if (this.use_parallels && this.try_cite){
		this.cite[this.variable] = this.data;
		if (this.one_set.mystack.length > 0){
			var prev = this.one_set.mystack[(this.one_set.mystack.length-1)];
			if (!this.isMid(this.variable) && this.data.value != prev[this.variable].value){
				// evaluation takes place later, at close of cite.
				this.try_cite = false;
				this.in_series = false;
			};
		};
	};
};
CSL.parallel.prototype.CloseCite = function(state){
	if (this.use_parallels){
		if (this.try_cite){
			if (this.one_set.mystack.length && state[state.tmp.area].opt["year-suffix-delimiter"]){
				state.tmp.splice_delimiter = state[state.tmp.area].opt["year-suffix-delimiter"];
			}
		} else {
			this.ComposeSet();
		};
		this.one_set.push(this.cite);
	};
};
CSL.parallel.prototype.ComposeSet = function(){
	if (this.use_parallels){
		if (this.one_set.mystack.length > 1){
			this.all_sets.push( this.one_set.mystack.slice() );
		};
		this.one_set.clear();
	};
};
CSL.parallel.prototype.PruneOutputQueue = function(){
	if (this.use_parallels){
		for each (var series in this.all_sets.mystack){
			for (var pos=0; pos<series.length; pos++){
				var cite = series[pos];
				if (pos == 0){
					this.purgeVariableBlobs(cite,cite.end);
				} else if (pos == (series.length-1) && series.length > 2){
					this.purgeVariableBlobs(cite,cite.top.concat(cite.end));
				} else {
					this.purgeVariableBlobs(cite,cite.top);
				};
			};
		};
	};
};
CSL.parallel.prototype.purgeVariableBlobs = function(cite,varnames){
	if (this.use_parallels){
		for each (var varname in varnames){
			if (cite[varname]){
				for each (var b in cite[varname].blobs){
					b[0].blobs = b[0].blobs.slice(0,b[1]).concat(b[0].blobs.slice((b[1]+1)));
				};
			};
		};
	};
};
CSL.parallel = new CSL.parallel();
dojo.provide("csl.token");
if (!CSL) {
}
CSL.Token = function(name,tokentype){
	this.name = name;
	this.strings = new Object();
	this.strings.delimiter = "";
	this.strings.prefix = "";
	this.strings.suffix = "";
	this.decorations = false;
	this.variables = [];
	this.execs = new Array();
	this.tokentype = tokentype;
	this.evaluator = false;
	this.tests = new Array();
	this.succeed = false;
	this.fail = false;
	this.next = false;
};
dojo.provide("csl.ambigconfig");
if (!CSL) {
}
CSL.AmbigConfig = function(){
	this.maxvals = new Array();
	this.minval = 1;
	this.names = new Array();
	this.givens = new Array();
	this.year_suffix = 0;
	this.disambiguate = 0;
};
dojo.provide("csl.blob");
CSL.Blob = function(token,str){
	if (token){
		this.strings = new Object();
		for (key in token.strings){
			this.strings[key] = token.strings[key];
		};
		this.decorations = new Array();
		for each (keyset in token.decorations){
			this.decorations.push(keyset.slice());
		}
	} else {
		this.strings = new Object();
		this.strings.prefix = "";
		this.strings.suffix = "";
		this.strings.delimiter = "";
		this.decorations = new Array();
	};
	if ("string" == typeof str){
		this.blobs = str;
	} else {
		this.blobs = new Array();
	};
	this.alldecor = [ this.decorations ];
};
CSL.Blob.prototype.push = function(blob){
	if ("string" == typeof this.blobs){
		throw "Attempt to push blob onto string object";
	} else {
		blob.alldecor = blob.alldecor.concat(this.alldecor);
		//CSL.debug("(blob.push alldecor): "+blob.alldecor);
		this.blobs.push(blob);
	}
};
dojo.provide("csl.range");
if (!CSL) {
}
CSL.NumericBlob = function(num,mother_token){
	this.alldecor = new Array();
	this.num = num;
	this.blobs = num.toString();
	this.status = CSL.START;
	this.strings = new Object();
	if (mother_token){
		this.decorations = mother_token.decorations;
		this.strings.prefix = mother_token.strings.prefix;
		this.strings.suffix = mother_token.strings.suffix;
		this.strings["text-case"] = mother_token.strings["text-case"];
		this.successor_prefix = mother_token.successor_prefix;
		this.range_prefix = mother_token.range_prefix;
		this.splice_prefix = "";
		this.formatter = mother_token.formatter;
		if (!this.formatter){
			this.formatter =  new CSL.Output.DefaultFormatter();
		}
		if (this.formatter){
			this.type = this.formatter.format(1);
		}
	} else {
		this.decorations = new Array();
		this.strings.prefix = "";
		this.strings.suffix = "";
		this.successor_prefix = "";
		this.range_prefix = "";
		this.splice_prefix = "";
		this.formatter = new CSL.Output.DefaultFormatter();
	}
};
CSL.NumericBlob.prototype.setFormatter = function(formatter){
	this.formatter = formatter;
	this.type = this.formatter.format(1);
};
CSL.Output.DefaultFormatter = function (){};
CSL.Output.DefaultFormatter.prototype.format = function (num){
	return num.toString();
};
CSL.NumericBlob.prototype.checkNext = function(next){
	if ( ! next || ! next.num || this.type != next.type || next.num != (this.num+1)){
		if (this.status == CSL.SUCCESSOR_OF_SUCCESSOR){
			this.status = CSL.END;
		}
		if ("object" == typeof next){
			next.status = CSL.SEEN;
		}
	} else { // next number is in the sequence
		if (this.status == CSL.START || this.status == CSL.SEEN){
			next.status = CSL.SUCCESSOR;
		} else if (this.status == CSL.SUCCESSOR || this.status == CSL.SUCCESSOR_OF_SUCCESSOR){
			if (this.range_prefix){
				next.status = CSL.SUCCESSOR_OF_SUCCESSOR;
				this.status = CSL.SUPPRESS;
			} else {
				next.status = CSL.SUCCESSOR;
			}
		}
		// won't see this again, so no effect of processing, but this
		// wakes up the correct delimiter.
		if (this.status == CSL.SEEN){
			this.status = CSL.SUCCESSOR;
		}
	};
};
dojo.provide("csl.util");
if (!CSL){
}
CSL.Util = {};
CSL.Util.Match = function(){
	this.any = function(token,state,Item){
		//
		// assume false, return true on any single true hit
		//
		var ret = false;
		for each (var func in token.tests){
			var rawres = func.call(token,state,Item);
			if ("object" != typeof rawres){
				rawres = [rawres];
			}
			for each (var res in rawres){
				if (res){
					ret = true;
					break;
				}
			};
			if (ret){
				break;
			};
		};
		if (ret){
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		};
		return ret;
	};
	this.none = function(token,state,Item){
		//
		// assume true, return false on any single true hit
		//
		var ret = true;
		for each (var func in this.tests){
			var rawres = func.call(token,state,Item);
			if ("object" != typeof rawres){
				rawres = [rawres];
			}
			for each (var res in rawres){
				if (res){
					ret = false;
					break;
				}
			};
			if (!ret){
				break;
			};
		};
		if (ret){
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		};
		return ret;
	};
	this.all = function(token,state,Item){
		//
		// assume true, return false on any single false hit
		//
		var ret = true;
		for each (var func in this.tests){
			var rawres = func.call(token,state,Item);
			if ("object" != typeof rawres){
				rawres = [rawres];
			}
			for each (var res in rawres){
				if (!res){
					ret = false;
					break;
				}
			};
			if (!ret){
				break;
			};
		};
		if (ret){
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		};
		return ret;
	};
};
dojo.provide("csl.util_names");
CSL.Util.Names = new function(){};
CSL.Util.Names.outputNames = function(state,display_names){
	var segments = new this.StartMiddleEnd(state,display_names);
	var and = state.output.getToken("name").strings.delimiter;
	if (state.output.getToken("name").strings["delimiter-precedes-last"] == "always"){
		and = state.output.getToken("inner").strings.delimiter+and;
	} else if (state.output.getToken("name").strings["delimiter-precedes-last"] == "never"){
		if (!and){
			and = state.output.getToken("inner").strings.delimiter;
		}
	} else if ((segments.segments.start.length + segments.segments.middle.length) > 1){
		and = state.output.getToken("inner").strings.delimiter+and;
	} else {
		if (!and){
			and = state.output.getToken("inner").strings.delimiter;
		}
	}
	if (and.match(CSL.STARTSWITH_ROMANESQUE_REGEXP)){
		and = " "+and;
	}
	if (and.match(CSL.ENDSWITH_ROMANESQUE_REGEXP)){
		and = and+" ";
	}
	state.output.getToken("name").strings.delimiter = and;
	state.output.openLevel("name");
	state.output.openLevel("inner");
	segments.outputSegmentNames("start");
	segments.outputSegmentNames("middle");
	state.output.closeLevel(); // inner
	segments.outputSegmentNames("end");
	state.output.closeLevel(); // name
};
CSL.Util.Names.StartMiddleEnd = function(state,names){
	this.state = state;
	this.nameoffset = 0;
	var start = names.slice(0,1);
	var middle = names.slice(1,(names.length-1));
	var endstart = 1;
	if (names.length > 1){
		endstart = (names.length-1);
	}
	var end = names.slice(endstart,(names.length));
	var ret = {};
	ret["start"] = start;
	ret["middle"] = middle;
	ret["end"] = end;
	this.segments = ret;
};
CSL.Util.Names.StartMiddleEnd.prototype.outputSegmentNames = function(seg){
	var state = this.state;
	for (var namenum in this.segments[seg]){
		this.namenum = parseInt(namenum,10);
		this.name = this.segments[seg][namenum];
		if (this.name.literal){
			state.output.append(this.name.literal);
		} else {
			var sequence = CSL.Util.Names.getNamepartSequence(state,seg,this.name);
			state.output.openLevel(sequence[0][0]);
			state.output.openLevel(sequence[0][1]);
			state.output.openLevel(sequence[0][2]);
			this.outputNameParts(sequence[1]);
			state.output.closeLevel();
			state.output.openLevel(sequence[0][2]);
			this.outputNameParts(sequence[2]);
			state.output.closeLevel();
			state.output.closeLevel();
			//
			// articular goes here  //
			//
			this.outputNameParts(sequence[3]);
			state.output.closeLevel();
		}
	};
	this.nameoffset += this.segments[seg].length;
}
CSL.Util.Names.StartMiddleEnd.prototype.outputNameParts = function(subsequence){
	var state = this.state;
	for each (var key in subsequence){
		var namepart = this.name[key];
		if ("given" == key && !this.name["static-ordering"]){
			if (0 == state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][(this.namenum+this.nameoffset)]){
				continue;
			} else if (1 == state.tmp.disambig_settings["givens"][state.tmp.nameset_counter][(this.namenum+this.nameoffset)]){
				var initialize_with = state.output.getToken("name").strings["initialize-with"];
				namepart = CSL.Util.Names.initializeWith(state,namepart,initialize_with);
			}
		}
		state.output.append(namepart,key);
	}
}
CSL.Util.Names.getNamepartSequence = function(state,seg,name){
	var token = state.output.getToken("name");
	if (name.comma_suffix){
		var suffix_sep = "commasep";
	} else {
		var suffix_sep = "space";
	}
	var romanesque = name["family"].match(CSL.ROMANESQUE_REGEXP);
	if (!romanesque ){ // neither roman nor Cyrillic characters
		var sequence = [["empty","empty","empty"],["non-dropping-particle", "family"],["given"],[]];
	} else if (name["static-ordering"]) { // entry likes sort order
		var sequence = [["space","space","space"],["non-dropping-particle", "family"],["given"],[]];
	} else if (state.tmp.sort_key_flag){
		if (state.opt["demote-non-dropping-particle"] == "never"){
			var sequence = [["space","sortsep","space"],["non-dropping-particle","family","dropping-particle"],["given"],["suffix"]];
		} else {
			var sequence = [["space","sortsep","space"],["family"],["given","dropping-particle","non-dropping-particle"],["suffix"]];
		};
	} else if (token && ( token.strings["name-as-sort-order"] == "all" || (token.strings["name-as-sort-order"] == "first" && seg == "start"))){
		//
		// Discretionary sort ordering and inversions
		//
		if (state.opt["demote-non-dropping-particle"] == "always"){
			var sequence = [["sortsep","sortsep","space"],["family"],["given","dropping-particle","non-dropping-particle"],["suffix"]];
		} else {
			var sequence = [["sortsep","sortsep","space"],["non-dropping-particle","family"],["given","dropping-particle"],["suffix"]];
		};
	} else { // plain vanilla
		var sequence = [[suffix_sep,"space","space"],["given"],["dropping-particle","non-dropping-particle","family"],["suffix"]];
	}
	return sequence;
};
CSL.Util.Names.deep_copy = function(nameset){
	var nameset2 = new Array();
	for each (name in nameset){
		var name2 = new Object();
		for (var i in name){
			name2[i] = name[i];
		}
		nameset2.push(name2);
	}
	return nameset2;
}
//
// XXXX A handy guide to variable assignments that need
// XXXX to be eliminated.  :)
//
CSL.Util.Names.reinit = function(state,Item){
	state.tmp.value = new Array();
	state.tmp.name_et_al_term = false;
	state.tmp.name_et_al_decorations = false;
	state.tmp.name_et_al_form = "long";
	state.tmp.et_al_prefix = false;
};
CSL.Util.Names.getCommonTerm = function(state,namesets){
	if (namesets.length < 2){
		return false;
	}
	var base_nameset = namesets[0];
	var varnames = new Array();
	if (varnames.indexOf(base_nameset.type) == -1){
		varnames.push(base_nameset.type);
	}
	for each (nameset in namesets.slice(1)){
		if (!CSL.Util.Names.compareNamesets(base_nameset,nameset)){
			return false;
		}
		if (varnames.indexOf(nameset.type) == -1){
			varnames.push(nameset.type);
		}
	}
	varnames.sort();
	return varnames.join("");
};
CSL.Util.Names.compareNamesets = function(base_nameset,nameset){
	if (base_nameset.length != nameset.length){
		return false;
	}
	var name;
	for (var n in nameset.names){
		name = nameset.names[n];
		for each (var part in ["family","given","dropping-particle","non-dropping-particle","suffix"]){
			if (base_nameset.names[n][part] != name[part]){
				return false;
			}
		}
	}
	return true;
};
CSL.Util.Names.initializeWith = function(state,name,terminator){
	if (!name){
		return "";
	};
	var namelist = name;
	if (state.opt["initialize-with-hyphen"] == false){
		namelist = namelist.replace(/\-/g," ");
	}
	namelist = namelist.replace(/\./g," ").replace(/\s*\-\s*/g,"-").replace(/\s+/g," ").split(/(\-|\s+)/);
	var l = namelist.length;
	for (var i=0; i<l; i+=2){
		var n = namelist[i];
		var m = n.match( CSL.NAME_INITIAL_REGEXP);
		if (m && m[1] == m[1].toUpperCase()){
			var extra = "";
			// extra upper-case characters also included
			if (m[2]){
				var s = "";
				for each (var c in m[2].split("")){
					if (c == c.toUpperCase()){
						s += c;
					} else {
						break;
					}
				}
				if (s.length < m[2].length){
					extra = s.toLocaleLowerCase();
				};
			}
			namelist[i] = m[1].toLocaleUpperCase() + extra;
			if (i < (namelist.length-1)){
				if (namelist[(i+1)].indexOf("-") > -1){
					namelist[(i+1)] = terminator + namelist[(i+1)];
				} else {
					namelist[(i+1)] = terminator;
				}
			} else {
				namelist.push(terminator);
			}
		} else if (n.match(CSL.ROMANESQUE_REGEXP)){
			// romanish things that began with lower-case characters don't get initialized ...
			namelist[i] = " "+n;
		};
	};
	var ret = CSL.Util.Names.stripRight( namelist.join("") );
	ret = ret.replace(/\s*\-\s*/g,"-").replace(/\s+/g," ");
	return ret;
};
CSL.Util.Names.stripRight = function(str){
	var end = 0;
	for (var pos=(str.length-1); pos > -1; pos--){
		if (str[pos] != " "){
			end = (pos+1);
			break;
		};
	};
	return str.slice(0,end);
};
CSL.Util.Names.rescueNameElements = function(names){
	for (var name in names){
		if (names[name]["given"]){
			if (names[name]["given"].indexOf(",") > -1){
				var m = names[name]["given"].match(/(.*),(!?)\s*(.*)/);
				names[name]["given"] = m[1];
				if (m[2]){
					names[name]["comma_suffix"] = true;
				}
				names[name]["suffix"] = m[3];
			};
			var m = names[name]["given"].match(/(.*?)\s+([ a-z]+)$/);
			if (m){
				names[name]["given"] = m[1];
				names[name]["prefix"] = m[2];
			}
		};
	};
	return names;
};
dojo.provide("csl.util_dates");
if (!CSL) {
}
CSL.Util.Dates = new function(){};
CSL.Util.Dates.year = new function(){};
CSL.Util.Dates.year["long"] = function(state,num){
	if (!num){
		num = 0;
	}
	return num.toString();
}
CSL.Util.Dates.year["short"] = function(state,num){
	num = num.toString();
	if (num && num.length == 4){
		return num.substr(2);
	}
}
CSL.Util.Dates["month"] = new function(){};
CSL.Util.Dates.month["numeric"] = function(state,num){
	var ret = num.toString();
	return ret;
}
CSL.Util.Dates.month["numeric-leading-zeros"] = function(state,num){
	if (!num){
		num = 0;
	}
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	return num.toString();
}
CSL.Util.Dates.month["long"] = function(state,num){
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	num = "month-"+num;
	return state.getTerm(num,"long",0);
}
CSL.Util.Dates.month["short"] = function(state,num){
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	num = "month-"+num;
	return state.getTerm(num,"short",0);
}
CSL.Util.Dates["day"] = new function(){};
CSL.Util.Dates.day["numeric"] = function(state,num){
	return num.toString();
}
CSL.Util.Dates.day["long"] = CSL.Util.Dates.day["numeric"];
CSL.Util.Dates.day["numeric-leading-zeros"] = function(state,num){
	if (!num){
		num = 0;
	}
	num = num.toString();
	while (num.length < 2){
		num = "0"+num;
	}
	return num.toString();
}
CSL.Util.Dates.day["ordinal"] = function(state,num){
	return state.fun.ordinalizer(num);
}
dojo.provide("csl.util_sort");
if (!CSL) {
}
CSL.Util.Sort = new function(){};
CSL.Util.Sort.strip_prepositions = function(str){
	if ("string" == typeof str){
		var m = str.toLocaleLowerCase();
		m = str.match(/^((a|an|the)\s+)/);
	}
	if (m){
		str = str.substr(m[1].length);
	};
	return str;
};
dojo.provide("csl.util_substitute");
CSL.Util.substituteStart = function(state,target){
	if (("text" == this.name && !this.postponed_macro) || ["number","date","names"].indexOf(this.name) > -1){
		var element_trace = function(state,Item){
			if (state.tmp.element_trace.value() == "author" || "names" == this.name){
				if (Item["author-only"]){
					state.tmp.element_trace.push("do-not-suppress-me");
				} else if (Item["suppress-author"]){
					state.tmp.element_trace.push("suppress-me");
				};
			} else {
				if (Item["author-only"]){
					state.tmp.element_trace.push("suppress-me");
				} else if (Item["suppress-author"]){
					state.tmp.element_trace.push("do-not-suppress-me");
				};
			};
		};
		this.execs.push(element_trace);
	};
	if (state.build.area == "bibliography"){
		if (state.build.render_nesting_level == 0){
			//
			// The markup formerly known as @bibliography/first
			//
			if (state.bibliography.opt["second-field-align"]){
				var bib_first = new CSL.Token("group",CSL.START);
				bib_first.decorations = [["@display","left-margin"]];
				var func = function(state,Item){
					if (!state.tmp.render_seen){
						state.tmp.count_offset_characters = true;
						state.output.startTag("bib_first",bib_first);
					};
				};
				bib_first.execs.push(func);
				target.push(bib_first);
			};
			if ("csl-left-label" == this.strings.cls && "bibliography" == state.build.area){
				print("OOOOOOOOOOOOOOOOOOKAY!");
				var func = function(state,Item){
					if ("csl-left-label" == this.strings.cls && !state.tmp.suppress_decorations){
						state.tmp.count_offset_characters = true;
					};
				};
				this.execs.push(func);
			}
		}
		state.build.render_nesting_level += 1;
	}
	if (state.build.substitute_level.value() == 1){
		//
		// All top-level elements in a substitute environment get
		// wrapped in conditionals.  The substitute_level variable
		// is a stack, because spanned names elements (with their
		// own substitute environments) can be nested inside
		// a substitute environment.
		//
		// (okay, we use conditionals a lot more than that.
		// we slot them in for author-only as well...)
		var choose_start = new CSL.Token("choose",CSL.START);
		target.push(choose_start);
		var if_start = new CSL.Token("if",CSL.START);
		//
		// Set a test of the shadow if token to skip this
		// macro if we have acquired a name value.
		var check_for_variable = function(state,Item){
			if (state.tmp.can_substitute.value()){
				return true;
			}
			return false;
		};
		if_start.tests.push(check_for_variable);
		//
		// this is cut-and-paste of the "any" evaluator
		// function, from Attributes.  These functions
		// should be defined in a namespace for reuse.
		// Sometime.
		if_start.evaluator = state.fun.match.any;
		target.push(if_start);
	};
};
CSL.Util.substituteEnd = function(state,target){
	if (state.build.area == "bibliography"){
		state.build.render_nesting_level += -1;
		if (state.build.render_nesting_level == 0){
			if ("csl-left-label" == this.strings.cls && state.build.area == "bibliography"){
				var func = function(state,Item){
					if ("csl-left-label" == this.strings.cls && !state.tmp.suppress_decorations){
						state.tmp.count_offset_characters = false;
					};
				};
				this.execs.push(func);
			};
			if (state.bibliography.opt["second-field-align"]){
				var bib_first_end = new CSL.Token("group",CSL.END);
				var first_func_end = function(state,Item){
					if (!state.tmp.render_seen){
						state.output.endTag(); // closes bib_first
						state.tmp.count_offset_characters = false;
					};
				};
				bib_first_end.execs.push(first_func_end);
				target.push(bib_first_end);
				var bib_other = new CSL.Token("group",CSL.START);
				bib_other.decorations = [["@display","right-inline"]];
				var other_func = function(state,Item){
					if (!state.tmp.render_seen){
						state.tmp.render_seen = true;
						state.output.startTag("bib_other",bib_other);
					};
				};
				bib_other.execs.push(other_func);
				target.push(bib_other);
			};
		};
	};
//	if (state.build.substitute_level.value() <= 1 && this.name != "group"){
	if (state.build.substitute_level.value() == 1){
		var if_end = new CSL.Token("if",CSL.END);
		target.push(if_end);
		var choose_end = new CSL.Token("choose",CSL.END);
		target.push(choose_end);
	};
	var toplevel = "names" == this.name && state.build.substitute_level.value() == 0;
	var hasval = "string" == typeof state[state.build.area].opt["subsequent-author-substitute"];
	if (toplevel && hasval){
		var author_substitute = new CSL.Token("text",CSL.SINGLETON);
		var func = function(state,Item){
			var printing = !state.tmp.suppress_decorations;
			if (printing){
				if (!state.tmp.rendered_name){
					state.tmp.rendered_name = state.output.string(state,state.tmp.name_node.blobs,false);
					if (state.tmp.rendered_name){
						//CSL.debug("TRY! "+state.tmp.rendered_name);
						if (state.tmp.rendered_name == state.tmp.last_rendered_name){
							var str = new CSL.Blob(false,state[state.tmp.area].opt["subsequent-author-substitute"]);
							state.tmp.name_node.blobs = [str];
						};
						state.tmp.last_rendered_name = state.tmp.rendered_name;
					};
				};
			};
		};
		author_substitute.execs.push(func);
		target.push(author_substitute);
	};
	if (("text" == this.name && !this.postponed_macro) || ["number","date","names"].indexOf(this.name) > -1){
		var element_trace = function(state,Item){
			state.tmp.element_trace.pop();
		};
		this.execs.push(element_trace);
	}
};
dojo.provide("csl.util_disambiguate");
if (!CSL) {
}
//
// This will probably become CSL.Util.Numbers
//
CSL.Util.LongOrdinalizer = function(){};
CSL.Util.LongOrdinalizer.prototype.init = function(state){
	this.state = state;
	this.names = new Object();
	for (var i=1; i<10; i+=1){
		this.names[""+i] = state.getTerm("long-ordinal-0"+i);
	};
	this.names["10"] = state.getTerm("long-ordinal-10");
};
CSL.Util.LongOrdinalizer.prototype.format = function(num){
	var ret = this.names[""+num];
	if (!ret){
		ret = this.state.fun.ordinalizer.format(num);
	};
	return ret;
};
CSL.Util.Ordinalizer = function(){};
CSL.Util.Ordinalizer.prototype.init = function(state){
	this.suffixes = new Array();
	for (var i=1; i<5; i+=1){
		this.suffixes.push( state.getTerm("ordinal-0"+i) );
	};
};
CSL.Util.Ordinalizer.prototype.format = function(num){
	num = parseInt(num,10);
	var str = num.toString();
	if ( (num/10)%10 == 1){
		str += this.suffixes[3];
	} else if ( num%10 == 1) {
		str += this.suffixes[0];
	} else if ( num%10 == 2){
		str += this.suffixes[1];
	} else if ( num%10 == 3){
		str += this.suffixes[2];
	} else {
		str += this.suffixes[3];
	}
	return str;
};
CSL.Util.Romanizer = function (){};
CSL.Util.Romanizer.prototype.format = function(num){
	var ret = "";
	if (num < 6000) {
		var numstr = num.toString().split("");
		numstr.reverse();
		var pos = 0;
		var n = 0;
		for (var pos in numstr){
			n = parseInt(numstr[pos],10);
			ret = CSL.ROMAN_NUMERALS[pos][n] + ret;
		}
	}
	return ret;
};
CSL.Util.Suffixator = function(slist){
	if (!slist){
		slist = CSL.SUFFIX_CHARS;
	}
	this.slist = slist.split(",");
};
CSL.Util.Suffixator.prototype.format = function(num){
	var suffixes = this.get_suffixes(num);
	return suffixes[(suffixes.length-1)];
}
CSL.Util.Suffixator.prototype.get_suffixes = function(num){
	var suffixes = new Array();
	for (var i=0; i <= num; i++){
		if (!i){
			suffixes.push([0]);
		} else {
			suffixes.push( this.incrementArray(suffixes[(suffixes.length-1)],this.slist) );
		}
	};
	for (pos in suffixes){
		var digits = suffixes[pos];
		var chrs = "";
		for each (digit in digits){
			chrs = chrs+this.slist[digit];
		}
		suffixes[pos] = chrs;
	};
	return suffixes;
};
CSL.Util.Suffixator.prototype.incrementArray = function (array){
	array = array.slice();
	var incremented = false;
	for (var i=(array.length-1); i > -1; i--){
		if (array[i] < (this.slist.length-1)){
			array[i] += 1;
			if (i < (array.length-1)){
				array[(i+1)] = 0;
			}
			incremented = true;
			break;
		}
	}
	if (!incremented){
		for (var i in array){
			array[i] = 0;
		}
		var newdigit = [0];
		array = newdigit.concat(array);
	}
	return array;
};
if (!CSL) {
}
CSL.Util.PageRangeMangler = new Object();
CSL.Util.PageRangeMangler.getFunction = function(state){
	var rangerex = /([a-zA-Z]*)([0-9]+)\s*-\s*([a-zA-Z]*)([0-9]+)/;
	var stringify = function(lst){
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			if ("object" == typeof lst[pos]){
				lst[pos] = lst[pos].join("");
			};
		};
		return lst.join("");
	};
	var listify = function(str){
		var lst = str.split(/([a-zA-Z]*[0-9]+\s*-\s*[a-zA-Z]*[0-9]+)/);
		return lst;
	};
	var expand = function(str){
		var lst = listify(str);
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			var m = lst[pos].match(rangerex);
			if (m){
				if (!m[3] || m[1] == m[3]){
					if (m[4].length < m[2].length){
						m[4] = m[2].slice(0,(m[2].length-m[4].length)) + m[4];
					}
					if (parseInt(m[2],10) < parseInt(m[4],10)){
						m[3] = "-"+m[1];
						lst[pos] = m.slice(1);
					}
				}
			}
		};
		return lst;
	};
	var minimize = function(lst){
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			lst[pos][3] = _minimize(lst[pos][1], lst[pos][3]);
			if (lst[pos][2].slice(1) == lst[pos][0]){
				lst[pos][2] = "-";
			}
		};
		return stringify(lst);
	};
	var _minimize = function(begin, end){
		var b = (""+begin).split("");
		var e = (""+end).split("");
		var ret = e.slice();
		ret.reverse();
		if (b.length == e.length){
			var l = b.length;
			for (var pos=0; pos<l; pos += 1){
				if (b[pos] == e[pos]){
					ret.pop();
				} else {
					break;
				}
			}
		}
		ret.reverse();
		return ret.join("");
	};
	var chicago = function(lst){
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			if ("object" == typeof lst[pos]){
				var m = lst[pos];
				var begin = parseInt(m[1],10);
				var end = parseInt(m[3],10);
				if (begin > 100 && begin % 100 && parseInt((begin/100),10) == parseInt((end/100),10)){
					m[3] = ""+(end % 100);
				} else if (begin >= 10000){
					m[3] = ""+(end % 1000);
				}
			}
			if (m[2].slice(1) == m[0]){
				m[2] = "-";
			}
		}
		return stringify(lst);
	};
	if (!state.opt["page-range-format"]){
		var ret_func = function(str){
			return str;
		};
	} else if (state.opt["page-range-format"] == "expanded"){
		var ret_func = function(str){
			var lst = expand( str );
			return stringify(lst);
		};
	} else if (state.opt["page-range-format"] == "minimal") {
		var ret_func = function(str){
			var lst = expand(str);
			return minimize(lst);
		};
	} else if (state.opt["page-range-format"] == "chicago"){
		var ret_func = function(str){
			var lst = expand(str);
			return chicago(lst);
		};
	};
	return ret_func;
};
dojo.provide("csl.util_flipflop");
//
// (A) initialize flipflopper with an empty blob to receive output.
// Text string in existing output queue blob will be replaced with
// an array containing this blob.
CSL.Util.FlipFlopper = function(state){
	this.state = state;
	this.blob = false;
	var tagdefs = [
		["<i>","</i>","italics","@font-style",["italic","normal"],true],
		["<b>","</b>","boldface","@font-weight",["bold","normal"],true],
		["<sup>","</sup>","superscript","@vertical-align",["sup","sup"],true],
		["<sub>","</sub>","subscript","@font-weight",["sub","sub"],true],
		["<sc>","</sc>","smallcaps","@font-variant",["small-caps","small-caps"],true],
		["<span class=\"nocase\">","</span>","passthrough","@passthrough",["true","true"],true],
		["<span class=\"nodecor\">","</span>","passthrough","@passthrough",["true","true"],true],
		['"','"',"quotes","@quotes",["true","inner"],"'"],
		["'","'","quotes","@quotes",["inner","true"],'"']
	];
	for each (var t in ["quote"]){
		for each (var p in ["-","-inner-"]){
			var entry = new Array();
			entry.push( state.getTerm( "open"+p+t ) );
			entry.push( state.getTerm( "close"+p+t ) );
			entry.push( t+"s" );
			entry.push( "@"+t+"s" );
			if ("-" == p){
				entry.push( ["true", "inner"] );
			} else {
				entry.push( ["inner", "true"] );
			};
			entry.push(true);
			tagdefs.push(entry);
		};
	};
	var allTags = function(tagdefs){
		var ret = new Array();
		for each (var def in tagdefs){
			if (ret.indexOf(def[0]) == -1){
				var esc = "";
				if (["(",")","[","]"].indexOf(def[0]) > -1){
					esc = "\\";
				}
				ret.push(esc+def[0]);
			};
			if (ret.indexOf(def[1]) == -1){
				var esc = "";
				if (["(",")","[","]"].indexOf(def[1]) > -1){
					esc = "\\";
				}
				ret.push(esc+def[1]);
			};
		};
		return ret;
	};
	this.allTagsRex = RegExp( "(" + allTags(tagdefs).join("|") + ")" );
	var makeHashes = function(tagdefs){
		var closeTags = new Object();
		var flipTags = new Object();
		var openToClose = new Object();
		var openToDecorations = new Object();
		var okReverse = new Object();
		var l = tagdefs.length;
		for (var i=0; i < l; i += 1){
			closeTags[tagdefs[i][1]] = true;
			flipTags[tagdefs[i][1]] = tagdefs[i][5];
			openToClose[tagdefs[i][0]] = tagdefs[i][1];
			openToDecorations[tagdefs[i][0]] = [tagdefs[i][3],tagdefs[i][4]];
			okReverse[tagdefs[i][3]] = [tagdefs[i][3],[tagdefs[i][4][1],tagdefs[i][1]]];
		};
		return [closeTags,flipTags,openToClose,openToDecorations,okReverse];
	};
	var hashes = makeHashes(tagdefs);
	this.closeTagsHash = hashes[0];
	this.flipTagsHash = hashes[1];
	this.openToCloseHash = hashes[2];
	this.openToDecorations = hashes[3];
	this.okReverseHash = hashes[4];
};
CSL.Util.FlipFlopper.prototype.init = function(str,blob){
	if (!blob){
		this.strs = this.getSplitStrings(str);
		this.blob = new CSL.Blob();
	} else {
		this.blob = blob;
		this.strs = this.getSplitStrings( this.blob.blobs );
		this.blob.blobs = new Array();
	}
	this.blobstack = new CSL.Stack(this.blob);
};
//
// (1) scan the string for escape characters.  Split the
// string on tag candidates, and rejoin the tags that
// are preceded by an escape character.  Ignore broken
// markup.
//
CSL.Util.FlipFlopper.prototype.getSplitStrings = function(str){
	var strs = str.split( this.allTagsRex );
	for (var i=(strs.length-2); i>0; i +=-2){
		if (strs[(i-1)].slice((strs[(i-1)].length-1)) == "\\"){
			var newstr = strs[(i-1)].slice(0,(strs[(i-1)].length-1)) + strs[i] + strs[(i+1)];
			var head = strs.slice(0,(i-1));
			var tail = strs.slice((i+2));
			head.push(newstr);
			strs = head.concat(tail);
		};
	};
	var expected_closers = new Array();
	var expected_openers = new Array();
	var expected_flips = new Array();
	var tagstack = new Array();
	var badTagStack = new Array();
	var l = (strs.length-1);
	for (var posA=1; posA<l; posA +=2){
		var tag = strs[posA];
		if (this.closeTagsHash[tag]){
			expected_closers.reverse();
			var sameAsOpen = this.openToCloseHash[tag];
			var openRev = expected_closers.indexOf(tag);
			var flipRev = expected_flips.indexOf(tag);
			expected_closers.reverse();
			if ( !sameAsOpen || (openRev > -1 && openRev < flipRev)){
				var ibeenrunned = false;
				for (var posB=(expected_closers.length-1); posB>-1; posB+=-1){
					ibeenrunned = true;
					var wanted_closer = expected_closers[posB];
					if (tag == wanted_closer){
						expected_closers.pop();
						expected_openers.pop();
						expected_flips.pop();
						tagstack.pop();
						break;
					};
					//CSL.debug("badA:"+posA);
					badTagStack.push( posA );
				};
				if (!ibeenrunned){
					//CSL.debug("badB:"+posA);
					badTagStack.push( posA );
				};
				continue;
			};
		};
		if (this.openToCloseHash[tag]){
			expected_closers.push( this.openToCloseHash[tag] );
			expected_openers.push( tag );
			expected_flips.push( this.flipTagsHash[tag] );
			tagstack.push(posA);
		};
	};
	for (var posC in expected_closers.slice()){
		expected_closers.pop();
		expected_flips.pop();
		expected_openers.pop();
		badTagStack.push( tagstack.pop() );
	};
	badTagStack.sort(function(a,b){if(a<b){return 1;}else if(a>b){return -1;};return 0;});
	for each (var badTagPos in badTagStack){
		var head = strs.slice(0,(badTagPos-1));
		var tail = strs.slice((badTagPos+2));
		var sep = strs[badTagPos];
		if (sep.length && sep[0] != "<" && this.openToDecorations[sep]){
			var params = this.openToDecorations[sep];
			sep = this.state.fun.decorate[params[0]][params[1][0]](this.state);
		}
		var resplice = strs[(badTagPos-1)] + sep + strs[(badTagPos+1)];
		head.push(resplice);
		strs = head.concat(tail);
	};
	var l = strs.length;
	for (var i=0; i<l; i+=2){
		strs[i] = CSL.Output.Formats[this.state.opt.mode].text_escape( strs[i] );
	};
	return strs;
};
//
// (2) scan the string for non-overlapping open and close tags,
// skipping escaped tags.  During processing, a list of expected
// closing tags will be maintained on a working stack.
//
CSL.Util.FlipFlopper.prototype.processTags = function(){
	var expected_closers = new Array();
	var expected_openers = new Array();
	var expected_flips = new Array();
	var expected_rendering = new Array();
	var str = "";
	if (this.strs.length == 1){
		this.blob.blobs = this.strs[0];
	} else if (this.strs.length > 2){
		var l = (this.strs.length-1);
		for (var posA=1; posA <l; posA+=2){
			var tag = this.strs[posA];
			var prestr = this.strs[(posA-1)];
			// start by pushing in the trailing text string
			var newblob = new CSL.Blob(false,prestr);
			var blob = this.blobstack.value();
			blob.push(newblob);
//
// (a) For closing tags, check to see if it matches something
// on the working stack.  If so, pop the stack and close the
// output queue level.
//
			if (this.closeTagsHash[tag]){
				//
				// Gaack.  Conditions.  Allow if ...
				// ... the close tag is not also an open tag, or ...
				// ... ... there is a possible open tag on our stacks, and ...
				// ... ... there is no intervening flipped partner to it.
				//
				expected_closers.reverse();
				var sameAsOpen = this.openToCloseHash[tag];
				var openRev = expected_closers.indexOf(tag);
				var flipRev = expected_flips.indexOf(tag);
				expected_closers.reverse();
				if ( !sameAsOpen || (openRev > -1 && openRev < flipRev)){
					for (var posB=(expected_closers.length-1); posB>-1; posB+=-1){
						var wanted_closer = expected_closers[posB];
						if (tag == wanted_closer){
							expected_closers.pop();
							expected_openers.pop();
							expected_flips.pop();
							expected_rendering.pop();
							this.blobstack.pop();
							break;
						};
					};
					continue;
				};
			};
//
// (b) For open tags, push the corresponding close tag onto a working
// stack, and open a level on the output queue.
//
			if (this.openToCloseHash[tag]){
				// CSL.debug("open:"+tag);
				expected_closers.push( this.openToCloseHash[tag] );
				expected_openers.push( tag );
				expected_flips.push( this.flipTagsHash[tag] );
				blob = this.blobstack.value();
				var newblobnest = new CSL.Blob();
				blob.push(newblobnest);
				var param = this.addFlipFlop(newblobnest,this.openToDecorations[tag]);
				//
				// No.  This can just impose the reverse of all normal decorations.
				//
				// CSL.debug(this.okReverseTagsHash[this.blob.alldecor[0][0].join("-is-")]);
				//
				if (tag == "<span class=\"nodecor\">"){
					for each (var level in this.blob.alldecor){
						for each (var decor in level){
							if (["@font-style"].indexOf(decor[0]) > -1){
								// This is be the @name of the decor, plus a
								// pairing composed of two copies of the "undo" side
								// of the decor's format parameter.  The effect
								// is to undo all decor at the top level of
								// an <span class="nocase"> span.
								param = this.addFlipFlop(newblobnest,this.okReverseHash[decor[0]]);
							}
						}
					}
				}
				expected_rendering.push( this.state.fun.decorate[param[0]][param[1]](this.state));
				this.blobstack.push(newblobnest);
			};
		};
//
// (B) at the end of processing, unwind any open tags, append any
// remaining text to the output queue and return the blob.
//
	if (this.strs.length > 2){
		str = this.strs[(this.strs.length-1)];
		var blob = this.blobstack.value();
		var newblob = new CSL.Blob(false,str);
		blob.push(newblob);
	};
	};
	return this.blob;
};
CSL.Util.FlipFlopper.prototype.addFlipFlop = function(blob,fun){
	var posB = 0;
	var l = blob.alldecor.length;
	for (var posA=0; posA<l; posA+=1){
		var decorations = blob.alldecor[posA];
		var breakme = false;
		for (var posC=(decorations.length-1); posC>-1; posC+=-1){
			var decor = decorations[posC];
			if (decor[0] == fun[0]){
				if (decor[1] == fun[1][0]){
					posB = 1;
				};
				breakme = true;
				break;
			};
		};
		if (breakme){
			break;
		};
	};
	var newdecor = [fun[0],fun[1][posB]];
	blob.decorations.reverse();
	blob.decorations.push(newdecor);
	blob.decorations.reverse();
	return newdecor;
};
dojo.provide("csl.formatters");
if (!CSL) {
}
CSL.Output.Formatters = new function(){};
CSL.Output.Formatters.strip_periods = function(state,string) {
    return string.replace(/\./g," ").replace(/\s*$/g,"").replace(/\s+/g," ");
};
CSL.Output.Formatters.passthrough = function(state,string){
	return string;
};
CSL.Output.Formatters.lowercase = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_USEALL);
	str.string = str.string.toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters.uppercase = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_USEALL);
	str.string = str.string.toUpperCase();
	var ret = CSL.Output.Formatters.undoppelString(str);
	return ret;
};
CSL.Output.Formatters["capitalize-first"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	if (str.string.length){
		str.string = str.string[0].toUpperCase()+str.string.substr(1);
		return CSL.Output.Formatters.undoppelString(str);
	} else {
		return "";
	}
};
CSL.Output.Formatters["sentence"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	str.string = str.string[0].toUpperCase()+str.string.substr(1).toLowerCase();
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters["capitalize-all"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	var strings = str.string.split(" ");
	var l = strings.length;
	for(var i=0; i<l; i++) {
		if(strings[i].length > 1) {
            strings[i] = strings[i][0].toUpperCase()+strings[i].substr(1).toLowerCase();
        } else if(strings[i].length == 1) {
            strings[i] = strings[i].toUpperCase();
        }
    }
	str.string = strings.join(" ");
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters["title"] = function(state,string) {
	var str = CSL.Output.Formatters.doppelString(string,CSL.TAG_ESCAPE);
	if (!string) {
		return "";
	}
	var words = str.string.split(/(\s+)/);
	var isUpperCase = str.string.toUpperCase() == string;
	var newString = "";
	var delimiterOffset = words[0].length;
	var lastWordIndex = words.length-1;
	var previousWordIndex = -1;
	for(var i=0; i<=lastWordIndex;  i += 2) {
		// only do manipulation if not a delimiter character
		if(words[i].length != 0 && (words[i].length != 1 || !/\s+/.test(words[i]))) {
			var upperCaseVariant = words[i].toUpperCase();
			var lowerCaseVariant = words[i].toLowerCase();
				// only use if word does not already possess some capitalization
				if(isUpperCase || words[i] == lowerCaseVariant) {
					if(
						// a skip word
						CSL.SKIP_WORDS.indexOf(lowerCaseVariant.replace(/[^a-zA-Z]+/, "")) != -1
						// not first or last word
						&& i != 0 && i != lastWordIndex
						// does not follow a colon
						&& (previousWordIndex == -1 || words[previousWordIndex][words[previousWordIndex].length-1] != ":")
					) {
							words[i] = lowerCaseVariant;
					} else {
						// this is not a skip word or comes after a colon;
						// we must capitalize
						words[i] = upperCaseVariant[0] + lowerCaseVariant.substr(1);
					}
				}
				previousWordIndex = i;
		}
	}
	str.string = words.join("");
	return CSL.Output.Formatters.undoppelString(str);
};
CSL.Output.Formatters.doppelString = function(string,rex){
	var ret = new Object();
	ret.array = string.split(rex);
	ret.string = "";
	var l = ret.array.length;
	for (var i=0; i<l; i += 2){
		ret.string += ret.array[i];
	};
	return ret;
};
CSL.Output.Formatters.undoppelString = function(str){
	var ret = "";
	var l = str.array.length;
	for (var i=0; i<l; i += 1){
		if ((i%2)){
			ret += str.array[i];
		} else {
			ret += str.string.slice(0,str.array[i].length);
			str.string = str.string.slice(str.array[i].length);
		};
	};
	return ret;
};
dojo.provide("csl.formats");
if (!CSL) {
}
CSL.Output.Formats = function(){};
CSL.Output.Formats.prototype.html = {
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
dojo.provide("csl.registry");
//
// Time for a rewrite of this module.
//
// Simon has pointed out that list and hash behavior can
// be obtained by ... just using a list and a hash.  This
// is faster for batched operations, because sorting is
// greatly optimized.  Since most of the interaction
// with plugins at runtime will involve batches of
// references, there will be solid gains if the current,
// one-reference-at-a-time approach implemented here
// can be replaced with something that leverages the native
// sort method of the Array() type.
//
// That's going to take some redesign, but it will simplify
// things in the long run, so it might as well happen now.
//
// We'll keep makeCitationCluster and makeBibliography as
// simple methods that return a string.  Neither should
// have any effect on internal state.  This will be a change
// in behavior for makeCitationCluster.
//
// A new updateItems command will be introduced, to replace
// insertItems.  It will be a simple list of IDs, in the
// sequence of first reference in the document.
//
// The calling application should always invoke updateItems
// before makeCitationCluster.
//
//
// should allow batched registration of items by
// key.  should behave as an update, with deletion
// of items and the tainting of disambiguation
// partner sets affected by a deletes and additions.
//
//
// we'll need a reset method, to clear the decks
// in the citation area and start over.
CSL.Registry = function(state){
	this.state = state;
	this.registry = new Object();
	this.reflist = new Array();
	this.namereg = new CSL.Registry.NameReg(state);
	this.mylist = new Array();
	this.myhash = new Object();
	this.deletes = new Array();
	this.inserts = new Array();
	this.refreshes = new Object();
	this.akeys = new Object();
	this.ambigcites = new Object();
	this.sorter = new CSL.Registry.Comparifier(state,"bibliography_sort");
	this.modes = CSL.getModes.call(this.state);
	this.checkerator = new CSL.Checkerator();
	this.getSortedIds = function(){
		var ret = [];
		for each (var Item in this.reflist){
			ret.push(Item.id);
		};
		return ret;
	};
};
//
// Here's the sequence of operations to be performed on
// update:
//
//  1.  (o) [init] Receive list as function argument, store as hash and as list.
//  2.  (o) [init] Initialize refresh list.  Never needs sorting, only hash required.
//  3.  (o) [dodeletes] Delete loop.
//  3a. (o) [dodeletes] Delete names in items to be deleted from names reg.
//  3b. (o) [dodeletes] Complement refreshes list with items affected by
//      possible name changes.  We'll actually perform the refresh once
//      all of the necessary data and parameters have been established
//      in the registry.
//  3c. (o) [dodeletes] Delete all items to be deleted from their disambig pools.
//  3d. (o) [dodeletes] Delete all items in deletion list from hash.
//  4.  (o) [doinserts] Insert loop.
//  4a. (o) [doinserts] Retrieve entries for items to insert.
//  4b. (o) [doinserts] Generate ambig key.
//  4c. (o) [doinserts] Add names in items to be inserted to names reg
//      (implicit in getAmbiguousCite).
//  4d. (o) [doinserts] Record ambig pool key on akey list (used for updating further
//      down the chain).
//  4e. (o) [doinserts] Create registry token.
//  4f. (o) [doinserts] Add item ID to hash.
//  4g. (o) [doinserts] Set and record the base token to hold disambiguation
//      results ("disambig" in the object above).
//  5.  (o) [rebuildlist] Create "new" list of hash pointers, in the order given
//          in the argument to the update function.
//  6.  (o) [rebuildlist] Apply citation numbers to new list.
//  7.  (o) [dorefreshes] Refresh items requiring update.
//  5. (o) [delnames] Delete names in items to be deleted from names reg, and obtain IDs
//         of other items that would be affected by changes around that surname.
//  6. (o) [delnames] Complement delete and insert lists with items affected by
//         possible name changes.
//  7. (o) [delambigs] Delete all items to be deleted from their disambig pools.
//  8. (o) [delhash] Delete all items in deletion list from hash.
//  9. (o) [addtohash] Retrieve entries for items to insert.
// 10. (o) [addtohash] Add items to be inserted to their disambig pools.
// 11. (o) [addtohash] Add names in items to be inserted to names reg
//         (implicit in getAmbiguousCite).
// 12. (o) [addtohash] Create registry token for each item to be inserted.
// 13. (o) [addtohash] Add items for insert to hash.
// 14. (o) [buildlist] Create "new" list of hash pointers, in the order given in the argument
//         to the update function.
// 15. (o) [renumber] Apply citation numbers to new list.
// 16. (o) [setdisambigs] Set disambiguation parameters on each inserted item token.
// 17. (o) [setsortkeys] Set sort keys on each item token.
// 18. (o) [sorttokens] Resort token list
// 19. (o) [renumber] Reset citation numbers on list items
//
CSL.Registry.prototype.init = function(myitems){
	this.mylist = myitems;
	this.myhash = new Object();
	for each (var item in myitems){
		this.myhash[item] = true;
	};
	this.refreshes = new Object();
	this.touched = new Object();
};
CSL.Registry.prototype.dodeletes = function(myhash){
	if ("string" == typeof myhash){
		myhash = {myhash:true};
	};
	for (var delitem in this.registry){
		if (!myhash[delitem]){
			//
			//  3a. Delete names in items to be deleted from names reg.
			//
			var otheritems = this.namereg.delitems(delitem);
			//
			//  3b. Complement refreshes list with items affected by
			//      possible name changes.  We'll actually perform the refresh once
			//      all of the necessary data and parameters have been established
			//      in the registry.
			//
			for (var i in otheritems){
				this.refreshes[i] = true;
			};
			//
			//  3c. Delete all items to be deleted from their disambig pools.
			//
			var ambig = this.registry[delitem].ambig;
			var pos = this.ambigcites[ambig].indexOf(delitem);
			if (pos > -1){
				var items = this.ambigcites[ambig].slice();
				this.ambigcites[ambig] = items.slice(0,pos).concat(items.slice([pos+1],items.length));
			}
			//
			// XX. What we've missed is to provide an update of all
			// items sharing the same ambig -- the remaining items in
			// ambigcites.  So let's do that here, just in case the
			// names update above doesn't catch them all.
			//
			for each (var i in this.ambigcites[ambig]){
				this.refreshes[i] = true;
			};
			//
			//  3d. Delete all items in deletion list from hash.
			//
			delete this.registry[delitem];
		};
	};
};
CSL.Registry.prototype.doinserts = function(mylist){
	if ("string" == typeof mylist){
		mylist = [mylist];
	};
	for each (var item in mylist){
		if (!this.registry[item]){
			//
			//  4a. Retrieve entries for items to insert.
			//
			var Item = this.state.sys.retrieveItem(item);
			//
			//  4b. Generate ambig key.
			//
			// AND
			//
			//  4c. Add names in items to be inserted to names reg
			//      (implicit in getAmbiguousCite).
			//
			var akey = CSL.getAmbiguousCite.call(this.state,Item);
			//
			//  4d. Record ambig pool key on akey list (used for updating further
			//      down the chain).
			//
			this.akeys[akey] = true;
			//
			//  4e. Create registry token.
			//
			var newitem = {
				"id":item,
				"seq":0,
				"offset":0,
				"sortkeys":undefined,
				"ambig":undefined,
				"disambig":undefined
			};
			//
			//
			//  4f. Add item ID to hash.
			//
			this.registry[item] = newitem;
			//
			//  4g. Set and record the base token to hold disambiguation
			//      results ("disambig" in the object above).
			//
			var abase = CSL.getAmbigConfig.call(this.state);
			this.registerAmbigToken(akey,item,abase);
			//if (!this.ambigcites[akey]){
			//	this.ambigcites[akey] = new Array();
			//}
			//CSL.debug("Run: "+item+"("+this.ambigcites[akey]+")");
			//if (this.ambigcites[akey].indexOf(item) == -1){
			//	CSL.debug("  Add: "+item);
			//	this.ambigcites[akey].push(item);
			//};
			//
			//  4h. Make a note that this item needs its sort keys refreshed.
			//
			this.touched[item] = true;
		};
	};
};
CSL.Registry.prototype.rebuildlist = function(){
	this.reflist = new Array();
	var count = 1;
	for each (var item in this.mylist){
		this.reflist.push(this.registry[item]);
		this.registry[item].seq = count;
		count += 1;
	};
};
CSL.Registry.prototype.dorefreshes = function(){
	for (var item in this.refreshes){
		var regtoken = this.registry[item];
		delete this.registry[item];
		regtoken.disambig = undefined;
		regtoken.sortkeys = undefined;
		regtoken.ambig = undefined;
		var Item = this.state.sys.retrieveItem(item);
		var akey = CSL.getAmbiguousCite.call(this.state,Item);
		this.registry[item] = regtoken;
		var abase = CSL.getAmbigConfig.call(this.state);
		this.registerAmbigToken(akey,item,abase);
		this.akeys[akey] = true;
		this.touched[item] = true;
	};
};
CSL.Registry.prototype.setdisambigs = function(){
	this.leftovers = new Array();
	for (var akey in this.akeys){
		//
		// if there are multiple ambigs, disambiguate them
		if (this.ambigcites[akey].length > 1){
			if (this.modes.length){
				if (this.debug){
					CSL.debug("---> Names disambiguation begin");
				};
				var leftovers = this.disambiguateCites(this.state,akey,this.modes);
			} else {
				//
				// if we didn't disambiguate with names, everything is
				// a leftover.
				var leftovers = new Array();
				for each (var key in this.ambigcites[akey]){
					leftovers.push(this.registry[key]);
				};
			};
			//
			// for anything left over, set disambiguate to true, and
			// try again from the base.
			if (leftovers && leftovers.length && this.state.opt.has_disambiguate){
				var leftovers = this.disambiguateCites(this.state,akey,this.modes,leftovers);
			};
			//
			// Throws single leftovers.
			// Enough of this correctness shtuff already.  Using a band-aide on this.
			if (leftovers.length > 1){
				this.leftovers.push(leftovers);
			};
		};
	};
	this.akeys = new Object();
};
CSL.Registry.prototype.renumber = function(){
	var count = 1;
	for each (var item in this.reflist){
		item.seq = count;
		count += 1;
	};
};
CSL.Registry.prototype.yearsuffix = function(){
	for each (var leftovers in this.leftovers){
		if ( leftovers && leftovers.length && this.state[this.state.tmp.area].opt["disambiguate-add-year-suffix"]){
			//CSL.debug("ORDER OF ASSIGNING YEAR SUFFIXES");
			leftovers.sort(this.compareRegistryTokens);
			for (var i in leftovers){
				//CSL.debug("  "+leftovers[i].id);
				this.registry[ leftovers[i].id ].disambig[2] = i;
			};
		};
		if (this.debug) {
			CSL.debug("---> End of registry cleanup");
		};
	};
};
CSL.Registry.prototype.setsortkeys = function(){
	for (var item in this.touched){
		this.registry[item].sortkeys = CSL.getSortKeys.call(this.state,this.state.sys.retrieveItem(item),"bibliography_sort");
		//CSL.debug("touched: "+item+" ... "+this.registry[item].sortkeys);
	};
};
CSL.Registry.prototype.sorttokens = function(){
	this.reflist.sort(this.sorter.compareKeys);
};
CSL.Registry.Comparifier = function(state,keyset){
	var sort_directions = state[keyset].opt.sort_directions;
    this.compareKeys = function(a,b){
		var l = a.sortkeys.length;
		for (var i=0; i < l; i++){
			//
			// for ascending sort 1 uses 1, -1 uses -1.
			// For descending sort, the values are reversed.
			//
			// Need to handle undefined values.  No way around it.
			// So have to screen .localeCompare (which is also
			// needed) from undefined values.  Everywhere, in all
			// compares.
			//
			var cmp = 0;
			if (a.sortkeys[i] == b.sortkeys[i]){
				cmp = 0;
			} else if ("undefined" == typeof a.sortkeys[i]){
				cmp = sort_directions[i][1];;
			} else if ("undefined" == typeof b.sortkeys[i]){
				cmp = sort_directions[i][0];;
			} else {
				cmp = a.sortkeys[i].toLocaleLowerCase().localeCompare(b.sortkeys[i].toLocaleLowerCase());
			}
			if (0 < cmp){
				return sort_directions[i][1];
			} else if (0 > cmp){
				return sort_directions[i][0];
			}
		}
		if (a.seq > b.seq){
			return 1;
		} else if (a.seq < b.seq){
			return -1;
		} else {
			return 0;
		};
	};
};
CSL.Registry.prototype.compareRegistryTokens = function(a,b){
	if (a.seq > b.seq){
		return 1;
	} else if (a.seq < b.seq){
		return -1;
	}
	return 0;
};
CSL.Registry.prototype.registerAmbigToken = function (akey,id,ambig_config){
	if ( ! this.ambigcites[akey]){
		this.ambigcites[akey] = new Array();
	};
	if (this.ambigcites[akey].indexOf(id) == -1){
		this.ambigcites[akey].push(id);
	};
	this.registry[id].ambig = akey;
	this.registry[id].disambig = CSL.cloneAmbigConfig(ambig_config);
};
CSL.getSortKeys = function(Item,key_type){
	if (false){
		CSL.debug("KEY TYPE: "+key_type);
	}
	var area = this.tmp.area;
	var strip_prepositions = CSL.Util.Sort.strip_prepositions;
	this.tmp.area = key_type;
	this.tmp.disambig_override = true;
	this.tmp.disambig_request = false;
	this.tmp.suppress_decorations = true;
	CSL.getCite.call(this,Item);
	this.tmp.suppress_decorations = false;
	this.tmp.disambig_override = false;
	for (var i in this[key_type].keys){
		this[key_type].keys[i] = strip_prepositions(this[key_type].keys[i]);
	}
	if (false){
		CSL.debug("sort keys ("+key_type+"): "+this[key_type].keys);
	}
	this.tmp.area = area;
	return this[key_type].keys;
};
dojo.provide("csl.namereg");
CSL.Registry.NameReg = function(state){
	this.state = state;
	this.namereg = new Object();
	this.nameind = new Object();
	var pkey;
	var ikey;
	var skey;
	this.itemkeyreg = new Object();
	var _strip_periods = function(str){
		if (!str){
			str = "";
		}
		return str.replace("."," ").replace(/\s+/," ");
	};
	var _set_keys = function(state,itemid,nameobj){
		pkey = _strip_periods(nameobj["family"]);
		skey = _strip_periods(nameobj["given"]);
		ikey = CSL.Util.Names.initializeWith(state,skey,"");
		if (state[state.tmp.area].opt["givenname-disambiguation-rule"] == "by-cite"){
			pkey = itemid + pkey;
		};
	};
	var evalname = function(item_id,nameobj,namenum,request_base,form,initials){
		// return vals
		var floor;
		var ceiling;
		_set_keys(this.state,item_id,nameobj);
		//
		// give literals a pass
		if ("undefined" == typeof this.namereg[pkey] || "undefined" == typeof this.namereg[pkey].ikey[ikey]){
			return 2;
		}
		//
		// possible options are:
		//
		// <option disambiguate-add-givenname value="true"/> (a)
		// <option disambiguate-add-givenname value="all-names"/> (a)
		// <option disambiguate-add-givenname value="all-names-with-initials"/> (b)
		// <option disambiguate-add-givenname value="primary-name"/> (d)
		// <option disambiguate-add-givenname value="primary-name-with-initials"/> (e)
		// <option disambiguate-add-givenname value="by-cite"/> (g)
		//
		var param = 2;
		var dagopt = state[state.tmp.area].opt["disambiguate-add-givenname"];
		var gdropt = state[state.tmp.area].opt["givenname-disambiguation-rule"];
		if (gdropt == "by-cite"){
			gdropt = "all-names";
		};
		//
		// set initial value
		//
		if ("short" == form){
			param = 0;
		} else if ("string" == typeof initials || state.tmp.force_subsequent){
			param = 1;
		};
		//
		// adjust value upward if appropriate
		//
		if (param < request_base){
			param = request_base;
		}
		if (state.tmp.force_subsequent || !dagopt){
			return param;
		};
		if ("string" == typeof gdropt && gdropt.slice(0,12) == "primary-name" && namenum > 0){
			return param;
		};
		//
		// the last composite condition is for backward compatibility
		//
		if (!gdropt || gdropt == "all-names" || gdropt == "primary-name"){
			if (this.namereg[pkey].count > 1){
				param = 1;
			};
			if (this.namereg[pkey].ikey && this.namereg[pkey].ikey[ikey].count > 1){
				param = 2;
			}
		} else if (gdropt == "all-names-with-initials" || gdropt == "primary-name-with-initials"){
			if (this.namereg[pkey].count > 1){
				param = 1;
			}
		};
		return param;
	};
	var delitems = function(ids){
		if ("string" == typeof ids){
			ids = [ids];
		};
		var ret = {};
		for (var item in ids){
			//CSL.debug("DEL-A");
			if (!this.nameind[item]){
				continue;
			};
			var key = this.nameind[item].split("::");
			//CSL.debug("DEL-B");
			pkey = key[0];
			ikey = key[1];
			skey = key[2];
			var pos = this.namereg[pkey].items.indexOf(item);
			var items = this.namereg[pkey].items;
			if (skey){
				pos = this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf(item);
				if (pos > -1){
					items = this.namereg[pkey].ikey[ikey].skey[skey].items.slice();
					this.namereg[pkey].ikey[ikey].skey[skey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
				};
				if (this.namereg[pkey].ikey[ikey].skey[skey].items.length == 0){
					delete this.namereg[pkey].ikey[ikey].skey[skey];
					this.namereg[pkey].ikey[ikey].count += -1;
					if (this.namereg[pkey].ikey[ikey].count < 2){
						for (var i in this.namereg[pkey].ikey[ikey].items){
							ret[i] = true;
						};
					};
				};
			};
			if (ikey){
				pos = this.namereg[pkey].ikey[ikey].items.indexOf(item);
				if (pos > -1){
					items = this.namereg[pkey].ikey[ikey].items.slice();
					this.namereg[pkey].ikey[ikey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
				};
				if (this.namereg[pkey].ikey[ikey].items.length == 0){
					delete this.namereg[pkey].ikey[ikey];
					this.namereg[pkey].count += -1;
					if (this.namereg[pkey].count < 2){
						for (var i in this.namereg[pkey].items){
							ret[i] = true;
						};
					};
				};
			};
			if (pkey){
				pos = this.namereg[pkey].items.indexOf(item);
				if (pos > -1){
					items = this.namereg[pkey].items.slice();
					this.namereg[pkey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
				};
				if (this.namereg[pkey].items.length == 0){
					delete this.namereg[pkey];
				};
			}
			this.namereg[pkey].items = items.slice(0,pos).concat(items.slice([pos+1],items.length));
			delete this.nameind[item];
		};
		return ret;
	};
	var addname = function(item_id,nameobj,pos){
		//CSL.debug("INS");
		_set_keys(this.state,item_id,nameobj);
		// pkey, ikey and skey should be stored in separate cascading objects.
		// there should also be a kkey, on each, which holds the item ids using
		// that form of the name.
		if (pkey){
			if ("undefined" == typeof this.namereg[pkey]){
				this.namereg[pkey] = new Object();
				this.namereg[pkey]["count"] = 0;
				this.namereg[pkey]["ikey"] = new Object();
				this.namereg[pkey]["items"] = new Array();
			};
			if (this.namereg[pkey].items.indexOf(item_id) == -1){
				this.namereg[pkey].items.push(item_id);
			};
		};
		if (pkey && ikey){
			if ("undefined" == typeof this.namereg[pkey].ikey[ikey]){
				this.namereg[pkey].ikey[ikey] = new Object();
				this.namereg[pkey].ikey[ikey]["count"] = 0;
				this.namereg[pkey].ikey[ikey]["skey"] = new Object();
				this.namereg[pkey].ikey[ikey]["items"] = new Array();
				this.namereg[pkey]["count"] += 1;
			};
			if (this.namereg[pkey].ikey[ikey].items.indexOf(item_id) == -1){
				this.namereg[pkey].ikey[ikey].items.push(item_id);
			};
		};
		if (pkey && ikey && skey){
			if ("undefined" == typeof this.namereg[pkey].ikey[ikey].skey[skey]){
				this.namereg[pkey].ikey[ikey].skey[skey] = new Object();
				this.namereg[pkey].ikey[ikey].skey[skey]["items"] = new Array();
				this.namereg[pkey].ikey[ikey]["count"] += 1;
			};
			if (this.namereg[pkey].ikey[ikey].skey[skey].items.indexOf(item_id) == -1){
				this.namereg[pkey].ikey[ikey].skey[skey].items.push(item_id);
			};
		};
		if ("undefined" == typeof this.nameind[item_id]){
			this.nameind[item_id] = new Object();
		};
		//CSL.debug("INS-A");
		this.nameind[item_id][pkey+"::"+ikey+"::"+skey] = true;
		//CSL.debug("INS-B");
	};
	this.addname = addname;
	this.delitems = delitems;
	this.eval = evalname;
};
dojo.provide("csl.disambiguate");
var debug = false;
CSL.Registry.prototype.disambiguateCites = function (state,akey,modes,candidate_list){
	if ( ! candidate_list){
		//
		// We start with the state and an ambig key.
		// We acquire a copy of the list of ambigs that relate to the key from state.
		var ambigs = this.ambigcites[akey].slice();
		//
		// We clear the list of ambigs so it can be rebuilt
		this.ambigcites[akey] = new Array();
	} else {
		//
		// If candidate_list is true, we are running one final time with
		// disambiguate="true"
		//
		var ambigs = new Array();
		for each (var reg_token in candidate_list){
			ambigs.push(reg_token.id);
			var keypos = this.ambigcites[akey].indexOf(reg_token.id);
			if (keypos > -1){
				this.ambigcites[akey] = this.ambigcites[akey].slice(0,keypos).concat(this.ambigcites[akey].slice((keypos+1)));
			}
		}
	}
	var id_vals = new Array();
	for each (var a in ambigs){
		id_vals.push(a);
	}
	var tokens = state.retrieveItems(id_vals);
	if (candidate_list && candidate_list.length){
		modes = ["disambiguate_true"].concat(modes);
	}
	CSL.initCheckerator.call(this.checkerator,tokens,modes);
	this.checkerator.lastclashes = (ambigs.length-1);
	var base = false;
	this.checkerator.pos = 0;
	while (CSL.runCheckerator.call(this.checkerator)){
		var token = tokens[this.checkerator.pos];
		if (debug){
			CSL.debug("<<<<<<<<<<<<<<<<<<<<<<<<< "+ token.id +" >>>>>>>>>>>>>>>>>>>>>>>>>>>");
		}
		//
		// skip items that have been finally resolved.
		if (this.ambigcites[akey].indexOf(token.id) > -1){
			if (debug){
				CSL.debug("---> Skip registered token for: "+token.id);
			}
			this.checkerator.pos += 1;
			continue;
		}
		this.checkerator.candidate = token.id;
		if (base == false){
			this.checkerator.mode = modes[0];
		}
		if (debug){
			CSL.debug("  ---> Mode: "+this.checkerator.mode);
		}
		if (debug){
			CSL.debug("base in (givens):"+base["givens"]);
		}
		var str = CSL.getAmbiguousCite.call(state,token,base);
		var maxvals = CSL.getMaxVals.call(state);
		var minval = CSL.getMinVal.call(state);
		base = CSL.getAmbigConfig.call(state);
		if (debug){
			CSL.debug("base out (givens):"+base["givens"]);
		}
		if (candidate_list && candidate_list.length){
			base["disambiguate"] = true;
		}
		CSL.setCheckeratorBase.call(this.checkerator,base);
		CSL.setMaxVals.call(this.checkerator,maxvals);
		CSL.setMinVal.call(this.checkerator,minval);
		for each (testpartner in tokens){
			if (token.id == testpartner.id){
				continue;
			}
			var otherstr = CSL.getAmbiguousCite.call(state,testpartner,base);
			if (debug){
				CSL.debug("  ---> last clashes: "+this.checkerator.lastclashes);
				CSL.debug("  ---> master:    "+token.id);
				CSL.debug("  ---> master:    "+str);
				CSL.debug("  ---> partner: "+testpartner.id);
				CSL.debug("  ---> partner: "+otherstr);
			}
			if(CSL.checkCheckeratorForClash.call(this.checkerator,str,otherstr)){
				break;
			}
		}
		if (CSL.evaluateCheckeratorClashes.call(this.checkerator)){
			var base_return = CSL.decrementCheckeratorNames.call(this,state,base);
			this.registerAmbigToken(akey,token.id,base_return);
			this.checkerator.seen.push(token.id);
			if (debug){
				CSL.debug("  ---> Evaluate: storing token config");
				CSL.debug("          names: "+base["names"]);
				CSL.debug("         givens: "+base_return["givens"]);
			}
			continue;
		}
		if (CSL.maxCheckeratorAmbigLevel.call(this.checkerator)){
			if ( ! state["citation"].opt["disambiguate-add-year-suffix"]){
				this.checkerator.mode1_counts = false;
				this.checkerator.maxed_out_bases[token.id] = CSL.cloneAmbigConfig(base);
				if (debug){
					CSL.debug("  ---> Max out: remembering token config for: "+token.id);
					CSL.debug("       ("+base["names"]+":"+base["givens"]+")");
				}
			} else {
				if (debug){
					CSL.debug("  ---> Max out: NOT storing token config for: "+token.id);
					CSL.debug("       ("+base["names"]+":"+base["givens"]+")");
				}
			}
			this.checkerator.seen.push(token.id);
			base = false;
			continue;
		}
		if (debug){
			CSL.debug("  ---> Incrementing");
		}
		CSL.incrementCheckeratorAmbigLevel.call(this.checkerator);
	}
	var ret = new Array();
	for each (id in this.checkerator.ids){
		if (id){
			ret.push(this.registry[id]);
		}
	}
	for (i in this.checkerator.maxed_out_bases){
		this.registry[i].disambig = this.checkerator.maxed_out_bases[i];
	}
	return ret;
};
CSL.Checkerator = function(){};
CSL.initCheckerator = function(tokens,modes){
	this.seen = new Array();
	this.modes = modes;
	this.mode = this.modes[0];
	this.tokens_length = tokens.length;
	this.pos = 0;
	this.clashes = 0;
	this.maxvals = false;
	this.base = false;
	this.ids = new Array();
	this.maxed_out_bases = new Object();
	for each (token in tokens){
		this.ids.push(token.id);
	}
	this.lastclashes = -1;
	this.namepos = 0;
	this.modepos = 0;
	this.mode1_counts = false;
};
CSL.runCheckerator = function(){
	if (this.seen.length < this.tokens_length){
		return true;
	}
	return false;
}
CSL.setMaxVals = function(maxvals){
	this.maxvals = maxvals;
};
CSL.setMinVal = function(minval){
	this.minval = minval;
};
CSL.setCheckeratorBase = function(base){
	this.base = base;
	if (! this.mode1_counts){
		this.mode1_counts = new Array();
		for each (i in this.base["givens"]){
			this.mode1_counts.push(0);
		}
	}
};
CSL.setCheckeratorMode = function(mode){
	this.mode = mode;
};
CSL.checkCheckeratorForClash = function(str,otherstr){
	if (str == otherstr){
		if (this.mode == "names" || this.mode == "disambiguate_true"){
			this.clashes += 1;
			if (debug){
				CSL.debug("   (mode 0 clash, returning true)");
			}
			return true;
		}
		if (this.mode == "givens"){
			this.clashes += 1;
			if (debug){
				CSL.debug("   (mode 1 clash, returning false)");
			}
		}
		return false;
	}
};
CSL.evaluateCheckeratorClashes = function(){
	if (!this.maxvals.length){
		return false;
	}
	if (this.mode == "names" || this.mode == "disambiguate_true"){
		if (this.clashes){
			this.lastclashes = this.clashes;
			this.clashes = 0;
			return false;
		} else {
			// cleared, so increment.  also quash the id as done.
			this.ids[this.pos] = false;
			this.pos += 1;
			this.lastclashes = this.clashes;
			return true;
		}
	}
	if (this.mode == "givens"){
		var ret = true;
		if (debug){
			CSL.debug("  ---> Comparing in mode 1: clashes="+this.clashes+"; lastclashes="+this.lastclashes);
		}
		var namepos = this.mode1_counts[this.modepos];
		if (this.clashes && this.clashes == this.lastclashes){
			if (debug){
				CSL.debug("   ---> Applying mode 1 defaults: "+this.mode1_defaults);
			}
			if (this.mode1_defaults && namepos > 0){
				var old = this.mode1_defaults[(namepos-1)];
				if (debug){
					CSL.debug("   ---> Resetting to default: ("+old+")");
				}
				this.base["givens"][this.modepos][(namepos-1)] = old;
			}
			ret = false;
		} else if (this.clashes) {
			if (debug){
				CSL.debug("   ---> Expanding given name helped a little, retaining it");
			}
			ret = false;
		} else { // only non-clash should be possible
			if (debug){
				CSL.debug("   ---> No clashes, storing token config and going to next");
			}
			this.mode1_counts = false;
			this.pos += 1;
			ret = true;
		}
		this.lastclashes = this.clashes;
		this.clashes = 0;
		if (ret){
			this.ids[this.pos] = false;
		}
		return ret;
	}
};
CSL.maxCheckeratorAmbigLevel = function (){
	if (!this.maxvals.length){
		return true;
	}
	if (this.mode == "disambiguate_true"){
		if (this.modes.indexOf("disambiguate_true") < (this.modes.length-1)){
			this.mode = this.modes[(this.modes.indexOf("disambiguate_true")+1)];
			this.modepos = 0;
		} else {
			this.pos += 1;
			return true;
		}
	}
	if (this.mode == "names"){
		if (this.modepos == (this.base["names"].length-1) && this.base["names"][this.modepos] == this.maxvals[this.modepos]){
			if (this.modes.length == 2){
				this.mode = "givens";
				this.mode1_counts[this.modepos] = 0;
			} else {
				this.pos += 1;
				return true;
			}
		}
	} else if (this.mode == "givens"){
		if (this.modepos == (this.mode1_counts.length-1) && this.mode1_counts[this.modepos] == (this.maxvals[this.modepos])){
			if (debug){
				CSL.debug("-----  Item maxed out -----");
			}
			if (this.modes.length == 2){
				this.mode = "givens";
				this.pos += 1;
			} else {
				this.pos += 1;
			}
			//this.ids[this.pos] = false;
			return true;
		}
	}
	return false;
};
CSL.incrementCheckeratorAmbigLevel = function (){
	if (this.mode == "names"){
		var val = this.base["names"][this.modepos];
		if (val < this.maxvals[this.modepos]){
			this.base["names"][this.modepos] += 1;
		} else if (this.modepos < (this.base["names"].length-1)){
			this.modepos +=1;
			this.base["names"][this.modepos] = 0;
		}
	}
	if (this.mode == "givens"){
		var val = (this.mode1_counts[this.modepos]);
		if (val < this.maxvals[this.modepos]){
			if (this.given_name_second_pass){
				if (debug){
					CSL.debug(" ** second pass");
				};
				this.given_name_second_pass = false;
				this.mode1_counts[this.modepos] += 1;
				this.base["givens"][this.modepos][val] += 1;
				if (debug){
					CSL.debug("   ---> (A) Setting expanded givenname param with base: "+this.base["givens"]);
				};
			} else {
				this.mode1_defaults = this.base["givens"][this.modepos].slice();
				if (debug){
					CSL.debug(" ** first pass");
				};
				this.given_name_second_pass = true;
			};
		} else if (this.modepos < (this.base["givens"].length-1)){
			this.modepos +=1;
			this.base["givens"][this.modepos][0] += 1;
			this.mode1_defaults = this.base["givens"][this.modepos].slice();
			if (debug){
				CSL.debug("   ---> (B) Set expanded givenname param with base: "+this.base["givens"]);
			}
		} else {
			this.mode = "names";
			this.pos += 1;
		}
	}
};
CSL.decrementCheckeratorNames = function(state,base){
	var base_return = CSL.cloneAmbigConfig(base);
	var do_me = false;
	for (var i=(base_return["givens"].length-1); i > -1; i--){
		for (var j=(base_return["givens"][i].length-1); j > -1; j--){
			if (base_return["givens"][i][j] == 2){
				do_me = true;
			}
		}
	}
	if (do_me){
		for (var i=(base_return["givens"].length-1); i > -1; i--){
			for (var j=(base_return["givens"][i].length-1); j > -1; j--){
				if (base_return["givens"][i][j] == 2){
					i = -1;
					break;
				}
				base_return["names"][i] += -1;
			}
		}
	}
	return base_return;
};
CSL.getAmbigConfig = function(){
	var config = this.tmp.disambig_request;
	if (!config){
		config = this.tmp.disambig_settings;
	}
	var ret = CSL.cloneAmbigConfig(config);
	return ret;
};
CSL.getMaxVals = function(){
	return this.tmp.names_max.mystack.slice();
};
CSL.getMinVal = function(){
	return this.tmp["et-al-min"];
};
CSL.getModes = function(){
	var ret = new Array();
	if (this[this.tmp.area].opt["disambiguate-add-names"]){
		ret.push("names");
	}
	var dagopt = this[this.tmp.area].opt["disambiguate-add-givenname"];
	var gdropt = this[this.tmp.area].opt["givenname-disambiguation-rule"];
	if (dagopt){
		if (!gdropt || ("string" == typeof gdropt && "primary-name" != gdropt.slice(0,12))){
			ret.push("givens");
		};
	}
	return ret;
};
