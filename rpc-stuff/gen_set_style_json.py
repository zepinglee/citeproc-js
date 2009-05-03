#! /usr/bin/env python

try:
    import json
except:
    import simplejson as json


style = open("./set_style.csl").read()

method = "setStyle"
params = [style]

command = { "method": method, "params": params }

open("./set_style.json","w+").write( json.dumps(command) )
