#!/usr/bin/python

import os,sys

mypath = os.path.split(sys.argv[0])[0]
if len(mypath):
    os.chdir(mypath)

datalst = open("../tests/dates.dat").read().split('\n')

tests = []

template1 = '''
dojo.provide("tests.test_dateparse");

doh.register("tests.dateparse", [%s
]);

'''

template2 = '''
        doh.assertEqual("%s", res["%s"]);
'''.rstrip()

template3 = '''
    function test_dateparse%0.3d() {
        var res = CSL.dateParse("%s");%s
    }
'''.strip()

for line in datalst:
    line = line.strip()
    if not line: continue
    if line.startswith("#"): continue
    if line.startswith("-->"):
        line = line[3:].strip()
        line = line.split(",")
        m = {}
        for chunk in line:
            print "(%s)" %chunk
            t = chunk.split("=")
            t[1] = t[1].strip('"')
            m[t[0]] = t[1]
        continue
    test = {}
    test["input"] = line
    test["result"] = m
    tests.append(test)

results3 = []

for pos in range(0, len(tests), 1):
    test = tests[pos]
    results2 = ''
    for key in test["result"].keys():
        results2 += template2 % (test["result"][key], key)
    results3.append( template3 % ((pos+1),test["input"],results2) )

final = template1 % (',\n    '.join( results3 ),)

open("../tests/test_dateparse.js","w+").write(final)
