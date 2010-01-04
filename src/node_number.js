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
CSL.Node.number = new function(){
	this.build = build;
	function build(state,target){
		CSL.Util.substituteStart.call(this,state,target);
		//
		// This should push a rangeable object to the queue.
		//
		if (this.strings.form == "roman"){
			this.formatter = state.fun.romanizer;
		} else if (this.strings.form == "ordinal"){
			this.formatter = state.fun.ordinalizer;
		} else if (this.strings.form == "long-ordinal"){
			this.formatter = state.fun.long_ordinalizer;
		}
		//
		// Whether we actually stick a number object on
		// the output queue depends on whether the field
		// contains a pure number.
		//
		var push_number_or_text = function(state,Item){
			var varname = this.variables[0];
			state.parallel.StartVariable(this.variables[0]);
			state.parallel.AppendToVariable(Item[this.variables[0]]);

			if (varname == "page-range" || varname == "page-first"){
				varname = "page";
			};
			var num = Item[varname];
			if ("undefined" != typeof num) {
				if (this.variables[0] == "page-first"){
					var m = num.split(/\s*(&|,|-)\s*/);
					num = m[0];
				}
				var m = num.match(/\s*([0-9]+).*/);
				if (m){
					num = parseInt( m[1], 10);
					var number = new CSL.NumericBlob( num, this );
					state.output.append(number,"literal");
				} else {
					state.output.append(num, this);
				};
			};
			state.parallel.CloseVariable();
		};
		this["execs"].push(push_number_or_text);

		target.push(this);
		CSL.Util.substituteEnd.call(this,state,target);
	};
};


