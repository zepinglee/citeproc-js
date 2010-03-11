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

function pointedStickInnerHtml(elementid,content){
	if (document.getElementById && !document.all){
		var rng = document.createRange();
		var el = document.getElementById(elementid);
		rng.setStartBefore(el);
		var htmlFrag = rng.createContextualFragment(content);
		while (el.hasChildNodes())
			el.removeChild(el.lastChild);
		el.appendChild(htmlFrag);
	}
}
var insert = function(){
	var sys = new Sys();
	var citeproc = new CSL.Engine(sys,chicago_author_date);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	var output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("chicago_author_date",output);
	}

	citeproc = new CSL.Engine(sys,chicago_fullnote_bibliography);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("chicago_fullnote_bibliography",output);
	}

	citeproc = new CSL.Engine(sys,ieee);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("ieee",output);
	}

	citeproc = new CSL.Engine(sys,chicago_fullnote_bibliography2);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("chicago_fullnote_bibliography2",output);
	}

};
