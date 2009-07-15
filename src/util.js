dojo.provide("csl.util");
if (!CSL){
	load("./src/csl.js");
}

/**
 * Utilities for various things.
 * @namespace Utilities
 */
CSL.Util = {};

/*
 * Also dumping this stuff here temporarily.
 */
CSL.Util.Match = function(){

	this.any = function(token,state,Item){
		//
		// assume false, return true on any single true hit
		//
		var ret = false;
		for each (var func in token.tests){
			var rawres = func.call(token,state,Item);
			if ("object" != typeof rawres){
				rawres = [rawres];
			}
			for each (var res in rawres){
				if (res){
					ret = true;
					break;
				}
			};
			if (ret){
				break;
			};
		};
		if (ret){
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		};
		return ret;
	};

	this.none = function(token,state,Item){
		//
		// assume true, return false on any single true hit
		//
		var ret = true;
		for each (var func in this.tests){
			var rawres = func.call(token,state,Item);
			if ("object" != typeof rawres){
				rawres = [rawres];
			}
			for each (var res in rawres){
				if (res){
					ret = false;
					break;
				}
			};
			if (!ret){
				break;
			};
		};
		if (ret){
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		};
		return ret;
	};

	this.all = function(token,state,Item){
		//
		// assume true, return false on any single false hit
		//
		var ret = true;
		for each (var func in this.tests){
			var rawres = func.call(token,state,Item);
			if ("object" != typeof rawres){
				rawres = [rawres];
			}
			for each (var res in rawres){
				if (!res){
					ret = false;
					break;
				}
			};
			if (!ret){
				break;
			};
		};
		if (ret){
			ret = token.succeed;
			state.tmp.jump.replace("succeed");
		} else {
			ret = token.fail;
			state.tmp.jump.replace("fail");
		};
		return ret;
	};
};
