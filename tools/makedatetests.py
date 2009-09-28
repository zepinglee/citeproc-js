#!/usr/bin/python

import os,sys

mypath = os.path.split(sys.argv[0])[0]
if len(mypath):
    os.chdir(mypath)

datalst = open("../tests/dates.dat").read().split('\n')

tests = []

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
    
print tests
    