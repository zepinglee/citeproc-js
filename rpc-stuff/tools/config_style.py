#! /usr/bin/env python

import sys,os

try:
    import json
except:
    import simplejson as json

mypath = os.path.split(sys.argv[0])[0]
os.chdir(mypath)


style = open("../src-csl/style.csl").read()

method = "setStyle"
params = [style]

command = { "method": method, "params": params }

open("../data/style.json","w+").write( json.dumps(command) )
