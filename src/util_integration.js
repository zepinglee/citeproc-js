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
CSL.Engine.prototype.setCitationId = function(citation){
	var ret = false;
	if (!citation.citationID){
		ret = true;
		var id = Math.floor(Math.random()*100000000000000);
		while (true){
			var direction = 0;
			if (!this.registry.citationreg.citationById[id]){
				citation.citationID = id.toString(32);
				break;
			} else if (!direction && id < 50000000000000){
				direction = 1;
			} else {
				direction = -1;
			}
			if (direction == 1){
				id++;
			} else {
				id--;
			};
		};
	};
	this.registry.citationreg.citationById[citation.citationID] = citation;
	return ret;
};
