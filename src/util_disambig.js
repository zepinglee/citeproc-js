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
CSL.cloneAmbigConfig = function(config,oldconfig,itemID){
	var ret = new Object();
	ret["names"] = new Array();
	ret["givens"] = new Array();
	ret["year_suffix"] = false;
	ret["disambiguate"] = false;
	for (var i in config["names"]){
		var param = config["names"][i];
		if (oldconfig && oldconfig["names"][i] != param){
			// print("hello "+i);
			this.tmp.taintedItemIDs[itemID] = true;
			oldconfig = false;
		};
		ret["names"][i] = param;
	};
	for (var i in config["givens"]){
		var param = new Array();
		for (var j in config["givens"][i]){
			// condition at line 312 of disambiguate.js protects against negative
			// values of j
			if (oldconfig && oldconfig["givens"][i] && oldconfig["givens"][i][j] != config["givens"][i][j]){
				// print("hello "+i+":"+j);
				this.tmp.taintedItemIDs[itemID] = true;
				oldconfig = false;
			};
			param.push(config["givens"][i][j]);
		};
		ret["givens"].push(param);
	};
	if (oldconfig && oldconfig["year_suffix"] != config["year_suffix"]){
		// print("hello year_suffix");
		this.tmp.taintedItemIDs[itemID] = true;
		oldconfig = false;
	}
	ret["year_suffix"] = config["year_suffix"];
	if (oldconfig && oldconfig["year_suffix"] != config["year_suffix"]){
		// print("hello disambiguate");
		this.tmp.taintedItemIDs[itemID] = true;
		oldconfig = false;
	}
	ret["disambiguate"] = config["disambiguate"];
	return ret;
};



