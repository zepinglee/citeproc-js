/**
 * A Javascript implementation of the CSL citation formatting language.
 *
 * <p>A configured instance of the process is built in two stages,
 * using {@link CSL.Core.Build} and {@link CSL.Core.Configure}.
 * The former sets up hash-accessible locale data and imports the CSL format file
 * to be applied to the citations,
 * transforming it into a one-dimensional token list, and
 * registering functions and parameters on each token as appropriate.
 * The latter sets jump-point information
 * on tokens that constitute potential branch
 * points, in a single back-to-front scan of the token list.
 * This
 * yields a token list that can be executed front-to-back by
 * body methods available on the
 * {@link CSL.Engine} class.</p>
 *
 * <p>This top-level {@link CSL} object itself carries
 * constants that are needed during processing.</p>
 * @namespace A CSL citation formatter.
 */
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

	this.any = function(token,state,Item,item){
		//
		// assume false, return true on any single true hit
		//
		var ret = false;
		for each (var func in token.tests){
			var rawres = func.call(token,state,Item,item);
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

	this.none = function(token,state,Item,item){
		//
		// assume true, return false on any single true hit
		//
		var ret = true;
		for each (var func in this.tests){
			var rawres = func.call(token,state,Item,item);
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

	this.all = function(token,state,Item,item){
		//
		// assume true, return false on any single false hit
		//
		var ret = true;
		for each (var func in this.tests){
			var rawres = func.call(token,state,Item,item);
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
