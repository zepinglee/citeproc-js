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
if (!CSL) {
	load("./src/csl.js");
}

CSL.Util.PageRangeMangler = new Object();


CSL.Util.PageRangeMangler.getFunction = function(state){

	var rangerex = /([a-zA-Z]*)([0-9]+)\s*-\s*([a-zA-Z]*)([0-9]+)/;

	var stringify = function(lst){
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			if ("object" == typeof lst[pos]){
				lst[pos] = lst[pos].join("");
			};
		};
		return lst.join("");
	};

	var listify = function(str){
		var lst = str.split(/([a-zA-Z]*[0-9]+\s*-\s*[a-zA-Z]*[0-9]+)/);
		return lst;
	};

	var expand = function(str){
		var lst = listify(str);
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			var m = lst[pos].match(rangerex);
			if (m){
				if (!m[3] || m[1] == m[3]){
					if (m[4].length < m[2].length){
						m[4] = m[2].slice(0,(m[2].length-m[4].length)) + m[4];
					}
					if (parseInt(m[2],10) < parseInt(m[4],10)){
						m[3] = "-"+m[1];
						lst[pos] = m.slice(1);
					}
				}
			}
		};
		return lst;
	};

	var minimize = function(lst){
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			lst[pos][3] = _minimize(lst[pos][1], lst[pos][3]);
			if (lst[pos][2].slice(1) == lst[pos][0]){
				lst[pos][2] = "-";
			}
		};
		return stringify(lst);
	};

	var _minimize = function(begin, end){
		var b = (""+begin).split("");
		var e = (""+end).split("");
		var ret = e.slice();
		ret.reverse();
		if (b.length == e.length){
			var l = b.length;
			for (var pos=0; pos<l; pos += 1){
				if (b[pos] == e[pos]){
					ret.pop();
				} else {
					break;
				}
			}
		}
		ret.reverse();
		return ret.join("");
	};

	var chicago = function(lst){
		var l = lst.length;
		for (var pos=1; pos<l; pos += 2){
			if ("object" == typeof lst[pos]){
				var m = lst[pos];
				var begin = parseInt(m[1],10);
				var end = parseInt(m[3],10);
				if (begin > 100 && begin % 100 && parseInt((begin/100),10) == parseInt((end/100),10)){
					m[3] = ""+(end % 100);
				} else if (begin >= 10000){
					m[3] = ""+(end % 1000);
				}
			}
			if (m[2].slice(1) == m[0]){
				m[2] = "-";
			}
		}
		return stringify(lst);
	};

	//
	// The top-level option handlers.
	//
	if (!state.opt["page-range-format"]){
		var ret_func = function(str){
			return str;
		};
	} else if (state.opt["page-range-format"] == "expanded"){
		var ret_func = function(str){
			var lst = expand( str );
			return stringify(lst);
		};
	} else if (state.opt["page-range-format"] == "minimal") {
		var ret_func = function(str){
			var lst = expand(str);
			return minimize(lst);
		};
	} else if (state.opt["page-range-format"] == "chicago"){
		var ret_func = function(str){
			var lst = expand(str);
			return chicago(lst);
		};
	};
	return ret_func;
};

