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
CSL.cloneAmbigConfig = function(config){
	var ret = new Object();
	ret["names"] = new Array();
	ret["givens"] = new Array();
	ret["year_suffix"] = false;
	ret["disambiguate"] = false;
	for (var i in config["names"]){
		var param = config["names"][i];
		ret["names"][i] = param;
	}
	for (var i in config["givens"]){
		var param = new Array();
		for (var j in config["givens"][i]){
			// condition at line 312 of disambiguate.js protects against negative
			// values of j
			param.push(config["givens"][i][j]);
		};
		ret["givens"].push(param);
	};
	ret["year_suffix"] = config["year_suffix"];
	ret["disambiguate"] = config["disambiguate"];
	return ret;
};



