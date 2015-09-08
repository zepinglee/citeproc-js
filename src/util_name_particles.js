CSL.parseParticles = function(){
    var always_dropping_1 = [[[0,1], null]];
    var always_dropping_2 = [[[0,2], null]];
    var always_dropping_3 = [[[0,3], null]]
    var always_non_dropping_1 = [[null, [0,1]]];
    var always_non_dropping_2 = [[null, [0,2]]];
    var dropping_alt_non_dropping_1 = [[[0,1], null],[null,[0,1]]];
    var non_dropping_alt_dropping_1 = [[null, [0,1]],[[0,1],null]];
    var dropping_2_alt_dropping_1_non_dropping_1 = [[null, [0,2]], [[0,1], [1,2]]];
    var PARTICLES = [
        ["af", always_dropping_1],
        ["al", always_dropping_1],
        ["das", always_dropping_1],
        ["dela", always_dropping_1],
        ["den", always_dropping_1],
        ["der", always_dropping_1],
        ["dos", always_dropping_1],
        ["du", always_dropping_1],
        ["el", always_dropping_1],
        ["il", always_dropping_1],
        ["les", always_dropping_1],
        ["lo", always_dropping_1],
        ["sen", always_dropping_1],
        ["vom", always_dropping_1],
        ["z", always_dropping_1],
        ["ze", always_dropping_1],
        ["zum", always_dropping_1],
        ["zur", always_dropping_1],
        ["auf den", always_dropping_2],
        ["auf der", always_dropping_2],
        ["aus der", always_dropping_2],
        ["de li", always_dropping_2],
        ["op de", always_dropping_2],
        ["von dem",always_dropping_2],
        ["von der", always_dropping_2],
        ["von zu", always_dropping_2],
        ["vom und zum", always_dropping_3],
        ["von und zu", always_dropping_3],
        ["'s-", always_non_dropping_1],
        ["'t", always_non_dropping_1],
        ["aan de", always_non_dropping_1],
        ["aus'm", always_non_dropping_1],
        ["ben", always_non_dropping_1],
        ["bin", always_non_dropping_1],
        ["da", always_non_dropping_1],
        ["dall'", always_non_dropping_1],
        ["de'", always_non_dropping_1],
        ["degli", always_non_dropping_1],
        ["dei", always_non_dropping_1],
        ["del", always_non_dropping_1],
        ["dell'", always_non_dropping_1],
        ["della", always_non_dropping_1],
        ["dello", always_non_dropping_1],
        ["di", always_non_dropping_1],
        ["do", always_non_dropping_1],
        ["l'", always_non_dropping_1],
        ["la", always_non_dropping_1],
        ["le", always_non_dropping_1],
        ["lou", always_non_dropping_1],
        ["mac", always_non_dropping_1],
        ["pietro", always_non_dropping_1],
        ["saint", always_non_dropping_1],
        ["sainte", always_non_dropping_1],
        ["st.", always_non_dropping_1],
        ["ste.", always_non_dropping_1],
        ["te", always_non_dropping_1],
        ["ten", always_non_dropping_1],
        ["ter", always_non_dropping_1],
        ["v", always_non_dropping_1],
        ["v.", always_non_dropping_1],
        ["v.d.", always_non_dropping_1],
        ["van", always_non_dropping_1],
        ["vander", always_non_dropping_1],
        ["vd", always_non_dropping_1],
        ["ver", always_non_dropping_1],
        ["in 't", always_non_dropping_2],
        ["in de", always_non_dropping_2],
        ["in der", always_non_dropping_2],
        ["in het", always_non_dropping_2],
        ["uit de", always_non_dropping_2],
        ["uit den", always_non_dropping_2],
        ["van de", always_non_dropping_2],
        ["van den", always_non_dropping_2],
        ["van der", always_non_dropping_2],
        ["van het", always_non_dropping_2],
        ["de la", dropping_2_alt_dropping_1_non_dropping_1],
        ["de las", dropping_2_alt_dropping_1_non_dropping_1],
        ["Ad-", dropping_alt_non_dropping_1],
        ["Adh-", dropping_alt_non_dropping_1],
        ["Al-", dropping_alt_non_dropping_1],
        ["An-", dropping_alt_non_dropping_1],
        ["Ar-", dropping_alt_non_dropping_1],
        ["As-", dropping_alt_non_dropping_1],
        ["Ash-", dropping_alt_non_dropping_1],
        ["At-", dropping_alt_non_dropping_1],
        ["Ath-", dropping_alt_non_dropping_1],
        ["Az-", dropping_alt_non_dropping_1],
        ["Aš-", dropping_alt_non_dropping_1],
        ["Aḍ-", dropping_alt_non_dropping_1],
        ["Aḏ-", dropping_alt_non_dropping_1],
        ["Aṣ-", dropping_alt_non_dropping_1],
        ["Aṭ-", dropping_alt_non_dropping_1],
        ["Aṯ-", dropping_alt_non_dropping_1],
        ["Aẓ-", dropping_alt_non_dropping_1],
        ["Ed-", dropping_alt_non_dropping_1],
        ["Edh-", dropping_alt_non_dropping_1],
        ["El-", dropping_alt_non_dropping_1],
        ["En-", dropping_alt_non_dropping_1],
        ["Er-", dropping_alt_non_dropping_1],
        ["Es-", dropping_alt_non_dropping_1],
        ["Esh-", dropping_alt_non_dropping_1],
        ["Et-", dropping_alt_non_dropping_1],
        ["Eth-", dropping_alt_non_dropping_1],
        ["Ez-", dropping_alt_non_dropping_1],
        ["Eš-", dropping_alt_non_dropping_1],
        ["Eḍ-", dropping_alt_non_dropping_1],
        ["Eḏ-", dropping_alt_non_dropping_1],
        ["Eṣ-", dropping_alt_non_dropping_1],
        ["Eṭ-", dropping_alt_non_dropping_1],
        ["Eṯ-", dropping_alt_non_dropping_1],
        ["Eẓ-", dropping_alt_non_dropping_1],
        ["ad-", dropping_alt_non_dropping_1],
        ["adh-", dropping_alt_non_dropping_1],
        ["al-", dropping_alt_non_dropping_1],
        ["an-", dropping_alt_non_dropping_1],
        ["ar-", dropping_alt_non_dropping_1],
        ["as-", dropping_alt_non_dropping_1],
        ["ash-", dropping_alt_non_dropping_1],
        ["at-", dropping_alt_non_dropping_1],
        ["ath-", dropping_alt_non_dropping_1],
        ["az-", dropping_alt_non_dropping_1],
        ["aš-", dropping_alt_non_dropping_1],
        ["aḍ-", dropping_alt_non_dropping_1],
        ["aḏ-", dropping_alt_non_dropping_1],
        ["aṣ-", dropping_alt_non_dropping_1],
        ["aṭ-", dropping_alt_non_dropping_1],
        ["aṯ-", dropping_alt_non_dropping_1],
        ["aẓ-", dropping_alt_non_dropping_1],
        ["d'", dropping_alt_non_dropping_1],
        ["ed-", dropping_alt_non_dropping_1],
        ["edh-", dropping_alt_non_dropping_1],
        ["el-", dropping_alt_non_dropping_1],
        ["en-", dropping_alt_non_dropping_1],
        ["er-", dropping_alt_non_dropping_1],
        ["es-", dropping_alt_non_dropping_1],
        ["esh-", dropping_alt_non_dropping_1],
        ["et-", dropping_alt_non_dropping_1],
        ["eth-", dropping_alt_non_dropping_1],
        ["ez-", dropping_alt_non_dropping_1],
        ["eš-", dropping_alt_non_dropping_1],
        ["eḍ-", dropping_alt_non_dropping_1],
        ["eḏ-", dropping_alt_non_dropping_1],
        ["eṣ-", dropping_alt_non_dropping_1],
        ["eṭ-", dropping_alt_non_dropping_1],
        ["eṯ-", dropping_alt_non_dropping_1],
        ["eẓ-", dropping_alt_non_dropping_1],
        ["von", dropping_alt_non_dropping_1],
        ["de", non_dropping_alt_dropping_1],
        ["des", non_dropping_alt_dropping_1]
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
        // Case insensitivity vs case sensitivity
        //REX.family = new RegExp("^((?:" + LIST.family.space.join("|") + ")(\\s+)|(?:" + LIST.family.nospace.join("|") + "([^\\s]))).*", "i");
        REX.family = new RegExp("^((?:" + LIST.family.space.join("|") + ")(\\s+)|(?:" + LIST.family.nospace.join("|") + "([^\\s]))).*");
        REX.given.full_comma = new RegExp(".*?(,[\\s]*)(" + LIST.given.full.join("|") + ")$", "i");
        REX.given.full_lower = new RegExp(".*?([ ]+)(" + LIST.given.full.join("|") + ")$");
        var allInTheFamily = LIST.family.space
        for (var key in LIST.given.partial) {
            // Case insensitivity vs case sensitivity
            //REX.given.partial[key] = new RegExp(".*?(\\s+)(" + LIST.given.partial[key].join("|") + ")$", "i");
            REX.given.partial[key] = new RegExp(".*?(\\s+)(" + LIST.given.partial[key].join("|") + ")$");
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
            // Case insensitivity vs case sensitivity
            //if (REX.given.partial[result.family.str.toLowerCase()]) {
            if (REX.given.partial[result.family.str]) {
                //var m = REX.given.partial[result.family.str.toLowerCase()].exec(name.given);
                var m = REX.given.partial[result.family.str].exec(name.given);
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
            // Case insensitivity vs case sensitivity
            //var pInfo = CATEGORIZER[key.toLowerCase()];
            var pInfo = CATEGORIZER[key];
            if (pInfo) {
                for (var i=pInfo.length-1;i>-1;i--) {
                    var pSet = pInfo[i];
                    if (!result.family.str) result.family.str = "";
                    if (!result.given.str) result.given.str = "";
                    // Case insensitivity vs case sensitivity
                    //if (result.given.str.toLowerCase() === pSet.strings[0] && result.family.str.toLowerCase() === pSet.strings[1]) {
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
        if (!name.suffix && name.given) {
            m = name.given.match(/(\s*,!*\s*)/);
            if (m) {
                idx = name.given.indexOf(m[1]);
                var possible_suffix = name.given.slice(idx + m[1].length);
                var possible_comma = name.given.slice(idx, idx + m[1].length).replace(/\s*/g, "");
                if (possible_suffix.length <= 3) {
                    if (possible_comma.length === 2) {
                        name["comma-suffix"] = true;
                    }
                    name.suffix = possible_suffix;
                } else if (!name["dropping-particle"] && name.given) {
                    // Covers the case where "et al." is explicitly used in the
                    // authorship information of the work.
                    name["dropping-particle"] = possible_suffix;
                    name["comma-dropping-particle"] = ",";
                }
                name.given = name.given.slice(0, idx);
            }
        }
        if (normalizeApostrophe) {
            apostropheNormalizer(name, true);
        }
    }
}();
