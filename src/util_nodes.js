/*global CSL: true */

CSL.tokenExec = function (token, Item, item) {
    // Called on state object
    var next, maybenext, exec, debug;
    debug = false;
    next = token.next;
    maybenext = false;
    //SNIP-START
    if (debug) {
        CSL.debug("---> Token: " + token.name + " (" + token.tokentype + ") in " + this.tmp.area + ", " + this.output.current.mystack.length);
    }
    //SNIP-END

    var record = function (result) {
        if (result) {
            this.tmp.jump.replace("succeed");
            return token.succeed;
        } else {
            this.tmp.jump.replace("fail");
            return token.fail;
        }
    }
    if (token.test) {
        next = record.call(this,token.test(Item, item));
    }
    for (var i=0,ilen=token.execs.length;i<ilen;i++) {
        exec = token.execs[i];
        maybenext = exec.call(token, this, Item, item);
        if (maybenext) {
            next = maybenext;
        }
    }
    //SNIP-START
    if (true) {
        CSL.debug(token.name + " (" + token.tokentype + ") ---> done");
    }
    //SNIP-END
    return next;
};

/**
 * Macro expander.
 * <p>Called on the state object.</p>
 */
CSL.expandMacro = function (macro_key_token, target) {
    var mkey, start_token, key, end_token, navi, macro_nodes, newoutput, mergeoutput, end_of_macro, func;

    mkey = macro_key_token.postponed_macro;

    //
    // Here's where things change pretty dramatically.  We pull
    // macros out of E4X directly, and process them using the
    // same combination of tree walker and tag processor that
    // led us here, but with a different queue.
    //
    // Xml: get list of nodes by attribute match
    //
    var hasDate = false;
    var macroid = false;
    macro_nodes = this.sys.xml.getNodesByName(this.cslXml, 'macro', mkey);
    if (macro_nodes.length) {
        macroid = this.sys.xml.getAttributeValue(macro_nodes[0],'cslid');
        hasDate = this.sys.xml.getAttributeValue(macro_nodes[0], "macro-has-date");
    }
    if (hasDate) {
        mkey = mkey + "@" + this.build.current_default_locale;
        func = function (state, Item) {
            if (state.tmp.extension) {
                state.tmp["doing-macro-with-date"] = true;
            }
        };
        macro_key_token.execs.push(func);
    }

    if (this.build.macro_stack.indexOf(mkey) > -1) {
        throw "CSL processor error: call to macro \"" + mkey + "\" would cause an infinite loop";
    } else {
        this.build.macro_stack.push(mkey);
    }

    //
    //
    // (true as the last argument suppresses quashing)
    macro_key_token.name = "group";
    macro_key_token.tokentype = CSL.START;
    macro_key_token.cslid = macroid;

    //if (this.sys.xml.getAttributeValue(macro_nodes[0], "prefer-jurisdiction")) {
    if (CSL.MODULE_MACROS[mkey]) {
        macro_key_token.juris = mkey;
        this.opt.update_mode = CSL.POSITION;
    }

    CSL.Node.group.build.call(macro_key_token, this, target);

    // Node does not exist in the CSL
    if (!this.sys.xml.getNodeValue(macro_nodes)) {
        throw "CSL style error: undefined macro \"" + mkey + "\"";
    }

    // Let's macro
    var mytarget = CSL.getMacroTarget.call(this, mkey);
    if (mytarget) {
        CSL.buildMacro.call(this, mytarget, macro_nodes);
        CSL.configureMacro.call(this, mytarget);
    }
    if (!this.build.extension) {
        var text_node = new CSL.Token("text", CSL.SINGLETON);
        var func = function(macro_name, alt_macro) {
            return function (state, Item, item) {
                var next = 0;
                while (next < state.macros[macro_name].length) {
                    next = CSL.tokenExec.call(state, state.macros[macro_name][next], Item, item);
                }
                var flag = state.tmp.group_context.value();
                if (!flag[2] && alt_macro) {
                    flag[1] = false;
                    var mytarget = CSL.getMacroTarget.call(state, alt_macro);
                    if (mytarget) {
                        var macro_nodes = state.sys.xml.getNodesByName(state.cslXml, 'macro', alt_macro);
                        CSL.buildMacro.call(state, mytarget, macro_nodes);
                        CSL.configureMacro.call(state, mytarget);
                    }
                    var next = 0;
                    while (next < state.macros[alt_macro].length) {
                        next = CSL.tokenExec.call(state, state.macros[alt_macro][next], Item, item);
                    }
                }
            }
        }(mkey, macro_key_token.alt_macro);
        text_node.execs.push(func);
        target.push(text_node);
    }

    // Could also use cloneToken()
    end_of_macro = new CSL.Token("group", CSL.END);
	if (macro_key_token.decorations) {
		end_of_macro.decorations = macro_key_token.decorations.slice();
    }
    if (hasDate) {
        func = function (state, Item) {
            if (state.tmp.extension) {
                state.tmp["doing-macro-with-date"] = false;
            }
        };
        end_of_macro.execs.push(func);
    }
    if (macro_key_token.juris) {
        end_of_macro.juris = mkey;
    }
    if (macro_key_token.alt_macro) {
        end_of_macro.alt_macro = macro_key_token.alt_macro;
    }
    CSL.Node.group.build.call(end_of_macro, this, target);
    this.build.macro_stack.pop();
};

CSL.getMacroTarget = function (mkey) {
    var mytarget;
    if (this.build.extension) {
        mytarget = this[this.build.root + this.build.extension].tokens;
    } else {
        if (!this.macros[mkey]) {
            mytarget = [];
            this.macros[mkey] = mytarget;
        } else {
            mytarget = false;
        }
    }
    return mytarget;
}

CSL.buildMacro = function (mytarget, macro_nodes) {
    var builder = CSL.makeBuilder(this, mytarget);
    var mynode;
    if ("undefined" === typeof macro_nodes.length) {
        mynode = macro_nodes;
    } else {
        mynode = macro_nodes[0];
    }
    builder(mynode);
}

CSL.configureMacro = function (mytarget) {
    if (!this.build.extension) {
        this.configureTokenList(mytarget);
    }
}


/**
 * Convert XML node to token.
 * <p>This is called on an XML node.  After extracting the name and attribute
 * information from the node, it performs three operations.  Attribute information
 * relating to output formatting is stored on the node as an array of tuples,
 * which fixes the sequence of execution of output functions to be invoked
 * in the next phase of processing.  Other attribute information is reduced
 * to functions, and is pushed into an array on the token in no particular
 * order, for later execution.  The element name is used as a key to
 * invoke the relevant <code>build</code> method of the target element.
 * Element methods are defined in {@link CSL.Node}.</p>
 * @param {Object} state  The state object returned by {@link CSL.Engine}.
 * @param {Int} tokentype  A CSL namespace constant (<code>CSL.START</code>,
 * <code>CSL.END</code> or <code>CSL.SINGLETON</code>.
 */
CSL.XmlToToken = function (state, tokentype, explicitTarget) {
    var name, txt, attrfuncs, attributes, decorations, token, key, target;
    name = state.sys.xml.nodename(this);
    //CSL.debug(tokentype + " : " + name);
    if (state.build.skip && state.build.skip !== name) {
        return;
    }
    if (!name) {
        txt = state.sys.xml.content(this);
        if (txt) {
            state.build.text = txt;
        }
        return;
    }
    if (!CSL.Node[state.sys.xml.nodename(this)]) {
        throw "Undefined node name \"" + name + "\".";
    }
    attrfuncs = [];
    attributes = state.sys.xml.attributes(this);
    decorations = CSL.setDecorations.call(this, state, attributes);
    token = new CSL.Token(name, tokentype);
    if (tokentype !== CSL.END || name === "if" || name === "else-if" || name === "layout") {
        //
        // xml: more xml stuff
        //
        for (key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                if (tokentype === CSL.END && key !== "@language" && key !== "@locale") {
                    continue;
                }
                if (attributes.hasOwnProperty(key)) {
                    if (CSL.Attributes[key]) {
                        try {
                            CSL.Attributes[key].call(token, state, "" + attributes[key]);
                        } catch (e) {
                            CSL.error(e);
                            throw "CSL processor error, " + key + " attribute: " + e;
                        }
                    } else {
                        CSL.debug("warning: undefined attribute \""+key+"\" in style");
                    }
                }
            }
        }
        token.decorations = decorations;
    } else if (tokentype === CSL.END && attributes['@variable']) {
        token.hasVariable = true;
    }
    //
    // !!!!!: eliminate diversion of tokens to separate
    // token list (formerly used for reading in macros
    // and terms).
    //
    if (explicitTarget) {
        target = explicitTarget;
    } else {
        target = state[state.build.area].tokens;
    }
    CSL.Node[name].build.call(token, state, target);
};


