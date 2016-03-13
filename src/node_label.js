/*global CSL: true */

CSL.Node.label = {
    build: function (state, target) {
        var debug = false;
        
        if (this.strings.term) {
            // Non-names labels
            var plural = false;
            if (!this.strings.form) {
                //this.strings.form = "long";
            }
            var func = function (state, Item, item) {
                // Must accomplish this without touching strings
                // shared with the calling application: "sub verbo"
                // and "sub-verbo" must both pass, as they stand.
                //if (item && item.label === "sub verbo") {
                //    item.label = "sub-verbo";
                //}
                // This is abstracted away, because the same
                // logic must be run in cs:names.
                var termtxt = CSL.evaluateLabel(this, state, Item, item);
                if (item && this.strings.term === "locator") {

                    state.parallel.StartVariable("label");
                    state.parallel.AppendToVariable(item.label);

                    item.section_form_override = this.strings.form;

                }
                if (termtxt) {
                    state.tmp.group_context.tip.term_intended = true;
                    //if (!state.tmp.just_looking) {
                    //    print("TERM INTENDED");
                    //}
                }
                if (state.tmp.group_context.tip.condition) {
                    if (state.tmp.group_context.tip.condition.test === "label-empty-or-alpha") {
                        if (!termtxt || termtxt.match(/^[a-zA-Z]/)) {
                            state.tmp.group_context.tip.force_suppress = false;
                        } else {
                            state.tmp.group_context.tip.force_suppress = true;
                        }
                        if (state.tmp.group_context.tip.condition.not) {
                            state.tmp.group_context.tip.force_suppress = !state.tmp.group_context.tip.force_suppress;
                        }
                    }
                    //if (!state.tmp.just_looking) {
                    //    print("  condition seen");
                    //}
                }
                if (termtxt.indexOf("%s") === -1) {
                    // Suppress output here if we have an embedded term
                    state.output.append(termtxt, this);
                }
                if (item && this.strings.term === "locator") {
                    state.parallel.CloseVariable();
                }
            };
            this.execs.push(func);
        } else {
            // Names labels
            // Picked up in names END
            var namevars = state.build.names_variables.slice(-1)[0];
            if (!state.build.name_label) {
                state.build.name_label = {};
            }
            for (var i = 0, ilen = namevars.length; i < ilen; i += 1) {
                if (!state.build.name_label[namevars[i]]) {
                    state.build.name_label[namevars[i]] = {};
                }
            }
            if (!state.build.name_flag) {
                for (var i = 0, ilen = namevars.length; i < ilen; i += 1) {
                    state.build.name_label[namevars[i]].before = this;
                }
            } else {
                for (var i = 0, ilen = namevars.length; i < ilen; i += 1) {
                    state.build.name_label[namevars[i]].after = this;
                }
            }
        }
        target.push(this);
    }
};
