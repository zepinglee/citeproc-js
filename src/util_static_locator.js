/*
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights
 * Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 1.13, 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./tests subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */

CSL.Engine.prototype.remapSectionVariable = function (inputList) {
    for (var i = 0, ilen = inputList.length; i < ilen; i += 1) {
        var Item = inputList[i][0];
        var item = inputList[i][1];
        var section_label_count = 0;
        var later_label = false;
        var value = false;
        if (["bill","gazette","legislation","treaty"].indexOf(Item.type) > -1) {
            
            // Extract and assemble
            item.force_pluralism = 0;
            if (!item.label) {
                item.label = "page"
            }
            var loci = ["section","","",""];
            var split;
            if (Item.section) {
                // If section starts with a term, set that in sec_label, otherwise set "section" there
                // Set remainder of section value in sec_label
                splt = Item.section.replace(/^\s+/,"").replace(/\s+$/, "").split(/\s+/);
                if (CSL.STATUTE_SUBDIV_STRINGS[splt[0]]) {
                    loci[0] = " " + splt[0] + " ";
                    loci[1] = splt.slice(1).join(" ");
                } else {
                    loci[0] = " sec. ";
                    loci[1] = splt.slice(0).join(" ");
                }
            } else {
                if (this.opt.development_extensions.clobber_locator_if_no_statute_section) {
                    item.locator = undefined;
                    item.label = undefined;
                }
            }

            if (item.locator) {
                
                // If locator starts with a term, set that in loc_label, otherwise set item.label
                // Set remainder of locator value in loc_locator
                var splt = item.locator.replace(/^\s+/,"").replace(/\s+$/, "").split(/\s+/);
                if (CSL.STATUTE_SUBDIV_STRINGS[splt[0]]) {
                    loci[2] = " " + splt[0] + " ";
                    loci[3] = splt.slice(1).join(" ");
                } else if (item.label) {
                    loci[2] = " " + CSL.STATUTE_SUBDIV_STRINGS_REVERSE[item.label] + " ";
                    loci[3] = splt.slice(0).join(" ");
                } else {
                    loci[3] = splt.join(" ")
                }
                if (loci[3] && loci[3].slice(0,1) === "&") {
                    loci[3] = " " + loci[3];
                }
            }
            
            // Normalize

            if (!loci[2]) {
                // If not loc_label, set loc_label to sec_label
                loci[2] = loci[0];
            }
            if (loci[3]) {
                if (loci[3].match(/^[^0-9a-zA-Z]/)) {
                    // If loc_locator and loc_locator starts with non-[a-zA-Z0-9], set loc_label to nil
                    var loclst = loci[3].split(/\s+/);
                    if (loci[0] === loci[2] && loclst[1] && !CSL.STATUTE_SUBDIV_STRINGS[loclst[1].replace(/\s+/, "").replace(/\s+/, "")]) {
                        item.force_pluralism = 1;
                    }
                    loci[2] = "";
                }
            } else {
                loci[2] = "";
            }
            if (!loci[1]) {
                // If not sec_locator, set sec_label to false
                loci[0] = "";
            }
            // Join list with ""
            var value = loci.join("");
            // Strip
            value = value.replace(/^\s+/,"").replace(/\s+$/, "");
            
            // Parse, store item.label, and evaluate for pluralism

            if (value) {
                splt = value.split(/\s+/);
                if (CSL.STATUTE_SUBDIV_STRINGS[splt[0]]) {
                    // Evaluate pluralism here
                    // (force plural if multiple first-occurring labels)
                    var has_other = false;
                    for (var j = splt.length - 2; j > 0; j += -2) {
                        if (splt[j] === splt[0]) {
                            item.force_pluralism = 1;
                            // Remove embedded labels that match top-level label
                            splt = splt.slice(0,j).concat(splt.slice(j + 1));
                        }
                    }
                    item.label = CSL.STATUTE_SUBDIV_STRINGS[splt[0]];
                    item.locator = splt.slice(1).join(" ");
                    if (item.force_pluralism === 0) {
                        delete item.force_pluralism;
                    }
                } else {
                    item.locator = splt.slice(0).join(" ");
                }
            }
        }
    }
}


CSL.Engine.prototype.setNumberLabels = function (Item) {
    if (Item.number
        && ["bill", "gazette", "legislation", "treaty"].indexOf(Item.type) > -1
        && this.opt.development_extensions.static_statute_locator
        && !this.tmp.shadow_numbers["number"]) {
        
        this.tmp.shadow_numbers["number"] = {};
        this.tmp.shadow_numbers["number"].values = [];
        this.tmp.shadow_numbers["number"].plural = 0;
        this.tmp.shadow_numbers["number"].numeric = false;
        this.tmp.shadow_numbers["number"].label = false;
        
        // Labels embedded in number variable
        var value = "" + Item.number;
        value = value.replace("\\", "", "g");
        // Get first word, parse out labels only if it parses
        var firstword = value.split(/\s/)[0];
        var firstlabel = CSL.STATUTE_SUBDIV_STRINGS[firstword];
        if (firstlabel) {
            // Get list and match
            var m = value.match(CSL.STATUTE_SUBDIV_GROUPED_REGEX);
            var splt = value.split(CSL.STATUTE_SUBDIV_PLAIN_REGEX);
            if (splt.length > 1) {
                // Convert matches to localized form
                var lst = [];
                for (var j=1, jlen=splt.length; j < jlen; j += 1) {
                    var subdiv = m[j - 1].replace(/^\s*/, "");
                    //subdiv = this.getTerm(CSL.STATUTE_SUBDIV_STRINGS[subdiv]);
                    lst.push(subdiv.replace("sec.", "Sec.").replace("ch.", "Ch."));
                    lst.push(splt[j].replace(/\s*$/, "").replace(/^\s*/, ""));
                }
                // Preemptively save to shadow_numbers
                value = lst.join(" ");
            } else {
                value = splt[0];
            }
            this.tmp.shadow_numbers["number"].values.push(["Blob", value, false]);
            this.tmp.shadow_numbers["number"].numeric = false;
        } else {
            this.tmp.shadow_numbers["number"].values.push(["Blob", value, false]);
            this.tmp.shadow_numbers["number"].numeric = true;
        }
    }
}
