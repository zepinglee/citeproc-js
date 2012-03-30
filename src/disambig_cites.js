/*
 * Copyright (c) 2009, 2010 and 2011 Frank G. Bennett, Jr. All Rights
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
 * Copyright (c) 2009, 2010 and 2011 Frank G. Bennett, Jr. All Rights Reserved.
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

CSL.Disambiguation = function (state) {
    this.state = state;
    this.sys = this.state.sys;
    this.registry = state.registry.registry;
    this.ambigcites = state.registry.ambigcites;
    this.configModes();
    this.debug = false;
};

CSL.Disambiguation.prototype.run = function(akey) {
    if (!this.modes.length) {
        return;
    }
    //SNIP-START
    if (this.debug) {
        print("== RUN ==");
    }
    //SNIP-END
    this.initVars(akey);
    this.runDisambig();
};

CSL.Disambiguation.prototype.runDisambig = function () {
    var pos, len, ppos, llen, pppos, lllen, ismax;
    //SNIP-START
    if (this.debug) {
        print("=== runDisambig() ===");
    }
    //SNIP-END
    this.initGivens = true;
    //
    // length is evaluated inside the loop condition by intention
    // here; items will be added to the list during processing.
    for (pos = 0; pos < this.lists.length; pos += 1) {
        this.gnameset = 0;
        this.gname = 0;
        // Set initial clash record
        this.clashes = [1, 0];
        // each list is scanned repeatedly until all
        // items either succeed or ultimately fail.
        while(this.lists[pos][1].length) {
            this.listpos = pos;
            if (!this.base) {
                this.base = this.lists[pos][0];
            }
            // With linear disambig, this should not be necessary
            // We know we're ambiguous, so increment, scan, then check
            // should do the trick.
            //if (this.rerun) {
            //    this.rerun = false;
            //} else {
            //    this.scanItems(this.lists[pos], 0);
            // }
            var names_used = [];
            // The key should be to get this right
            ismax = this.incrementDisambig();
            this.scanItems(this.lists[pos], 1);

            // Add to scanItems()
            //if (this.clashes[1] < this.clashes[0]) {
                //print("Clashes reduced to: "+this.clashes[1]);
                //print("  setting \"better\" to: ["+this.base.names+"]");
                //this.base.better = this.base.names.slice();
            //}
            this.evalScan(ismax);
        }
    }
};

CSL.Disambiguation.prototype.scanItems = function (list, phase) {
    var pos, len, Item, otherItem, ItemCite, ignore, base;
    //SNIP-START
    if (this.debug) {
        print("=== scanItems() ===");
    }
    //SNIP-END
    this.scanlist = list[1];
    this.partners = [];
    this.partners.push(this.Item);
    this.nonpartners = [];
    if (!phase) {
        this.base.disambiguate = false;
    }
    var clashes = 0;

    this.ItemCite = CSL.getAmbiguousCite.call(this.state, this.Item, this.base);
    for (pos = 1, len = list[1].length; pos < len; pos += 1) {
        otherItem = list[1][pos];
        var otherItemCite = CSL.getAmbiguousCite.call(this.state, otherItem, this.base);

        //var otherItemCite = CSL.getAmbiguousCite.call(this.state, otherItem, this.base);
        //ZZZ
        //SNIP-START
        if (this.debug) {
            print("  --> "+this.Item.id+": ("+this.ItemCite+") "+otherItem.id+": ("+otherItemCite+")");
        }
        //SNIP-END
        if (this.ItemCite === otherItemCite) {
            //SNIP-START
            if (this.debug) {
                print("    clash");
            }
            //SNIP-END
            clashes += 1;
            this.partners.push(otherItem);
        } else {
            //SNIP-START
            if (this.debug) {
                print("    non-clash");
            }
            //SNIP-END
            this.nonpartners.push(otherItem);
        }
    }
    this.clashes[0] = this.clashes[1];
    this.clashes[1] = clashes;
};

CSL.Disambiguation.prototype.evalScan = function (ismax) {
    // print("MODE: "+this.modeindex+" "+this.modes);
    // FIXED
    //print("Mode: "+this.modes[this.modeindex]+" names: "+this.base.names[this.nnameset]);
    this[this.modes[this.modeindex]](ismax);
    if (ismax) {
        if (this.modeindex < this.modes.length - 1) {
            this.modeindex += 1;
            //print("EVAL SCAN REG: "+this.betterbase.names);
            this.base = CSL.cloneAmbigConfig(this.betterbase);
        } else {
            this.lists[this.listpos + 1] = [this.base, []];
        }
    }
};

CSL.Disambiguation.prototype.disNames = function (ismax) {
    var pos, len, mybase;
    
    // New design
    // this.base is a forward-only counter. Values are never
    // reduced, and the counter object is never overwritten.
    // It is methodically pushed forward in single-unit increments
    // in incrementDisambig() until disNames() wipes out the list.

    // this.betterbase is cloned from this.base exactly once,
    // at the start of a disambiguation run. Whenever an operation
    // results in improvement, the just-incremented elements
    // identified as this.base.names[this.gnameset] (number of
    // names)and as this.base.givens[this.gnameset][this.gname]
    // (level of given name) are copied from this.base.

    // The this.base object is used to control disambiguation
    // renderings. These will be more fully expanded than the final
    // text, but the flip side of the fact that the extra data does
    // not contribute anything to disambiguation is that leaving
    // it in does no harm -- it is the cold dark matter of
    // disambiguation.

    //SNIP-START
    if (this.debug) {
        print("== disNames() ==: "+this.partners);
    }
    //SNIP-END
    if (this.clashes[1] === 0 && this.nonpartners.length === 1) {
        // Fully resolved
        this.captureStepToBase();
        //SNIP-START
        if (this.debug) {
            print("RESOLVE [a]: "+this.partners[0].id);
        }
        //SNIP-END
        this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, this.betterbase);
        this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, this.betterbase);
        this.state.tmp.taintedItemIDs[this.nonpartners[0].id] = true;
        this.lists[this.listpos] = [this.base, []];
    } else if (this.clashes[1] === 0) {
        // Partially resolved
        // Capture better-base
        this.captureStepToBase();
        //SNIP-START
        if (this.debug) {
            print("RESOLVE [b]: "+this.partners[0].id);
        }
        //SNIP-END
        var base = CSL.cloneAmbigConfig(this.betterbase);
        this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, base);
        this.lists[this.listpos] = [this.betterbase, this.nonpartners];
        if (this.nonpartners.length) {
            this.Item = this.nonpartners[0];
            //this.ItemCite = this.getCiteData(this.Item, this.base);
            //this.ItemCite = CSL.getAmbiguousCite.call(this.state, this.Item, this.base);
            this.initGivens = true;
        }
    } else if (this.nonpartners.length === 1) {
        // Partially resolved
        // Capture better-base
        this.captureStepToBase();
        //SNIP-START
        if (this.debug) {
            print("RESOLVE [c]: "+this.nonpartners[0].id);
        }
        //SNIP-END
        this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, this.betterbase);
        this.lists[this.listpos] = [this.betterbase, this.partners];
    } else if (this.clashes[1] < this.clashes[0]) {
        // Improved, but not resolved
        this.captureStepToBase();
        //SNIP-START
        if (this.debug) {
            print("  RESOLVE [d]: improved but not resolved");
        }
        //SNIP-END
        this.lists[this.listpos] = [this.betterbase, this.partners];
        print("NON-PART: "+this.nonpartners[0].id+" "+this.nonpartners[1].id)
        this.lists.push([this.betterbase, this.nonpartners]);
    } else {
        // No change
        if (ismax) {
            //SNIP-START
            if (this.debug) {
                print("maxed out: "+this.clashes);
            }
            //SNIP-END
            this.lists[this.listpos] = [this.betterbase, this.nonpartners];
            //for (pos = 0, len = this.partners.length; pos < len; pos += 1) {
            //    this.state.registry.registerAmbigToken(this.akey, "" + this.partners[pos].id, this.betterbase);
            //}
            // Check requested names against et-al-min, and set to base if
            // et-al-min is larger than request
            var namelength = this.maxNamesByItemId[this.Item.id][this.gnameset];
            for (var j = 0, jlen = this.betterbase.names.length; j < jlen; j += 1) {
                if (this.betterbase.names[j] < this.etAlMin && namelength < this.etAlMin) {
                    this.betterbase.names[j] = namelength;
                }
            }
            //this.base = CSL.cloneAmbigConfig(this.betterbase);
            this.ItemCite = CSL.getAmbiguousCite.call(this.state, this.Item, this.betterbase);
            //this.ItemCite = CSL.getAmbiguousCite.call(this.state, this.Item, this.betterbase);
            this.lists.push([this.base, this.partners]);
            if (this.modeindex === this.modes.length - 1) {
                for (var i = 0, ilen = this.partners.length; i < ilen; i += 1) {
                    this.state.registry.registerAmbigToken(this.akey, "" + this.partners[i].id, this.betterbase);
                }
            }
        }
    }
    //print("XXXX end of names: "+this.base.names);
};

CSL.Disambiguation.prototype.disExtraText = function () {
    var pos, len, mybase;
    
    if (!this.base.disambiguate) {
        this.base.disambiguate = true;
        return;
    }
    // If disambiguate is false, set it to true and roll.
    // If 

    // Try with disambiguate="true""
    //SNIP-START
    if (this.debug) {
        print("=== disExtraText ==");
    }
    //SNIP-END
    mybase = CSL.cloneAmbigConfig(this.base);
    mybase.year_suffix = false;

    // See note in disNames, above (?)
    if (this.clashes[1] === 0 || this.clashes[1] < this.clashes[0]) {
        this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, mybase);
        for (var i=0, ilen=this.partners.length; i < ilen; i += 1) {
            this.state.registry.registerAmbigToken(this.akey, "" + this.partners[i].id, mybase);
        }
        for (var i=0, ilen=this.nonpartners.length; i < ilen; i += 1) {
            this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[i].id, mybase);
        }
    } else {
        // If adding text would be fruitless, don't bother.
        for (var i=0, ilen=this.partners.length; i < ilen; i += 1) {
            this.state.registry.registerAmbigToken(this.akey, "" + this.partners[i].id, this.betterbase);
        }
    }
    this.lists[this.listpos] = [this.base, []];
};

CSL.Disambiguation.prototype.disYears = function () {
    var pos, len, tokens, token, item;
    //SNIP-START
    if (this.debug) {
        print("=== disYears ==");
    }
    //SNIP-END
    tokens = [];
    //print("=====");
    //print("IDs: " + [this.lists[this.listpos][1][x].id for (x in this.lists[this.listpos][1])]);
    //print("=====");
    if (this.clashes[1]) {
        // That is, if the initial increment on the ambigs group returns no
        // clashes, don't apply suffix. The condition is a failsafe.
        for (pos = 0, len = this.lists[this.listpos][1].length; pos < len; pos += 1) {
            token = this.registry[this.lists[this.listpos][1][pos].id];
            tokens.push(token);
        }
    }
    tokens.sort(this.state.registry.sorter.compareKeys);
    for (pos = 0, len = tokens.length; pos < len; pos += 1) {
        // Only pass this.scanlist on the first iteration.  The
        // list will be iterated on execution, and should only
        // be run once, to avoid losing update markers.
        //print("  ??? [" +pos+ "] " +oldys);
        this.base.year_suffix = ""+pos;
        var oldBase = this.state.registry.registry[tokens[pos].id].disambig;
        var namelength = this.maxNamesByItemId[tokens[pos].id][this.gnameset];
        for (var j = 0, jlen = this.base.names.length; j < jlen; j += 1) {
            if (this.base.names[j] < this.etAlMin && namelength < this.etAlMin) {
                this.base.names[j] = namelength;
            }
        }
        this.state.registry.registerAmbigToken(this.akey, "" + tokens[pos].id, this.base);
        //this.state.registry.registry[tokens[pos].id].disambig.year_suffix = ""+pos;
        //tokens[pos].disambig.year_suffix = ""+pos;
        //var newys = tokens[pos].disambig.year_suffix;
        //print("     --> [" +pos+ "] " +newys);

        // we should compare the entire token here, and only
        // taint the object if they are unequal.
        //print("  CHECK TAINT (old): "+tokens[pos].id+" ("+oldBase.year_suffix+")");
        //print("  CHECK TAINT (new): "+tokens[pos].id+" ("+this.base.year_suffix+")");
        
        //print("---");
        //print("oldBase.names: "+oldBase.names);
        //print("this.base.names: "+this.base.names);
        //print("registry names: "+this.state.registry.registry[tokens[pos].id].disambig.names);
        //print("---");
        //print("oldBase.year_suffix: "+oldBase.year_suffix);
        //print("this.base.year_suffix: "+this.base.year_suffix);
        //print("---");
        
        //this.maxNamesByItemId[otherItem.id];
        if (CSL.ambigConfigDiff(oldBase,this.base)) {
            this.state.tmp.taintedItemIDs[tokens[pos].id] = true;
        }
    }
    //print("=== disYears (end) ==");
    this.lists[this.listpos] = [this.base, []];
};

CSL.Disambiguation.prototype.incrementDisambig = function () {
    var val, maxed;
    //SNIP-START
    if (this.debug) {
        print("=== incrementDisambig() ===");
    }
    //SNIP-END
    if (this.initGivens) {
        this.initGivens = false;
        return false;
    }
    var maxed = false;
    increment_names = true;
    increment_givens = true;
    if ("disNames" === this.modes[this.modeindex]) {
        //SNIP-START
        if (this.debug) {
            print("  disNames mode");
        }
        //SNIP-END
        // this.gnameset: the index pos of the current nameset
        // this.gname: the index pos of the current name w/in the current nameset
        // this.minval: the lowest permitted givenname level for any name
        // this.maxvals: number of names, per nameset
        
        // Four stages:
        // - Increment givenname (optional)
        // - Add a name (optional)
        // - Move to next nameset
        // - Advance mode counter, ending the cycle
        
        // At each stage, check for max val first, and if true,
        // drop value to floor and increment the next stage.
        
        // Increment
        // Max val is always true if a level is inactive.
        increment_names = false;
        if ("number" !== typeof this.givensMax) {
            increment_names = true;
        }
        var increment_namesets = false;
        if ("number" !== typeof this.namesMax) {
            increment_namesets = true;
        }
        if ("number" === typeof this.givensMax) {
            // normalize value. This REALLY should not be necessary.
            //if (!this.base.givens[this.gnameset][this.gname]) {
            //    this.base.givens[this.gnameset][this.gname] = 0;
            //}
            //SNIP-START
            if (this.debug) {
                print("-- givens --");
                print("  gnameset: "+this.gnameset);
                print("  gname: "+this.gname);
                print("  value: "+this.base.givens[this.gnameset][this.gname]);
                print("  max: "+this.givensMax);
            }
            //SNIP-END
            if (this.base.givens[this.gnameset][this.gname] < this.givensMax) {
                this.base.givens[this.gnameset][this.gname] += 1;
                //if (this.gnameset === 0 && this.gname === 0) {
                //    print("SET given UP TO: "+this.base.givens[this.gnameset][this.gname]);
                //}
            } else {
                var increment_names = true;
                //this.base.givens[this.gnameset][this.gname] = 0;
                //if (this.gnameset === 0 && this.gname === 0) {
                //    print("SET given DOWN TO: "+this.base.givens[this.gnameset][this.gname]);
                //}
            }
        }
        if ("number" === typeof this.namesMax && increment_names) {
            increment_namesets = false;
            //SNIP-START
            if (this.debug) {
                print("  base names: gns:"+this.gnameset+" bn:"+this.base.names[this.gnameset]+" nmx:"+this.namesMax);
            }
            //SNIP-END
            if (this.base.names[this.gnameset] < this.namesMax) {
                this.base.names[this.gnameset] += 1;
                this.gname += 1;

                //this.base.names[this.gnameset][this.gname] = 0;
            } else {
                //SNIP-START
                if (this.debug) {
                    print("  MARK AS FULLY INCREMENTED");
                }
                //SNIP-END
                var increment_namesets = true;
            }
        }
        if ("number" === typeof this.namesetsMax && increment_namesets) {
            if (this.gnameset < this.namesetsMax) {
                this.gnameset += 1;
                this.base.names[this.gnameset] = 1;
                this.gname = 0;

                //this.base.names[this.gnameset][this.gname] = 1;
            } else {
                var increment_mode = true;
            }
        }
        // Refresh item string
        this.ItemCite = CSL.getAmbiguousCite.call(this.state, this.Item, this.base);
        //this.ItemCite = CSL.getAmbiguousCite.call(this.state, this.Item, this.base);
        // Acquire new max values if there was significant change
        if (!increment_mode && increment_namesets) {
            //SNIP-START
            if (this.debug) {
                print("Refresh maxvals");
            }
            //SNIP-END
            //this.base = CSL.getAmbigConfig.call(this.state);
            this.namesMax = this.namesMaxVals[this.gnameset];
            this.maxNamesByItemId[this.Item.id] = this.namesMax;
            this.etAlMin = CSL.getMinVal.call(this.state);
        }
        // Check for max
        //SNIP-START
        if (this.debug) {
            print("-- final --");
            print("  namesetsMax: "+this.namesetsMax);
            print("  gnameset: "+this.gnameset);
            print("  gname: "+this.gname);
            print("  namesMax: "+this.namesMax);
            print("  givensMax: "+this.givensMax);
            print("  names value: "+this.base.names[this.gnameset]);
            print("  givens value: "+this.base.givens[this.gnameset][this.gname]);
        }
        //SNIP-END
        if (("number" !== typeof this.namesetsMax || this.gnameset === this.namesetsMax)
            && ("number" !== typeof this.namesMax || this.base.names[this.gnameset] === this.namesMax)
            && ("number" != typeof this.givensMax || "undefined" === typeof this.base.givens[this.gnameset][this.gname] || this.base.givens[this.gnameset][this.gname] === this.givensMax)) {
        
            maxed = true;

            //SNIP-START
            if (this.debug) {
                print("MAXED");
            }
            //SNIP-END
        }
    }
    if ("disYears" === this.modes[this.modeindex]) {
    }
    return maxed;
};

CSL.Disambiguation.prototype.initVars = function (akey) {
    var i, ilen, myIds, myItemBundles, myItems;
    //print("=== initVars() ===");
    this.lists = [];
    this.base = false;
    this.betterbase = false;
    this.akey = akey;

    this.maxNamesByItemId = {};

    myItemBundles = [];
    myIds = this.ambigcites[akey];
    var Item = false;
    if (myIds && myIds.length > 1) {
        // Build a composite list of Items and associated
        // disambig objects. This is messy, but it's the only
        // way to get the items sorted by the number of names
        // to be disambiguated. If they are in descending order
        // with name expansions, the processor will hang.
        for (i = 0, ilen = myIds.length; i < ilen; i += 1) {
            var myItem = this.state.retrieveItem("" + myIds[i]);
            this.getCiteData(myItem);
            myItemBundles.push([this.maxNamesByItemId[myItem.id], myItem]);
        }
        myItemBundles.sort(
            function (a, b) {
                if (a[0] > b[0]) {
                    return 1;
                } else if (a[0] < b[0]) {
                    return -1;
                } else {
                    if (a[1].id > b[1].id) {
                        return 1;
                    } else if (a[1].id < b[1].id) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            }
        );
        myItems = [];
        for (i = 0, ilen = myItemBundles.length; i < ilen; i += 1) {
            myItems.push(myItemBundles[i][1]);
        }
        // FIXED
        //print("Item sequence: "+[myItems[x].id for (x in myItems)]);
        
        // first element is the base disambig, which is false for the initial
        // list.
        this.lists.push([this.base, myItems]);
        this.Item = this.lists[0][1][0];
    } else {
        this.Item = this.state.retrieveItem("" + myIds[0]);
    }

    this.modeindex = 0;
    this.ItemCite = this.getCiteData(this.Item);
    this.namesMax = this.maxNamesByItemId[this.Item.id][0];
    for (var i = 0, ilen = this.base.givens.length; i < ilen; i += 1) {
        for (var j = 0, jlen = this.namesMax; j < jlen; j += 1) {
            if (!this.base.givens[i][j]) {
                this.base.givens[i][j] = 0;
                this.betterbase.givens[i][j] = 0;
            }
        }
    }
    this.base.year_suffix = false;
    this.base.disambiguate = false;
    this.betterbase.year_suffix = false;
    this.betterbase.disambiguate = false;
    if (this.state.opt["givenname-disambiguation-rule"] === "by-cite") {
        this.givensMax = 2;
    }

};

/**
 * Set available modes for disambiguation
 */
CSL.Disambiguation.prototype.configModes = function () {
    var dagopt, gdropt;
    // Modes are function names prototyped to this instance.
    this.modes = [];
    dagopt = this.state.opt["disambiguate-add-givenname"];
    gdropt = this.state.opt["givenname-disambiguation-rule"];
    if (this.state.opt['disambiguate-add-names'] || (dagopt && gdropt === "by-cite")) {
        this.modes.push("disNames");
    }
    if (this.state.opt.has_disambiguate) {
        this.modes.push("disExtraText");
    }
    if (this.state.opt["disambiguate-add-year-suffix"]) {
        this.modes.push("disYears");
    }
};

CSL.Disambiguation.prototype.getCiteData = function(Item, base) {
    var ret = CSL.getAmbiguousCite.call(this.state, Item, base);
    if (!this.maxNamesByItemId[Item.id]) {
        this.maxNamesByItemId[Item.id] = CSL.getMaxVals.call(this.state);
        this.state.registry.registry[Item.id].disambig.givens = this.state.tmp.disambig_settings.givens.slice();
        this.etAlMin = CSL.getMinVal.call(this.state);
        this.namesetsMax = this.state.registry.registry[Item.id].disambig.names.length - 1;
        var base = CSL.getAmbigConfig.call(this.state);
        if (!this.base) {
            this.base = base;
            this.betterbase = CSL.cloneAmbigConfig(base);
        }
        var oldBase = this.base;
        this.base = base;
        var base = oldBase;
        if (base.names.length < this.base.names.length) {
            // I don't know what would happen with discrepancies in the number
            // of namesets rendered on items, so we use the fewer of the two
            // and limit the other to that size.
            this.base = base;
        } else {
            // Within namesets, we use the longer of the two throughout.
            var update = false;
            for (var i = 0, ilen = base.names.length; i < ilen; i += 1) {
                if (base.names[i] > this.base.names[i]) {
                    this.base.givens[i] = this.base.givens[i].concat(this.base.givens[i].slice(this.base.names[i]));
                    this.base.names[i] = base.names[i];
                }
            }
        }
    }

    return ret;
};

CSL.Disambiguation.prototype.captureStepToBase = function() {
    this.betterbase.givens[this.gnameset][this.gname] = this.base.givens[this.gnameset][this.gname];
    this.betterbase.names[this.gnameset] = this.base.names[this.gnameset];
};
