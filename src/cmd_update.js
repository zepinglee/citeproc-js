dojo.provide("csl.cmd_update");

CSL.Engine.prototype.updateItems = function(idList){
	var debug = false;
	if (debug){
		CSL.debug("--> init <--");
	};
	this.registry.init(idList);
	if (debug){
		CSL.debug("--> dodeletes <--");
	};
	this.registry.dodeletes(this.registry.myhash);
	if (debug){
		CSL.debug("--> doinserts <--");
	};
	this.registry.doinserts(this.registry.mylist);
	if (debug){
		CSL.debug("--> dorefreshes <--");
	};
	this.registry.dorefreshes();
	if (debug){
		CSL.debug("--> rebuildlist <--");
	};
	this.registry.rebuildlist();
	if (debug){
		CSL.debug("--> setdisambigs <--");
	};
	this.registry.setdisambigs();
	if (debug){
		CSL.debug("--> setsortkeys <--");
	};
	this.registry.setsortkeys();
	if (debug){
		CSL.debug("--> sorttokens <--");
	};
	this.registry.sorttokens();
	if (debug){
		CSL.debug("--> renumber <--");
	};
	this.registry.renumber();
	if (debug){
		CSL.debug("--> yearsuffix <--");
	};
	this.registry.yearsuffix();

	return this.registry.getSortedIds();
};
