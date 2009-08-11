dojo.provide("csl.testing_rhino");

RhinoTest = function(name){
	this.xml = new CSL.System.Xml.E4X();
	this.dummy = [["dummy",{}]];
	this.citations = [];
	this.input = name;
	this.items = [];
	this._ids = [];
	this._cache = {};
	if (name){
		if ("string" == typeof name[0]){
			var input = this._getInput(name);
		} else {
			var input = name;
		}
		this.fixData(input);
	} else {
		this._ids.push("dummy");
		this._cache["dummy"] = {"id":"dummy"};
		this.citations.push(["dummy",{}]);
		this.items.push({"id":"dummy"});
	}
};

RhinoTest.prototype.fixData = function(Item){
	//
	// Item isn't really an item, it's a list of items.
	// And they need to be remangled to conform to the
	// processor API.
	//
	if (Item){
		var seqno = 100;
		this._ids = [];
		this._cache = {};
		this.citations = [];
		for (var i in Item){
			var realitem = Item[i];
			if (!realitem.id){
				realitem.id = "ITEM-"+seqno.toString();
				seqno += 1;
			}
			this._ids.push(realitem.id);
			this._cache[realitem.id] = realitem;
			this.citations.push([realitem.id,{}]);
			this.items.push(realitem);
		}
	}
};


RhinoTest.prototype.retrieveItem = function(id){
	return this._cache[id];
};


RhinoTest.prototype.retrieveItems = function(ids){
	var ret = [];
	for each (var id in ids){
		ret.push(this.retrieveItem(id));
	}
	return ret;
};


RhinoTest.prototype._getInput = function(name){
	this.myname = name;
	var ret = new Array();
	if ("object" == typeof name && name.length){
		for each (filename in name){
			if (this.input[filename]){
				ret.push(this.input[filename]);
			} else {
				var datastring = readFile("data/" + filename + ".txt", "UTF-8");
				eval( "obj = " + datastring );
				this._fixAllNames([obj]);
				this.input[filename] = obj;
				ret.push(obj);
			}
		}
	} else if ("object" == typeof name){
		if (this.input[filename]){
			ret.push(this.input[filename]);
		} else {
			var datastring = readFile("data/" + filename + ".txt", "UTF-8");
			this.input[filename] = obj;
			eval( "obj = " + datastring );
			this._fixAllNames([obj]);
			ret.push(obj);
		}
	} else {
		throw "Failure reading test data file, WTF?";
	}
	return ret;
}

RhinoTest.prototype._fixAllNames = function(input){
	for each (obj in input){
		if (!obj.id){
			throw "No id for object in test: "+this.myname;
		}
		for each (key in CSL.CREATORS){
			if (obj[key]){
				for each (var entry in obj[key]){
					var one_char = entry.name.length-1;
					var two_chars = one_char-1;
					entry.sticky = false;
					if ("!!" == entry.name.substr(two_chars)){
						entry.literal = entry.name.substr(0,two_chars).replace(/\s+$/,"");
					} else {
						var parsed = entry.name;
						if ("!" == entry.name.substr(one_char)){
							entry.sticky = true;
							parsed = entry.name.substr(0,one_char).replace(/\s+$/,"");
						}
						parsed = parsed.split(/\s*,\s*/);

						if (parsed.length > 0){
							var m = parsed[0].match(/^\s*([a-z]+)\s+(.*)/);
							if (m){
								entry.prefix = m[1];
								entry["family"] = m[2];
							} else {
								entry["family"] = parsed[0];
							}
						}
						if (parsed.length > 1){
							entry["given"] = parsed[1];
						}
						if (parsed.length > 2){
							var m = parsed[2].match(/\!\s*(.*)/);
							if (m){
								entry.suffix = m[1];
								entry.comma_suffix = true;
							} else {
								entry.suffix = parsed[2];
							}
						}
					}
				}
			}
		}
	}
};

