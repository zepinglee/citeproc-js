/*
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights
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
 * Sections 1.13, 14 and 15 have been added to cover use of software over a
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
 * under the ./tests subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights Reserved.
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

/*global CSL: true */

CSL.Attributes = {};

CSL.Attributes["@disambiguate"] = function (state, arg) {
    if (arg === "true") {
        state.opt.has_disambiguate = true;
        var func = function (Item, item) {
            var ret;
            state.tmp.disambiguate_maxMax += 1;
            if (state.tmp.disambig_settings.disambiguate
               && state.tmp.disambiguate_count < state.tmp.disambig_settings.disambiguate) {
                state.tmp.disambiguate_count += 1;
                return true;
            }
            return false;
        };
        this.tests.push(func);
    }
};

CSL.Attributes["@is-numeric"] = function (state, arg) {
    var variables = arg.split(/\s+/);
    // Strip off any boolean prefix.
    var reverses = CSL.Util.setReverseConditions.call(this, variables);
    var maketest = function(variable, reverse) {
        return function (Item, item) {
            var myitem = Item;
            var mytests = [];
            if (["locator","locator-revision"].indexOf(variable) > -1) {
                myitem = item;
            }
            if (CSL.NUMERIC_VARIABLES.indexOf(variable) > -1) {
                if (!state.tmp.shadow_numbers[variable]) {
                    state.processNumber(false, myitem, variable, Item.type);
                }
                if (myitem[variable] && state.tmp.shadow_numbers[variable].numeric) {
                    return reverse ? false : true;
                }
            } else if (["title", "locator-revision","version"].indexOf(variable) > -1) {
                if (myitem[variable]) {
                    if (myitem[variable].slice(-1) === "" + parseInt(myitem[variable].slice(-1), 10)) {
                        return reverse ? false : true;
                    }
                }
            }
            return reverse ? true : false;
        }
    }
    var mytests = [];
    for (var i=0; i<variables.length; i+=1) {
        mytests.push(maketest(variables[i], reverses[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};
CSL.Attributes["@is-numeric-any"] = function (state, arg) {
    CSL.Attributes["@is-numeric"].call(this, state, arg, "any");
};
CSL.Attributes["@is-numeric-all"] = function (state, arg) {
    CSL.Attributes["@is-numeric"].call(this, state, arg, "all");
};


CSL.Attributes["@is-uncertain-date"] = function (state, arg) {
    var variables = arg.split(/\s+/);
    // Strip off any boolean prefix.
    var reverses = CSL.Util.setReverseConditions.call(this, variables);
    var maketest = function (myvariable, reverse) {
        return function(Item, item) {
            if (Item[myvariable] && Item[myvariable].circa) {
                return reverse ? false : true;
            } else {
                return reverse ? true : false;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=variables.length;i<ilen;i+=1) {
        mytests.push(maketest(variables[i], reverses[i]));
    };
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};
CSL.Attributes["@is-uncertain-date-any"] = function (state, arg) {
    CSL.Attributes["@is-uncertain-date"].call(this, state, arg, "any");
};
CSL.Attributes["@is-uncertain-date-all"] = function (state, arg) {
    CSL.Attributes["@is-uncertain-date"].call(this, state, arg, "all");
};


CSL.Attributes["@locator"] = function (state, arg) {
    var trylabels = arg.replace("sub verbo", "sub-verbo");
    trylabels = trylabels.split(/\s+/);
    // Strip off any boolean prefix.
    var reverses = CSL.Util.setReverseConditions.call(this, trylabels);
    var maketest = function (trylabel, reverse) {
        return function(Item, item) {
            var label;
            if ("undefined" === typeof item || !item.label) {
                label = "page";
            } else if (item.label === "sub verbo") {
                label = "sub-verbo";
            } else {
                label = item.label;
            }
            if (trylabel === label) {
                return reverse ? false : true;
            } else {
                return reverse ? true : false;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=trylabels.length;i<ilen;i+=1) {
        mytests.push(maketest(trylabels[i], reverses[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};
CSL.Attributes["@locator-any"] = function (state, arg) {
    CSL.Attributes["@locator"].call(this, state, arg, "any");
};
CSL.Attributes["@locator-all"] = function (state, arg) {
    CSL.Attributes["@locator"].call(this, state, arg, "all");
};


CSL.Attributes["@position"] = function (state, arg) {
    var tryposition;
    state.opt.update_mode = CSL.POSITION;
    state.parallel.use_parallels = true;
    var trypositions = arg.split(/\s+/);
    var maketest = function(tryposition) {
        return function (Item, item) {
            if (state.tmp.area === "bibliography") {
                return false;
            }
            if (item && "undefined" === typeof item.position) {
                item.position = 0;
            }
            if (item && typeof item.position === "number") {
                if (item.position === 0 && tryposition === 0) {
                    return true;
                } else if (tryposition > 0 && item.position >= tryposition) {
                    return true;
                }
            } else if (tryposition === 0) {
                return true;
            }
            return false;
        }
    }
    var mytests = [];
    for (var i=0,ilen=trypositions.length;i<ilen;i+=1) {
        var tryposition = trypositions[i];
        if (tryposition === "first") {
            tryposition = CSL.POSITION_FIRST;
        } else if (tryposition === "subsequent") {
            tryposition = CSL.POSITION_SUBSEQUENT;
        } else if (tryposition === "ibid") {
            tryposition = CSL.POSITION_IBID;
        } else if (tryposition === "ibid-with-locator") {
            tryposition = CSL.POSITION_IBID_WITH_LOCATOR;
        }
        if ("near-note" === tryposition) {
            mytests.push(function (Item, item) {
                if (item && item.position === CSL.POSITION_SUBSEQUENT && item["near-note"]) {
                    return true;
                }
                return false;
            });
        } else {
            mytests.push(maketest(tryposition));
        }
    }
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};

CSL.Attributes["@type"] = function (state, arg) {
    var types = arg.split(/\s+/);
    // Strip off any boolean prefix.
    var reverses = CSL.Util.setReverseConditions.call(this, types);
    var maketest = function (mytype, reverse) {
        return function(Item,item) {
            var ret = (Item.type === mytype);
            if (ret) {
                return reverse ? false : true;
            } else {
                return reverse ? true : false;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=types.length;i<ilen;i+=1) {
        mytests.push(maketest(types[i], reverses[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};
CSL.Attributes["@type-any"] = function (state, arg) {
    CSL.Attributes["@type"].call(this, state, arg, "any");
};
CSL.Attributes["@type-all"] = function (state, arg) {
    CSL.Attributes["@type"].call(this, state, arg, "all");
};

CSL.Attributes["@variable"] = function (state, arg) {
    this.variables = arg.split(/\s+/);
    this.variables_real = this.variables.slice();

    // First the non-conditional code.
    if ("label" === this.name && this.variables[0]) {
        this.strings.term = this.variables[0];
    } else if (["names", "date", "text", "number"].indexOf(this.name) > -1) {
        //
        // An oddity of variable handling is that this.variables
        // is actually ephemeral; the full list of variables is
        // held in the variables_real var, and pushed into this.variables
        // conditionally in order to suppress repeat renderings of
        // the same item variable.  [STILL FUNCTIONAL? 2010.01.15]
        //
        // set variable names
        func = function (state, Item, item) {
            variables = this.variables_real.slice();
            // Clear this.variables in place
            for (var i = this.variables.length - 1; i > -1; i += -1) {
                this.variables.pop();
            }

            len = variables.length;
            for (pos = 0; pos < len; pos += 1) {
                // set variable name if not quashed, and if not the title of a legal case w/suppress-author
                if (state.tmp.done_vars.indexOf(variables[pos]) === -1 && !(item && Item.type === "legal_case" && item["suppress-author"] && variables[pos] === "title")) {
                    this.variables.push(variables[pos]);
                }
                if (state.tmp.can_block_substitute) {
                    state.tmp.done_vars.push(variables[pos]);
                }
            }
        };
        this.execs.push(func);

        // check for output
        func = function (state, Item, item) {
            var mydate;
            output = false;
            len = this.variables.length;
            for (pos = 0; pos < len; pos += 1) {
                variable = this.variables[pos];
                if (variable === "authority"
                    && "string" === typeof Item[variable]
                    && "names" === this.name) {
                    
                    Item[variable] = [{family:Item[variable],isInstitution:true}];
                }
                if (this.strings.form === "short" && !Item[variable]) {
                    if (variable === "title") {
                        variable = "shortTitle";
                    } else if (variable === "container-title") {
                        variable = "journalAbbreviation";
                    }
                }
                if (variable === "year-suffix") {
                    // year-suffix always signals that it produces output,
                    // even when it doesn't. This permits it to be used with
                    // the "no date" term inside a group used exclusively
                    // to control formatting.
                    output = true;
                    break;
                } else if (CSL.DATE_VARIABLES.indexOf(variable) > -1) {
                    if (state.opt.development_extensions.locator_date_and_revision && "locator-date" === variable) {
                        // If locator-date is set, it's valid.
                        output = true;
                        break;
                    }
                    if (Item[variable]) {
                        for (var key in Item[variable]) {
                            if (this.dateparts.indexOf(key) === -1 && "literal" !== key) {
                                continue;
                            }
                            if (Item[variable][key]) {
                                output = true;
                                break;
                            }
                        }
                        if (output) {
                            break;
                        }
                    }
                } else if ("locator" === variable) {
                    if (item && item.locator) {
                        output = true;
                    }
                    break;
                } else if ("locator-revision" === variable) {
                    if (item && item["locator-revision"]) {
                        output = true;
                    }
                    break;
                } else if (["citation-number","citation-label"].indexOf(variable) > -1) {
                    output = true;
                    break;
                } else if ("first-reference-note-number" === variable) {
                    if (item && item["first-reference-note-number"]) {
                        output = true;
                    }
                    break;
                } else if ("hereinafter" === variable) {
                    if (state.transform.abbrevs["default"].hereinafter[Item.id]
                        && state.sys.getAbbreviation
                        && Item.id) {
						
                        output = true;
                    }
                    break;
                } else if ("object" === typeof Item[variable]) {
                    if (Item[variable].length) {
                        //output = true;
                    }
                    break;
                } else if ("string" === typeof Item[variable] && Item[variable]) {
                    output = true;
                    break;
                } else if ("number" === typeof Item[variable]) {
                    output = true;
                    break;
                }
                if (output) {
                    break;
                }
            }
            //print("-- VAR: "+variable);
            flag = state.tmp.group_context.value();
            if (output) {
                if (variable !== "citation-number" || state.tmp.area !== "bibliography") {
                    state.tmp.cite_renders_content = true;
                }
                //print("  setting [2] to true based on: " + arg);
                flag[2] = true;
                state.tmp.group_context.replace(flag);

                // For util_substitute.js, subsequent-author-substitute
                if (state.tmp.can_substitute.value() 
                    && state.tmp.area === "bibliography"
                    && "string" === typeof Item[variable]) {

                    state.tmp.rendered_name.push(Item[variable]);
                }

                state.tmp.can_substitute.replace(false,  CSL.LITERAL);

            } else {
                //print("  setting [1] to true based on: " + arg);
                flag[1] = true;
            }
        };
        this.execs.push(func);
    } else if (["if",  "else-if"].indexOf(this.name) > -1) {
        // Strip off any boolean prefix.
        var reverses = CSL.Util.setReverseConditions.call(this, this.variables);
        // Now the conditionals.
        var maketest = function (variable, reverse) {
            return function(Item,item){
                var myitem = Item;
                if (item && ["locator", "locator-revision", "first-reference-note-number", "locator-date"].indexOf(variable) > -1) {
                    myitem = item;
                }
                // We don't run loadAbbreviation() here; it is run by the application-supplied
                // retrieveItem() if hereinafter functionality is to be used, so this key will
                // always exist in memory, possibly with a nil value.
                if (variable === "hereinafter" && state.sys.getAbbreviation && myitem.id) {
                    if (state.transform.abbrevs["default"].hereinafter[myitem.id]) {
                        return reverse ? false : true;
                    }
                } else if (myitem[variable]) {
                    if ("number" === typeof myitem[variable] || "string" === typeof myitem[variable]) {
                        return reverse ? false : true;
                    } else if ("object" === typeof myitem[variable]) {
                        //
                        // this will turn true only for hash objects
                        // that have at least one attribute, or for a
                        // non-zero-length list
                        //
                        for (key in myitem[variable]) {
                            if (myitem[variable][key]) {
                                return reverse ? false : true;
                            }
                        }
                    }
                }
                return reverse ? true : false;
            }
        }
        var mytests = [];
        for (var i=0,ilen=this.variables.length;i<ilen;i+=1) {
            mytests.push(maketest(this.variables[i], reverses[i]));
        }
        var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
        this.tests.push(func);
    }
};
CSL.Attributes["@variable-any"] = function (state, arg) {
    CSL.Attributes["@variable"].call(this, state, arg, "any");
};
CSL.Attributes["@variable-all"] = function (state, arg) {
    CSL.Attributes["@variable"].call(this, state, arg, "all");
};


CSL.Attributes["@page"] = function (state, arg) {
    var trylabels = arg.replace("sub verbo", "sub-verbo");
    trylabels = trylabels.split(/\s+/);
    // Strip off any boolean prefix.
    var reverses = CSL.Util.setReverseConditions.call(this, trylabels);
    var maketest = function (trylabel, reverse) {
        return function(Item, item) {
            var label;
            state.processNumber(false, Item, "page", Item.type);
            if (!state.tmp.shadow_numbers.page.label) {
                label = "page";
            } else if (state.tmp.shadow_numbers.page.label === "sub verbo") {
                label = "sub-verbo";
            } else {
                label = state.tmp.shadow_numbers.page.label;
            }
            if (trylabel === label) {
                return reverse ? false : true;
            } else {
                return reverse ? true : false;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=trylabels.length;i<ilen;i+=1) {
        mytests.push(maketest(trylabels[i], reverses[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};
CSL.Attributes["@page-any"] = function (state, arg) {
    CSL.Attributes["@page"].call(this, state, arg, "any");
};
CSL.Attributes["@page-all"] = function (state, arg) {
    CSL.Attributes["@page"].call(this, state, arg, "all");
};


CSL.Attributes["@jurisdiction"] = function (state, arg) {
    var tryjurisdictions = arg.split(/\s+/);
    // Strip off any boolean prefix.
    var reverses = CSL.Util.setReverseConditions.call(this, tryjurisdictions);
    for (var i=0,ilen=tryjurisdictions.length;i<ilen;i+=1) {
        tryjurisdictions[i] = tryjurisdictions[i].split(";");
    }
    var maketests = function (tryjurisdiction, reverse) {
        return function(Item,item){
            if (!Item.jurisdiction) {
                return reverse ? true : false;
            }
            var jurisdictions = Item.jurisdiction.split(";");
            for (var i=0,ilen=jurisdictions.length;i<ilen;i+=1) {
                jurisdictions[i] = jurisdictions[i].split(";");
            }
            for (i=tryjurisdiction.length;i>0;i+=-1) {
                var tryjurisdictionStr = tryjurisdiction.slice(0,i).join(";");
                var jurisdiction = jurisdictions.slice(0,i).join(";");
                if (tryjurisdictionStr === jurisdiction) {
                    return reverse ? false : true;
                }
            }
            return reverse ? true : false;
        }
    }
    var mytests = [];
    for (var i=0,ilen=tryjurisdictions.length;i<ilen;i+=1) {
        var tryjurisdictionSlice = tryjurisdictions[i].slice();
        mytests.push(maketests(tryjurisdictionSlice, reverses[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests, CSL.CONDITION_LEVEL_BOTTOM);
    this.tests.push(func);
};
CSL.Attributes["@jurisdiction-any"] = function (state, arg) {
    CSL.Attributes["@jurisdiction"].call(this, state, arg, "any");
};
CSL.Attributes["@jurisdiction-all"] = function (state, arg) {
    CSL.Attributes["@jurisdiction"].call(this, state, arg, "all");
};


CSL.Attributes["@context"] = function (state, arg) {
    var func = function (Item, item) {
		var area = state.tmp.area.slice(0, arg.length);
		if (area === arg) {
			return true;
		}
		return false;
    };
    this.tests.push(func);
};

CSL.Attributes["@has-year-only"] = function (state, arg) {
    var trydates = arg.split(/\s+/);
    var maketest = function (trydate) {
        return function(Item,item){
            var date = Item[trydate];
            if (!date || date.month || date.season) {
                return false;
            } else {
                return true;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=trydates.length;i<ilen;i+=1) {
        mytests.push(maketest(trydates[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests);
    this.tests.push(func);
};

CSL.Attributes["@has-month-or-season-only"] = function (state, arg) {
    var trydates = arg.split(/\s+/);
    var maketest = function (trydate) {
        return function(Item,item){
            var date = Item[trydate];
            if (!date || (!date.month && !date.season) || date.day) {
                return false;
            } else {
                return true;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=trydates.length;i<ilen;i+=1) {
        mytests.push(maketest(trydates[i]));
    }
    var func = state.fun.match[this.match](this, state, mytests);
    this.tests.push(func);
};

CSL.Attributes["@has-day-only"] = function (state, arg) {
    var trydates = arg.split(/\s+/);
    var maketest = function (trydate) {
        return function(Item,item){
            var date = Item[trydate];
            if (!date || !date.day) {
                return false;
            } else {
                return true;
            }
        }
    }
    var mytests = [];
    for (var i=0,ilen=trydates.length;i<ilen;i+=1) {
        mytests.push(maketest(trydates[i]));
    };
    var func = state.fun.match[this.match](this, state, mytests);
    this.tests.push(func);
};

CSL.Attributes["@subjurisdictions"] = function (state, arg) {
    var trysubjurisdictions = parseInt(arg, 10);
    var func = function (Item, item) {
        var subjurisdictions = 0;
        if (Item.jurisdiction) {
            subjurisdictions = Item.jurisdiction.split(";").length;
        }
        if (subjurisdictions) {
            subjurisdictions += -1;
        }
        if (subjurisdictions >= trysubjurisdictions) {
            return true;
        }
        return false;
    };
    this.tests.push(func);
};

CSL.Attributes["@is-plural"] = function (state, arg) {
    var func = function (Item, item) {
        var nameList = Item[arg];
        if (nameList && nameList.length) {
            var persons = 0;
            var institutions = 0;
            var last_is_person = false;
            for (var i = 0, ilen = nameList.length; i < ilen; i += 1) {
                if (nameList[i].isInstitution && (nameList[i].literal || (nameList[i].family && !nameList[i].given))) {
                    institutions += 1;
                    last_is_person = false;
                } else {
                    persons += 1;
                    last_is_person = true;
                }
            }
            if (persons > 1) {
                return true;
            } else if (institutions > 1) {
                return true;
            } else if (institutions && last_is_person) {
                return true;
            }
        }
        return false;
    };
    this.tests.push(func);
};

CSL.Attributes["@locale"] = function (state, arg) {
    var func, ret, len, pos, variable, myitem, langspec, lang, lst, i, ilen, fallback;

    if (this.name === "layout") {
        // For layout
        this.locale_raw = arg;
    } else {
        // For if and if-else

        // Split argument
        lst = arg.split(/\s+/);

        // Expand each list element
        this.locale_bares = [];
        for (i = 0, ilen = lst.length; i < ilen; i += 1) {
            // Parse out language string
            lang = lst[i];
        
            // Analyze the locale
            langspec = CSL.localeResolve(lang);
            if (lst[i].length === 2) {
                // For fallback
                this.locale_bares.push(langspec.bare);
            }
            // Load the locale terms etc.
            state.localeConfigure(langspec);
            
            // Replace string with locale spec object
            lst[i] = langspec;
        }
        // Set locale tag on node
        this.locale_default = state.opt["default-locale"][0];
        // The locale to set on node children if match is successful
        this.locale = lst[0].best;
        // Locales to test
        this.locale_list = lst.slice();
        
        // check for variable value
        // Closure probably not necessary here.
        var maketest = function (me) {
            return function (Item, item) {
                var key, res;
                ret = [];
                res = false;
                var langspec = false;
                if (Item.language) {
                    lang = Item.language;
                    langspec = CSL.localeResolve(lang);
                    if (langspec.best === state.opt["default-locale"][0]) {
                        langspec = false;
                    }
                }
                if (langspec) {
                    // We attempt to match a specific locale from the
                    // list of parameters.  If that fails, we fall back
                    // to the base locale of the first element.  The
                    // locale applied is always the first local 
                    // in the list of parameters (or base locale, for a 
                    // single two-character language code) 
                    for (i = 0, ilen = me.locale_list.length; i < ilen; i += 1) {
                        if (langspec.best === me.locale_list[i].best) {
                            state.opt.lang = me.locale;
                            state.tmp.last_cite_locale = me.locale;
                            // Set empty group open tag with locale set marker
                            state.output.openLevel("empty");
                            state.output.current.value().new_locale = me.locale;
                            res = true;
                            break;
                        }
                    }
                    if (!res && me.locale_bares.indexOf(langspec.bare) > -1) {
                        state.opt.lang = me.locale;
                        state.tmp.last_cite_locale = me.locale;
                        // Set empty group open tag with locale set marker
                        state.output.openLevel("empty");
                        state.output.current.value().new_locale = me.locale;
                        res = true;
                    }
                }
                return res;
            }
        }
        var me = this;
        this.tests.push(maketest(me));
    }
};

// This one is not evaluated as a condition: it only
// sets some parameters that are picked up during
// processing.
CSL.Attributes["@is-parallel"] = function (state, arg) {
    var values = arg.split(" ");
    for (var i = 0, ilen = values.length; i < ilen; i += 1) {
        if (values[i] === "true") {
            values[i] = true;
        } else if (values[i] === "false") {
            values[i] = false;
        }
    }
    this.strings.set_parallel_condition = values;
};



CSL.Attributes["@gender"] = function (state, arg) {
    this.gender = arg;
}

CSL.Attributes["@cslid"] = function (state, arg) {
    // @cslid is a noop
    // The value set on this attribute is used to
    // generate reverse lookup wrappers on output when 
    // this.development_extensions.csl_reverse_lookup_support is
    // set to true in state.js (there is no runtime option,
    // it must be set in state.js)
    //
    // See the @showid method in the html output
    // section of formats.js for the function that
    // renders the wrappers.
    this.cslid = parseInt(arg, 10);
};

CSL.Attributes["@label-form"] = function (state, arg) {
    this.strings.label_form_override = arg;
};

CSL.Attributes["@part-separator"] = function (state, arg) {
    this.strings["part-separator"] = arg;
};

CSL.Attributes["@leading-noise-words"] = function (state, arg) {
    this["leading-noise-words"] = arg;
};

CSL.Attributes["@class"] = function (state, arg) {
    state.opt["class"] = arg;
};

CSL.Attributes["@version"] = function (state, arg) {
    state.opt.version = arg;
};

/**
 * Store the value attribute on the token.
 * @name CSL.Attributes.@value
 * @function
 */
CSL.Attributes["@value"] = function (state, arg) {
    this.strings.value = arg;
};


/**
 * Store the name attribute (of a macro or term node)
 * on the state object.
 * <p>For reference when the closing node of a macro
 * or locale definition is encountered.</p>
 * @name CSL.Attributes.@name
 * @function
 */
CSL.Attributes["@name"] = function (state, arg) {
    this.strings.name = arg;
};


/**
 * Store the form attribute (of a term node) on the state object.
 * <p>For reference when the closing node of a macro
 * or locale definition is encountered.</p>
 * @name CSL.Attributes.@form
 * @function
 */
CSL.Attributes["@form"] = function (state, arg) {
    this.strings.form = arg;
};

CSL.Attributes["@date-parts"] = function (state, arg) {
    this.strings["date-parts"] = arg;
};

CSL.Attributes["@range-delimiter"] = function (state, arg) {
    this.strings["range-delimiter"] = arg;
};

/**
 * Store macro tokens in a buffer on the state object.
 * <p>For reference when the enclosing text token is
 * processed.</p>
 * @name CSL.Attributes.@macro
 * @function
 */
CSL.Attributes["@macro"] = function (state, arg) {
    this.postponed_macro = arg;
};


CSL.Attributes["@term"] = function (state, arg) {
    if (arg === "sub verbo") {
        this.strings.term = "sub-verbo";
    } else {
        this.strings.term = arg;
    }
};


/*
 * Ignore xmlns attribute.
 * <p>This should always be <p>http://purl.org/net/xbiblio/csl</code>
 * anyway.  At least for the present we will blindly assume
 * that it is.</p>
 * @name CSL.Attributes.@xmlns
 * @function
 */
CSL.Attributes["@xmlns"] = function (state, arg) {};


/*
 * Store language attribute to a buffer field.
 * <p>Will be placed in the appropriate location
 * when the element is processed.</p>
 * @name CSL.Attributes.@lang
 * @function
 */
CSL.Attributes["@lang"] = function (state, arg) {
    if (arg) {
        state.build.lang = arg;
    }
};


// Used as a flag during dates processing
CSL.Attributes["@lingo"] = function (state, arg) {
};

// Used as a flag during dates processing
CSL.Attributes["@macro-has-date"] = function (state, arg) {
    this["macro-has-date"] = true;
};

/*
 * Store suffix string on token.
 * @name CSL.Attributes.@suffix
 * @function
 */
CSL.Attributes["@suffix"] = function (state, arg) {
    this.strings.suffix = arg;
};


/*
 * Store prefix string on token.
 * @name CSL.Attributes.@prefix
 * @function
 */
CSL.Attributes["@prefix"] = function (state, arg) {
    this.strings.prefix = arg;
};


/*
 * Store delimiter string on token.
 * @name CSL.Attributes.@delimiter
 * @function
 */
CSL.Attributes["@delimiter"] = function (state, arg) {
    if ("name" == this.name) {
        this.strings.name_delimiter = arg;
    } else {
        this.strings.delimiter = arg;
    }
};


/*
 * Store match evaluator on token.
 */
CSL.Attributes["@match"] = function (state, arg) {
    var match;
    if (this.tokentype === CSL.START || CSL.SINGLETON) {
        this.match = arg;
        this.evaluator = function (token, state, Item, item) {
            var record = function (result) {
                if (result) {
                    state.tmp.jump.replace("succeed");
                    return token.succeed;
                } else {
                    state.tmp.jump.replace("fail");
                    return token.fail;
                }
            }
            return record(state.fun.match[arg](token, state, token.tests, CSL.CONDITION_LEVEL_TOP)(Item, item));
        };
    }
};

CSL.Attributes["@names-min"] = function (state, arg) {
    var val = parseInt(arg, 10);
    if (state.opt.max_number_of_names < val) {
        state.opt.max_number_of_names = val;
    }
    this.strings["et-al-min"] = val;
};

CSL.Attributes["@names-use-first"] = function (state, arg) {
    this.strings["et-al-use-first"] = parseInt(arg, 10);
};

CSL.Attributes["@names-use-last"] = function (state, arg) {
    if (arg === "true") {
        this.strings["et-al-use-last"] = true;
    } else {
        this.strings["et-al-use-last"] = false;
    }
};

CSL.Attributes["@sort"] = function (state, arg) {
    if (arg === "descending") {
        this.strings.sort_direction = CSL.DESCENDING;
    }
};


CSL.Attributes["@plural"] = function (state, arg) {
    // Accepted values of plural attribute differ on cs:text
    // and cs:label nodes.
    if ("always" === arg || "true" === arg) {
        this.strings.plural = 1;
    } else if ("never" === arg || "false" === arg) {
        this.strings.plural = 0;
    } else if ("contextual" === arg) {
        this.strings.plural = false;
    }
};


// also a near duplicate of code above
CSL.Attributes["@number"] = function (state, arg) {
    var func;
    var trylabels = arg.replace("sub verbo", "sub-verbo");
    trylabels = trylabels.split(/\s+/);
    if (["if",  "else-if"].indexOf(this.name) > -1) {
        // check for variable value
        func = function (state, Item, item) {
            var ret = [];
            var label;
            state.processNumber(false, Item, "number", Item.type);
            if (!state.tmp.shadow_numbers.number.label) {
                label = "number";
            } else if (state.tmp.shadow_numbers.number.label === "sub verbo") {
                label = "sub-verbo";
            } else {
                label = state.tmp.shadow_numbers.number.label;
            }
            for (var i = 0, ilen = trylabels.length; i < ilen; i += 1) {
                if (trylabels[i] === label) {
                    ret.push(true);
                } else {
                    ret.push(false);
                }
            }
            return ret;
        };
        this.tests.push(func);
    }
};

CSL.Attributes["@has-publisher-and-publisher-place"] = function (state, arg) {
    this.strings["has-publisher-and-publisher-place"] = true;
};

CSL.Attributes["@publisher-delimiter-precedes-last"] = function (state, arg) {
    this.strings["publisher-delimiter-precedes-last"] = arg;
};

CSL.Attributes["@publisher-delimiter"] = function (state, arg) {
    this.strings["publisher-delimiter"] = arg;
};

CSL.Attributes["@publisher-and"] = function (state, arg) {
    this.strings["publisher-and"] = arg;
};

CSL.Attributes["@newdate"] = function (state, arg) {

};


CSL.Attributes["@givenname-disambiguation-rule"] = function (state, arg) {
    if (CSL.GIVENNAME_DISAMBIGUATION_RULES.indexOf(arg) > -1) {
        state.citation.opt["givenname-disambiguation-rule"] = arg;
    }
};

CSL.Attributes["@collapse"] = function (state, arg) {
    // only one collapse value will be honoured.
    if (arg) {
        state[this.name].opt.collapse = arg;
    }
};

CSL.Attributes["@cite-group-delimiter"] = function (state, arg) {
    if (arg) {
        state[state.tmp.area].opt.cite_group_delimiter = arg;
    }
};



CSL.Attributes["@names-delimiter"] = function (state, arg) {
    state.setOpt(this, "names-delimiter", arg);
};

CSL.Attributes["@name-form"] = function (state, arg) {
    state.setOpt(this, "name-form", arg);
};

CSL.Attributes["@subgroup-delimiter"] = function (state, arg) {
    this.strings["subgroup-delimiter"] = arg;
};

CSL.Attributes["@subgroup-delimiter-precedes-last"] = function (state, arg) {
    this.strings["subgroup-delimiter-precedes-last"] = arg;
};


CSL.Attributes["@name-delimiter"] = function (state, arg) {
    state.setOpt(this, "name-delimiter", arg);
};

CSL.Attributes["@et-al-min"] = function (state, arg) {
    var val = parseInt(arg, 10);
    if (state.opt.max_number_of_names < val) {
        state.opt.max_number_of_names = val;
    }
    state.setOpt(this, "et-al-min", val);
};

CSL.Attributes["@et-al-use-first"] = function (state, arg) {
    state.setOpt(this, "et-al-use-first", parseInt(arg, 10));
};

CSL.Attributes["@et-al-use-last"] = function (state, arg) {
    if (arg === "true") {
        state.setOpt(this, "et-al-use-last", true);
    } else {
        state.setOpt(this, "et-al-use-last", false);
    }
};

CSL.Attributes["@et-al-subsequent-min"] = function (state, arg) {
    var val = parseInt(arg, 10);
    if (state.opt.max_number_of_names < val) {
        state.opt.max_number_of_names = val;
    }
    state.setOpt(this, "et-al-subsequent-min", val);
};

CSL.Attributes["@et-al-subsequent-use-first"] = function (state, arg) {
    state.setOpt(this, "et-al-subsequent-use-first", parseInt(arg, 10));
};

CSL.Attributes["@suppress-min"] = function (state, arg) {
    this.strings["suppress-min"] = parseInt(arg, 10);
};

CSL.Attributes["@suppress-max"] = function (state, arg) {
    this.strings["suppress-max"] = parseInt(arg, 10);
};


CSL.Attributes["@and"] = function (state, arg) {
    state.setOpt(this, "and", arg);
};

CSL.Attributes["@delimiter-precedes-last"] = function (state, arg) {
    state.setOpt(this, "delimiter-precedes-last", arg);
};

CSL.Attributes["@delimiter-precedes-et-al"] = function (state, arg) {
    state.setOpt(this, "delimiter-precedes-et-al", arg);
};

CSL.Attributes["@initialize-with"] = function (state, arg) {
    state.setOpt(this, "initialize-with", arg);
};

CSL.Attributes["@initialize"] = function (state, arg) {
    if (arg === "false") {
        state.setOpt(this, "initialize", false);
    }
};

CSL.Attributes["@name-as-sort-order"] = function (state, arg) {
    state.setOpt(this, "name-as-sort-order", arg);
};

CSL.Attributes["@sort-separator"] = function (state, arg) {
    state.setOpt(this, "sort-separator", arg);
};



CSL.Attributes["@year-suffix-delimiter"] = function (state, arg) {
    state[this.name].opt["year-suffix-delimiter"] = arg;
};

CSL.Attributes["@after-collapse-delimiter"] = function (state, arg) {
    state[this.name].opt["after-collapse-delimiter"] = arg;
};

CSL.Attributes["@subsequent-author-substitute"] = function (state, arg) {
    state[this.name].opt["subsequent-author-substitute"] = arg;
};

CSL.Attributes["@subsequent-author-substitute-rule"] = function (state, arg) {
    state[this.name].opt["subsequent-author-substitute-rule"] = arg;
};

CSL.Attributes["@disambiguate-add-names"] = function (state, arg) {
    if (arg === "true") {
        state.opt["disambiguate-add-names"] = true;
    }
};

CSL.Attributes["@disambiguate-add-givenname"] = function (state, arg) {
    if (arg === "true") {
        state.opt["disambiguate-add-givenname"] = true;
    }
};

CSL.Attributes["@disambiguate-add-year-suffix"] = function (state, arg) {
    if (arg === "true") {
        state.opt["disambiguate-add-year-suffix"] = true;
    }
};


CSL.Attributes["@second-field-align"] = function (state, arg) {
    if (arg === "flush" || arg === "margin") {
        state[this.name].opt["second-field-align"] = arg;
    }
};


CSL.Attributes["@hanging-indent"] = function (state, arg) {
    if (arg === "true") {
        state[this.name].opt.hangingindent = 2;
    }
};


CSL.Attributes["@line-spacing"] = function (state, arg) {
    if (arg && arg.match(/^[.0-9]+$/)) {
        state[this.name].opt["line-spacing"] = parseFloat(arg, 10);
    }
};


CSL.Attributes["@entry-spacing"] = function (state, arg) {
    if (arg && arg.match(/^[.0-9]+$/)) {
        state[this.name].opt["entry-spacing"] = parseFloat(arg, 10);
    }
};


CSL.Attributes["@near-note-distance"] = function (state, arg) {
    state[this.name].opt["near-note-distance"] = parseInt(arg, 10);
};

CSL.Attributes["@text-case"] = function (state, arg) {
    var func = function (state, Item) {
        if (arg === "normal") {
            this.text_case_normal = true;
        } else {
            this.strings["text-case"] = arg;
            if (arg === "title") {
                var m = false;
                var default_locale = state.opt["default-locale"][0].slice(0, 2);
                if (Item.jurisdiction) {
                    this.strings["text-case"] = "passthrough";
                }
            }
        }
    };
    this.execs.push(func);
};


CSL.Attributes["@page-range-format"] = function (state, arg) {
    state.opt["page-range-format"] = arg;
};


CSL.Attributes["@year-range-format"] = function (state, arg) {
    state.opt["year-range-format"] = arg;
};


CSL.Attributes["@default-locale"] = function (state, arg) {
    var lst, len, pos, m, ret;
    //
    // Workaround for Internet Exploder 6 (doesn't recognize
    // groups in str.split(/something(braced-group)something/)
    //
    m = arg.match(/-x-(sort|translit|translat)-/g);
    if (m) {
        for (pos = 0, len = m.length; pos < len; pos += 1) {
            m[pos] = m[pos].replace(/^-x-/, "").replace(/-$/, "");
        }
    }
    lst = arg.split(/-x-(?:sort|translit|translat)-/);
    ret = [lst[0]];
    for (pos = 1, len = lst.length; pos < len; pos += 1) {
        ret.push(m[pos - 1]);
        ret.push(lst[pos]);
    }
    lst = ret.slice();
    len = lst.length;
    for (pos = 1; pos < len; pos += 2) {
        state.opt[("locale-" + lst[pos])].push(lst[(pos + 1)].replace(/^\s*/g, "").replace(/\s*$/g, ""));
    }
    if (lst.length) {
        state.opt["default-locale"] = lst.slice(0, 1);
    } else {
        state.opt["default-locale"] = ["en"];
    }
};

CSL.Attributes["@demote-non-dropping-particle"] = function (state, arg) {
    state.opt["demote-non-dropping-particle"] = arg;
};

CSL.Attributes["@initialize-with-hyphen"] = function (state, arg) {
    if (arg === "false") {
        state.opt["initialize-with-hyphen"] = false;
    }
};

CSL.Attributes["@institution-parts"] = function (state, arg) {
    this.strings["institution-parts"] = arg;
};

CSL.Attributes["@if-short"] = function (state, arg) {
    if (arg === "true") {
        this.strings["if-short"] = true;
    }
};

CSL.Attributes["@substitute-use-first"] = function (state, arg) {
    this.strings["substitute-use-first"] = parseInt(arg, 10);
};

CSL.Attributes["@use-first"] = function (state, arg) {
    this.strings["use-first"] = parseInt(arg, 10);
};

CSL.Attributes["@stop-last"] = function (state, arg) {
    this.strings["stop-last"] = parseInt(arg, 10) * -1;
};

CSL.Attributes["@oops"] = function (state, arg) {
    this.strings.oops = arg;
};

CSL.Attributes["@use-last"] = function (state, arg) {
    this.strings["use-last"] = parseInt(arg, 10);
};


CSL.Attributes["@reverse-order"] = function (state, arg) {
    if ("true" === arg) {
        this.strings["reverse-order"] = true;
    }
};

CSL.Attributes["@display"] = function (state, arg) {
    this.strings.cls = arg;
};

