/*
 * Copyright (c) 2009, 2010 and 2011 Frank G. Bennett, Jr. All Rights
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
 * Sections 14 and 15 have been added to cover use of software over a
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
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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

/*global CSL: true */

CSL.Node.group = {
    build: function (state, target) {
        var func, execs;
        if (this.tokentype === CSL.START) {

            CSL.Util.substituteStart.call(this, state, target);
            if (state.build.substitute_level.value()) {
                state.build.substitute_level.replace((state.build.substitute_level.value() + 1));
            }
            // fieldcontentflag
            func = function (state, Item) {
                // (see below)
                state.tmp.term_sibling.push([false, false, false], CSL.LITERAL);
            };
            this.execs.push(func);
            // newoutput
            func = function (state, Item) {
                state.output.startTag("group", this);
            };
            //
            // Paranoia.  Assure that this init function is the first executed.
            execs = [];
            execs.push(func);
            this.execs = execs.concat(this.execs);

            // "Special handling" for nodes that contain only
            // publisher and place, with no affixes. For such
            // nodes only, parallel publisher/place pairs
            // will be parsed out and properly joined, piggybacking on
            // join parameters set on cs:citation or cs:bibliography.
            if (this.strings["has-publisher-and-publisher-place"]) {
                // Set the handling function only if name-delimiter
                // is set on the parent cs:citation or cs:bibliography
                // node.
                state.build["publisher-special"] = true;
                if ("string" === typeof state[state.build.root].opt["name-delimiter"]) {
                    // Pass variable string values to the closing
                    // tag via a global, iff they conform to expectations.
                    func = function (state, Item) {
                        if (Item.publisher && Item["publisher-place"]) {
                            var publisher_lst = Item.publisher.split(/;\s*/);
                            var publisher_place_lst = Item["publisher-place"].split(/;\s*/);
                            if (publisher_lst.length > 1
                                && publisher_lst.length === publisher_place_lst.length) {
                                
                                state.publisherOutput = new CSL.PublisherOutput(state);
                                state.publisherOutput["publisher-list"] = publisher_lst;
                                state.publisherOutput["publisher-place-list"] = publisher_place_lst;
                                state.publisherOutput.group_tok = this;
                            }
                        }
                    };
                    this.execs.push(func);
                }
            }
        } else {

            // Unbundle and print publisher lists
            // Same constraints on creating the necessary function here
            // as above. The full content of the group formatting token
            // is apparently not available on the closing tag here,
            // hence the global flag on state.build.
            if (state.build["publisher-special"]) {
                state.build["publisher-special"] = false;
                if ("string" === typeof state[state.build.root].opt["name-delimiter"]) {
                    func = function (state, Item) {
                        if (state.publisherOutput) {
                            state.publisherOutput.name_delimiter = state[state.build.root].opt["name-delimiter"];
                            state.publisherOutput.delimiter_precedes_last = state[state.build.root].opt["delimiter-precedes-last"];
                            state.publisherOutput.and = state[state.build.root].opt.and;
                            state.publisherOutput.render();
                            state.publisherOutput = false;
                        }
                    };
                    this.execs.push(func);
                }
            }
            
            // quashnonfields
            func = function (state, Item) {
                var flag = state.tmp.term_sibling.pop();
                
                state.output.endTag();
                //
                // 0 marks an intention to render a term or value
                // 1 marks an attempt to render a variable
                // 2 marks an actual variable rendering
                //
                var upperflag = state.tmp.term_sibling.value();
                // print("leaving with flags: "+flag+" (stack length: "+ (state.tmp.term_sibling.mystack.length + 1) +")");
                if (flag[1]) {
                    state.tmp.term_sibling.value()[1] = true;
                }
                if (flag[2] || (flag[0] && !flag[1])) {
                    state.tmp.term_sibling.value()[2] = true;
                } else {
                    if (state.output.current.value().blobs) {
                        state.output.current.value().blobs.pop();
                    }
                }
            };
            this.execs.push(func);
            
            // mergeoutput
            //func = function (state, Item) {
            //    state.output.endTag();
            //};
            //this.execs.push(func);

        }
        target.push(this);

        if (this.tokentype === CSL.END) {
            if (state.build.substitute_level.value()) {
                state.build.substitute_level.replace((state.build.substitute_level.value() - 1));
            }
            CSL.Util.substituteEnd.call(this, state, target);
        }
    }
};

