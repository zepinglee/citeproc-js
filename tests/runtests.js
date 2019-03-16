const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const getopts = require("getopts");
const spawn = require("child_process").spawn;

/* Configuration */

const scriptDir = path.dirname(require.main.filename);

const defaultConfig =
      "path:"
      + "    local: fixtures/local"
      + "    std: fixtures/std/processor-tests/humans"
      + "    src: ../src"
      + "    locale: ../locale"
      + "    styles: fixtures/local/styles"
      + "    modules: fixtures/local/styles"

const configFile = process.argv[1].replace(/.js$/, ".yaml");
if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, defaultConfig);
}
var config = yaml.parse(fs.readFileSync(configFile).toString());
config.path.localAbs = path.join(scriptDir, config.path.local);
config.path.stdAbs = path.join(scriptDir, config.path.std);
config.path.srcAbs = path.join(scriptDir, config.path.src);

const sourceFiles = [
    "load",
    "print",
    "xmljson",
    "xmldom",
    "system",
    "sort",
    "util_disambig",
    "util_nodes",
    "util_dateparser",
    "build",
    "util_static_locator",
    "util_processor",
    "util_citationlabel",
    "api_control",
    "queue",
    "state",
    "api_cite",
    "api_bibliography",
    "util_integration",
    "api_update",
    "util_locale",
    "util_locale_sniff",
    "node_bibliography",
    "node_choose",
    "node_citation",
    "node_comment",
    "node_date",
    "node_datepart",
    "node_elseif",
    "node_else",
    "node_etal",
    "node_group",
    "node_if",
    "node_conditions",
    "node_condition",
    "util_conditions",
    "node_info",
    "node_institution",
    "node_institutionpart",
    "node_key",
    "node_label",
    "node_layout",
    "node_macro",
    "node_alternative",
    "node_alternativetext",
    "util_names_output",
    "util_names_tests",
    "util_names_truncate",
    "util_names_divide",
    "util_names_join",
    "util_names_common",
    "util_names_constraints",
    "util_names_disambig",
    "util_names_etalconfig",
    "util_names_etal",
    "util_names_render",
    "util_publishers",
    "util_label",
    "node_name",
    "node_namepart",
    "node_names",
    "node_number",
    "node_sort",
    "node_substitute",
    "node_text",
    "attributes",
    "stack",
    "util_parallel",
    "util",
    "util_transform",
    "obj_token",
    "obj_ambigconfig",
    "obj_blob",
    "obj_number",
    "util_datenode",
    "util_date",
    "util_names",
    "util_dates",
    "util_sort",
    "util_substitute",
    "util_number",
    "util_page",
    "util_flipflop",
    "formatters",
    "formats",
    "registry",
    "disambig_names",
    "disambig_citations",
    "disambig_cites",
    "util_modules",
    "util_name_particles"
];

/* Utilities */

const sections = {
    ABBREVIATIONS: {
        required: false,
        type: "json"
    },
    BIBENTRIES: {
        required: false,
        type: "json"
    },
    BIBSECTION: {
        required: false,
        type: "json"
    },
    "CITATION-ITEMS": {
        required: false,
        type: "json"
    },
    CITATIONS: {
        required: false,
        type: "json"
    },
    CSL: {
        required: true,
        type: "xml"
    },
    INPUT: {
        required: true,
        type: "json"
    },
    INPUT2: {
        required: false,
        type: "json"
    },
    LANGPARAMS: {
        required: false,
        type: "json"
    },
    MODE: {
        required: true,
        type: "string"
    },
    MULTIAFFIX: {
        required: false,
        type: "json"
    },
    OPTIONS: {
        required: false,
        type: "json"
    },
    OPTIONZ: {
        required: false,
        type: "json"
    },
    RESULT: {
        required: true,
        type: "string"
    },
    NAME: {
        required: true,
        type: "string"
    },
    PATH: {
        required: true,
        type: "string"
    }
}

function Parser(tn, fpth) {
    this.fpth = fpth;
    this.obj = {
        NAME: [tn],
        PATH: [fpth]
    };
    this.section = false;
    this.state = null;
    this.openRex = new RegExp("^.*>>===*\\s(" + Object.keys(sections).join("|") + ")\\s.*=>>.*$");
    this.closeRex = new RegExp("^.*<<===*\\s(" + Object.keys(sections).join("|") + ")\\s.*=<<.*$");
    this.dumpObj = function() {
        for (var key in this.obj) {
            this.obj[key] = this.obj[key].join("\n");
            if (sections[key].type === "json") {
                try {
                    this.obj[key] = JSON.parse(this.obj[key]);
                } catch (err) {
                    console.log(this.fpth);
                    throw new Error("JSON parse fail for tag \"" + key + "\"");
                }
            }
        }
        for (var key of Object.keys(sections).filter(key => sections[key].required)) {
            if ("undefined" === typeof this.obj[key]) {
                console.log(this.fpth);
                throw new Error("Missing required tag \"" + key + "\"")
            }
        }
        if (this.obj.CSL.trim().slice(-4) === ".csl") {
            try {
                this.obj.CSL = fs.readFileSync(path.join(scriptDir, config.path.styles, this.obj.CSL.trim())).toString();
            } catch (err) {
                console.log("Warning: style \"" + this.obj.CSL.trim() + "\" not found, skipping test");
                this.obj = false;
            }
        }
        return this.obj;
    }
    this.checkLine = function (line) {
        var m = null;
        if (this.openRex.test(line)) {
            m = this.openRex.exec(line);
            if (this.state) {
                console.log(this.fpth);
                throw new Error("Attempted to open tag \"" + m[1] + "\" before tag \"" + this.section + "\" was closed.");
            }
            this.section = m[1];
            this.state = "opening";
        } else if (this.closeRex.test(line)) {
            m = this.closeRex.exec(line);
            if (this.section !== m[1]) {
                console.log(this.fpth);
                throw new Error("Expected closing tag \"" + this.section + "\" but found \"" + m[1] + "\"");
            }
            this.state = "closing";
            // for empty results
            if (this.section === "RESULT" && !this.obj[this.section]) {
                this.obj[this.section] = [""];
            }
        } else {
            if (this.state === "opening") {
                this.obj[this.section] = [];
                this.state = "reading";
            } else if (this.state === "closing") {
                this.state = null;
            }
        }
        if (this.state === "reading") {
            this.obj[this.section].push(line);
        }
    }
}

function parseFixture(tn, fpth) {
    var raw = fs.readFileSync(fpth).toString();
    var parser = new Parser(tn, fpth);
    for (var line of raw.split("\n")) {
        parser.checkLine(line);
    }
    return parser.dumpObj();
}

function Stripper(fn, noStrip) {
    this.fn = fn;
    this.noStrip = noStrip;
    this.arr = [];
    this.area = "code";
    this.state = "reading";
    this.skipStarRex = new RegExp("^\\s*(\\/\\*.*\\*\\/\\s*)$");
    this.skipSlashRex = new RegExp("^\\s*(\\/\\/.*)$");
    this.openRex = new RegExp("^\\s*(\\/\\*|\\/\\/SNIP-START)");
    this.closeRex = new RegExp("^\\s*(\\*\\/|\\/\\/SNIP-END)\\s*$");
    this.checkRex = new RegExp("");
    this.dumpArr = function() {
        return this.arr.join("\n");
    }
    this.checkLine = function (line) {
        if (line.match(/^.use strict.;?$/)) {
            return;
        }
        if (this.noStrip) {
            this.arr.push(line);
        } else {
            var m = null;
            if (this.skipStarRex.test(line)) {
                return;
            } else if (this.openRex.test(line)) {
                m = this.openRex.exec(line);
                this.area = "comment";
                this.state = "opening";
            } else if (this.closeRex.test(line)) {
                m = this.closeRex.exec(line);
                this.state = "closing";
            } else if (this.skipSlashRex.test(line)) {
                return;
            } else {
                if (this.state === "opening") {
                    this.state = "skipping";
                } else if (this.state === "closing") {
                    this.state = "reading";
                    this.area = "code";
                }
            }
            if (this.state === "reading") {
                if (line.trim()) {
                    this.arr.push(line);
                }
            }
        }
    }
}

/* Options */

const usage = "Usage: " + path.basename(process.argv[1])
      + " [-s testName|-g groupName|-a] <-c> <-v|-q>\n"
      + "  -s testName, --single=testName\n"
      + "    Run a single local or standard test fixture\n"
      + "  -g groupName, --group=groupName\n"
      + "    Run a group of tests with the specified prefix\n"
      + "  -a, --all\n"
      + "    Run all tests\n"
      + "  -c, --cranky\n"
      + "    Validate CSL in selected fixtures\n"
      + "  -v, --verbose\n"
      + "    Add console chatter to output\n"
      + "  -q, --quiet\n"
      + "    Be quiet"

const optParams = {
    alias: {
        s: "single",
        g: "group",
        a: "all",
        c: "cranky",
        v: "verbose",
        q: "quiet"
    },
    string: ["s", "g"],
    boolean: ["c", "v", "b", "a"],
    unknown: option => {
        throw Error("Unknown option \"" +option + "\"");
    }
}

const options = getopts(process.argv.slice(2), optParams);

function checkSanity() {
    if (["s", "g", "a"].filter(o => options[o]).length > 1) {
        throw new Error("Only one of -s, -g, or -a may be invoked.");
    }
    if (["s", "g", "a"].filter(o => options[o]).length === 0) {
        throw new Error("Exactly one of -s, -g, or -a must be invoked. No option found.");
    }
    if (["v", "q"].filter(o => options[o]).length > 1) {
        throw new Error("Only one of -v or -q may be specified.");
    }
}

config.testData = {};

function checkOverlap(tn) {
    if (config.testData[tn]) {
        throw new Error("Fixture name exists in local and std: " + tn);
    }
}

function checkSingle() {
    var tn = options.single.replace(/.txt~?$/, "");
    var fn = tn + ".txt";
    if (fn.split("_").length !== 2) {
        throw new Error("Single test fixture must be specified as [group]_[name]");
    }
    var lpth = path.join(config.path.localAbs, fn)
    var spth = path.join(config.path.stdAbs, fn)
    if (!fs.existsSync(lpth) && !fs.existsSync(spth)) {
        console.log("Looking for " + lpth);
        console.log("Looking for " + spth);
        throw new Error("Test fixture \"" + options.single + "\" not found.");
    }
    if (fs.existsSync(lpth)) {
        config.testData[tn] = parseFixture(tn, lpth);
    }
    if (fs.existsSync(spth)) {
        checkOverlap(tn);
        config.testData[tn] = parseFixture(tn, spth);
    }
}

function checkGroup() {
    var fail = true;
    var rex = new RegExp("^" + options.group + "_.*\.txt$");
    for (var line of fs.readdirSync(config.path.localAbs)) {
        if (rex.test(line)) {
            fail = false;
            var lpth = path.join(config.path.localAbs, line);
            var tn = line.replace(/.txt$/, "");
            config.testData[tn] = parseFixture(tn, lpth);
        }
    }
    for (var line of fs.readdirSync(config.path.localAbs)) {
        if (rex.test(line)) {
            fail = false;
            var spth = path.join(config.path.stdAbs, line);
            var tn = line.replace(/.txt$/, "");
            config.testData[tn] = parseFixture(tn, spth);
        }
    }
    if (fail) {
        throw new Error("No fixtures found for group \"" + options.group + "\".");
    }
    
}

function checkAll() {
    var rex = new RegExp("^.*_.*\.txt$");
    for (var line of fs.readdirSync(config.path.localAbs)) {
        if (rex.test(line)) {
            var lpth = path.join(config.path.localAbs, line);
            var tn = line.replace(/.txt$/, "");
            config.testData[tn] = parseFixture(tn, lpth);
        }
    }
    for (var line of fs.readdirSync(config.path.stdAbs)) {
        if (rex.test(line)) {
            var spth = path.join(config.path.stdAbs, line);
            var tn = line.replace(/.txt$/, "");
            config.testData[tn] = parseFixture(tn, spth);
        }
    }
}

try {
    checkSanity();
    if (options.single) {
        checkSingle();
    }
    if (options.group) {
        checkGroup();
    }
    if (options.all) {
        checkAll();
    }
} catch (err) {
    console.log("Error: " + err.message + "\n");
    console.log(usage);
    process.exit(1);
}


/* Operations */

function Bundle(noStrip) {
    // The markup of the code is weird, so we do weird things to strip
    // comments.
    var ret = "";
    for (var fn of sourceFiles) {
        var txt = fs.readFileSync(path.join(config.path.srcAbs, fn + ".js")).toString();
        var stripper = new Stripper(fn, noStrip);
        for (var line of txt.split("\n")) {
            stripper.checkLine(line);
        }
        ret += stripper.dumpArr() + "\n";
    }
    fs.writeFileSync(path.join(scriptDir, "..", "citeproc.js"), ret);
    fs.writeFileSync(path.join(scriptDir, "..", "citeproc_commonjs.js"), ret + "\nmodule.exports = CSL");
}

// Always bundle and load
Bundle(options.v);

// Build the tests
var fixtures = fs.readFileSync(path.join(scriptDir, "runtemplate.js")).toString();
var testData = Object.keys(config.testData).map(k => config.testData[k]).filter(o => o);
fixtures = fixtures.replace("%%SCRIPT_PATH%%", scriptDir);
fixtures = fixtures.replace("%%TEST_DATA%%", JSON.stringify(testData, null, 2));
fs.writeFileSync(path.join(scriptDir, "..", "test", "fixtures.js"), fixtures);

// Run the tests
var mocha = spawn("mocha", ["--color"], {cwd: path.join(scriptDir, "..")});
mocha.stdout.on('data', (data) => {
    console.log(data.toString().replace(/\s+$/, ""));
});
mocha.stderr.on('data', (data) => {
    console.log(data.toString().replace(/\s+$/, ""));
});
mocha.on('close', (code) => {
    console.log(`mocha exited with code ${code}`);
});

// If we ran verbose, rebundle without comments
if (options.v) {
    Bundle();
}
