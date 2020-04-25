/*global CSL: true */

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.Parallel = function (state) {
    this.state = state;
};

CSL.Parallel.prototype.StartCitation = function (sortedItems, out) {
    // This array carries the repeat markers used in rendering the cite.
    this.state.tmp.suppress_repeats = [];
    if (sortedItems.length < 2) return;
    var idxEnd = 0;
    var parallelMatchList = false;
    var siblingRanges = [];
    // Okay, shit. This is hard.
    // Start is fine.
    // End is failing to tag a penultimate item.
    
    for (var i=0,ilen=sortedItems.length-1;i<ilen;i++) {
        var freshMatchList = false;
        var info = {};
        if (sortedItems[i][0].seeAlso && !parallelMatchList) {
            freshMatchList = true;
            parallelMatchList = [sortedItems[i][0].id].concat(sortedItems[i][0].seeAlso);
            var tempMatchList = parallelMatchList.slice();
            var remainder = sortedItems.slice(i);
            remainder[0][1].parallel = "first";
            for (var j=0,jlen=remainder.length;j<jlen;j++) {
                var itemID = remainder[j][0].id;
                var ididx = tempMatchList.indexOf(itemID);
                idxEnd = false;
                if (ididx === -1) {
                    idxEnd = (i+j-1);
                } else if ((i+j) === (sortedItems.length-1)) {
                    idxEnd = (i+j);
                }
                if (idxEnd) {
                    siblingRanges.push([i, idxEnd]);
                    break;
                } else {
                    tempMatchList = tempMatchList.slice(0, ididx).concat(tempMatchList.slice(ididx+1));
                }
            }
        }
        if (parallelMatchList) {
            if (i > 0 && freshMatchList) {
                this.state.tmp.suppress_repeats[i-1].START = true;
                freshMatchList = false;
            }
            var currItem = sortedItems[i][0];
            var nextItem = sortedItems[i+1][0];
            for (var varname in this.state.opt.track_repeat) {
                    // if (varname === "title") {
                    //    this.state.sys.print(`curr: ${currItem}, next: ${JSON.stringify(nextItem, null, 2)}`);
                    // }
                if (!currItem[varname] || !nextItem[varname]) {
                    // Go ahead and render any value with an empty partner
                    info[varname] = false;
                } else if ("string" === typeof nextItem[varname] || "number" === typeof nextItem[varname]) {
                    // Simple comparison of string values
                    if (currItem[varname] == nextItem[varname]) {
                        info[varname] = true;
                    } else {
                        info[varname] = false;
                    }
                } else if ("undefined" === typeof currItem[varname].length) {
                    // If a date, use only the year
                    info[varname] = false;
                    var currYear = currItem[varname].year;
                    var nextYear = nextItem[varname].year;
                    if (currYear && nextYear) {
                        if (currYear == nextYear) {
                            info[varname] = true;
                        }
                    }
                } else {
                    // If a creator value, kludge it
                    var currVal = JSON.stringify(currItem[varname]);
                    var nextVal = JSON.stringify(nextItem[varname]);
                    if (currVal === nextVal) {
                        info[varname] = true;
                    } else {
                        info[varname] = false;
                    }
                }
            }
            
        }
        if (idxEnd === i) {
            info.END = true;
            parallelMatchList = false;
        }
        this.state.tmp.suppress_repeats.push(info);
    }
    for (var j=0,jlen=siblingRanges.length;j<jlen;j++) {
        var masterID = sortedItems[siblingRanges[j][0]][0].id;
        this.state.registry.registry[masterID].master = true;
        this.state.registry.registry[masterID].siblings = [];
        var start = siblingRanges[j][0];
        var end = siblingRanges[j][1];
        for (var k=start; k<end; k++) {
            this.state.tmp.suppress_repeats[k].SIBLING = true;
            var siblingID = sortedItems[k+1][0].id;
            sortedItems[k+1][1].parallel = "other";
            this.state.registry.registry[masterID].siblings.push(siblingID);
        }
    }
    // this.state.sys.print(JSON.stringify(this.state.tmp.suppress_repeats, null, 2));
};

CSL.Parallel.prototype.checkRepeats = function(params) {
    var idx = this.state.tmp.cite_index;
    var ret = false;
    if (params.parallel_first) {
        for (var varname in params.parallel_first) {
            var arr = [{}].concat(this.state.tmp.suppress_repeats);
            if (arr[idx][varname] && !arr[idx].START) {
                return true;
            }
        }
    }
    if (params.parallel_last) {
        var arr = this.state.tmp.suppress_repeats.concat([{}]);
        for (var varname in params.parallel_last) {
            if (arr[idx][varname] && !arr[idx].END) {
                return true;
            }
        }
    }
    return false;
};
