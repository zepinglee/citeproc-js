#! /usr/bin/env python

import sys, re
import os,os.path
from spidermonkey import Runtime

try:
    import json
except:
    import simplejson as json

import traceback

mypath = os.path.split(sys.argv[0])[0]
os.chdir(mypath)

if __name__ == '__main__':

    rt = Runtime()
    cx = rt.new_context()

    print "Loading citeproc ..."
    cslcode = open("./citeproc.js").read()
    cx.eval_script(cslcode)

    #print "Loading locales ..."
    locales = {}
    for filename in os.listdir("./locale"):
        lang = filename.split("-")[1]
        locale = open("./locale/%s" % (filename,)).read()
        #locale = re.sub("<\?[^>]*>\n*","",locale)
        #print "setting locale: "+locale
        #print "setting locale ..."
        locales[lang] = locale
    localejson = json.dumps(locales)
    cx.eval_script("var locale = %s" % (localejson,) )

    #print "Loading tests ..."
    cx.eval_script("testobjects = new Object();")
    for filename in os.listdir("./std/machines"):
        testname = os.path.splitext(filename)[0]
        fh = open("./std/machines/%s" % (filename,))
        str = fh.read()
        str = json.dumps(str)
        cx.eval_script("testobjects[\"%s\"] = %s" % (testname,str,))

    #print "Loading retrieval functions ..."
    system = open("./src/tests-sm.js").read()
    cx.eval_script(system)

    #print "Loading dojo ..."
    dojo = open("./dojo-sm/dojo/dojo.js").read()
    cx.eval_script(dojo)

    #print "Loading dojo.string ..."
    dojostring = open("./dojo-sm/dojo/string.js").read()
    cx.eval_script(dojostring)

    #print "Loading dojox.DocTest ..."
    doctest = open("./dojo-sm/dojox/testing/DocTest.js").read()
    cx.eval_script(doctest)

    #print "Loading test _rhinoRunner ..."
    runner = open("./dojo-sm/util/doh/_rhinoRunner.js").read()
    cx.eval_script(runner)

    #print "Loading test runner ..."
    runner = open("./dojo-sm/util/doh/runner.js").read()
    cx.eval_script(runner)

   # print "Loading test _rhinoRunner AGAIN ..."
    runner = open("./dojo-sm/util/doh/_rhinoRunner.js").read()
    cx.eval_script(runner)

    #print "Loading test run functions ..."
    for filename in os.listdir("./tests"):
        if not filename.startswith("std_") or not filename.endswith(".js"):
            continue
        #if not filename == "std_fullstyles.js":
        #    continue
        if filename == "std_decorations.js":
            continue
        if len(sys.argv) > 1 and not filename.startswith(sys.argv[1]):
            continue
        run = open("./tests/%s" % (filename,)).read()
        cx.eval_script(run)

    print "Running tests ..."
    cx.eval_script("tests.run();")

    sys.exit()
