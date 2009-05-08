dojo.provide("csl.tests");
if (!CSL){
	load("./src/csl.js");
}

/**
 * Static functions for reading and running standard CSL tests.
 * <p>The functions here are specifically designed for test-bed
 * operation of the distribution source.  Implementors may wish
 * to reimplement this module to confirm operation in their
 * local environment.</p>
 * @namespace Tests
 */
CSL.System.Tests = function(){};

CSL.System.Tests.getTest = function(myname){
	var test;
	var filename = "std/machines/" + myname + ".json";
	//
	// Clean up the CSL token string.
	var teststring = readFile(filename, "utf8");
	try {
		eval( "test = "+teststring );
	} catch(e){
		throw e + teststring;
	}
	//
	// Set up the token string to use for formatting.
	if (test.mode == "bibliography"){
		var render = "makeBibliography";
	} else {
		var render = "makeCitationCluster";
	}
	// Build run function.
	test.run = function(){
		var builder = new CSL.Core.Build(this.csl);
		var raw = builder.build();
		var configurator = new CSL.Core.Configure(raw);
		var style = configurator.configure();
		if (this.flipflops){
			for each (var ff in this.flipflops){
				style.fun.flipflopper.register( ff["start"], ff["end"], ff["func"], ff["alt"], ff["additive"] );
			}
		}
		CSL.System.Tests.fixNames(this.input,myname);
		for each (var item in this.input){
			style.fun.retriever.setInput(style,item);
			style.registry.insert(style,item);
		}
		if (this.citations){
			for each (var cite_cluster in this.citations){
				var cluster = [];
				for each (var cite in cite_cluster){
					for each (var datem in this.input){
						if (datem.id == cite.id){
							cluster.push(datem);
							break;
						}
					}
				}
				var ret = style[render](cluster);
			}
		} else {
			var ret = style[render](this.input);
		}
		return ret;
	};
	return test;
};


CSL.System.Tests.fixNames = function(itemlist,myname){
	for each (obj in itemlist){
		if (!obj.id){
			throw "No id for object in: "+myname;
		}
		for each (key in ["author","editor","translator"]){
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
						print("\n---> b/f split: "+parsed);
						parsed = parsed.split(/\s*,\s*/);
						print("---> a/f split: "+parsed);
						
						if (parsed.length > 0){
							var m = parsed[0].match(/^\s*([a-z]+)\s+(.*)/);
							if (m){
								entry.prefix = m[1];
								entry["primary-key"] = m[2];
							} else {
								entry["primary-key"] = parsed[0];
							}
						}
						if (parsed.length > 1){
							entry["secondary-key"] = parsed[1];
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
	return itemlist;
};
