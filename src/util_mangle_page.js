/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
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
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
if (!CSL) {
	load("./src/csl.js");
}

CSL.Util.PageRangeMangler = new Object();


CSL.Util.PageRangeMangler.getFunction = function(state){
	if (!state.opt["page-range-format"]){
		var ret_func = function(str){
			return str;
		};
	} else if (state.opt["page-range-format"] == "expanded"){
		var ret_func = function(str){
			return expand(str);
		};
	} else if (state.opt["page-range-format"] == "minimal") {
		var ret_func = function(str){
			str = expand(str);
			return minimize(str);
		};
	} else if (state.opt["page-range-format"] == "chicago"){
		var ret_func = function(str){
			str = expand(str);
			return chicago(str);
		};
	};
	var expand = function(str){
		print("do something to expand page ranges");
	};
};

CSL.Util.PageRangeMangler.expand = function(str){
};

CSL.Util.PageRangeMangler._expand = function(str){
};

CSL.Util.PageRangeMangler.minimize = function(str){
};

CSL.Util.PageRangeMangler._minimize = function(str){
};

CSL.Util.PageRangeMangler.chicago = function(str){
};

CSL.Util.PageRangeMangler._chicago = function(str){
};


/*
 * #!/usr/bin/python
 *
 * from operator import idiv, mod
 * def numStrDiff(begin, end):
 *     b = list(str(begin))
 *     e = list(str(end))
 *     ret = e[:]
 *     ret.reverse()
 *     if len(b) == len(e):
 *         for pos in range(0,len(b),1):
 *             if b[pos] == e[pos]:
 *                 ret.pop()
 *             else:
 *                 ret.reverse()
 *                 break
 *     return "".join(ret)
 *
 *
 * def collapse(begin, end, RESULT):
 *     print "Orig: %d to %d" % (begin, end)
 *     if begin > 100 and mod(begin, 100) and idiv(begin, 100) == idiv(end, 100):
 *         ret = (str(begin) + "-" + str(mod(end,100)))
 *     elif begin >= 10000:
 *         ret = (str(begin) + "-"  + numStrDiff(begin, end))
 *     else:
 *         ret = (str(begin) + "-" + str(end))
 *     if ret == RESULT:
 *         ok = " ... ok"
 *     else:
 *         ok = " ... FAIL (expected %s)" % RESULT
 *     print "  Result: %s%s" %(ret,ok)
 *     return ret
 *
 * collapse(101, 108, "101-8")
 *
 * collapse(3,10, "3-10")
 * collapse(71,72, "71-72")
 * collapse(96,117, "96-117")
 * collapse(100,104, "100-104")
 * collapse(600,613, "600-613")
 * collapse(1100,1123, "1100-1123")
 * collapse(107,108, "107-8")
 * collapse(505,517, "505-17")
 * collapse(1002,1006, "1002-6")
 * collapse(321,325, "321-25")
 * collapse(415,532, "415-532")
 * collapse(1536,1538, "1536-38")
 * collapse(11564,11568, "11564-68")
 * collapse(11564,11578, "11564-78")
 * collapse(13792,13803, "13792-803")
 * #
 * # The following two tests mail be failing or passing, depending on
 * # the rule applied.  Do the following come from different editions
 * # of CMS, or is the first of the two trying to fix a single algorithm
 * # to cover page ranges and years?
 * #
 * # Compare http://www.aahn.org/guidelines.html
 * # ... and http://msupress.msu.edu/journals/fch/admin/FCH%20Style%20Sheet%2015.pdf
 * #
 * collapse(1496,1504, "1496-1504")
 * collapse(2787,2816, "2787-2816")
 */
