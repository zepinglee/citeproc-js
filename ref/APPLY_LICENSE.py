#!/usr/bin/python

import re,os,sys

mypath = os.path.split(sys.argv[0])[0]
os.chdir(mypath)

REX = "(?ms)^^(/\*.*?\n\s*\*/)(.*)"

m = re.match(REX, open("../src/csl.js").read())


if m:
    license = m.group(1)
else:
    print "Oops, no license in csl.js"
    sys.exit()


for path in ["../src", "../std", "../std/humans","../tests"]:
    for file in os.listdir( path ):
        if not file.endswith(".js") and not file.endswith(".txt"): continue
        if file == "README.txt": continue
        text = open("%s/%s" %(path,file)).read()
        m = re.match(REX,text)
        if m:
            text = "%s%s" % (license, m.group(2))
        else:
            text = "%s\n%s" % (license, text)
        open("%s/%s" %(path,file),"w+").write(text)
                        