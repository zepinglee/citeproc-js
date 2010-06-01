/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights
 * Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */

/*
 * Fields can be transformed by translation/transliteration, or by
 * abbreviation.  Two levels of translation/transliteration
 * are available: primary-only (a one-to-one transform) or
 * primary+secondary (a transform resulting in two fields of
 * output, with implicit punctuation formatting).
 *
 * The primary+secondary transliteration/translation level is
 * available only with full-form fields.  Primary-only
 * transliteration/translation is available with both full-form
 * and short-form fields.  In this case, the abbreviation is
 * applied after the language transform.
 *
 * The transformation object here applies the most aggressive
 * transformation available under a given set of parameters.
 * It works only with simple string fields; multilingual
 * dates are handled by a separate mechanism, and numeric
 * fields are not subject to transformation.
 *
 * The transformed output is written directly to the output
 * queue.  This is necessary to cover the possibility of
 * two output fields with separate formatting requirements.
 *
 * This object itself returns an appropriate token function
 * with a standard interface, for use at runtime.
 *
 * Instantiation arguments:
 *   state object
 *
 * Initialization arguments
 *
 *   Required arguments
 *     default formatting token
 *     field name
 *
 *   Optional argument (used only if abbreviation is required)
 *     subsection
 *
 * Abbreviation
 *
 *   Optional setters:
 *     .setAbbreviationFallback(); fallback flag
 *       (if true, a failed abbreviation will fallback to long)
 *     .setAlternativeVariableName(): alternative variable name in Item,
 *       for use as a fallback abbreviation source
 *
 * Translation/transliteration
 *
 *   Required setter:
 *     .setTransformLocale(): mode (one of "default-locale", "locale-pri",
 *       "locale-sec" or "locale-sort")
 *
 *   Optional setter:
 *     .setTransformFallback():
 *       default flag (if true, the original field value will be used as a fallback)
 *
 *
 * The getTextSubField() method may be used to obtain a string transform
 * of a field, without abbreviation, as needed for setting sort keys
 * (for example).
 *
 */

CSL.Transform = function (state) {
	var debug = false, abbreviations, token, fieldname, subsection, opt;

	// Abbreviation subsections
	this["container-title"] = {};
	this["collection-title"] = {};
	this.institution = {};
	this.authority = {};
	this.title = {};
	this.publisher = {};
	this["publisher-place"] = {};
	this.hereinafter = {};

	abbreviations = "default";

	// Initialization method
	function init(t, f, x) {
		token = t;
		fieldname = f;
		subsection = x;
		opt = {
			abbreviation_fallback: false,
			alternative_varname: false,
			transform_locale: false,
			transform_fallback: false
		};
	}
	this.init = init;

	// Internal function
	function abbreviate(state, Item, altvar, basevalue, mysubsection, use_field) {
		var value;
		if (!mysubsection) {
			return basevalue;
		}
		value = "";
		if (state.transform[mysubsection]) {
			if (state.transform[mysubsection][basevalue]) {
				value = state.transform[mysubsection][basevalue];
			} else if ("string" != typeof state.transform[mysubsection][basevalue]) {
				//SNIP-START
				if (this.debug) {
					CSL.debug("UNKNOWN ABBREVIATION FOR ... " + basevalue);
				}
				//SNIP-END
				state.transform[mysubsection][basevalue] = "";
			}
		}
		if (!value && Item[altvar] && use_field) {
			value = Item[altvar];
		}
		if (!value) {
			value = basevalue;
		}
		return value;
	}

	// Internal function
	function getTextSubField(value, locale_type, use_default) {
		var m, lst, opt, o, pos, key, ret, len, myret;
		if (!value) {
			return "";
		}
		ret = "";
		// Workaround for Internet Explorer
		m = value.match(/\s*:([\-a-zA-Z0-9]+):\s*/g);
		if (m) {
			for (pos = 0, len = m.length; pos < len; pos += 1) {
				m[pos] = m[pos].replace(/^\s*:/, "").replace(/:\s*$/, "");
			}
		}
		lst = value.split(/\s*:(?:[\-a-zA-Z0-9]+):\s*/);
		myret = [lst[0]];
		for (pos = 1, len = lst.length; pos < len; pos += 1) {
			myret.push(m[pos - 1]);
			myret.push(lst[pos]);
		}
		lst = myret.slice();
		opt = state.opt[locale_type];
		if ("undefined" === typeof opt) {
			opt = state.opt["default-locale"];
		}
		for (key in opt) {
			if (opt.hasOwnProperty(key)) {
				o = opt[key];
				if (o && lst.indexOf(o) > -1 && lst.indexOf(o) % 2) {
					ret = lst[(lst.indexOf(o) + 1)];
					break;
				}
			}
		}
		if (!ret && use_default) {
			ret = lst[0];
		}
		return ret;
	}

	//
	function setAbbreviationFallback(b) {
		opt.abbreviation_fallback = b;
	}
	this.setAbbreviationFallback = setAbbreviationFallback;

	//
	function setAlternativeVariableName(s) {
		opt.alternative_varname = s;
	}
	this.setAlternativeVariableName = setAlternativeVariableName;

	//
	function setTransformLocale(s) {
		opt.transform_locale = s;
	}
	this.setTransformLocale = setTransformLocale;

	//
	function setTransformFallback(b) {
		opt.transform_fallback = b;
	}
	this.setTransformFallback = setTransformFallback;

	// Setter for abbreviation lists
	function setAbbreviations(name) {
		var vartype, pos, len;
		if (name) {
			abbreviations = name;
		}
		len = CSL.MULTI_FIELDS.length;
		for (pos = 0; pos < len; pos += 1) {
			vartype = CSL.MULTI_FIELDS[pos];
			this[vartype] = state.sys.getAbbreviations(abbreviations, vartype);
		}
	}
	this.setAbbreviations = setAbbreviations;

	// Return function appropriate to selected options
	function getOutputFunction() {
		var mytoken, mysubsection, myfieldname, abbreviation_fallback, alternative_varname, transform_locale, transform_fallback, getTextSubfield;

		// Freeze mandatory values
		mytoken = CSL.Util.cloneToken(token); // the token isn't needed, is it?
		mysubsection = subsection;
		myfieldname = fieldname;

		// Freeze option values
		abbreviation_fallback = opt.abbreviation_fallback;
		alternative_varname = opt.alternative_varname;
		transform_locale = opt.transform_locale;
		transform_fallback = opt.transform_fallback;

		if (mysubsection) {
			// Short form
			return function (state, Item) {
				var value, primary;
				value = Item[myfieldname];

				primary = getTextSubField(value, transform_locale, transform_fallback);
				primary = abbreviate(state, Item, alternative_varname, primary, mysubsection, true);
				state.output.append(primary, this);
			};
		} else if (transform_locale === "locale-sec") {
			// Long form, with secondary translation
			return function (state, Item) {
				var primary, secondary, primary_tok, secondary_tok, key, value;
				value = Item[myfieldname];
				if (value) {
					if ("number" === typeof value) {
						value = "" + value;
					}
					primary = getTextSubField(value, "locale-pri", transform_fallback);
					secondary = getTextSubField(value, "locale-sec");
					if (secondary) {
						primary_tok = CSL.Util.cloneToken(this);
						primary_tok.strings.suffix = "";
						secondary_tok = new CSL.Token("text", CSL.SINGLETON);
						secondary_tok.strings.suffix = "]" + this.strings.suffix;
						secondary_tok.strings.prefix = " [";

						state.output.append(primary, primary_tok);
						state.output.append(secondary, secondary_tok);
					} else {
						state.output.append(primary, this);
					}
				}
				return null;
			};
		} else {
			return function (state, Item) {
				var value, primary;
				value = Item[myfieldname];
				if (value) {
					if ("number" === typeof value) {
						value = "" + value;
					}
					primary = getTextSubField(value, transform_locale, transform_fallback);
					state.output.append(primary, this);
				}
				return null;
			};
		}
	}
	this.getOutputFunction = getOutputFunction;

	function output(state, basevalue, token_short, token_long, use_fallback) {
		//
		// This output method is specific to institutions.
		// See util_institutions.js
		//
		var shortvalue;
		//
		// This was pointless: institutions are names, and language
		// selection is done by getNameSubFields().
		//basevalue = this.getTextSubField(value, "locale-pri", true);

		shortvalue = state.transform.institution[basevalue];
		if (shortvalue) {
			state.output.append(shortvalue, token_short);
		} else {
			if (use_fallback) {
				state.output.append(basevalue, token_long);
			}
			//SNIP-START
			if (this.debug) {
				CSL.debug("UNKNOWN ABBREVIATION FOR: " + basevalue);
			}
			//SNIP-END
		}
	}
	this.output = output;
};



