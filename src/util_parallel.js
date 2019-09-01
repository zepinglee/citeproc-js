/*global CSL: true */

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.Parallel = function (state) {
    this.state = state;
};

CSL.Parallel.Partnerships = function(state, items) {
    this.state = state;
    this.items = items.concat([[{},{}]]);
    this.partnerMap = null;
    this.partnerStatus = null;
    this.repeatMap = null;
};

CSL.Parallel.Partnerships.prototype.update = function(i) {
    var currItem = this.items[i][0];
    var nextItem = this.items[i+1][0];
    this.partnerStatus = null;
    if (this.partnerMap) {
        if (this.partnerMap[nextItem.id]) {
            this.partnerStatus = "mid";
        } else {
            this.partnerMap = null;
            this.partnerStatus = "last";
        }
    } else {
        // set partnerMap for this and its partner if none present
        if (this._setPartnerMap(i)) {
            this.partnerStatus = "first";
        }
    }
    // set repeatMap for this and its partner
    // This really isn't the place for this stuff, if we can avoid it.
    // We're tracking ALL VARIABLES, after which we'll filter out the
    // ones we're interested in. Very wasteful. And that goes for
    // the partnerMap code as well.
    // At the very least, this should all be disabled if the style
    // does not use one of is-parallel or no-repeat.
}

CSL.Parallel.Partnerships.prototype.getPartnerStatus = function(i) {
    return this.partnerStatus;
}

CSL.Parallel.Partnerships.prototype.getID = function(i) {
    return this.items[i][0].id;
}

CSL.Parallel.Partnerships.prototype._setPartnerMap = function(i) {
    var currItem = this.items[i][0];
    var nextItem = this.items[i+1][0]
    var hasMap = false;
    if (currItem.seeAlso) {
        if (currItem.seeAlso.indexOf(nextItem.id) > -1) {
            this.partnerMap = {};
            for (var j=0,jlen=currItem.seeAlso.length; j<jlen; j++) {
                this.partnerMap[currItem.seeAlso[j]] = true;
            }
            hasMap = true;
        }
    }
    return hasMap;
}

CSL.Parallel.Partnerships.prototype._getPartnerRepeats = function(i, mode) {
    var currItem = this.items[i][0];
    var nextItem = this.items[i+1][0];
    var rex = /(?:type|multi|id|seeAlso|.*-sub|.*-subjoin|.*-main)/;
    var ret = {};
    for (var key in this.state.opt.parallel[mode]) {
        if (currItem[key]) {
            if (key.match(rex)) {
                continue;
            }
            if (!currItem[key]) continue;
            if (typeof currItem[key] === "string") {
                if (currItem[key] === nextItem[key]) {
                    ret[key] = true;
                }
            } else if (typeof currItem[key] === "object") {
                // Could do better than this, should be proper deepEqual polyfill
                if (JSON.stringify(currItem[key]) === JSON.stringify(nextItem[key])) {
                    ret[key] = true;
                }
            }
        }
    }
    return ret;
}

CSL.Parallel.prototype.StartCitation = function (sortedItems, out) {
    this.parallel_conditional_blobs_list = [];
    if (sortedItems.length > 1) {
        var partners = new CSL.Parallel.Partnerships(this.state, sortedItems);
        var masterID = false;
        for (var i=0,ilen=sortedItems.length; i<ilen; i++) {
            partners.update(i);
            var status = partners.getPartnerStatus();
            var currentID = partners.getID(i);
            if (status === "first") {
                sortedItems[i][1].parallel = "first";
                if (i < ilen-1) {
                    sortedItems[i+1][1].parallel_repeats = partners._getPartnerRepeats(i, "changes_in");
                    sortedItems[i][1].parallel_repeats = sortedItems[i+1][1].parallel_repeats;
                }
                masterID = currentID;
                this.state.registry.registry[masterID].master = true;
                this.state.registry.registry[masterID].siblings = [];
            } else if (status === "mid") {
                sortedItems[i][1].parallel = "mid";
                if (i < ilen-1) {
                    sortedItems[i+1][1].parallel_repeats = partners._getPartnerRepeats(i, "changes_in");
                }
                this.state.registry.registry[masterID].siblings.push(currentID);
                this.state.registry.masterMap[currentID] = masterID;
            } else if (status === "last") {
                sortedItems[i][1].parallel = "last";
                if (i < ilen-1) {
                    sortedItems[i+1][1].parallel_repeats = partners._getPartnerRepeats(i, "changes_in");
                }
                this.state.registry.registry[masterID].siblings.push(currentID);
                this.state.registry.masterMap[currentID] = masterID;
            }
            // Set repeats map here?
            if (this.state.opt.parallel.no_repeat) {
                if (i < ilen-1) {
                    sortedItems[i+1][1].no_repeat_repeats = partners._getPartnerRepeats(i, "no_repeat");
                }
            }
        }
    }
};


CSL.Parallel.prototype.checkRepeats = function(obj) {
    var purgeme = false;
    if (obj.no_repeat_repeats && obj.no_repeat_condition) {
        var matches = 0;
        for (var j=0,jlen=obj.no_repeat_condition.length; j<jlen; j++) {
            if (obj.no_repeat_repeats[obj.no_repeat_condition[j]]) {
                matches += 1;
            }
        }
        if (matches === obj.no_repeat_condition.length) {
            purgeme = true;
        }
    }
    return purgeme;
};

CSL.Parallel.prototype.checkParallels = function(obj, Item) {
    var purgeme = false;
    if (obj.parallel_result && obj.parallel_condition) {
        purgeme = true;
        if (obj.parallel_result === obj.parallel_condition) {
            purgeme = false;
        }
        if (purgeme && obj.changes_in_condition && obj.parallel_repeats) {
            //if (purgeme && obj.changes_in_condition && obj.parallel_repeats)
            purgeme = false;
            var matches = 0;
            for (var j=0,jlen=obj.changes_in_condition.length; j<jlen; j++) {
                if (obj.parallel_repeats[obj.changes_in_condition[j]]) {
                    matches += 1;
                }
            }
            if (matches === obj.changes_in_condition.length) {
                purgeme = true;
            }
        }
    }
    return purgeme;
};


CSL.Parallel.prototype.purgeGroupsIfParallel = function() {};
