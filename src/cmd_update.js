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

CSL.Engine.prototype.restoreProcessorState = function (citations) {
	var pos, len, ppos, llen, item, Item, newitem, citationList, itemList, sortedItems;
	// Quickly restore state from citation details retained by
	// calling application.
	//
	// Position details and sortkeys are assumed to be correct.  Item
	// data is retrieved, and sortedItems arrays are created and
	// sorted as required by the current style.
	citationList = [];
	itemList = [];
	for (pos = 0, len = citations.length; pos < len; pos += 1) {
		sortedItems = [];
		for (ppos = 0, len = citations[pos].citationItems.length; ppos < llen; ppos += 1) {
			item = citations[pos].citationItems[ppos];
			Item = this.retrieveItem(item.id);
			newitem = [Item, item];
			sortedItems.push(newitem);
			citations[pos].citationItems[ppos].item = Item;
			itemList.push(item.id);
		}
		if (!citations[pos].properties.unsorted) {
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
		}
		citations[pos].sortedItems = sortedItems;
		// Save citation data in registry
		this.registry.citationreg.citationById[citations[pos].citationID] = citations[pos];
		// Save off citationIDs and index positions, for use in
		// final initialization.
		citationList.push([citations[pos].citationID, citations[pos].properties.noteIndex]);
	}
	// Register Items
	this.updateItems(itemList);
	// Rendering one citation restores remainder of processor state.
	if (citations && citations.length) {
		this.processCitationCluster(citations[0], [], citationList.slice(1));
	}
};


CSL.Engine.prototype.updateItems = function (idList, nosort) {
	var debug = false;
	//SNIP-START
	if (debug) {
		CSL.debug("--> init <--");
	}
	//SNIP-END
	this.registry.init(idList);
	//SNIP-START
	if (debug) {
		CSL.debug("--> dodeletes <--");
	}
	//SNIP-END
	this.registry.dodeletes(this.registry.myhash);
	//SNIP-START
	if (debug) {
		CSL.debug("--> doinserts <--");
	}
	//SNIP-END
	this.registry.doinserts(this.registry.mylist);
	//SNIP-START
	if (debug) {
		CSL.debug("--> dorefreshes <--");
	}
	//SNIP-END
	this.registry.dorefreshes();
	//SNIP-START
	if (debug) {
		CSL.debug("--> rebuildlist <--");
	}
	//SNIP-END
	this.registry.rebuildlist();
	//SNIP-START
	if (debug) {
		CSL.debug("--> setsortkeys <--");
	}
	//SNIP-END
	this.registry.setsortkeys();
	// taints always
	//SNIP-START
	if (debug) {
		CSL.debug("--> setdisambigs <--");
	}
	//SNIP-END
	this.registry.setdisambigs();

	if (!nosort) {
		//SNIP-START
		if (debug) {
			CSL.debug("--> sorttokens <--");
		}
		//SNIP-END
		this.registry.sorttokens();
	}
	//SNIP-START
	if (debug) {
		CSL.debug("--> renumber <--");
	}
	//SNIP-END
	// taints if numbered style
	this.registry.renumber();
	//SNIP-START
	if (debug) {
		CSL.debug("--> yearsuffix <--");
	}
	//SNIP-END
	// taints always
	//this.registry.yearsuffix();

	return this.registry.getSortedIds();
};

CSL.Engine.prototype.updateUncitedItems = function (idList, nosort) {
	var debug = false;

	// prepare extended list of items
	this.registry.init(idList, true);

	// don't delete things
	// this.registry.dodeletes(this.registry.myhash);

	// add anything that's missing
	this.registry.doinserts(this.registry.mylist);

	// mark uncited entries
	this.registry.douncited();

	// refreshes are only triggered by dodeletes, so skip it
	//this.registry.dorefreshes();

	// everything else is the same as updateItems()
	this.registry.rebuildlist();

	this.registry.setsortkeys();

	this.registry.setdisambigs();

	if (!nosort) {
		this.registry.sorttokens();
	}

	this.registry.renumber();

	return this.registry.getSortedIds();
};
