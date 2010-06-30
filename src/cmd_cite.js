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

CSL.Engine.prototype.previewCitationCluster = function (citation, citationsPre, citationsPost, newMode) {
	var oldMode, oldCitationID, newCitationID, ret, data;

	// Generate output for a hypothetical citation at the current position,
	// Leave the registry in the same state in which it was found.
	oldMode = this.opt.mode;
	this.setOutputFormat(newMode);

	[data, ret] = this.processCitationCluster(citation, citationsPre, citationsPost, CSL.PREVIEW);

	this.setOutputFormat(oldMode);
	return ret;
};

CSL.Engine.prototype.appendCitationCluster = function (citation) {
	var pos, len, c, citationsPre;
	citationsPre = [];
	len = this.registry.citationreg.citationByIndex.length;
	for (pos = 0; pos < len; pos += 1) {
		c = this.registry.citationreg.citationByIndex[pos];
		citationsPre.push([c.citationID, c.properties.noteIndex]);
	}
	return this.processCitationCluster(citation, citationsPre, [])[1];
};

CSL.Engine.prototype.processCitationCluster = function (citation, citationsPre, citationsPost, flag) {
	var sortedItems, new_citation, pos, len, item, citationByIndex, c, Item, newitem, k, textCitations, noteCitations, update_items, citations, first_ref, last_ref, ipos, ilen, cpos, onecitation, oldvalue, ibidme, suprame, useme, items, i, key, prev_locator, curr_locator, param, ret, obj, ppos, llen, lllen, pppos, ppppos, llllen, cids, note_distance, return_data, lostItemId, lostItemList, lostItemData, otherLostPkeys, disambig, oldItemIds;
	this.debug = false;
	return_data = {"bibchange": false};
	this.registry.return_data = return_data;

	// make sure this citation has a unique ID, and register it in citationById.
	this.setCitationId(citation);

	if (flag === CSL.PREVIEW) {
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** start state save *********");
		}
		//SNIP-END
		//
		// Simplify.

		// Take a slice of existing citations.
		var oldCitationList = this.registry.citationreg.citationByIndex.slice();

		// Take a slice of current items, for later use with update.
		var oldItemList = this.registry.reflist.slice();

		// Make a list of preview citation ref objects
		var newCitationList = citationsPre.concat([[citation.citationID, citation.properties.noteIndex]]).concat(citationsPost);

		// Make a full list of desired ids, for use in preview update,
		// and a hash list of same while we're at it.
		var newItemIds = {};
		var newItemIdsList = [];
		for (pos = 0, len = newCitationList.length; pos < len; pos += 1) {
			c = this.registry.citationreg.citationById[newCitationList[pos][0]];
			for (ppos = 0, llen = c.citationItems.length; ppos < llen; ppos += 1) {
				newItemIds[c.citationItems[ppos].id] = true;
				newItemIdsList.push(c.citationItems[ppos].id);
			}
		}

		// Clone and save off disambigs of items that will be lost.
		var oldAmbigs = {};
		for (pos = 0, len = oldItemList.length; pos < len; pos += 1) {
			if (!newItemIds[oldItemList[pos].id]) {
				var oldAkey = this.registry.registry[oldItemList[pos].id].ambig;
				var ids = this.registry.ambigcites[oldAkey];
				if (ids) {
					for (ppos = 0, llen = ids.length; ppos < llen; ppos += 1) {
						oldAmbigs[ids[ppos]] = CSL.cloneAmbigConfig(this.registry.registry[ids[ppos]].disambig);
					}
				}
			}
		}

		// Update items.  This will produce the base name data and sort things.
		// Possibly unnecessary?
		//this.updateItems(this.registry.mylist.concat(tmpItems));

		//SNIP-START
		if (this.debug) {
			CSL.debug("****** end state save *********");
		}
		//SNIP-END
	}
	this.tmp.taintedItemIDs = {};
	this.tmp.taintedCitationIDs = {};
	sortedItems = [];

	// retrieve item data and compose items for use in rendering
	// attach pointer to item data to shared copy for good measure
	len = citation.citationItems.length;
	for (pos = 0; pos < len; pos += 1) {
		item = citation.citationItems[pos];
		Item = this.sys.retrieveItem(item.id);
	    newitem = [Item, item];
		sortedItems.push(newitem);
		citation.citationItems[pos].item = Item;
	}
	// sort the list to be used in rendering
	if (!this.opt.citation_number_sort && sortedItems && sortedItems.length > 1 && this.citation_sort.tokens.length > 0) {
	//if (sortedItems && sortedItems.length > 1 && this.citation_sort.tokens.length > 0) {
		len = sortedItems.length;
		for (pos = 0; pos < len; pos += 1) {
			sortedItems[pos][1].sortkeys = CSL.getSortKeys.call(this, sortedItems[pos][0], "citation_sort");
		}
		if (!citation.properties.unsorted) {
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
		}
	}
	// attach the sorted list to the citation item
	citation.sortedItems = sortedItems;

	// build reconstituted citations list in current document order
	citationByIndex = [];
	len = citationsPre.length;
	for (pos = 0; pos < len; pos += 1) {
		c = citationsPre[pos];
		this.registry.citationreg.citationById[c[0]].properties.noteIndex = c[1];
		citationByIndex.push(this.registry.citationreg.citationById[c[0]]);
	}
	citationByIndex.push(citation);
	len = citationsPost.length;
	for (pos = 0; pos < len; pos += 1) {
		c = citationsPost[pos];
		this.registry.citationreg.citationById[c[0]].properties.noteIndex = c[1];
		citationByIndex.push(this.registry.citationreg.citationById[c[0]]);
	}
	this.registry.citationreg.citationByIndex = citationByIndex;

	//
	// The processor provides three facilities to support
	// updates following position reevaluation.
	//
	// (1) The updateItems() function reports tainted ItemIDs
	// to state.tmp.taintedItemIDs.
	//
	// (2) The processor memos the type of style referencing as
	// CSL.NONE, CSL.NUMERIC or CSL.POSITION in state.opt.update_mode.
	//
	// XXXX: NO LONGER
	// (3) For citations containing cites with backreference note numbers,
	// a string image of the rendered citation is held in
	// citation.properties.backref_citation, and a list of
	// ItemIDs to be used to update the backreference note numbers
	// is memoed at citation.properties.backref_index.  When such
	// citations change position, they can be updated with a
	// series of simple find and replace operations, without
	// need for rerendering.
	//

	//
	// Position evaluation!
	//
	// set positions in reconstituted list, noting taints
	this.registry.citationreg.citationsByItemId = {};
	if (this.opt.update_mode === CSL.POSITION) {
		textCitations = [];
		noteCitations = [];
	}
	update_items = [];
	len = citationByIndex.length;
	for (pos = 0; pos < len; pos += 1) {
		citationByIndex[pos].properties.index = pos;
		llen = citationByIndex[pos].sortedItems.length;
		for (ppos = 0; ppos < llen; ppos += 1) {
			item = citationByIndex[pos].sortedItems[ppos];
			if (!this.registry.citationreg.citationsByItemId[item[1].id]) {
				this.registry.citationreg.citationsByItemId[item[1].id] = [];
				update_items.push(item[1].id);
			}
			if (this.registry.citationreg.citationsByItemId[item[1].id].indexOf(citationByIndex[pos]) === -1) {
				this.registry.citationreg.citationsByItemId[item[1].id].push(citationByIndex[pos]);
			}
		}
		if (this.opt.update_mode === CSL.POSITION) {
			if (citationByIndex[pos].properties.noteIndex) {
				noteCitations.push(citationByIndex[pos]);
			} else {
				textCitations.push(citationByIndex[pos]);
			}
		}
	}
	//
	// update bibliography items here
	//
	if (flag !== CSL.ASSUME_ALL_ITEMS_REGISTERED) {
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** start update items *********");
		}
		//SNIP-END
		this.updateItems(update_items);
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** endo update items *********");
		}
		//SNIP-END
	}
	if (this.opt.update_mode === CSL.POSITION) {
		for (pos = 0; pos < 2; pos += 1) {
			citations = [textCitations, noteCitations][pos];
			first_ref = {};
			last_ref = {};
			llen = citations.length;
			for (ppos = 0; ppos < llen; ppos += 1) {
				onecitation = citations[ppos];
				// Set the following:
				//
				// (1) position as required (as per current Zotero)
				// (2) first-reference-note-number as required (on onecitation item)
				// (3) near-note as required (on onecitation item, according to
				//     state.opt["near-note-distance"] parameter)
				// (4) state.registry.citationreg.citationsByItemId.
				//
				// Any state changes caused by unsetting or resetting should
				// trigger a single entry for the citations in
				// state.tmp.taintedCitationIDs (can block on presence of
				// state.registry.citationreg.citationsByItemId).
				//
				lllen = citations[ppos].sortedItems.length;
				for (pppos = 0; pppos < lllen; pppos += 1) {
					item = citations[ppos].sortedItems[pppos];
					oldvalue = {};
					oldvalue.position = item[1].position;
					oldvalue["first-reference-note-number"] = item[1]["first-reference-note-number"];
					oldvalue["near-note"] = item[1]["near-note"];
					item[1]["first-reference-note-number"] = 0;
					item[1]["near-note"] = false;
					if ("number" !== typeof first_ref[item[1].id]) {
						if (!onecitation.properties.noteIndex) {
							onecitation.properties.noteIndex = 0;
						}
						first_ref[item[1].id] = onecitation.properties.noteIndex;
						last_ref[item[1].id] = onecitation.properties.noteIndex;
						item[1].position = CSL.POSITION_FIRST;
					} else {
						//
						// backward-looking position evaluation happens here.
						//
						//
						//
						ibidme = false;
						suprame = false;
						if (ppos > 0 && parseInt(pppos, 10) === 0) {
							// Case 1: source in previous onecitation
							// (1) Threshold conditions
							//     (a) there must be a previous onecitation with one item
							//     (b) this item must be the first in this onecitation
							//     (c) the previous onecitation must contain a reference
							//         to the same item ...
							//     (d) the note numbers must be the same or consecutive.
							// (this has some jiggery-pokery in it for parallels)
							items = citations[(ppos - 1)].sortedItems;
							useme = false;
							// (note: use of looser == form for first comparison below
							// is important: the id may be of type number or string,
							// and the looser form will work with both.
							if ((citations[(ppos - 1)].sortedItems[0][1].id == item[1].id && citations[ppos - 1].properties.noteIndex >= (citations[ppos].properties.noteIndex - 1)) || citations[(ppos - 1)].sortedItems[0][1].id === this.registry.registry[item[1].id].parallel) {
								useme = true;
							}
							llllen = items.slice(1).length;
							for (ppppos = 0; ppppos < llllen; ppppos += 1) {
								i = items.slice(1)[ppppos];
								if (!this.registry.registry[i[1].id].parallel || this.registry.registry[i[1].id].parallel === this.registry.registry[i[1].id]) {
									useme = false;
								}
							}
							if (useme) {
								ibidme = true;
							} else {
								suprame = true;
							}
						} else if (pppos > 0 && onecitation.sortedItems[(pppos - 1)][1].id === item[1].id) {
							// Case 2: immediately preceding source in this onecitation
							// (1) Threshold conditions
							//     (a) there must be an imediately preceding reference to  the
							//         same item in this onecitation
							ibidme = true;
						} else {
							// everything else is definitely subsequent
							suprame = true;
						}
						// conditions
						if (ibidme) {
							if (pppos > 0) {
								prev_locator = onecitation.sortedItems[(pppos - 1)][1].locator;
							} else {
								prev_locator = citations[(ppos - 1)].sortedItems[0][1].locator;
							}
							curr_locator = item[1].locator;
						}
						// triage
						if (ibidme && prev_locator && !curr_locator) {
							ibidme = false;
							suprame = true;

						}
						if (ibidme) {
							if (!prev_locator && curr_locator) {
								//     (a) if the previous onecitation had no locator
								//         and this onecitation has one, use ibid+pages
								item[1].position = CSL.POSITION_IBID_WITH_LOCATOR;
							} else if (!prev_locator && !curr_locator) {
								//     (b) if the previous onecitation had no locator
								//         and this onecitation also has none, use ibid
								item[1].position = CSL.POSITION_IBID;
								//print("setting ibid in cmd_cite()");
							} else if (prev_locator && curr_locator === prev_locator) {
								//     (c) if the previous onecitation had a locator
								//         (page number, etc.) and this onecitation has
								//         a locator that is identical, use ibid

								item[1].position = CSL.POSITION_IBID;
								//print("setting ibid in cmd_cite() [2]");
							} else if (prev_locator && curr_locator && curr_locator !== prev_locator) {
								//     (d) if the previous onecitation had a locator,
								//         and this onecitation has one that differs,
								//         use ibid+pages
								item[1].position = CSL.POSITION_IBID_WITH_LOCATOR;
							} else {
								//     (e) if the previous onecitation had a locator
								//         and this onecitation has none, use subsequent
								//
								//     ... and everything else would be subsequent also
								ibidme = false; // just to be clear
								suprame = true;
							}
						}
						if (suprame) {
							item[1].position = CSL.POSITION_SUBSEQUENT;
							if (first_ref[item[1].id] !== onecitation.properties.noteIndex) {
								item[1]["first-reference-note-number"] = first_ref[item[1].id];
							}
						}
					}
					if (onecitation.properties.noteIndex) {
						cids = this.registry.citationreg.citationsByItemId[item[0].id];
						for (ppppos = (cids.length - 1); ppppos > -1; ppppos += -1) {
							if (cids[ppppos].properties.noteIndex < onecitation.properties.noteIndex) {
								note_distance = onecitation.properties.noteIndex - cids[ppppos].properties.noteIndex;
								if (note_distance <= this.citation.opt["near-note-distance"]) {
									item[1]["near-note"] = true;
								}
							}
						}
						// if ((onecitation.properties.noteIndex - this.citation.opt["near-note-distance"]) < onecitation.properties.noteIndex) {
						//	item[1]["near-note"] = true;
						// }
					}
					if (onecitation.citationID !== citation.citationID) {
						llllen = CSL.POSITION_TEST_VARS.length;
						for (ppppos = 0; ppppos < llllen; ppppos += 1) {
							param = CSL.POSITION_TEST_VARS[ppppos];
							if (item[1][param] !== oldvalue[param]) {
								this.tmp.taintedCitationIDs[onecitation.citationID] = true;
							}
						}
					}
				}
			}
		}
	}
	if (this.opt.citation_number_sort && sortedItems && sortedItems.length > 1 && this.citation_sort.tokens.length > 0) {
		len = sortedItems.length;
		for (pos = 0; pos < len; pos += 1) {
			sortedItems[pos][1].sortkeys = CSL.getSortKeys.call(this, sortedItems[pos][0], "citation_sort");
		}
		if (!citation.properties.unsorted) {
			sortedItems.sort(this.citation.srt.compareCompositeKeys);
		}
	}
	for (key in this.tmp.taintedItemIDs) {
		if (this.tmp.taintedItemIDs.hasOwnProperty(key)) {
			citations = this.registry.citationreg.citationsByItemId[key];
			// Current citation may be tainted but will not exist
			// during previewing.
			//if (citations) {
				for (pos = 0, len = citations.length; pos < len; pos += 1) {
					this.tmp.taintedCitationIDs[citations[pos].citationID] = true;
				}
			//}
		}
	}
	ret = [];
	if (flag === CSL.PREVIEW) {
		// If previewing, return only a rendered string
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** start run processor *********");
		}
		//SNIP-END
		ret = this.process_CitationCluster.call(this, citation.sortedItems);
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** end run processor *********");
			CSL.debug("****** start state restore *********");
		}
		//SNIP-END
		// Wind out anything related to new items added for the preview.
		// This means (1) names, (2) disambig state for affected items,
		// (3) keys registered in the ambigs pool arrays, and (4) registry
		// items.
		//

		// restore sliced citations
		this.registry.citationreg.citationByIndex = oldCitationList;
		this.registry.citationreg.citationById = {};
		for (pos = 0, len = oldCitationList.length; pos < len; pos += 1) {
			this.registry.citationreg.citationById[oldCitationList[pos].citationID] = oldCitationList[pos];
		}

		//SNIP-START
		if (this.debug) {
			CSL.debug("****** start final update *********");
		}
		//SNIP-END
		oldItemIds = [];
		for (pos = 0, len = oldItemList.length; pos < len; pos += 1) {
			oldItemIds.push(oldItemList[pos].id);
		}
		this.updateItems(oldItemIds);
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** end final update *********");
		}
		//SNIP-END
		// Roll back disambig states
		for (key in oldAmbigs) {
			this.registry.registry[key].disambig = oldAmbigs[key];
		}
		//SNIP-START
		if (this.debug) {
			CSL.debug("****** end state restore *********");
		}
		//SNIP-END
	} else {
		// Run taints only if not previewing
		//
		// Push taints to the return object
		//
		for (key in this.tmp.taintedCitationIDs) {
			if (this.tmp.taintedCitationIDs.hasOwnProperty(key)) {
				if (key === citation.citationID) {
					continue;
				}
				obj = [];
				citation = this.registry.citationreg.citationById[key];
				// Again, citation may not exist during previewing?
				//if (citation) {
					obj.push(citation.properties.index);
					obj.push(this.process_CitationCluster.call(this, citation.sortedItems));
					ret.push(obj);
				//}
			}
		}
		this.tmp.taintedItemIDs = false;
		this.tmp.taintedCitationIDs = false;
		obj = [];
		obj.push(citationsPre.length);
		obj.push(this.process_CitationCluster.call(this, sortedItems));
		ret.push(obj);
		//
		// note for posterity: Rhino and Spidermonkey produce different
		// sort results for items with matching keys.  That discrepancy
		// turned up a subtle bug in the parallel detection code, trapped
		// at line 266, above, and in line 94 of util_parallel.js.
		//
		ret.sort(function (a, b) {
			if (a[0] > b[0]) {
				return 1;
			} else if (a[0] < b[0]) {
				return -1;
			} else {
				return 0;
			}
		});
		//
		// In normal rendering, return is a list of two-part arrays, with the first element
		// a citation index number, and the second the text to be inserted.
		//
	}
	return [return_data, ret];
};

CSL.Engine.prototype.process_CitationCluster = function (sortedItems) {
	var str;
	this.parallel.StartCitation(sortedItems);
	str = CSL.getCitationCluster.call(this, sortedItems);

	return str;
};

CSL.Engine.prototype.makeCitationCluster = function (rawList) {
	var inputList, newitem, str, pos, len, item, Item;
	inputList = [];
	len = rawList.length;
	for (pos = 0; pos < len; pos += 1) {
		item = rawList[pos];
		Item = this.sys.retrieveItem(item.id);
		newitem = [Item, item];
		inputList.push(newitem);
	}
	if (inputList && inputList.length > 1 && this.citation_sort.tokens.length > 0) {
		len = inputList.length;
		for (pos = 0; pos < len; pos += 1) {
			rawList[pos].sortkeys = CSL.getSortKeys.call(this, inputList[pos][0], "citation_sort");
		}
		inputList.sort(this.citation.srt.compareCompositeKeys);
	}
	this.parallel.StartCitation(inputList);
	str = CSL.getCitationCluster.call(this, inputList);
	return str;
};


/**
 * Get the undisambiguated version of a cite, without decorations
 * <p>This is used internally by the Registry.</p>
 */
CSL.getAmbiguousCite = function (Item, disambig) {
	var use_parallels, ret;
	if (disambig) {
		this.tmp.disambig_request = disambig;
	} else {
		this.tmp.disambig_request = false;
	}
	this.tmp.area = "citation";
	use_parallels = this.parallel.use_parallels;
	this.parallel.use_parallels = false;
	this.tmp.suppress_decorations = true;
	this.tmp.just_looking = true;
	CSL.getCite.call(this, Item, {position: 1});
	ret = this.output.string(this, this.output.queue);
	this.tmp.just_looking = false;
	this.tmp.suppress_decorations = false;
	this.parallel.use_parallels = use_parallels;
	return ret;
};

/**
 * Return delimiter for use in join
 * <p>Splice evaluation is done during cite
 * rendering, and this method returns the
 * result.  Evaluation requires three items
 * of information from the preceding cite, if
 * one is present: the names used; the years
 * used; and the suffix appended to the
 * citation.  These details are copied into
 * the state object before processing begins,
 * and are cleared by the processor on
 * completion of the run.</p>
 */

CSL.getSpliceDelimiter = function (last_collapsed) {
	if (last_collapsed && ! this.tmp.have_collapsed && this.citation.opt["after-collapse-delimiter"]) {
		this.tmp.splice_delimiter = this.citation.opt["after-collapse-delimiter"];
	}
	return this.tmp.splice_delimiter;
};

/*
 * Compose individual cites into a single string, with
 * flexible inter-cite splicing.
 */
CSL.getCitationCluster = function (inputList, citationID) {
	var delimiter, result, objects, myparams, len, pos, item, last_collapsed, params, empties, composite, compie, myblobs, Item, llen, ppos, obj, preceding_item;
	this.tmp.area = "citation";
	delimiter = "";
	result = "";
	objects = [];
	this.tmp.last_suffix_used = "";
	this.tmp.last_names_used = [];
	this.tmp.last_years_used = [];
	this.tmp.backref_index = [];
	if (citationID) {
		this.registry.citationreg.citationById[citationID].properties.backref_index = false;
		this.registry.citationreg.citationById[citationID].properties.backref_citation = false;
	}

	myparams = [];
	len = inputList.length;
	for (pos = 0; pos < len; pos += 1) {
		Item = inputList[pos][0];
		item = inputList[pos][1];
		last_collapsed = this.tmp.have_collapsed;
		params = {};

		if (pos > 0) {
			CSL.getCite.call(this, Item, item, inputList[(pos - 1)][1].id);
		} else {
			this.tmp.term_predecessor = false;
			CSL.getCite.call(this, Item, item);
		}
		// ZZZZZZ:
		//print("parallel is: "+this.registry.registry[Item.id].parallel);
		//print("parallel is: "+Item.id);

		if (pos === (inputList.length - 1)) {
			this.parallel.ComposeSet();
		}

		//print("-- item: "+Item.id);
		//for (var x in this.registry.registry[Item.id]) {
		//	print("  "+x+": "+this.registry.registry[Item.id][x]);
		//}

		params.splice_delimiter = CSL.getSpliceDelimiter.call(this, last_collapsed);
		if (item && item["author-only"]) {
			this.tmp.suppress_decorations = true;
		}

		if (pos > 0) {
			preceding_item = inputList[pos - 1][1];
			if (preceding_item.suffix && pos > 0 && preceding_item.suffix.slice(-1) === ".") {
				var spaceidx = params.splice_delimiter.indexOf(" ");
				if (spaceidx > -1) {
					params.splice_delimiter = params.splice_delimiter.slice(spaceidx);
				} else {
					params.splice_delimiter = "";
				}
			}
		}
		params.suppress_decorations = this.tmp.suppress_decorations;
		params.have_collapsed = this.tmp.have_collapsed;
		//
		// XXXXX: capture parameters to an array, which
		// will be of the same length as this.output.queue,
		// corresponding to each element.
		//
		myparams.push(params);
	}

	this.parallel.PruneOutputQueue(this);
	//
	// output.queue is a simple array.  do a slice
	// of it to get each cite item, setting params from
	// the array that was built in the preceding loop.
	//
	empties = 0;
	myblobs = this.output.queue.slice();


	if (CSL.TERMINAL_PUNCTUATION.indexOf(this.citation.opt.layout_suffix) > -1) {
		CSL.Output.Queue.quashDuplicateFinalPunctuation(myblobs, this.citation.opt.layout_suffix.slice(0, 1));
	}

	for (pos = 0, len = myblobs.length; pos < len; pos += 1) {

		this.output.queue = [myblobs[pos]];

		this.tmp.suppress_decorations = myparams[pos].suppress_decorations;
		this.tmp.splice_delimiter = myparams[pos].splice_delimiter;
		//
		// oh, one last second thought on delimiters ...
		//
		if (myblobs[pos].parallel_delimiter) {
			this.tmp.splice_delimiter = myblobs[pos].parallel_delimiter;
		}
		this.tmp.have_collapsed = myparams[pos].have_collapsed;

		composite = this.output.string(this, this.output.queue);
		this.tmp.suppress_decorations = false;
		// meaningless assignment
		// this.tmp.handle_ranges = false;
		if (item && item["author-only"]) {
			return composite;
		}
		if ("object" === typeof composite && composite.length === 0 && !item["suppress-author"]) {
			composite.push("[CSL STYLE ERROR: reference with no printed form.]");
		}
		if (objects.length && "string" === typeof composite[0]) {
			composite.reverse();
			objects.push(this.tmp.splice_delimiter + composite.pop());
		} else {
			composite.reverse();
			compie = composite.pop();
			if ("undefined" !== typeof compie) {
				objects.push(compie);
			}
		}
		composite.reverse();
		llen = composite.length;
		for (ppos = 0; ppos < llen; ppos += 1) {
			obj = composite[ppos];
			if ("string" === typeof obj) {
				objects.push(this.tmp.splice_delimiter + obj);
				continue;
			}
			compie = composite.pop();
			if ("undefined" !== typeof compie) {
				objects.push(compie);
			}
		}
		if (objects.length === 0 && !inputList[pos][1]["suppress-author"]) {
			empties += 1;
		}
	}
	result += this.output.renderBlobs(objects)[0];
	if (result) {
		if (result.slice(-1) === this.citation.opt.layout_suffix.slice(0)) {
			result = result.slice(0, -1);
		}
		result = this.citation.opt.layout_prefix + result + this.citation.opt.layout_suffix;
		if (!this.tmp.suppress_decorations) {
			len = this.citation.opt.layout_decorations.length;
			for (pos = 0; pos < len; pos += 1) {
				params = this.citation.opt.layout_decorations[pos];
				result = this.fun.decorate[params[0]][params[1]](this, result);
			}
		}
	}
	return result;
};

/*
 * Render a single cite item.
 *
 * This is called on the state object, with a single
 * Item as input.  It iterates exactly once over the style
 * citation tokens, and leaves the result of rendering in
 * the top-level list in the relevant *.opt.output
 * stack, as a list item consisting of a single string.
 *
 * (This might be dual-purposed for generating individual
 * entries in a bibliography.)
 */
CSL.getCite = function (Item, item, prevItemID) {
	var next;
	this.parallel.StartCite(Item, item, prevItemID);
	CSL.citeStart.call(this, Item);
	next = 0;
	while (next < this[this.tmp.area].tokens.length) {
		next = CSL.tokenExec.call(this, this[this.tmp.area].tokens[next], Item, item);
    }
	CSL.citeEnd.call(this, Item);
	this.parallel.CloseCite(this);
	return Item.id;
};

CSL.citeStart = function (Item) {
	this.tmp.have_collapsed = true;
	this.tmp.render_seen = false;
	if (this.tmp.disambig_request  && ! this.tmp.disambig_override) {
		this.tmp.disambig_settings = this.tmp.disambig_request;
	} else if (this.registry.registry[Item.id] && ! this.tmp.disambig_override) {
		this.tmp.disambig_request = this.registry.registry[Item.id].disambig;
		this.tmp.disambig_settings = this.registry.registry[Item.id].disambig;
	} else {
		this.tmp.disambig_settings = new CSL.AmbigConfig();
	}
	this.tmp.names_used = [];
	this.tmp.nameset_counter = 0;
	this.tmp.years_used = [];
	this.tmp.names_max.clear();

	this.tmp.splice_delimiter = this[this.tmp.area].opt.delimiter;

	this.bibliography_sort.keys = [];
	this.citation_sort.keys = [];

	this.tmp.count_offset_characters = false;
	this.tmp.offset_characters = 0;
	this.tmp.has_done_year_suffix = false;
	CSL.Util.Names.initNameSlices(this);
};

CSL.citeEnd = function (Item) {

	if (this.tmp.last_suffix_used && this.tmp.last_suffix_used.match(/[\-.,;:]$/)) {
		this.tmp.splice_delimiter = " ";
	} else if (this.tmp.prefix.value() && this.tmp.prefix.value().match(/^[.,:;a-z]/)) {
		this.tmp.splice_delimiter = " ";
	}

	this.tmp.last_suffix_used = this.tmp.suffix.value();
	this.tmp.last_years_used = this.tmp.years_used.slice();
	this.tmp.last_names_used = this.tmp.names_used.slice();

	// This is a hack, in a way; I have lost track of where
	// the disambig (name rendering) settings used for rendering work their way
	// into the registry.  This resets defaults to the subsequent form,
	// when first cites are rendered.
	if (this.tmp.disambig_restore && this.registry.registry[Item.id]) {
		this.registry.registry[Item.id].disambig = this.tmp.disambig_restore;
	}
	this.tmp.disambig_request = false;

	if (!this.tmp.suppress_decorations && this.tmp.offset_characters) {
		this.registry.registry[Item.id].offset = this.tmp.offset_characters;
	}
};
