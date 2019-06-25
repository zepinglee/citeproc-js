/*global CSL: true */

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.Parallel = function (state) {
    this.state = state;
    this.info = {};
};

CSL.Parallel.prototype.setSeriesRels = function(prevID, currID, seriesRels) {
    if (this.info[prevID][currID]) {
        if (!seriesRels) {
            seriesRels = JSON.parse(JSON.stringify(this.info[prevID]));
        }
    } else {
        seriesRels = false;
    }
    return seriesRels;
}

CSL.Parallel.prototype.getRepeats = function(prev, curr) {
    var rex = /(?:type|id|seeAlso|.*-sub|.*-subjoin|.*-main)/;
    var ret = {};
    for (var key in prev) {
        if (key.match(rex)) {
            continue;
        }
        if (typeof prev[key] === "string") {
            if (prev[key] && prev[key] === curr[key]) {
                ret[key] = true;
            }
        } else if (typeof prev[key] === "object") {
            // Could do better than this.
            if (JSON.stringify(prev[key]) === JSON.stringify(curr[key])) {
                ret[key] = true;
            }
        }
    }
    return ret;
}

CSL.Parallel.prototype.StartCitation = function (sortedItems, out) {
    this.parallel_conditional_blobs_list = [];
    this.info = {};
    if (sortedItems.length > 1) {
        // Harder than it looks.
        // On a first pass, get the seeAlso of each item.
        for (var i=0,ilen=sortedItems.length; i<ilen; i++) {
            var curr = sortedItems[i][0];
            this.info[curr.id] = {};
            if (curr.seeAlso) {
                for (var j=0,jlen=curr.seeAlso.length; j<jlen; j++) {
                    if (curr.id === curr.seeAlso[j]) {
                        continue;
                    }
                    this.info[curr.id][curr.seeAlso[j]] = true;
                }
            }
        }
        // On a second pass, set an item to FIRST if the current
        // item is in its seeAlso. The seeAlso of the FIRST item control
        // until (a) a non-member is encountered at CURRENT, or
        // (b) the end of the array is reached.
        // The seeAlso keys are deleted as each is seen.
        // If neither (a) nor (b), set the current item to MID.
        // If (a) and the previous item is FIRST, delete its
        // parallel marker.
        // If (b) and the current item is FIRST, delete its
        // parallel marker.
        // If (a) and the previous item is not FIRST, set it to
        // LAST, and reset seeAlso from the current item.
        // If (b) and the current item is not FIRST, set it to
        // LAST.
        var seriesRels = false;
        var masterID = false;
        for (var i=1,ilen=sortedItems.length; i<ilen; i++) {
            var prev = sortedItems[i-1][0];
            var curr = sortedItems[i][0];
            var newSeriesRels = this.setSeriesRels(prev.id, curr.id, seriesRels);
            if (!seriesRels) {
                if (newSeriesRels) {
                    // first
                    seriesRels = newSeriesRels;
                    delete seriesRels[curr.id];
                    sortedItems[i-1][1].parallel = "first";
                    sortedItems[i][1].parallel = "mid";
                    sortedItems[i][1].repeats = this.getRepeats(prev, curr);
                    if (!sortedItems[i][1].prefix) {
                        sortedItems[i][1].prefix = ", ";
                    }
                    masterID = prev.id;
                    this.state.registry.registry[masterID].master = true;
                    this.state.registry.registry[masterID].siblings = [curr.id];

                }
            } else {
                if (seriesRels[curr.id]) {
                    sortedItems[i][1].parallel = "mid";
                    if (!sortedItems[i][1].prefix) {
                        sortedItems[i][1].prefix = ", ";
                    }
                    delete seriesRels[curr.id];
                    sortedItems[i][1].repeats = this.getRepeats(prev, curr);
                    this.state.registry.registry[masterID].siblings.push(curr.id);
                } else {
                    sortedItems[i-1][1].parallel = "last";
                    seriesRels = false;
                }
            }
            if (i === (sortedItems.length-1)) {
                if (sortedItems[i][1].parallel === "mid") {
                    sortedItems[i][1].parallel = "last";
                }
            }
        }
    }
};


CSL.Parallel.prototype.purgeGroupsIfParallel = function () {
    for (var i = this.parallel_conditional_blobs_list.length - 1; i > -1; i += -1) {
        var obj = this.parallel_conditional_blobs_list[i];
        if (!obj.result && !obj.repeats) {
            //this.state.sys.print(i + " No action [render] " + obj.id);
            purgeme = false;
        } else {
            if (obj.condition) {
                var purgeme = true;
                if (obj.result === obj.condition) {
                    //this.state.sys.print(i + " Position match [render] "+obj.id);
                    purgeme = false;
                }
                //else {
                //    this.state.sys.print(i + " Position non-match [not-render] "+obj.id + " " + obj.condition + " " + obj.result);
                //}
            } else if (obj.repeats) {
                purgeme = false;
                var matches = 0;
                //this.state.sys.print(obj.norepeat)
                for (var j=0,jlen=obj.norepeat.length; j<jlen; j++) {
                    if (obj.repeats[obj.norepeat[j]]) {
                        matches += 1;
                    }
                }
                if (matches === obj.norepeat.length) {
                    purgeme = true;
                }
            }
        }
        //if (purgeme) {
        //    this.state.sys.print(i + " Repetition check [not-render] "+obj.id + " (" + obj.norepeat + " / " + JSON.stringify(obj.repeats) + ")");
        //} else {
        //    this.state.sys.print(i + " Repetition check [render] "+obj.id + " (" + obj.norepeat + " / " + JSON.stringify(obj.repeats) + ")");
        //}
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
