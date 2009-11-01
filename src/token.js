/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
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
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
if(dojo){ 
    dojo.provide("csl.token");
};
if (!CSL) {
   load("./src/csl.js");
}

/**
 * Style token.
 * <p>This class provides the tokens that define
 * the runtime version of the style.  The tokens are
 * instantiated by {@link CSL.Core.Build}, but the token list
 * must be post-processed with
 * {@link CSL.Core.Configure} before it can be used to generate
 * citations.</p>
 * @param {String} name The node name represented by this token.
 * @param {Int} tokentype A flag indicating whether this token
 * marks the start of a node, the end of a node, or is a singleton.
 * @class
 */
CSL.Factory.Token = function(name,tokentype){
	/**
	 * Name of the element.
	 * <p>This corresponds to the element name of the
	 * relevant tag in the CSL file.
	 */
	this.name = name;
	/**
	 * Strings and other static content specific to the element.
	 */
	this.strings = new Object();
	this.strings.delimiter = "";
	this.strings.prefix = "";
	this.strings.suffix = "";
	/**
	 * Formatting parameters.
	 * <p>This is a placeholder at instantiation.  It is
	 * replaced by the result of {@link CSL.Factory.setDecorations}
	 * when the tag is created and configured during {@link CSL.Core.Build}
	 * by {@link CSL.Factory.XmlToToken}.  The parameters for particular
	 * formatting attributes are stored as string arrays, which
	 * map to formatting functions at runtime,
	 * when the output format is known.  Note that the order in which
	 * parameters are registered is fixed by the constant
	 * {@link CSL.FORMAT_KEY_SEQUENCE}.
	 */
	this.decorations = false;
	this.variables = [];
	/**
	 * Element functions.
	 * <p>Functions implementing the styling behaviour of the element
	 * are pushed into this array in the {@link CSL.Core.Build} phase.
	 */
	this.execs = new Array();
	/**
	 * Token type.
	 * <p>This is a flag constant indicating whether the token represents
	 * a start tag, an end tag, or is a singleton.</p>
	 */
	this.tokentype = tokentype;
	/**
	 * Condition evaluator.
	 * <p>This is a placeholder that receives a single function, and is
	 * only relevant for a conditional branching tag (<code>if</code> or
	 * <code>else-if</code>).  The function implements the argument to
	 * the <code>match=</code> attribute (<code>any</code>, <code>all</code>
	 * or <code>none</code>), by executing the functions registered in the
	 * <code>tests</code> array (see below), and reacting accordingly.  This
	 * function is invoked by the execution wrappers found in
	 * {@link CSL.Engine}.</p>
	 */
	this.evaluator = false;
	/**
	 * Conditions.
	 * <p>Functions that evaluate to true or false, implementing
	 * various posisble attributes to the conditional branching tags,
	 * are registered here during {@link CSL.Core.Build}.
	 * </p>
	 */
	this.tests = new Array();
	/**
	 * Jump point on success.
	 * <p>This holds the list jump point to be used when the
	 * <code>evaluator</code> function of a conditional tag
	 * returns true (success).  The jump index value is set during the
	 * back-to-front token pass performed during {@link CSL.Core.Configure}.
	 * </p>
	 */
	this.succeed = false;
	/**
	 * Jump point on failure.
	 * <p>This holds the list jump point to be used when the
	 * <code>evaluator</code> function of a conditional tag
	 * returns false (failure).  Jump index values are set during the
	 * back-to-front token pass performed during {@link CSL.Core.Configure}.
	 * </p>
	 */
	this.fail = false;
	/**
	 * Index of next token.
	 * <p>This holds the index of the next token in the
	 * token list, which is the default "jump-point" for ordinary
	 * processing.  Jump index values are set during the
	 * back-to-front token pass performed during {@link CSL.Core.Configure}.
	 * </p>
	 */
	this.next = false;
};
