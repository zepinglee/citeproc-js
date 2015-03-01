CSL.parseParticles = function(){
    var PARTICLES = [
        ["abbé d'", [[[0,2], null]]],
        ["al", [[[0,1], null]]],
        ["al-", [[[0,1], null]],[[null,[0,1]]]],
        ["auf den", [[[0,2], null]]],
        ["ben", [[null, [0,1]]]],
        ["bin", [[null, [0,1]]]],
        ["d'", [[[0,1], null]],[[null,[0,1]]]],
        ["da", [[null, [0,1]]]],
        ["das", [[[0,1], null]]],
        ["de", [[null, [0,1]],[[0,1],null]]],
        ["de la", [[[0,1], [1,2]]]],
        ["de las", [[[0,1], [1,2]]]],
        ["del", [[null, [0,1]]]],
        ["dela", [[[0,1], null]]],
        ["della", [[[0,1], null]]],
        ["dello", [[[0,1], null]]],
        ["den", [[[0,1], null]]],
        ["der", [[[0,1], null]]],
        ["des", [[null, [0,1]],[[0,1], null]]],
        ["di", [[null, [0,1]]]],
        ["do", [[null, [0,1]]]],
        ["dos", [[[0,1], null]]],
        ["du", [[[0,1], null]]],
        ["el", [[[0,1], null]]],
        ["il", [[[0,1], null]]],
        ["in 't", [[[0,2], null]]],
        ["in de", [[[0,2], null]]],
        ["in het", [[[0,2], null]]],
        ["lo", [[[0,1], null]]],
        ["les", [[[0,1], null]]],
        ["l'", [[null, [0,1]]]],
        ["la", [[null, [0,1]]]],
        ["le", [[null, [0,1]]]],
        ["lou", [[null, [0,1]]]],
        ["mac", [[null, [0,1]]]],
        ["op de", [[[0,2], null]]],
        ["pietro", [[null, [0,1]]]],
        ["saint", [[null, [0,1]]]],
        ["sainte", [[null, [0,1]]]],
        ["sen", [[[0,1], null]]],
        ["st.", [[null, [0,1]]]],
        ["ste.", [[null, [0,1]]]],
        ["te", [[[0,1], null]]],
        ["ten", [[[0,1], null]]],
        ["ter", [[[0,1], null]]],
        ["uit de", [[[0,2], null]]],
        ["uit den", [[[0,2], null]]],
        ["v.d.", [[null, [0,1]]]],
        ["van", [[null, [0,1]]]],
        ["van de", [[null, [0,2]]]],
        ["van den", [[null, [0,2]]]],
        ["van der", [[null, [0,2]]]],
        ["van het", [[null, [0,2]]]],
        ["vander", [[null, [0,1]]]],
        ["vd", [[null, [0,1]]]],
        ["ver", [[null, [0,1]]]],
        ["von", [[[0,1], null]],[[null,[0,1]]]],
        ["von der", [[[0,2], null]]],
        ["von dem",[[[0,2], null]]],
        ["von zu", [[[0,2], null]]],
        ["v.", [[[0,1], null]]],
        ["v", [[[0,1], null]]],
        ["vom", [[[0,1], null]]],
        ["zum", [[[0,1], null]]],
        ["zur", [[[0,1], null]]]
        ]
    var CATEGORIZER = null;
    function createCategorizer () {
        CATEGORIZER = {};
        for (var i=0,ilen=PARTICLES.length;i<ilen;i++) {
            var tLst = PARTICLES[i][0].split(" ");
            var pInfo = [];
            for (var j=0,jlen=PARTICLES[i][1].length;j<jlen;j++) {
                var pParams = PARTICLES[i][1][j];
                var str1 = pParams[0] ? tLst.slice(pParams[0][0], pParams[0][1]).join(" ") : "";
                var str2 = pParams[1] ? tLst.slice(pParams[1][0], pParams[1][1]).join(" ") : "";
                pInfo.push({
                    strings: [str1, str2],
                    positions: [pParams[0], pParams[1]]
                });
            }
            CATEGORIZER[PARTICLES[i][0]] = pInfo;
        }
    }
    createCategorizer();
    var LIST = null;
    var REX = null;
    
    function assignToList (nospaceList, spaceList, particle) {
        if (["\'", "-"].indexOf(particle.slice(-1)) > -1) {
            nospaceList.push(particle);
        } else {
            spaceList.push(particle);
        }
    }
    
    function composeParticleLists () {
       LIST = {
            "family": {
                "space": [],
                "nospace": []
            },
            "given": {
                "partial": {},
                "full": []
            }
        }
        REX = {
            "family": null,
            "given": {
                "full_lower": null,
                "full_comma": null,
                "partial": {}
            }
        }
        var FAM_SP = LIST.family.space;
        var FAM_NSP = LIST.family.nospace;
        var GIV_PART = LIST.given.partial;
        var GIV_FULL = LIST.given.full;
        
        for (var i=0,ilen=PARTICLES.length;i<ilen;i++) {
            var info = PARTICLES[i];
            var particle = info[0].split(" ");
            if (particle.length === 1) {
                // one particle
                assignToList(FAM_NSP, FAM_SP, particle[0]);
                GIV_FULL.push(particle[0]);
                if (!GIV_PART[particle[0]]) {
                    GIV_PART[particle[0]] = [];
                }
                GIV_PART[particle[0]].push("");
            } else if (particle.length === 2) {
                // two particles
                assignToList(FAM_NSP, FAM_SP, particle[1]);
                if (!GIV_PART[particle[1]]) {
                    GIV_PART[particle[1]] = [];
                }
                GIV_PART[particle[1]].push(particle[0]);
                particle = particle.join(" ");
                assignToList(FAM_NSP, FAM_SP, particle);
                GIV_FULL.push(particle);
            }
        }
        FAM_SP.sort(byLength);
        FAM_NSP.sort(byLength);
        GIV_FULL.sort(byLength);
        for (var key in GIV_PART) {
            GIV_PART[key].sort(byLength);
        }
    }
    
    function byLength(a,b) {
        if (a.length<b.length) {
            return 1;
        } else if (a.length>b.length) {
            return -1;
        } else {
            return 0;
        }
    }

    function composeRegularExpressions () {
        composeParticleLists();
        REX.family = new RegExp("^((?:" + LIST.family.space.join("|") + ")(\\s+)|(?:" + LIST.family.nospace.join("|") + "([^\\s]))).*", "i");
        REX.given.full_comma = new RegExp(".*?(,[\\s]*)(" + LIST.given.full.join("|") + ")$", "i");
        REX.given.full_lower = new RegExp(".*?([ ]+)(" + LIST.given.full.join("|") + ")$");
        X = "Tom du".match(REX.given.full_lower)
        var allInTheFamily = LIST.family.space
        for (var key in LIST.given.partial) {
            REX.given.partial[key] = new RegExp(".*?(\\s+)(" + LIST.given.partial[key].join("|") + ")$", "i");
        }
    }
    composeRegularExpressions();

    function matchRegularExpressions (name) {
        var m = REX.family.exec(name.family);
        var result = {
            family: {match:null, str:null},
            given: {match:null, str:null}
        }
        if (m) {
            result.family.match = m[2] ? m[1] : m[3] ? m[1].slice(0,-m[3].length) : m[1];
            result.family.str = (m[2] ? m[1].slice(0,-m[2].length) : m[3] ? m[1].slice(0,-m[3].length) : m[1]);
            if (REX.given.partial[result.family.str.toLowerCase()]) {
                var m = REX.given.partial[result.family.str.toLowerCase()].exec(name.given);
                if (m) {
                    result.given.match = m[2] ? m[1] + m[2] : m[2];
                    result.given.str = m[2];
                }
            }
        } else {
            var m = REX.given.full_comma.exec(name.given);
            if (!m) m = REX.given.full_lower.exec(name.given);
            if (m) {
                result.given.match = m[1] ? m[1] + m[2] : m[2];
                result.given.str = m[2];
            }
        }
        return result;
    }
    
    function apostropheNormalizer(name, reverse) {
        var params = ["\u2019", "\'"]
        if (reverse) params.reverse();
        if (name.family) {
            name.family = name.family.replace(params[0], params[1])
        }
        if (name.given) {
            name.given = name.given.replace(params[0], params[1])
        }
    }

    return function (name, normalizeApostrophe) {
        if (normalizeApostrophe) {
            apostropheNormalizer(name);
        }
        var result = matchRegularExpressions(name);
        var particles = [];
        if (result.given.match) {
            name.given = name.given.slice(0,-result.given.match.length);
            particles.push(result.given.str);
        }
        if (result.family.match) {
            name.family = name.family.slice(result.family.match.length);
            particles.push(result.family.str);
        }
        particles = particles.join(" ").split(" ");
        if (particles.length) {
            var key = particles.join(" ");
            var pInfo = CATEGORIZER[key.toLowerCase()];
            if (pInfo) {
                for (var i=pInfo.length-1;i>-1;i--) {
                    var pSet = pInfo[i];
                    if (!result.family.str) result.family.str = "";
                    if (!result.given.str) result.given.str = "";
                    if (result.given.str === pSet.strings[0] && result.family.str === pSet.strings[1]) {
                        break;
                    }
                }
                if (pSet.positions[0] !== null) {
                    // Set element(s) as dropping-particle
                    name["dropping-particle"] = particles.slice(pSet.positions[0][0], pSet.positions[0][1]).join(" ");
                }
                if (pSet.positions[1] !== null) {
                    // Set element(s) as non-dropping-particle
                    name["non-dropping-particle"] = particles.slice(pSet.positions[1][0], pSet.positions[1][1]).join(" ");
                }
            }
        }
        if (normalizeApostrophe) {
            apostropheNormalizer(name, true);
        }
    }
}();
