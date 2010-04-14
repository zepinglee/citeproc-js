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

//
// XXXXX: note to self, the parallels machinery should be completely
// disabled when sorting of citations is requested.
//
//
// XXXXX: also mark the entry as "parallel" on the citation
// object.
//
//
// XXXXX: thinking forward a bit, we're going to need a means
// of snooping and mangling delimiters.  Inter-cite delimiters
// can be easily applied; it's just a matter of adjusting
// this.tmp.splice_delimiter (?) on the list of attribute
// bundles after a cite or set of cites is completed.
// That happens in cmd_cite.js.  We also need to do two
// things: (1) assure that volume, number, journal and
// page are contiguous within the cite, with no intervening
// rendered variables [done]; and (2) strip affixes to the series,
// so that the sole splice string is the delimiter.  This
// latter will need a walk of the output tree, but it's
// doable.
//
// The advantage of doing things this way is that
// the parallels machinery is encapsulated in a set of
// separate functions that do not interact with cite
// composition.
//

/**
 * Initializes the parallel cite tracking arrays
 */
CSL.Parallel = function (state) {
	this.state = state;
	this.sets = new CSL.Stack([]);
	this.try_cite = true;
	this.use_parallels = true;
};

CSL.Parallel.prototype.isMid = function (variable) {
	return ["volume", "container-title", "issue", "page", "locator"].indexOf(variable) > -1;
};

CSL.Parallel.prototype.StartCitation = function (sortedItems, out) {
	if (this.use_parallels) {
		this.sortedItems = sortedItems;
		this.sortedItemsPos = -1;
		this.sets.clear();
		this.sets.push([]);
		this.in_series = true;
		this.am_master = true;
		this.delim_counter = 0;
		this.delim_pointers = [];
		if (out) {
			this.out = out;
		} else {
			this.out = this.state.output.queue;
		}

	}
};

/**
 * Sets up an empty variables tracking object.
 *
 */
CSL.Parallel.prototype.StartCite = function (Item, item, prevItemID) {
	var position, len, pos, x, curr, master, last_id, prev_locator, curr_locator, is_master, parallel;
	if (this.use_parallels) {
		if (this.sets.value().length && this.sets.value()[0].itemId === Item.id) {
			this.ComposeSet();
		}
		this.sortedItemsPos += 1;
		if (item) {
			position = item.position;
		}
		//
		// Parallel items are tracked in the registry
		// against each reference item, on first references
		// only.  The parallel value is the ID of the reference
		// item first in the list of parallels, otherwise it
		// is false.
		//
		this.try_cite = true;
		len = CSL.PARALLEL_MATCH_VARS.length;
		for (pos = 0; pos < len; pos += 1) {
			x = CSL.PARALLEL_MATCH_VARS[pos];
			if (!Item[x]) {
				this.try_cite = false;
				if (this.in_series) {
					this.sets.push([]);
					this.in_series = false;
					this.am_master = false;
				}
				break;
			}
		}
		this.cite = {};
		this.cite.top = [];
		this.cite.mid = [];
		this.cite.end = [];
		this.cite.position = position;
		this.cite.itemId = Item.id;
		this.cite.prevItemID = prevItemID;
		this.target = "top";
		//
		// Reevaluate position of this cite, if it follows another, in case it
		// is a lurking ibid reference.
		//
		if (this.sortedItems && this.sortedItemsPos > 0 && this.sortedItemsPos < this.sortedItems.length) {
			// This works, and I am absolutely certain that I have
			// no idea how or why.
			curr = this.sortedItems[this.sortedItemsPos][1];
			last_id = this.sortedItems[(this.sortedItemsPos - 1)][1].id;
			master = this.state.registry.registry[last_id].parallel;
			prev_locator = false;
			if (master === curr.id) {
				len = this.sortedItemsPos - 1;
				for (pos = len; pos > -1; pos += -1) {
					if (this.sortedItems[pos][1].id === Item.id) {
						prev_locator = this.sortedItems[pos][1].locator;
						break;
					}
				}
				curr_locator = this.sortedItems[this.sortedItemsPos][1].locator;
				if (!prev_locator && curr_locator) {
					curr.position = CSL.POSITION_IBID_WITH_LOCATOR;
				} else if (curr_locator === prev_locator) {
					curr.position = CSL.POSITION_IBID;
				} else {
					curr.position = CSL.POSITION_IBID_WITH_LOCATOR;
				}
			}
		}
		this.force_collapse = false;
		if (this.state.registry.registry[Item.id].parallel) {
			this.force_collapse = true;
		}
	}
};

/**
 * Initializes scratch object and variable name string
 * for tracking a single variable.
 */
CSL.Parallel.prototype.StartVariable = function (variable) {
	if (this.use_parallels && (this.try_cite || this.force_collapse)) {
		this.variable = variable;
		this.data = {};
		this.data.value = "";
		this.data.blobs = [];
		var is_mid = this.isMid(variable);
		if (this.target === "top" && is_mid) {
			this.target = "mid";
		} else if (this.target === "mid" && !is_mid) {
			this.target = "end";
		} else if (this.target === "end" && is_mid) {
			this.try_cite = true;
			this.in_series = false;
			this.am_master = false;
		}
		this.cite[this.target].push(variable);
	}
};

/**
 * Adds a blob to the the scratch object.  Invoked through
 * state.output.append().  The pointer is used to snip
 * the target blob out of the output queue if appropriate,
 * after parallels detection is complete.
 */
CSL.Parallel.prototype.AppendBlobPointer = function (blob) {
	if (this.use_parallels && (this.try_cite || this.force_collapse) && blob && blob.blobs) {
		this.data.blobs.push([blob, blob.blobs.length]);

	}
};

/**
 * Adds string data to the current variable
 * in the variables tracking object.
 */
CSL.Parallel.prototype.AppendToVariable = function (str) {
	if (this.use_parallels && (this.try_cite || this.force_collapse)) {
		this.data.value += "::" + str;
	}
};

/**
 * Merges scratch object to the current cite object.
 * Checks variable content, and possibly deletes the
 * variables tracking object to abandon parallel cite processing
 * for this cite.  [??? careful with the logic here, current
 * item can't necessarily be discarded; it might be the first
 * member of an upcoming sequence ???]
 */
CSL.Parallel.prototype.CloseVariable = function (hello) {
	if (this.use_parallels && (this.try_cite || this.force_collapse)) {
		this.cite[this.variable] = this.data;
		if (this.sets.value().length > 0) {
			var prev = this.sets.value()[(this.sets.value().length - 1)];
			if (!this.isMid(this.variable) && (!prev[this.variable] || this.data.value !== prev[this.variable].value)) {
				// evaluation takes place later, at close of cite.
				//this.try_cite = true;
				this.in_series = false;
				this.am_master = false;
			}
		}
	}
};

/**
 * Merges current cite object to the
 * tracking array, and evaluate maybe.
 */
CSL.Parallel.prototype.CloseCite = function () {
	if (this.use_parallels) {
		if (!this.in_series && !this.force_collapse) {
			this.ComposeSet(true);
		}
		this.sets.value().push(this.cite);
	}
};

/**
 * Move variables tracking array into the array of
 * composed sets.
 */
CSL.Parallel.prototype.ComposeSet = function (next_output_in_progress) {
	var start, end, cite, pos, master, len;
	if (this.use_parallels) {
		// a bit loose here: zero-length sets relate to one cite,
		// apparently.
		if (this.sets.value().length == 1) {
			if (!this.in_series) {
				this.sets.value().pop();
				this.delim_counter += 1;
			}
		} else {
			len = this.sets.value().length;
			for (pos = 0; pos < len; pos += 1) {
				if (pos === 0) {
					this.delim_counter += 1;
				} else {
					this.delim_pointers.push(this.delim_counter);
					this.delim_counter += 1;
				}
				cite = this.sets.value()[pos];

				if (CSL.POSITION_FIRST === cite.position) {
					if (this.am_master) {
						this.state.registry.registry[cite.itemId].master = true;
						//this.state.registry.registry[cite.itemId].parallel = cite.itemId;
						this.state.registry.registry[cite.itemId].siblings = [];
						this.am_master = false;
					} else {
						if (cite.prevItemID) {
							if (!this.state.registry.registry[cite.prevItemID].parallel) {
								this.state.registry.registry[cite.itemId].parallel = cite.prevItemID;
							} else {
								this.state.registry.registry[cite.itemId].parallel = this.state.registry.registry[cite.prevItemID].parallel;
							}
							this.state.registry.registry[cite.itemId].siblings = this.state.registry.registry[cite.prevItemID].siblings;
							this.state.registry.registry[cite.itemId].siblings.push(cite.itemId);
						}
					}
				}
			}
			this.sets.push([]);
			//this.in_series = false;

		}
		this.am_master = true;
		this.in_series = true;
	}
};

/**
 * Mangle the queue as appropropriate.
 */
CSL.Parallel.prototype.PruneOutputQueue = function () {
	var len, pos, series, ppos, llen, cite;
	if (this.use_parallels) {
		len = this.sets.mystack.length;
		for (pos = 0; pos < len; pos += 1) {
			series = this.sets.mystack[pos];
			if (series.length > 1) {
				llen = series.length;
				for (ppos = 0; ppos < llen; ppos += 1) {
					cite = series[ppos];
					if (ppos === 0) {
						this.purgeVariableBlobs(cite, cite.end);
					} else if (ppos === (series.length - 1)){
						this.purgeVariableBlobs(cite, cite.top);
					} else {
						this.purgeVariableBlobs(cite, cite.top.concat(cite.end));
					}

				}
			}
		}
	}
};

CSL.Parallel.prototype.purgeVariableBlobs = function (cite, varnames) {
	var len, pos, varname, b, llen, ppos, out;
	if (this.use_parallels) {
		//
		// special delimiter within parallel cites.
		//
		out = this.state.output.current.value();
		if ("undefined" === typeof out.length) {
			out = out.blobs;
		}
		for each (pos in this.delim_pointers) {
			out[pos].parallel_delimiter = ", ";
		}
		len = varnames.length - 1;
		for (pos = len; pos > -1; pos += -1) {
			varname = varnames[pos];
			if (cite[varname]) {
				llen = cite[varname].blobs.length - 1;
				for (ppos = llen; ppos > -1; ppos += -1) {
					b = cite[varname].blobs[ppos];
					b[0].blobs = b[0].blobs.slice(0, b[1]).concat(b[0].blobs.slice((b[1] + 1)));
				}
			}
		}
	}
};

