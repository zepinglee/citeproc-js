/*
 * Copyright (c) 2009 and 2010 Frank G. Bennett, Jr. All Rights
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

CSL.Node.names = {
	build: function (state, target) {
		var debug, func, len, pos, attrname;
		debug = false;
		// CSL.debug = print;
		
		var debug = false;
		if (this.tokentype === CSL.START || this.tokentype === CSL.SINGLETON) {
			CSL.Util.substituteStart.call(this, state, target);
			state.build.substitute_level.push(1);
			
			state.fixOpt(this, "names-delimiter", "delimiter");

			// init names
			func = function (state, Item, item) {
				state.parallel.StartVariable("names");
				state.nameOutput = new CSL.NameOutput(state, Item, item, this.variables);
				state.nameOutput.names = this;
			};
			this.execs.push(func);
		}
		
		if (this.tokentype === CSL.START) {
			// init can substitute
			func = function (state, Item) {
				state.tmp.can_substitute.push(true);
			};
			this.execs.push(func);
		};
		
		if (this.tokentype === CSL.END) {
			func = function (state, Item, item) {
				state.nameOutput.outputNames();
			};
			this.execs.push(func);
		}

		if (this.tokentype === CSL.END) {
			// unsets
			func = function (state, Item) {
				if (!state.tmp.can_substitute.pop()) {
					state.tmp.can_substitute.replace(false, CSL.LITERAL);
				}
				
				state.parallel.CloseVariable("names");

				state.tmp.can_block_substitute = false;
			};
			this.execs.push(func);
		}
		target.push(this);

		if (this.tokentype === CSL.END || this.tokentype === CSL.SINGLETON) {
			state.build.substitute_level.pop();
			CSL.Util.substituteEnd.call(this, state, target);
		}
	},

	//
	// XXXXX: in configure phase, set a flag if this node contains an
	// institution node.  If it does, then each nameset will be filtered into an
	 // array containing two lists, to be run separately and joined
	// in the end.  If we don't, the array will contain only one list.
	//
	configure: function (state, pos) {
		if ([CSL.SINGLETON, CSL.START].indexOf(this.tokentype) > -1) {
			if (state.build.has_institution) {
				this.strings["has-institution"] = true;
				state.build.has_institution = false;
			}
		}
	}
};
