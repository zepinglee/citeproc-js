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

CSL.Engine.prototype.updateItems = function (idList) {
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
		CSL.debug("--> setdisambigs <--");
	}
	//SNIP-END
	// taints always
	this.registry.setdisambigs();
	//SNIP-START
	if (debug) {
		CSL.debug("--> setsortkeys <--");
	}
	//SNIP-END
	this.registry.setsortkeys();
	//SNIP-START
	if (debug) {
		CSL.debug("--> sorttokens <--");
	}
	//SNIP-END
	this.registry.sorttokens();
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
	this.registry.yearsuffix();

	return this.registry.getSortedIds();
};

CSL.Engine.prototype.updateUncitedItems = function (idList) {
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

	this.registry.setdisambigs();

	this.registry.setsortkeys();

	this.registry.sorttokens();

	this.registry.renumber();

	this.registry.yearsuffix();

	return this.registry.getSortedIds();
};
