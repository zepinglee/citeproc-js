/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights Reserved.
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
 */

CSL.Node["else-if"] = {
	//
	// these function are the same as those in if, might just clone
	build: function (state, target) {
		var func, tryposition;
		if (this.tokentype === CSL.START) {
			if ("number" === typeof this.strings.position) {
				tryposition = this.strings.position;
				//
				// c&p from node_if
				//
				func = function (state, Item, item) {
					if (item && "undefined" === typeof item.position) {
						item.position = 0;
					}
					if (item && typeof item.position === "number") {
						if (item.position === 0 && tryposition === 0) {
							return true;
						} else if (tryposition > 0 && item.position >= tryposition) {
							return true;
						}
					} else if (tryposition === 0) {
						return true;
					}
					return false;
				};
				this.tests.push(func);
			}
			if (this.strings["near-note-distance-check"]) {
				func = function (state, Item, item) {
					if (item && item["near-note"]) {
						return true;
					}
					return false;
				};
				this.tests.push(func);
			}
			if (! this.evaluator) {
				//
				// cut and paste of "any"
				this.evaluator = state.fun.match.any;
			}
		}
		if (this.tokentype === CSL.END) {
			func = function (state, Item) {
				var next = this[state.tmp.jump.value()];
				return next;
			};
			this.execs.push(func);
		}
		target.push(this);
	},
	configure: function (state, pos) {
		if (this.tokentype === CSL.START) {
			// jump index on failure
			this.fail = state.configure.fail.slice(-1)[0];
			this.succeed = this.next;
			state.configure.fail[(state.configure.fail.length - 1)] = pos;
		} else {
			// jump index on success
			this.succeed = state.configure.succeed.slice(-1)[0];
			this.fail = this.next;
		}
	}
};

