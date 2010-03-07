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

CSL.Node.group = {
	build: function (state, target, quashquash) {
		var func, execs;
		if (this.tokentype === CSL.START) {
			CSL.Util.substituteStart.call(this, state, target);
			if (state.build.substitute_level.value()) {
				state.build.substitute_level.replace((state.build.substitute_level.value() + 1));
			}
			if (!quashquash || true) {
				// fieldcontentflag
				func = function (state, Item) {
					state.tmp.term_sibling.push(undefined, CSL.LITERAL);
					//print("++ SET: "+typeof state.tmp.term_sibling.value()+" ["+state.tmp.term_sibling.mystack.length+"]");
				};
				this.execs.push(func);
			}
			// newoutput
			func = function (state, Item) {
				state.output.startTag("group", this);
			};
			//
			// Paranoia.  Assure that this init function is the first executed.
			execs = [];
			execs.push(func);
			this.execs = execs.concat(this.execs);

		} else {

			if (!quashquash || true) {
				// quashnonfields
				func = function (state, Item) {
					var flag = state.tmp.term_sibling.value();
					//if (false === flag) {
						//print("X"+state.output.current.value().strings.prefix+"X");
						//state.output.clearlevel();
						//print(state.output.queue[0].blobs[2].strings.prefix)
					//}

					state.output.endTag();
					//print("-- QUASHER: "+typeof state.tmp.term_sibling.value()+" ["+state.tmp.term_sibling.mystack.length+"]");
					if (false === flag) {
						//print("POP!");
						//state.output.current.pop();
						if (state.output.current.value().blobs) {
							//print("pop");
							state.output.current.value().blobs.pop();
							//state.output.formats.pop();
						}
					}
					state.tmp.term_sibling.pop();
					//
					// Heals group quashing glitch with nested groups.
					//
					if ((flag === true || flag === undefined) && state.tmp.term_sibling.mystack.length > 1) {
						state.tmp.term_sibling.replace(true);
					}
				};
				this.execs.push(func);
			}

			// mergeoutput
			//func = function (state, Item) {
			//	state.output.endTag();
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

