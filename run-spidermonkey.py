#!/usr/bin/env python
#-*- encoding: utf-8 -*-

import sys
reload(sys)
sys.setdefaultencoding("utf-8") # Needs Python Unicode build!

import os,re
import spidermonkey
from time import time,ctime

try:
    import json
except:
    import simplejson as json

mypath = os.path.split(sys.argv[0])[0]
os.chdir(mypath)

if __name__ == "__main__":

    tstart = ctime(time())

    rt = spidermonkey.Runtime()
    cx = rt.new_context()

    # Dummy print function
    def myprint(*str):
        ret = str
        if type(str) == type(("tuple",)):
            ret = ""
            for s in str:
                if type(s) == type(None):
                    s = "undefined"
                if type(s) != type("string") and type(s) != type(0) and type(s) != type(u'x'):
                    s = s.toString()
                ret = "%s %s" % (ret,s)
        print ret.strip()
    cx.add_global("print",myprint)

    # Dummy readFile function
    def myReadFile(filename,encoding="UTF-8"):
        return open(filename).read().decode(encoding)
    cx.add_global("readFile",myReadFile)

    # Load the Dojo
    #  dojo ...
    dojo = open("./dojo-sm/dojo/dojo.js").read()
    cx.execute(dojo)
    # dojo.string ...
    dojostring = open("./dojo-sm/dojo/string.js").read()
    cx.execute(dojostring)
    # dojox.DocTest ...
    doctest = open("./dojo-sm/dojox/testing/DocTest.js").read()
    cx.execute(doctest)

    # Load D.O.H.
    #print "Loading test _rhinoRunner ..."
    runner = open("./dojo-sm/util/doh/_rhinoRunner.js").read()
    cx.execute(runner)

    #print "Loading test runner ..."
    runner = open("./dojo-sm/util/doh/runner.js").read()
    cx.execute(runner)

   # print "Loading test _rhinoRunner AGAIN ..."
    runner = open("./dojo-sm/util/doh/_rhinoRunner.js").read()
    cx.execute(runner)


    # Load locales
    locales = {}
    for filename in os.listdir("./locale"):
        p = "./locale/%s" % filename
        if not os.path.stat.S_ISREG( os.stat(p).st_mode ):
            continue
        if p.endswith("~") or p.endswith(".orig"):
            continue
        lang = filename.split("-")[1]
        locale = open("./locale/%s" % (filename,)).read()
        locales[lang] = locale
    cx.add_global("locale", locales)

    #print "Loading tests ..."
    cx.execute("var testobjects = new Object();")
    for filename in os.listdir("./std/machines"):
        if not filename.endswith(".json"):
            continue
        if not os.path.stat.S_ISREG( os.stat("./std/machines/%s" %filename).st_mode ):
            continue
        testname = os.path.splitext(filename)[0]
        tstr = open("./std/machines/%s" % (filename,)).read()
        cx.execute('testobjects["%s"] = %s;' %(testname,tstr))
    
    # Load rhino test runner framework, for internal tests
    rhinotester = open("./src/testing_rhino.js").read()
    cx.execute(rhinotester)

    # Load stdrhino test runner framework, for standard tests without special
    # Spidermonkey framework code
    stdrhinotester = open("./src/testing_stdrhino.js").read()
    cx.execute(stdrhinotester)

    # Load the Code
    rootfile = open("./citeproc.js").read()
    #rootfile = open("./src/csl.js").read()
    #m = re.split('load\("([^"]+)"\)',rootfile)
    cx.execute( re.sub("(?sm)//SNIP-START.*","",rootfile) )
    #if len(m) > 1:
    #    for pos in range(1,len(m),2):
    #        str = open( m[pos] ).read()
    #        cx.execute( str )

    # Load standard tests (dropped in favor of running tests through the
    # same frameworks as under Rhino -- which works, amazingly enough)
    if False:
        for filename in os.listdir("./tests"):
            if not filename.startswith("std_") or not filename.endswith(".js"):
                continue
            #if filename == "std_decorations.js":
            #    continue
            if len(sys.argv) > 1 and not filename.startswith(sys.argv[1]):
                continue
            mytest = open("./tests/%s" % (filename,)).read()
            cx.execute(mytest)

    runfile = open("./tests/run.js").read()
    runfile = re.sub("(?sm)(//SNIP-START|}\s*else\s*{).*","",runfile)
    m = re.split('require\("tests\.([^"]+)"\)',runfile)
    if len(m) > 1:
        for pos in range(1,len(m),2):
            print m[pos]
            str = open( "./tests/%s.js" % m[pos] ).read()
            cx.execute( str )
        

    print "Running tests ..."
    cx.execute("tests.run();")

    tend = ctime(time())

    print '%s <--------------START' % (tstart,)
    print '%s <--------------END' % (tend,)

    

    print "Ok"
