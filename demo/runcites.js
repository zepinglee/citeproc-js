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
	} else {
		if (document.getElementById) {
			var el = document.getElementById(elementid);
			el.innerHTML = content;
		}
	}
}

var insertCites = function(cites) {
	var pos, len, data, idx, cite, spannodes, nodes, node, id, ret;
	nodes = [];
	spannodes = document.getElementsByTagName("span");
	for (pos = 0, len = spannodes.length; pos < len; pos += 1) {
		node = spannodes.item(pos);
		if (node.getAttribute("name") !== "citation") {
			continue;
		}
		nodes.push(node);
	}
	for (pos = 0, len = cites.length; pos < len; pos += 1) {
		data = cites[pos];
		idx = data[0];
		cite = data[1];
		id = nodes[idx].id;
		pointedStickInnerHtml(id,cite);
	}
}

var citationSrc1 = {
	"citationItems": [
        {
			id: "ITEM-6",
			label: "page",
			locator: "223"
		}
	],
	"properties": {
		"noteIndex": 1
	}
};

var citationSrc2 = {
	"citationItems": [
        {
			id: "ITEM-6"
		},
        {
			id: "ITEM-10"
		},
        {
			id: "ITEM-11"
		},
        {
			id: "ITEM-12"
		},
        {
			id: "ITEM-6",
			locator: "15",
			prefix:"<i>but see</i>"
		}
	],
	"properties": {
		"noteIndex": 2
	}
};

var citationSrc3 = {
	"citationItems": [
        {
			id: "ITEM-13",
			locator:"90",
			label:"section"
		},
        {
			id: "ITEM-14",
			locator:"7",
			label:"section"
		},
        {
			id: "ITEM-15",
			locator:"731-32",
			label:"page"
		},
        {
			id: "ITEM-16"
		}
	],
	"properties": {
		"noteIndex": 3
	}
};

var citationSrc4 = {
	"citationItems": [
        {
			id: "ITEM-2"
		}
	],
	"properties": {
		"noteIndex": 4
	}
};

var citationSrc5 = {
	"citationItems": [
        {
			id: "ITEM-2",
			label:"page",
			locator:"482"
		},
        {
			id: "ITEM-13",
			locator:"395",
			label:"section"
		},
        {
			id: "ITEM-1",
			label:"page",
			locator:"25"
		},
        {
			id: "ITEM-1"
		},
        {
			id: "ITEM-1",
			label:"page",
			locator:"112"
		}
	],
	"properties": {
		"noteIndex": 5
	}
};

var citationSrc6 = {
	"citationItems": [
        {
			id: "ITEM-16"
		}
	],
	"properties": {
		"noteIndex": 6
	}
};

var citationSrc7 = {
	"citationItems": [
        {
			id: "ITEM-17",
			label:"paragraph",
			locator:"6"
		},
        {
			id: "ITEM-18",
			label:"page",
			locator:"983"
		}
	],
	"properties": {
		"noteIndex": 7
	}
};

var citationSrc8 = {
	"citationItems": [
        {
			id: "ITEM-19",
			"suffix":"(appeal taken from Scot.)"
		}
	],
	"properties": {
		"noteIndex": 8
	}
};

var citationSrc9 = {
	"citationItems": [
        {
			id: "ITEM-20",
			suffix:"(appeal taken from B.C.)"
		}
	],
	"properties": {
		"noteIndex": 9
	}
};

var citationSrc10 = {
	"citationItems": [
        {
			id: "ITEM-3",
			prefix:"<b>En sinn Scholl beschéngt ass, da Mamm frësch blénken hun?</b> <i>See, e.g.</i>"
		},
        {
			prefix:"<b>Der mä gutt Dach, eng onser bléit geplot mä.</b>  <i>See generally</i>",
			id: "ITEM-3",
			suffix:"<b>(Iwer Engel Milliounen nei fu, blëtzen néierens d'Gaassen rou do.)</b>"
		}
	],
	"properties": {
		"noteIndex": 10
	}
};

var citationSrc11 = {
	"citationItems": [
        {
			id: "ITEM-13",
			label:"section",
			locator:"1"
		}
	],
	"properties": {
		"noteIndex": 11
	}
};

var insert = function(){
	var citeproc, output;
	var sys = new Sys(abbreviations);

	// Chicago Author-Date
	citeproc = new CSL.Engine(sys, chicago_author_date);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("chicago_author_date",output);
	}

	// Bluebook and subsectioned bib
	citeproc = new CSL.Engine(sys,bluebook_demo);
	citeproc.setAbbreviations("default");
	var citation1 = citeproc.appendCitationCluster(citationSrc1);
	insertCites(citation1);
	var citation2 = citeproc.appendCitationCluster(citationSrc2);
	insertCites(citation2);
	var citation3 = citeproc.appendCitationCluster(citationSrc3);
	insertCites(citation3);
	var citation4 = citeproc.appendCitationCluster(citationSrc4);
	insertCites(citation4);
	var citation5 = citeproc.appendCitationCluster(citationSrc5);
	insertCites(citation5);
	var citation6 = citeproc.appendCitationCluster(citationSrc6);
	insertCites(citation6);
	var citation7 = citeproc.appendCitationCluster(citationSrc7);
	insertCites(citation7);
	var citation8 = citeproc.appendCitationCluster(citationSrc8);
	insertCites(citation8);
	var citation9 = citeproc.appendCitationCluster(citationSrc9);
	insertCites(citation9);
	var citation10 = citeproc.appendCitationCluster(citationSrc10);
	insertCites(citation10);
	var citation11 = citeproc.appendCitationCluster(citationSrc11);
	insertCites(citation11);

	var cases = {
		"include" : [
			{
				"field" : "type",
				"value" : "legal_case"
			},
			{
				"field" : "type",
				"value" : "legislation"
			}
		]
	};
	output = citeproc.makeBibliography(cases);
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("bluebook_demo_legal_stuff",output);
	}
	var books = {
		"select" : [
			{
				"field" : "type",
				"value" : "book"
			}
		]
	};
	output = citeproc.makeBibliography(books);
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("bluebook_demo_books",output);
	}
	var articles = {
		"exclude" : [
			{
				"field" : "type",
				"value" : "book"
			},
			{
				"field" : "type",
				"value" : "legal_case"
			},
			{
				"field" : "type",
				"value" : "legislation"
			}
		]
	};
	output = citeproc.makeBibliography(articles);
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("bluebook_demo_articles",output);
	}

	// Listing
	citeproc = new CSL.Engine(sys,chicago_author_date_listing);
	citeproc.updateItems(["ITEM-1", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6", "ITEM-7", "ITEM-8","ITEM-9"]);
	citeproc.setAbbreviations("default");
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("chicago_author_date_listing",output);
	}

	// IEEE
	citeproc = new CSL.Engine(sys,ieee);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	citeproc.setAbbreviations("slightly_weird");
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("ieee",output);
	}

	// Annotated
	citeproc = new CSL.Engine(sys,chicago_fullnote_bibliography2);
	citeproc.updateItems(["ITEM-1", "ITEM-2", "ITEM-3", "ITEM-4", "ITEM-5", "ITEM-6"]);
	citeproc.setAbbreviations("default");
	output = citeproc.makeBibliography();
	if (output && output.length && output[1].length){
		output = output[0].bibstart + output[1].join("") + output[0].bibend;
		pointedStickInnerHtml("chicago_fullnote_bibliography2",output);
	}

};
