#!/usr/bin/python

import re,os,sys

mypath = os.path.split(sys.argv[0])[0]
os.chdir(mypath)

REX = "(?ms)^^(/\*.*?\n\s*\*/)(.*)"

m = re.match(REX, open("../src/load.js").read())


if m:
    license = m.group(1)
else:
    print "Oops, no license in csl.js"
    sys.exit()


print license
    
for path in ["../src", "../tests/std", "../tests/std/humans","../tests/javascript", "../tests/std/machines"]:
    for file in os.listdir( path ):
        if not file.endswith(".js") and not file.endswith(".txt") and not file.endswith(".json"): continue
        if file == "README.txt": continue
        text = open("%s/%s" %(path,file)).read()
        m = re.match(REX,text)
        if m:
            text = "%s%s" % (license, m.group(2))
        else:
            text = "%s\n%s" % (license, text)
        open("%s/%s" %(path,file),"w+").write(text)
                        
