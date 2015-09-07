CSL.parseParticles = function(){
    var always_non_dropping_1 = [[null, [0,1]]];
    var always_non_dropping_2 = [[null, [0,2]]];
    var PARTICLES = [
        ["al-", [[[0,1], null],[null,[0,1]]]],
        ["at-", [[[0,1], null],[null,[0,1]]]],
        ["ath-", [[[0,1], null],[null,[0,1]]]],
        ["aṯ-", [[[0,1], null],[null,[0,1]]]],
        ["ad-", [[[0,1], null],[null,[0,1]]]],
        ["adh-", [[[0,1], null],[null,[0,1]]]],
        ["aḏ-", [[[0,1], null],[null,[0,1]]]],
        ["ar-", [[[0,1], null],[null,[0,1]]]],
        ["az-", [[[0,1], null],[null,[0,1]]]],
        ["as-", [[[0,1], null],[null,[0,1]]]],
        ["ash-", [[[0,1], null],[null,[0,1]]]],
        ["aš-", [[[0,1], null],[null,[0,1]]]],
        ["aṣ-", [[[0,1], null],[null,[0,1]]]],
        ["aḍ-", [[[0,1], null],[null,[0,1]]]],
        ["aṭ-", [[[0,1], null],[null,[0,1]]]],
        ["aẓ-", [[[0,1], null],[null,[0,1]]]],
        ["an-", [[[0,1], null],[null,[0,1]]]],
        ["et-", [[[0,1], null],[null,[0,1]]]],
        ["eth-", [[[0,1], null],[null,[0,1]]]],
        ["eṯ-", [[[0,1], null],[null,[0,1]]]],
        ["ed-", [[[0,1], null],[null,[0,1]]]],
        ["edh-", [[[0,1], null],[null,[0,1]]]],
        ["eḏ-", [[[0,1], null],[null,[0,1]]]],
        ["er-", [[[0,1], null],[null,[0,1]]]],
        ["ez-", [[[0,1], null],[null,[0,1]]]],
        ["es-", [[[0,1], null],[null,[0,1]]]],
        ["esh-", [[[0,1], null],[null,[0,1]]]],
        ["eš-", [[[0,1], null],[null,[0,1]]]],
        ["eṣ-", [[[0,1], null],[null,[0,1]]]],
        ["eḍ-", [[[0,1], null],[null,[0,1]]]],
        ["eṭ-", [[[0,1], null],[null,[0,1]]]],
        ["eẓ-", [[[0,1], null],[null,[0,1]]]],
        ["el-", [[[0,1], null],[null,[0,1]]]],
        ["en-", [[[0,1], null],[null,[0,1]]]],
        ["At-", [[[0,1], null],[null,[0,1]]]],
        ["Ath-", [[[0,1], null],[null,[0,1]]]],
        ["Aṯ-", [[[0,1], null],[null,[0,1]]]],
        ["Ad-", [[[0,1], null],[null,[0,1]]]],
        ["Adh-", [[[0,1], null],[null,[0,1]]]],
        ["Aḏ-", [[[0,1], null],[null,[0,1]]]],
        ["Ar-", [[[0,1], null],[null,[0,1]]]],
        ["Az-", [[[0,1], null],[null,[0,1]]]],
        ["As-", [[[0,1], null],[null,[0,1]]]],
        ["Ash-", [[[0,1], null],[null,[0,1]]]],
        ["Aš-", [[[0,1], null],[null,[0,1]]]],
        ["Aṣ-", [[[0,1], null],[null,[0,1]]]],
        ["Aḍ-", [[[0,1], null],[null,[0,1]]]],
        ["Aṭ-", [[[0,1], null],[null,[0,1]]]],
        ["Aẓ-", [[[0,1], null],[null,[0,1]]]],
        ["Al-", [[[0,1], null],[null,[0,1]]]],
        ["An-", [[[0,1], null],[null,[0,1]]]],
        ["Et-", [[[0,1], null],[null,[0,1]]]],
        ["Eth-", [[[0,1], null],[null,[0,1]]]],
        ["Eṯ-", [[[0,1], null],[null,[0,1]]]],
        ["Ed-", [[[0,1], null],[null,[0,1]]]],
        ["Edh-", [[[0,1], null],[null,[0,1]]]],
        ["Eḏ-", [[[0,1], null],[null,[0,1]]]],
        ["Er-", [[[0,1], null],[null,[0,1]]]],
        ["Ez-", [[[0,1], null],[null,[0,1]]]],
        ["Es-", [[[0,1], null],[null,[0,1]]]],
        ["Esh-", [[[0,1], null],[null,[0,1]]]],
        ["Eš-", [[[0,1], null],[null,[0,1]]]],
        ["Eṣ-", [[[0,1], null],[null,[0,1]]]],
        ["Eḍ-", [[[0,1], null],[null,[0,1]]]],
        ["Eṭ-", [[[0,1], null],[null,[0,1]]]],
        ["Eẓ-", [[[0,1], null],[null,[0,1]]]],
        ["El-", [[[0,1], null],[null,[0,1]]]],
        ["En-", [[[0,1], null],[null,[0,1]]]],
        ["'s-", always_non_dropping_1],
        ["'t", always_non_dropping_1],
        ["aan de", always_non_dropping_1],
        ["af", [[[0,1], null]]],
        ["al", [[[0,1], null]]],
        ["auf den", [[[0,2], null]]],
        ["auf der", [[[0,2], null]]],
        ["aus der", [[[0,2], null]]],
        ["aus'm", [[null, [0,1]]]],
        ["ben", [[null, [0,1]]]],
        ["bin", [[null, [0,1]]]],
        ["d'", [[[0,1], null],[null,[0,1]]]],
        ["da", [[null, [0,1]]]],
        ["dell'", always_non_dropping_1],
        ["dall'", always_non_dropping_1],
        ["das", [[[0,1], null]]],
        ["de", [[null, [0,1]],[[0,1],null]]],
        ["de la", [[null, [0,2]], [[0,1], [1,2]]]],
        ["de las", [[null, [0,2]], [[0,1], [1,2]]]],
        ["de li", [[[0,2], null]]],
        ["de'", always_non_dropping_1],
        ["degli", always_non_dropping_1],
        ["dei", always_non_dropping_1],
        ["del", [[null, [0,1]]]],
        ["dela", [[[0,1], null]]],
        ["della", always_non_dropping_1],
        ["dello", always_non_dropping_1],
        ["den", [[[0,1], null]]],
        ["der", [[[0,1], null]]],
        ["des", [[null, [0,1]],[[0,1], null]]],
        ["di", [[null, [0,1]]]],
        ["do", [[null, [0,1]]]],
        ["dos", [[[0,1], null]]],
        ["du", [[[0,1], null]]],
        ["el", [[[0,1], null]]],
        ["il", [[[0,1], null]]],
        ["in 't", always_non_dropping_2],
        ["in de", always_non_dropping_2],
        ["in der", always_non_dropping_2],
        ["in het", always_non_dropping_2],
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
        ["te", always_non_dropping_1],
        ["ten", always_non_dropping_1],
        ["ter", always_non_dropping_1],
        ["uit de", always_non_dropping_2],
        ["uit den", always_non_dropping_2],
        ["v.d.", always_non_dropping_1],
        ["van", always_non_dropping_1],
        ["van de", always_non_dropping_2],
        ["van den", always_non_dropping_2],
        ["van der", always_non_dropping_2],
        ["van het", always_non_dropping_2],
        ["vander", always_non_dropping_1],
        ["vd", always_non_dropping_1],
        ["ver", [[null, [0,1]]]],
        ["von", [[[0,1], null],[null,[0,1]]]],
        ["von der", [[[0,2], null]]],
        ["von dem",[[[0,2], null]]],
        ["von und zu", [[[0,3], null]]],
        ["von zu", [[[0,2], null]]],
        ["v.", always_non_dropping_1],
        ["v", always_non_dropping_1],
        ["vom", [[[0,1], null]]],
        ["vom und zum", [[[0,3], null]]],
        ["z", [[[0,1], null]]],
        ["ze", [[[0,1], null]]],
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
