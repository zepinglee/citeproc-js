/*global CSL: true */

CSL.Node.group = {
    build: function (state, target) {
        var func, execs;
        if (this.tokentype === CSL.START) {
            CSL.Util.substituteStart.call(this, state, target);
            if (state.build.substitute_level.value()) {
                state.build.substitute_level.replace((state.build.substitute_level.value() + 1));
            }
            if (!this.juris) {
                target.push(this);
            }

            // newoutput
            func = function (state, Item) {
                state.output.startTag("group", this);
                if (state.tmp.group_context.mystack.length) {
                    state.output.current.value().parent = state.tmp.group_context.value()[4];
                }


                // fieldcontextflag
                var label_form = state.tmp.group_context.value()[5];
                if (!label_form && this.strings.label_form_override) {
                    label_form = this.strings.label_form_override;
                }
                state.tmp.group_context.push([false, false, false, false, state.output.current.value(), label_form, this.strings.set_parallel_condition], CSL.LITERAL);
                // XXX
                // XXX Oops is deprecated.
                // XXX
                // Oops is triggered in two situations:
                //   (1) Where rendering of content fails; and
                //   (2) Where content is rendered, but the rendered
                //       content within the group is entirely removed
                //       before the output queue is flattened.
                // The "this" value above should be used to grab
                // the target of the "oops" delimiter in both cases.
                if (this.strings.oops) {
                    state.tmp.group_context.value()[3] = this.strings.oops;
                }
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
                // Pass variable string values to the closing
                // tag via a global, iff they conform to expectations.
                func = function (state, Item) {
                    if (this.strings["subgroup-delimiter"]
                        && Item.publisher && Item["publisher-place"]) {
                        var publisher_lst = Item.publisher.split(/;\s*/);
                        var publisher_place_lst = Item["publisher-place"].split(/;\s*/);
                        if (publisher_lst.length > 1
                            && publisher_lst.length === publisher_place_lst.length) {
                            state.publisherOutput = new CSL.PublisherOutput(state, this);
                            state.publisherOutput["publisher-list"] = publisher_lst;
                            state.publisherOutput["publisher-place-list"] = publisher_place_lst;
                        }
                    }
                };
                this.execs.push(func);
            }

            if (this.juris) {
                // "Special handling" for jurisdiction macros
                // We try to instantiate these as standalone token lists.
                // If available, the token list is executed,
                // the result is written directly into output,
                // and control returns here.

                // So we'll have something like this:
                // * expandMacro() in util_node.js flags juris- macros
                //   on build. [DONE]
                // * Those are picked up here, and
                //   - A runtime function attempts to fetch and instantiate
                //     the macros in separate token lists under a segment
                //     opened for the jurisdiction. We assume that the
                //     jurisdiction has a full set of macros. That will need
                //     to be enforced by validation. [DONE HERE, function is TODO]
                //   - Success or failure is marked in a runtime flag object
                //     (in citeproc.opt). [DONE]
                //   - After the instantiation function comes a test, for
                //     juris- macros only, which either runs diverted code,
                //     or proceeds as per normal through the token list. [TODO]
                // I think that's all there is to it.
                
                // Code for fetching an instantiating?


                for (var x=0,xlen=target.length;x<xlen;x++) {
                    var token = target[x];
                }

                var choose_start = new CSL.Token("choose", CSL.START);
                CSL.Node.choose.build.call(choose_start, state, target);
                
                var if_start = new CSL.Token("if", CSL.START);

                func = function (macroName) {
                    return function (Item) {
                        if (!state.sys.retrieveStyleModule || !CSL.MODULE_MACROS[macroName] || !Item.jurisdiction) return false;
                        var jurisdictionList = state.getJurisdictionList(Item.jurisdiction);
                        // Set up a list of jurisdictions here, we will reuse it
                        if (!state.opt.jurisdictions_seen[jurisdictionList[0]]) {
                            var res = state.retrieveAllStyleModules(jurisdictionList);
                            // Okay. We have code for each of the novel modules in the
                            // hierarchy. Load them all into the processor.
                            for (var jurisdiction in res) {
                                var macroCount = 0;
                                state.juris[jurisdiction] = {};
                                var myXml = CSL.setupXml(res[jurisdiction]);
                                var myNodes = myXml.getNodesByName(myXml.dataObj, "law-module");
                                for (var i=0,ilen=myNodes.length;i<ilen;i++) {
                                    var myTypes = myXml.getAttributeValue(myNodes[i],"types");
                                    if (myTypes) {
                                        state.juris[jurisdiction].types = {};
                                        myTypes =  myTypes.split(/\s+/);
                                        for (var j=0,jlen=myTypes.length;j<jlen;j++) {
                                            state.juris[jurisdiction].types[myTypes[j]] = true;
                                        }
                                    }
                                }
                                if (!state.juris[jurisdiction].types) {
                                    state.juris[jurisdiction].types = CSL.MODULE_TYPES;
                                }
                                var myNodes = myXml.getNodesByName(myXml.dataObj, "macro");
                                for (var i=0,ilen=myNodes.length;i<ilen;i++) {
                                    var myName = myXml.getAttributeValue(myNodes[i], "name");
                                    if (!CSL.MODULE_MACROS[myName]) {
                                        CSL.debug("CSL: skipping non-modular macro name \"" + myName + "\" in module context");
                                        continue;
                                    };
                                    macroCount++;
                                    state.juris[jurisdiction][myName] = [];
                                    // Must use the same XML parser for style and modules.
                                    state.buildTokenLists(myNodes[i], state.juris[jurisdiction][myName]);
                                    state.configureTokenList(state.juris[jurisdiction][myName]);
                                }
                                if (macroCount < Object.keys(state.juris[jurisdiction].types).length) {
                                    throw "CSL ERROR: Incomplete jurisdiction style module for: " + jurisdiction;
                                }
                            }
                        }
                        // Identify the best jurisdiction for the item and return true, otherwise return false
                        for (var i=0,ilen=jurisdictionList.length;i<ilen;i++) {
                            var jurisdiction = jurisdictionList[i];
                            if(state.juris[jurisdiction] && state.juris[jurisdiction].types[Item.type]) {
                                Item["best-jurisdiction"] = jurisdiction;
                                return true;
                            }
                        }
                        return false;
                    };
                }(this.juris);
                
                if_start.tests.push(func);
                if_start.test = state.fun.match.any(if_start, state, if_start.tests);
                target.push(if_start);
                var text_node = new CSL.Token("text", CSL.SINGLETON);
                func = function (state, Item, item) {
                    // This will run the juris- token list.
                    var next = 0;
                    if (state.juris[Item["best-jurisdiction"]][this.juris]) {
                        while (next < state.juris[Item["best-jurisdiction"]][this.juris].length) {
                            next = CSL.tokenExec.call(state, state.juris[Item["best-jurisdiction"]][this.juris][next], Item, item);
                        }
                        CSL.runAltMacro(state, this.alt_macro, Item, item);
                    }
                }
                text_node.juris = this.juris;
                text_node.alt_macro = this.alt_macro;
                text_node.execs.push(func);
                target.push(text_node);

                var if_end = new CSL.Token("if", CSL.END);
                CSL.Node.if.build.call(if_end, state, target);
                var else_start = new CSL.Token("else", CSL.START);
                CSL.Node.else.build.call(else_start, state, target);
            }
        }

        if (this.tokentype === CSL.END) {

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
                            state.publisherOutput.render();
                            state.publisherOutput = false;
                        }
                    };
                    this.execs.push(func);
                }
            }
            
            // quashnonfields
            func = function (state, Item) {
                var flag = state.tmp.group_context.pop();

                state.output.endTag();
                //
                // 0 marks an intention to render a term or value
                // 1 marks an attempt to render a variable
                // 2 marks an actual variable rendering
                // 3 is an oops substitute string, rendered when nothing else does
                //
                var upperflag = state.tmp.group_context.value();
                // print("leaving with flags: "+flag+" (stack length: "+ (state.tmp.group_context.mystack.length + 1) +")");
                if (flag[1]) {
                    state.tmp.group_context.value()[1] = true;
                }
                if (flag[2] || (flag[0] && !flag[1])) {
                    if (!this.isJurisLocatorLabel) {
                        state.tmp.group_context.value()[2] = true;
                    }
                    var blobs = state.output.current.value().blobs;
                    var pos = state.output.current.value().blobs.length - 1;
                    if (!state.tmp.just_looking && "undefined" !== typeof flag[6]) {
                        var parallel_condition_object = {
                            blobs: blobs,
                            conditions: flag[6],
                            id: Item.id,
                            pos: pos
                        };
                        state.parallel.parallel_conditional_blobs_list.push(parallel_condition_object);
                    }
                } else {
                    if (state.output.current.value().blobs) {
                        state.output.current.value().blobs.pop();
                    }
                    // Oops. Replace the delimiter TWO levels above the
                    // current level with the oops string value. Used for
                    // very rare cases in which the ACTUAL rendering/non-rendering
                    // of a name value (not the presence/non-presence of field
                    // content) alters delimiter joins.
                    if (state.tmp.group_context.value()[3]) {
                        state.output.current.mystack[state.output.current.mystack.length - 2].strings.delimiter = state.tmp.group_context.value()[3];
                    }
                }
            };
            this.execs.push(func);
            
            if (this.juris) {
                var else_end = new CSL.Token("else", CSL.END);
                CSL.Node.else.build.call(else_end, state, target);
                var choose_end = new CSL.Token("choose", CSL.END);
                CSL.Node.choose.build.call(choose_end, state, target);
            }
        }

        if (this.tokentype === CSL.END) {
            if (!this.juris) {
                target.push(this);
            }
            if (state.build.substitute_level.value()) {
                state.build.substitute_level.replace((state.build.substitute_level.value() - 1));
            }
            CSL.Util.substituteEnd.call(this, state, target);
        }
    }
};

