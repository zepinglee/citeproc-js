#!/usr/bin/python

import os,sys

mypath = os.path.split(sys.argv[0])[0]
if len(mypath):
    os.chdir(mypath)

datalst = open("../ref/dates.txt").read().split('\n')

tests = []

template1 = '''
dojo.provide("tests.test_dateparse");

var sys = new RhinoTest();
var citeproc = new CSL.Engine(sys,"<style></style>");

doh.register("tests.dateparse", [%s
]);

'''

template2 = '''
        // doh.assertEqual("%s", res["%s"]);
'''.rstrip()

template4 = '''
        // doh.assertEqual(%d, (var c=0;for(pos in res){c+=1;}) );
'''.rstrip()

template3 = '''
    function test_dateparse%0.3d() {
        var res = citeproc.dateParse("%s");%s
    }
'''.strip()

asserts = 0

for line in datalst:
    line = line.strip()
    if not line: continue
    if line.startswith("#"): continue
    if line.startswith("-->"):
        line = line[3:].strip()
        line = line.split(",")
        m = {}
        for chunk in line:
            #print "(%s)" %chunk
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
    asserts = 0
    for key in test["result"].keys():
        asserts += 1
        results2 += template2 % (test["result"][key], key)
    results2 += template4 % asserts
    results3.append( template3 % ((pos+1),test["input"],results2) )

final = template1 % (',\n    '.join( results3 ),)

open("../tests/test_dateparse.js","w+").write(final)

print "Done!"
