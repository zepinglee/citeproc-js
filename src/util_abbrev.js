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
CSL.Abbrev = function(){
	this.journal = new Object();
	this.series = new Object();
	this.institution = new Object();
	this.authority = new Object();
	this.hereinafter = new Object();
	this.abbreviations = "default";
};

CSL.Abbrev.prototype.output = function(state,value,token_short,token_long,use_fallback){
	var basevalue = state.getTextSubField( value,"default-locale",true);
	var shortvalue = state.abbrev.institution[value];
	if (shortvalue){
		state.output.append(shortvalue,token_short);
	} else {
		if (use_fallback){
			state.output.append(value,token_long);
		};
		print("UNKNOWN ABBREVIATION FOR: "+value);
	};
};

CSL.Abbrev.prototype.getOutputFunc = function(token,varname,vartype,altvar){

	return function(state,Item){
		var basevalue = state.getTextSubField( Item[varname],"default-locale",true);
		var value = "";
		if (state.abbrev[vartype]){
			if (state.abbrev[vartype][basevalue]){
				value = state.abbrev[vartype][ basevalue ];
			} else {
				print("UNKNOWN ABBREVIATION FOR ... "+basevalue );		}
		};
		if (!value && Item[altvar]){
			value = Item[altvar];
		};
		if (!value){
			value = basevalue;
		};
		state.output.append(value,token);
	};
};
