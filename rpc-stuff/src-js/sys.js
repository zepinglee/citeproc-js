Retriever = function(){
    this._cache = new Object();
};

Retriever.prototype.retrieveItem = function(id){
	return this._cache[id];
};

Retriever.prototype.retrieveItems = function(ids){
	var ret = [];
	for each (var id in ids){
		ret.push(this.retrieveItem(id));
	}
	return ret;
};

Retriever.prototype.getLang = function(lang){
	return locales[lang];
};

Retriever.prototype.loadData = function(data){
	for each (var entry in data){
		this._cache[entry.id] = entry;
	}
}

var sys = new Retriever();
