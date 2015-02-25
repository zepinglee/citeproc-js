CSL.Engine.prototype.retrieveStyleModule = function (jurisdiction) {
    var ret = null;
    var jurisdictions = jurisdiction.split(":");
    var preferences = this.locale[this.opt.lang].opts["jurisdiction-preference"];
    preferences = preferences ? preferences : [];
    preferences.push(null);
    outer:
    for (var i=0,ilen=preferences.length;i<ilen;i++) {
        var preference = preferences[i];
        for (var j=jurisdictions.length;j>0;j--) {
            var jurisdiction = jurisdictions.slice(0,j).join(":");
            ret = this.sys.retrieveStyleModule(jurisdiction, preference);
            if (ret) break outer;
        }
    }
    return ret ? ret : false;
}
