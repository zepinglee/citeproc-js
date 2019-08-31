/*global CSL: true */

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.Parallel = function (state) {
    this.state = state;
    this.parallel_conditional_blobs_list = [];
};

CSL.Parallel.Partnerships = function(state, items) {
    this.state = state;
    this.items = items.concat([[{},{}]]);
    this.partnerMap = null;
};

CSL.Parallel.Partnerships.prototype.update = function(i) {
    var currItem = this.items[i][0];
    var nextItem = this.items[i+1][0];
    var partnerStatus = null;
    if (this.partnerMap) {
        if (this.partnerMap[nextItem.id]) {
            partnerStatus = "mid";
        } else {
            this.partnerMap = null;
            partnerStatus = "last";
        }
    } else {
        // set partnerMap for this and its partner if none present
        if (this._setPartnerStatus(i)) {
            partnerStatus = "first";
        }
    }
    return partnerStatus;
    // set repeatMap for this an its partner
}

CSL.Parallel.Partnerships.prototype.getID = function(i) {
    return this.items[i][0].id;
}

CSL.Parallel.Partnerships.prototype._setPartnerStatus = function(i) {
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

CSL.Parallel.Partnerships.prototype._getPartnerRepeats = function(i) {
    var currItem = this.items[i][0];
    var nextItem = this.items[i+1][0];
    var rex = /(?:type|id|seeAlso|.*-sub|.*-subjoin|.*-main)/;
    var ret = {};
    for (var key in currItem) {
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
    return ret;
}

CSL.Parallel.prototype.StartCitation = function (sortedItems, out) {
    this.parallel_conditional_blobs_list = [];
    if (sortedItems.length > 1) {
        var partners = new CSL.Parallel.Partnerships(this.state, sortedItems);
        var masterID = false;
        for (var i=0,ilen=sortedItems.length; i<ilen; i++) {
            var status = partners.update(i);
            var currentID = partners.getID(i);
            if (status === "first") {
                sortedItems[i][1].parallel = "first";
                if (i < ilen-1) {
                    sortedItems[i+1][1].parallel_repeats = partners._getPartnerRepeats(i);
                    sortedItems[i][1].parallel_repeats = sortedItems[i+1][1].parallel_repeats;
                }
                masterID = currentID;
                this.state.registry.registry[masterID].master = true;
                this.state.registry.registry[masterID].siblings = [];
            } else if (status === "mid") {
                sortedItems[i][1].parallel = "mid";
                if (i < ilen-1) {
                    sortedItems[i+1][1].parallel_repeats = partners._getPartnerRepeats(i);
                }
                if (!sortedItems[i][1].prefix) {
                    sortedItems[i][1].prefix = ", ";
                }
                this.state.registry.registry[masterID].siblings.push(currentID);
            } else if (status === "last") {
                sortedItems[i][1].parallel = "last";
                if (!sortedItems[i][1].prefix) {
                    sortedItems[i][1].prefix = ", ";
                }
                if (i < ilen-1) {
                    sortedItems[i+1][1].parallel_repeats = partners._getPartnerRepeats(i);
                }
                this.state.registry.registry[masterID].siblings.push(currentID);
            }
        }
    }
};


CSL.Parallel.prototype.purgeGroupsIfParallel = function () {
    for (var i = this.parallel_conditional_blobs_list.length - 1; i > -1; i += -1) {
        var obj = this.parallel_conditional_blobs_list[i];
        if (!obj.result && !obj.parallel_repeats) {
            purgeme = false;
        } else {
            if (obj.condition) {
                var purgeme = true;
                if (!obj.result || obj.result === obj.condition) {
                    purgeme = false;
                }
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
        if (purgeme) {
            var buffer = [];
            while (obj.blobs.length > obj.pos) {
                buffer.push(obj.blobs.pop());
            }
            if (buffer.length) {
                buffer.pop();
            }
            while (buffer.length) {
                obj.blobs.push(buffer.pop());
            }
        }
        this.parallel_conditional_blobs_list.pop();
    }
};
