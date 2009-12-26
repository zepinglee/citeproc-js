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
dojo.provide("csl.util_names");


/**
 * Helper functions for constructing names and namesets.
 * @namespace Name construction utilities
 */
CSL.Util.Institutions = new function(){};

/**
 * Build a set of names, less any label or et al. tag
 */
CSL.Util.Institutions.outputInstitutions = function(state,display_names){

	state.output.openLevel("institution");
	for each (var name in display_names){
		var institution = state.output.getToken("institution");
		var value = name.literal;
		if (state.abbrev.institution[value]){
			var token_long = state.output.mergeTokenStrings("institution-long","institution-if-short");
		} else {
			var token_long = state.output.getToken("institution-long");
		}
		var token_short = state.output.getToken("institution-short");
		var parts = institution.strings["institution-parts"];
		if ("short" == parts){
			state.abbrev.output(state,value,token_short,token_long,true);
		} else if ("short-long" == parts) {
			state.abbrev.output(state,value,token_short);
			state.output.append(value,token_long);
		} else if ("long-short" == parts){
			state.output.append(value,token_long);
			state.abbrev.output(state,value,token_short);
		} else {
			state.output.append(value,token_long);
		};
	};
	state.output.closeLevel(); // institution
};
