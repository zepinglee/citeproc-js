#!/usr/bin/env python
#-*- encoding: utf-8 -*-
""" Grind human-readable CSL tests into machine-readable form

    When invoked directly as a script, this module converts
    a set of human-readable CSL test files into the JSON
    format used for processor testing.
"""
import sys,os,re
import tempfile
from cStringIO import StringIO
try:
    import json
except:
    import simplejson as json

#
# Encoding non-ascii characters in the human readable test files 
# as JSON ordinarily causes a UnicodeEncodeError, if the Python
# default encoding is set to the (factory default) value of "ascii".
# I was unable to find a means of enabling UTF-8 support in
# simplejson, and have resorted to the Big Hammer Method, which
# involves reloading the sys module (to restore the
# setdefaultencoding method that Python ordinarily deletes on
# startup), and clobbering the system default value, replacing
# it with "utf-8".  This is said to be a hack, and is said to
# run the risk of subtle incompatibilities with other libraries,
# but it works here for Python versions > 2.1 or so.
# 
# For further details, see http://faassen.n--tree.net/blog/view/weblog/2005/08/02/0
# and the posts linked in the first paragraph of that blog entry. 
#
reload(sys)
sys.setdefaultencoding("utf-8") # Needs Python Unicode build !
    
class CslTestUtils:
    """ Constants and utility methods

    This provides a regular expression to identify data blocks within
    the human-readable tests files, a list of the valid CSL author
    field names, and a little utility method for building paths during
    processing.  These are shared with CslTests and with CslTest.
    """
    def __init__(self):
	self.CREATORS = ["author","editor","translator","recipient","interviewer"]
        self.CREATORS += ["composer","original-author","container-author","collection-editor"]
        self.RE_ELEMENT = '(?sm)^.*>>=.*%s[^\n]+(.*)\n<<=.*%s'
        self.RE_FILENAME = '^[a-z]+_[a-zA-Z0-9]+\.txt'

    
    def path(self,*elements):
        return os.path.join( os.getcwd(), *elements )

class CslTests(CslTestUtils):
    """ Control class for processing a set of tests

    Instantiates with a list of human-readable test names derived from
    the filesystem.  Provides a method for clearing the content
    of the machine-readable directory and processing the
    human-readable files.
    """
    def __init__(self, args=[], options={}):
        self.options = options
        CslTestUtils.__init__(self)
        self.tests = []
        self.args = args
        for filename in os.listdir( self.path( "humans" ) ):
            p = self.path("humans", filename)
            if not os.path.stat.S_ISREG( os.stat(p).st_mode ) or not re.match(self.RE_FILENAME,filename):
                continue
            if p.endswith("~") or p.endswith(".orig"):
                continue
            testname = os.path.splitext(filename)[0]
            if len(self.args) and not testname in self.args:
                continue
            self.tests.append(testname)
        self.tests.sort()

    def clear(self):
        for file in os.listdir( self.path("machines") ):
            p = self.path("machines", file)
            if os.path.stat.S_ISREG( os.stat(p).st_mode ):
                os.unlink( p )

    def process(self):
        if not len(self.args):
            self.clear()
        for testname in self.tests:
            test = CslTest(testname, options=self.options)
            test.load()
            test.parse()
            test.fix_names()
            test.validate(testname)
            test.dump()
        sys.stdout.write("\n")

class CslTest(CslTestUtils):
    """ Handler for an individual test file

    Instantiates with a single test name, and provides
    methods for loading the raw data, parsing and massaging
    the content, and dumping the result.
    """
    def __init__(self,testname, options={}):
        CslTestUtils.__init__(self)
        if options.be_verbose:
            sys.stdout.write( "%s\n" %testname)
        else:
            sys.stdout.write(".")
        sys.stdout.flush()
        self.options = options
        self.testname = testname
        self.data = {}

    def load(self):
        self.raw = open( "%s.txt" % (self.path("humans",self.testname),) ).read()

    def parse(self):
        for element in ["MODE","SCHEMA","CSL","RESULT"]:
            self.extract(element,required=True,is_json=False)
        self.extract("INPUT",required=True,is_json=True)
        self.extract("CITATIONS",required=False,is_json=True)
        self.extract("BIBENTRIES",required=False,is_json=True)

    def extract(self,tag,required=False,is_json=False):
        m = re.match(self.RE_ELEMENT %(tag,tag),self.raw)
        data = False
        if m:
            data = m.group(1).strip()
        elif required:
            print "Ooops, missing element: %s in test %s" %(tag,self.testname)
            sys.exit()
        if data != False:
            if is_json:
                data = json.loads(data)
            self.data[tag.lower()] = data

    def fix_names(self):
        """ Mangle name fields

        This method converts names from the shorthand format
        used in the "name" field in the INPUT area of the human-readable 
        test files to the more explicit format recognized by the processor
        API.
        """
        for item in self.data["input"]:
            for key in [unicode(i) for i in self.CREATORS]:
                if item.has_key(key):
                    for entry in item[key]:
                        one_char = len(entry["name"])-1
                        two_chars = one_char-1
                        entry["sticky"] = False
                        if entry["name"].endswith("!!"):
                            entry["literal"] = entry["name"][0:-2].strip()
                        else:
                            parsed = entry["name"]
                            if entry["name"].endswith("!"):
                                entry["sticky"] = True
                                parsed = entry["name"][0:-1].strip()
                            parsed = re.split("\s*,\s*",parsed)
                            if len(parsed) > 0:
                                m = re.match("^\s*([a-z]+)\s+(.*)",parsed[0])
                                if m:
                                    entry["prefix"] = m.group(1)
                                    entry["primary-key"] = m.group(2)
                                else:
                                    entry["primary-key"] = parsed[0]
                            if len(parsed) > 1:
                                entry["secondary-key"] = parsed[1];
                            if len(parsed) > 2:
                                m = re.match("\!\s*(.*)",parsed[2])
                                if m:
                                    entry["suffix"] = m.group(1)
                                    entry["comma_suffix"] = True
                                else:
                                    entry["suffix"] = parsed[2]
                        del entry["name"]

    def validate(self,testname):
        if not self.options.be_cranky:
            return
        if not os.path.exists("../../jing"):
            print "Error: jing not found as sibling of processor archive."
            sys.exit()
        if not os.path.exists("../csl/csl.rnc"):
            print "Error: csl.rnc not found in csl subdirectory of archive"
            sys.exit()
        tfd,tfilename = tempfile.mkstemp(dir=".")
        os.write(tfd,self.data["csl"])
        os.close(tfd)
        
        jfh = os.popen("java -jar ../../jing/bin/jing.jar -c ../csl/csl.rnc %s" % tfilename)
        success = True
        plural = ""
        while 1:
            line = jfh.readline()
            if not line: break
            line = line.strip()
            m = re.match(".*:([0-9]+):([0-9]+):  *error:(.*)",line)
            if m:
              if success:
                  print "\n##"
                  print "#### Error%s in CSL for test: %s" % (plural,testname)
                  print "##\n"
                  success = False
              print "  %s @ line %s" %(m.group(3).upper(),m.group(1))
              plural = "s"
        jfh.close()
        os.unlink(tfilename)
        if not success:
            print ""
            io = StringIO()
            io.write(self.data["csl"])
            io.seek(0)
            linepos = 1
            while 1:
                cslline = io.readline()
                if not cslline: break
                cslline = cslline.rstrip()
                print "%3d  %s" % (linepos,cslline)
                linepos += 1
            sys.exit()
        #print "Would continue"
        #sys.exit()
        

    def dump(self):
        if not os.path.exists( self.path("machines")):
            os.makedirs( self.path("machines"))
        tpath_out = "%s.json" % (self.path("machines", self.testname),)
        json.dump(self.data, open(tpath_out,"w+"), indent=4, sort_keys=True, ensure_ascii=False )
        

if __name__ == "__main__":
    from optparse import OptionParser
    usage = '''
      %prog [options] [[testname] ...]
'''.rstrip()

    prefix = "%s%s" % (os.path.curdir, os.path.sep)
    description=''' This script converts human-friendly test files for
the CSL bibliography system into the machine-friendly JSON format.
The script should be located in the top-level directory of the test
suite, with an immediate subdirectory %shumans/ that contains the
human-readable test files.  Machine-readable files will be written
into the %smachines/ subdirectory.  When the script is run without
options (or with the -v option only), the content of the %smachines/ 
directory will be deleted, and all files in %shumans/ directory will
be processed.  If the names of one or more tests are given as
arguments, existing files in %smachines/ will not be deleted, and only
the named test files will be processed.
'''.strip() % (prefix,prefix,prefix,prefix,prefix)

    parser = OptionParser(usage=usage,description=description,epilog="Happy testing!")
    parser.add_option("-v", "--verbose", dest="be_verbose",
                      default=False,
                      action="store_true", 
                      help='Display test names during processing.')
    parser.add_option("-c", "--cranky", dest="be_cranky",
                      default=False,
                      action="store_true", 
                      help='Attempt to validate CSL files before processing.')
    (options, args) = parser.parse_args()

    if len(args) > 0:
        options.be_verbose = True
    
    mypath = os.path.split(sys.argv[0])[0]
    if len(mypath):
        os.chdir(mypath)
    
    tests = CslTests( args=args, options=options )
    tests.process()

