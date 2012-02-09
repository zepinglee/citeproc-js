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
    // print("== RUN ==");
    this.initVars(akey);
    this.runDisambig();
};

CSL.Disambiguation.prototype.runDisambig = function () {
    var pos, len, ppos, llen, pppos, lllen, ismax;
    //print("=== runDisambig() ===");
    //
    // length is evaluated inside the loop condition by intention
    // here; items will be added to the list during processing.
    for (pos = 0; pos < this.lists.length; pos += 1) {
        this.nnameset = 0;
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
    //print("=== scanItems() ===");
    Item = list[1][0];
    this.scanlist = list[1];
    this.partners = [];

    var tempResult = this.getItemDesc(Item);
    this.base = tempResult[0];
    if (!phase) {
        this.base.disambiguate = false;
    }
    this.maxvals = tempResult[1];
    this.minval = tempResult[2];
    ItemCite = tempResult[3];

    this.partners.push(Item);
    this.nonpartners = [];
    var clashes = 0;
    for (pos = 1, len = list[1].length; pos < len; pos += 1) {
        otherItem = list[1][pos];
        var otherItemData = this.getItemDesc(otherItem);
        var otherItemCite = otherItemData[3];
        //otherItemBase = otherItemData[0];

        // FIXED
        //SNIP-START
        if (this.debug) {
            print("  --> "+Item.id+": ("+ItemCite+") "+otherItem.id+": ("+otherItemCite+")");
        }
        //SNIP-END
        if (ItemCite === otherItemCite) {
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
};

CSL.Disambiguation.prototype.disNames = function (ismax) {
    var pos, len, mybase;
    if (this.clashes[1] === 0 && this.nonpartners.length === 1) {
        // Fully resolved
        mybase = CSL.cloneAmbigConfig(this.base);
        mybase.year_suffix = false;
        //SNIP-START
        if (this.debug) {
            print("RESOLVE [a]: "+this.partners[0].id);
        }
        //SNIP-END
        this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, mybase);
        this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, mybase);
        this.lists[this.listpos] = [this.base, []];
    } else if (this.clashes[1] === 0) {
        // Partially resolved
        // Capture better-base
        this.betterbase = CSL.cloneAmbigConfig(this.base);
        this.betterbase.year_suffix = false;
        //SNIP-START
        if (this.debug) {
            print("RESOLVE [b]: "+this.partners[0].id);
        }
        //SNIP-END
        this.state.registry.registerAmbigToken(this.akey, "" + this.partners[0].id, this.betterbase);
        this.lists[this.listpos] = [this.base, []];
    } else if (this.nonpartners.length === 1) {
        // Partially resolved
        // Capture better-base
        this.betterbase = CSL.cloneAmbigConfig(this.base);
        this.betterbase.year_suffix = false;
        //SNIP-START
        if (this.debug) {
            print("RESOLVE [c]: "+this.nonpartners[0].id);
        }
        //SNIP-END
        this.state.registry.registerAmbigToken(this.akey, "" + this.nonpartners[0].id, this.betterbase);
        this.lists[this.listpos] = [this.base, this.partners];
    } else if (this.clashes[1] < this.clashes[0]) {
        // Improved, but not resolved
        this.betterbase = CSL.cloneAmbigConfig(this.base);
        //SNIP-START
        if (this.debug) {
            print("improved but not resolved");
        }
        //SNIP-END
        this.lists[this.listpos] = [this.base, this.partners];
        this.lists.push([this.base, this.nonpartners]);
    } else {
        // No change
        if (ismax) {
            //SNIP-START
            if (this.debug) {
                print("maxed out");
            }
            //SNIP-END
            if (this.betterbase) {
                // Clone possibly not necessary
                this.base = CSL.cloneAmbigConfig(this.betterbase);
            }
            this.lists[this.listpos] = [this.base, this.nonpartners];
            for (pos = 0, len = this.partners.length; pos < len; pos += 1) {
                this.state.registry.registerAmbigToken(this.akey, "" + this.partners[pos].id, this.base);
            }
        }
    }
};

CSL.Disambiguation.prototype.disExtraText = function () {
    var pos, len, mybase;
    // Try with disambiguate="true""
    //print("=== disExtraText ==");
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
    //print("=== disYears ==");
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
        if (pos === 0) {
            //this.state.registry.registerAmbigToken(this.akey, "" + tokens[pos].id, this.base, this.scanlist);
            this.base.year_suffix = ""+pos;
            this.state.registry.registerAmbigToken(this.akey, "" + tokens[pos].id, this.base);
        } else {
            this.base.year_suffix = ""+pos;
            this.state.registry.registerAmbigToken(this.akey, "" + tokens[pos].id, this.base);
        }
        //this.state.registry.registry[tokens[pos].id].disambig.year_suffix = ""+pos;
        //tokens[pos].disambig.year_suffix = ""+pos;
        //var newys = tokens[pos].disambig.year_suffix;
        var newys = this.state.registry.registry[tokens[pos].id].disambig.year_suffix;
        //print("     --> [" +pos+ "] " +newys);
        if (this.old_desc[tokens[pos].id][0] !== newys) {
            this.state.tmp.taintedItemIDs[tokens[pos].id] = true;
        }
    }
    this.lists[this.listpos] = [this.base, []];
    //print("=== disYears (end) ==");
};

CSL.Disambiguation.prototype.incrementDisambig = function () {
    var val, maxed;
    //print("=== incrementDisambig() ===");
    var maxed = false;
    if ("disNames" === this.modes[this.modeindex]) {
        var increment_name = false;
        var increment_nameset = false;
        if (this.state.opt["disambiguate-add-givenname"] && this.state.opt["givenname-disambiguation-rule"] === "by-cite") {
            // this.gnameset: the index pos of the current nameset
            // this.gname: the index pos of the current name w/in the current nameset
            // this.minval: the lowest permitted givenname level for any name
            // this.maxvals: number of names, per nameset

            // If current name level NOT maxed, increment by one
            // If it IS maxed, drop level to floor, and ...
            // If current givenname position is less than name count limit
            //   increment the givenname position and bump the base for the next name
            // Otherwise, raise the increment-name flag
            //SNIP-START
            if (this.debug) {
                print("** Well, we have gnameset: "+this.gnameset+" and gname: "+this.gname);
            }
            //SNIP-END
            if (this.base.givens[this.gnameset][this.gname] < 2) {
                this.base.givens[this.gnameset][this.gname] += 1;
                //SNIP-START
                if (this.debug) {
                    print("(A) "+this.gnameset+" "+this.gname+" "+this.base.givens[this.gnameset][this.gname]);
                }
                //SNIP-END
            } else {
                this.base.givens[this.gnameset][this.gname] = this.betterbase.givens[this.gnameset][this.gname];
                if (this.gname < this.base.names[this.gnameset]) {
                    this.gname += 1;
                    this.base.names[this.gnameset] += 1;
                    //SNIP-START
                    if (this.debug) {
                        print("INCR gname (1) to "+this.gname);
                    }
                    //SNIP-END
                    this.base.givens[this.gnameset][this.gname] += 1;
                } else {
                    increment_name = true;
                }
            }
        } else {
            // always raise next-increment flag if not doing givenname disambiguation
            increment_name = true;
        }
        if (this.state.opt["disambiguate-add-names"]) {
            // maxed name pos?
            //   If increment-name flag
            //      If not maxed, increment name count
            //      Otherwise, raise the increment-nameset flag
            if (increment_name) {
                if (this.base.names[this.gnameset] < this.maxvals[this.gnameset]) {
                    this.gname += 1;
                    //SNIP-START
                    if (this.debug) {
                        print("INCR gname (2) to "+this.gname);
                    }
                    //SNIP-END
                    this.base.names[this.gnameset] += 1;
                } else {
                    increment_nameset = true;
                }
            }
            // maxed nameset?
            //   If increment-nameset flag
            //      If not maxed, increment nameset count
            //      Otherwise, return true for ismax
            //SNIP-START
            if (this.debug) {
                print("Increment nameset?");
            }
            //SNIP-END
            if (increment_nameset) {
                //SNIP-START
                if (this.debug) {
                    print("  INCREMENT NAMESET");
                }
                //SNIP-END
                if (this.gnameset < this.base.names.length - 1) {
                    //SNIP-START
                    if (this.debug) {
                        print("  uh-oh, really doing it");
                    }
                    //SNIP-END
                    this.gnameset += 1;
                    this.gname = 0;
                    //SNIP-START
                    if (this.debug) {
                        print("INCR gname (3) to "+this.gname);
                    }
                    //SNIP-END
                    // Hmm. The increment from here depends on the
                    // settings. Hmm.
                    if (this.state.opt["disambiguate-add-givenname"] && this.state.opt["givenname-disambiguation-rule"] === "by-cite") {
                        this.base.givens[this.gnameset][this.gname] += 1;
                    } else if (this.base.names[this.gnameset] < this.maxvals[this.gnameset]) {
                        this.gname += 1;
                        //SNIP-START
                        if (this.debug) {
                            print("INCR gname (4) to "+this.gname);
                        }
                        //SNIP-END
                        this.base.names[this.gnameset] += 1;
                    }
                } else {
                    // This will just be a return value. ...
                    maxed = true;
                    this.base = CSL.cloneAmbigConfig(this.betterbase);
                    if (this.modeindex < this.modes.length - 1) {
                        //SNIP-START
                        if (this.debug) {
                            print("  got: "+this.base.givens[this.gnameset][this.gname]+" for "+this.gname)
                        }
                        //SNIP-END
                        this.modeindex += 1;
                    }
                }
            }
        } else if (increment_name) {
            maxed = true;
            if (this.modeindex < this.modes.length - 1) {
                this.modeindex += 1;
            }
        }
    }
    if ("disExtraText" === this.modes[this.modeindex]) {
        this.base.disambiguate = true;
    }
    if ("disYears" === this.modes[this.modeindex]) {
    }
    return maxed;
};

CSL.Disambiguation.prototype.getItemDesc = function (Item, forceMax) {
    var str, maxvals, minval, base;
    //print("=== getItemDesc() ===");
    //print("getItem with name limits: "+this.base.names);
    str = CSL.getAmbiguousCite.call(this.state, Item, this.base);
    maxvals = CSL.getMaxVals.call(this.state);
    minval = CSL.getMinVal.call(this.state);
    base = CSL.getAmbigConfig.call(this.state);
    return [base, maxvals, minval, str];
};

CSL.Disambiguation.prototype.initVars = function (akey) {
    var i, ilen, myIds, myItemBundles, myItems;
    //print("=== initVars() ===");
    this.lists = [];
    this.base = false;
    this.betterbase = false;
    this.akey = akey;
    myItemBundles = [];
    this.old_desc = {};
    myIds = this.ambigcites[akey];
    if (myIds && myIds.length > 1) {
        // Build a composite list of Items and associated
        // disambig objects. This is messy, but it's the only
        // way to get the items sorted by the number of names
        // to be disambiguated. If they are in descending order
        // with name expansions, the processor will hang.
        for (i = 0, ilen = myIds.length; i < ilen; i += 1) {
            var myItem = this.state.retrieveItem("" + myIds[i]);
            var myDesc = this.getItemDesc(myItem);
            if (!this.betterbase) {
                this.betterbase = CSL.cloneAmbigConfig(myDesc[0]);
                this.base = myDesc[0];
                this.maxvals = myDesc[1];
                this.minval = myDesc[2];
            }
            myItemBundles.push([myDesc, myItem]);
            this.old_desc[myIds[i]] = [this.state.registry.registry[myIds[i]].disambig.year_suffix, this.state.registry.registry[myIds[i]].disambig.disambiguate];
        }
        myItemBundles.sort(
            function (a, b) {
                if (a[0][1] > b[0][1]) {
                    return 1;
                } else if (a[0][1] < b[0][1]) {
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
    }
    this.modeindex = 0;
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
