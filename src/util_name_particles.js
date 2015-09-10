CSL.parseParticles = function(){
    var always_dropping_1 = [[[0,1], null]];
    var always_dropping_2 = [[[0,2], null]];
    var always_dropping_3 = [[[0,3], null]]
    var always_non_dropping_1 = [[null, [0,1]]];
    var always_non_dropping_2 = [[null, [0,2]]];
    var always_non_dropping_3 = [[null, [0,3]]];
    var either_1 = [[null, [0,1]],[[0,1],null]];
    var either_2 = [[null, [0,2]],[[0,2],null]];
    var non_dropping_2_alt_dropping_1_non_dropping_1 = [[null, [0,2]], [[0,1], [1,2]]];
    var PARTICLES = [
        ["'s", always_non_dropping_1],
        ["'s-", always_non_dropping_1],
        ["'t", always_non_dropping_1],
        ["Ad-", either_1],
        ["Adh-", either_1],
        ["Al-", either_1],
        ["An-", either_1],
        ["Ar-", either_1],
        ["As-", either_1],
        ["Ash-", either_1],
        ["At-", either_1],
        ["Ath-", either_1],
        ["Az-", either_1],
        ["Aš-", either_1],
        ["Aḍ-", either_1],
        ["Aḏ-", either_1],
        ["Aṣ-", either_1],
        ["Aṭ-", either_1],
        ["Aṯ-", either_1],
        ["Aẓ-", either_1],
        ["Ed-", either_1],
        ["Edh-", either_1],
        ["El-", either_1],
        ["En-", either_1],
        ["Er-", either_1],
        ["Es-", either_1],
        ["Esh-", either_1],
        ["Et-", either_1],
        ["Eth-", either_1],
        ["Ez-", either_1],
        ["Eš-", either_1],
        ["Eḍ-", either_1],
        ["Eḏ-", either_1],
        ["Eṣ-", either_1],
        ["Eṭ-", either_1],
        ["Eṯ-", either_1],
        ["Eẓ-", either_1],
        ["a", 	always_non_dropping_1],
        ["aan 't", always_non_dropping_2],
        ["aan de", always_non_dropping_2],
        ["aan den", always_non_dropping_2],
        ["aan der", always_non_dropping_2],
        ["aan het", always_non_dropping_2],
        ["aan t", always_non_dropping_2],
        ["aan", always_non_dropping_1],
        ["ad-", either_1],
        ["adh-", either_1],
        ["af", either_1],
        ["al", either_1],
        ["al-", either_1],
        ["am de", always_non_dropping_2],
        ["am", always_non_dropping_1],
        ["an-", either_1],
        ["ar-", either_1],
        ["as-", either_1],
        ["ash-", either_1],
        ["at-", either_1],
        ["ath-", either_1],
        ["auf dem", either_2_dropping_best],
        ["auf den", either_2_dropping_best],
        ["auf der", either_2_dropping_best],
        ["auf ter", always_non_dropping_2],
        ["auf", either_1_dropping_best],
        ["aus 'm", either_2_dropping_best],
        ["aus dem", either_2_dropping_best],
        ["aus den", either_2_dropping_best],
        ["aus der", either_2_dropping_best],
        ["aus m", either_2_dropping_best],
        ["aus", either_1_dropping_best],
        ["aus'm", either_2_dropping_best],
        ["az-", either_1],
        ["aš-", either_1],
        ["aḍ-", either_1],
        ["aḏ-", either_1],
        ["aṣ-", either_1],
        ["aṭ-", either_1],
        ["aṯ-", either_1],
        ["aẓ-", either_1],
        ["ben", always_non_dropping_1],
        ["bij 't", always_non_dropping_2],
        ["bij de", always_non_dropping_2],
        ["bij den", always_non_dropping_2],
        ["bij het", always_non_dropping_2],
        ["bij t", always_non_dropping_2],
        ["bij", always_non_dropping_1],
        ["bin", always_non_dropping_1],
        ["boven d", always_non_dropping_2],
        ["boven d'", always_non_dropping_2],
        ["d", always_non_dropping_1],
        ["d'", either_1],
        ["da", either_1],
        ["dal", always_non_dropping_1],
        ["dal'", always_non_dropping_1],
        ["dall'", always_non_dropping_1],
        ["dalla", always_non_dropping_1],
        ["das", either_1],
        ["de die le", always_non_dropping_3],
        ["de die", always_non_dropping_2],
        ["de l", always_non_dropping_2],
        ["de l'", always_non_dropping_2],
        ["de la", non_dropping_2_alt_dropping_1_non_dropping_1],
        ["de las", non_dropping_2_alt_dropping_1_non_dropping_1],
        ["de le", always_non_dropping_2],
        ["de li", either_2],
        ["de van der", always_non_dropping_3],
        ["de", either_1],
        ["de'", either_1],
        ["deca", always_non_dropping_1],
        ["degli", either_1],
        ["dei", either_1],
        ["del", either_1],
        ["dela", always_dropping_1],
        ["dell'", either_1],
        ["della", either_1],
        ["delle", either_1],
        ["dello", either_1],
        ["den", either_1],
        ["der", either_1],
        ["des", either_1],
        ["di", either_1],
        ["die le", always_non_dropping_2],
        ["do", always_non_dropping_1],
        ["don", always_non_dropping_1],
        ["dos", either_1],
        ["du", either_1],
        ["ed-", either_1],
        ["edh-", either_1],
        ["el", either_1],
        ["el-", either_1],
        ["en-", either_1],
        ["er-", either_1],
        ["es-", either_1],
        ["esh-", either_1],
        ["et-", either_1],
        ["eth-", either_1],
        ["ez-", either_1],
        ["eš-", either_1],
        ["eḍ-", either_1],
        ["eḏ-", either_1],
        ["eṣ-", either_1],
        ["eṭ-", either_1],
        ["eṯ-", either_1],
        ["eẓ-", either_1],
        ["het", always_non_dropping_1],
        ["i", always_non_dropping_1],
        ["il", always_dropping_1],
        ["im", always_non_dropping_1],
        ["in 't", always_non_dropping_2],
        ["in de", always_non_dropping_2],
        ["in den", always_non_dropping_2],
        ["in der", either_2],
        ["in het", always_non_dropping_2],
        ["in t", always_non_dropping_2],
        ["in", always_non_dropping_1],
        ["l", always_non_dropping_1],
        ["l'", always_non_dropping_1],
        ["la", always_non_dropping_1],
        ["las", always_non_dropping_1],
        ["le", always_non_dropping_1],
        ["les", either_1],
        ["lo", either_1],
        ["los", always_non_dropping_1],
        ["lou", always_non_dropping_1],
        ["of", always_non_dropping_1],
        ["onder 't", always_non_dropping_2],
        ["onder de", always_non_dropping_2],
        ["onder den", always_non_dropping_2],
        ["onder het", always_non_dropping_2],
        ["onder t", always_non_dropping_2],
        ["onder", always_non_dropping_1],
        ["op 't", always_non_dropping_2],
        ["op de", either_2],
        ["op den", always_non_dropping_2],
        ["op der", always_non_dropping_2],
        ["op gen", always_non_dropping_2],
        ["op het", always_non_dropping_2],
        ["op t", always_non_dropping_2],
        ["op ten", always_non_dropping_2],
        ["op", always_non_dropping_1],
        ["over 't", always_non_dropping_2],
        ["over de", always_non_dropping_2],
        ["over den", always_non_dropping_2],
        ["over het", always_non_dropping_2],
        ["over t", always_non_dropping_2],
        ["over", always_non_dropping_1],
        ["s", always_non_dropping_1],
        ["s'", always_non_dropping_1],
        ["sen", always_dropping_1],
        ["t", always_non_dropping_1],
        ["te", always_non_dropping_1],
        ["ten", always_non_dropping_1],
        ["ter", always_non_dropping_1],
        ["tho", always_non_dropping_1],
        ["thoe", always_non_dropping_1],
        ["thor", always_non_dropping_1],
        ["to", always_non_dropping_1],
        ["toe", always_non_dropping_1],
        ["tot", always_non_dropping_1],
        ["uijt 't", always_non_dropping_2],
        ["uijt de", always_non_dropping_2],
        ["uijt den", always_non_dropping_2],
        ["uijt te de", always_non_dropping_3],
        ["uijt ten", always_non_dropping_2],
        ["uijt", always_non_dropping_1],
        ["uit 't", always_non_dropping_2],
        ["uit de", always_non_dropping_2],
        ["uit den", always_non_dropping_2],
        ["uit het", always_non_dropping_2],
        ["uit t", always_non_dropping_2],
        ["uit te de", always_non_dropping_3],
        ["uit ten", always_non_dropping_2],
        ["uit", always_non_dropping_1],
        ["unter", always_non_dropping_1],
        ["v", always_non_dropping_1],
        ["v.", always_non_dropping_1],
        ["v.d.", always_non_dropping_1],
        ["van 't", always_non_dropping_2],
        ["van de l", always_non_dropping_3],
        ["van de l'", always_non_dropping_3],
        ["van de", always_non_dropping_2],
        ["van de", always_non_dropping_2],
        ["van den", always_non_dropping_2],
        ["van der", always_non_dropping_2],
        ["van gen", always_non_dropping_2],
        ["van het", always_non_dropping_2],
        ["van la", always_non_dropping_2],
        ["van t", always_non_dropping_2],
        ["van ter", always_non_dropping_2],
        ["van van de", always_non_dropping_3],
        ["van", either_1],
        ["vander", always_non_dropping_1],
        ["vd", always_non_dropping_1],
        ["ver", always_non_dropping_1],
        ["vom und zum", always_dropping_3],
        ["vom", either_1],
        ["von 't", always_non_dropping_2],
        ["von dem", either_2_dropping_best],
        ["von den", either_2_dropping_best],
        ["von der", either_2_dropping_best],
        ["von t", always_non_dropping_2],
        ["von und zu", either_3_dropping_best],
        ["von zu", either_2_dropping_best],
        ["von", either_1_dropping_best],
        ["voor 't", always_non_dropping_2],
        ["voor de", always_non_dropping_2],
        ["voor den", always_non_dropping_2],
        ["voor in 't", always_non_dropping_3],
        ["voor in t", always_non_dropping_3],
        ["voor", always_non_dropping_1],
        ["vor der", either_2_dropping_best],
        ["vor", either_1_dropping_best],
        ["z", always_dropping_1],
        ["ze", always_dropping_1],
        ["zu", either_1_dropping_best],
        ["zum", either_1],
        ["zur", either_1]
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
