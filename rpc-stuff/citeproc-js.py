#!/usr/bin/python

from spidermonkey import Runtime
rt = Runtime()
cx = rt.new_context()

cslcode = open("stripped.js").read()

cx.eval_script(cslcode)

test = '''
var builder = new CSL.Core.Build('<style><citation><text value="hello world"/></citation>></style>');
var obj = builder.build();
obj.citation.tokens.length
'''     

cx.eval_script(test)
