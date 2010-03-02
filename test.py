#!/usr/bin/python -u

import sys,os,re
from datetime import datetime
from stat import *
import tempfile
from cStringIO import StringIO
from cPickle import Pickler, Unpickler
import subprocess as sub 

try:
    import json
except:
    import simplejson as json

class ElementMissing(Exception):
    pass

class TooFewArgs(Exception):
    pass

class NoFilesError(Exception):
    pass

class FileNotFound(Exception):
    pass

class MissingHumansFile(Exception):
    pass

class NoLicense(Exception):
    pass

class ApplyLicense:

    def __init__(self):
        self.rex = "(?sm)^^(/\*.*?^\s*\*/\n*)(.*)"
        m = re.match(self.rex, open( os.path.join("src","load.js")).read() )
        if m:
            self.license = "%s\n" % m.group(1).strip()
        else:
            raise NoLicense
        print self.license

    def apply(self):
        for path in [".", "src", os.path.join("tests", "std"), os.path.join("tests","std","humans"),os.path.join("tests","std","bundled"), os.path.join("tests","std","machines"),os.path.join("tests","citeproc-js")]:
            for file in os.listdir( path ):
                self.process_file(path,file)

    def process_file(self,path,file):
        filepath = os.path.join( path, file)
        if not filepath.endswith(".js") and not filepath.endswith(".txt") and not filepath.endswith(".json") and not filepath.endswith("README.txt"): return
        text = open(filepath).read()
        oldtext = text
        m = re.match(self.rex,text)
        if m:
            text = "%s\n%s" % (self.license, m.group(2))
        else:
            text = "%s%s" % (self.license, text)
        if text.strip() != oldtext.strip():
            open(filepath,"w+").write(text)

class Bundle:
    
    def __init__(self):
        self.citeproc = "citeproc.js"
        f = ["load","queue","util_locale","util_processor","util_disambig"]
        f.extend(["util_nodes","build","state","util_integration","cmd_update"])
        f.extend(["cmd_bibliography","cmd_cite","node_bibliography","node_choose"])
        f.extend(["node_citation","node_date","node_datepart","node_elseif","node_else"])
        f.extend(["node_etal","node_group","node_if","node_info","node_institution"])
        f.extend(["node_institutionpart","node_key","node_label","node_layout","node_macro"])
        f.extend(["node_name","node_namepart","node_names","node_number","node_sort"])
        f.extend(["node_substitute","node_text","attributes","xmle4x","stack","util_abbrev"])
        f.extend(["util_parallel","obj_token","obj_ambigconfig","obj_blob","obj_number"])
        f.extend(["util","util_datenode","util_institutions","util_names","util_dates"])
        f.extend(["util_sort","util_substitute","util_number","util_page","util_flipflop"])
        f.extend(["formatters","formats","registry","disambig_names","disambig_cites"])
        f.extend(["disambig_citations"])
        self.files = f
    
    def deleteOldBundle(self):
        if os.path.exists( self.citeproc ):
            os.unlink(self.citeproc)

    def createNewBundle(self):
        file = ""
        for f in self.files:
            filename = os.path.join( "src", "%s.js"%f)
            ifh = open(filename)
            subfile = ifh.read()
            subfile = re.sub("(?sm)^\s*/\*.*?^\s*\*/","",subfile)
            subfile = re.sub("(?sm)^\s*//SNIP-START.*?^\s*//SNIP-END","",subfile)
            subfile = re.sub("(?sm)^\s*//.*?$","",subfile)
            subfile = re.sub("(?sm)^\s*load.*?$","",subfile)
            subfile = re.sub("(?sm)^\s*\n","",subfile)
            file += subfile
        open(self.citeproc,"w+").write(file)

class Params:
    def __init__(self,opt,args,force=None):
        self.opt = opt
        self.args = args
        self.script = os.path.split(sys.argv[0])[1]
        self.pickle = ".".join((os.path.splitext( self.script )[0], "pkl"))
        self.force = force
        self.files = {}
        self.files['humans'] = {}
        self.files['machines'] = []
        mypath = os.path.split(sys.argv[0])[0]
        self.base = os.path.join( mypath )
        if len(self.base):
            os.chdir(self.base)
        self.tests = os.path.join( os.getcwd(), "tests")
        self.runners = os.path.join( self.tests, "runners")
        self.makedirs()
        self.initConfig()

    def makedirs(self):
        for dir in ("std","custom","citeproc-js","runners"):
            p = os.path.join(self.tests, dir)
            if not os.path.exists(p):
                os.makedirs(p)
        for dir in ("std","custom"):
            for subdir in ("humans","machines"):
                p = os.path.join( self.tests, dir, subdir)
                if not os.path.exists(p):
                    os.makedirs(p)

    def path(self):
        if self.force:
            return ( os.path.join( self.tests, self.force), )
        else:
            return (os.path.join(self.tests,"custom"),os.path.join(self.tests,"std"))

    def getSourcePaths(self):
        if self.opt.processor:
            print "opt.processor is WIP"
        else:
            if len(self.args) == 2:
                filename = "%s_%s.txt" % tuple(self.args)
                filepath = None
                for path in self.path():
                    if os.path.exists( os.path.join(path, "humans", filename)):
                        filepath = (path,os.path.join("humans", filename))
                        break
                if not filepath:
                    raise MissingHumansFile(filename,[os.path.join(p,"humans") for p in self.path()])
                self.files['humans'][filename] = (filepath)
            else:
                for path in self.path():
                    for filename in os.listdir( os.path.join(path,"humans")):
                        if not filename.endswith(".txt"): continue
                        if args:
                            if not filename.startswith("%s_" % self.args[0]): continue
                        if not self.files['humans'].has_key(filename):
                            self.files['humans'][filename] = (path,os.path.join("humans",filename))
    
    def clearSource(self):
        mstd = os.path.join( "tests", "std", "machines")
        mcustom = os.path.join( "tests", "custom", "machines")
        for file in os.listdir(mstd):
            if not file.endswith(".json"): continue
            os.unlink( os.path.join(mstd, file) )
        for file in os.listdir(mcustom):
            if not file.endswith(".json"): continue
            os.unlink( os.path.join(mcustom, file) )

    def refreshSource(self,force=False):
        groups = {}
        for filename in self.files['humans'].keys():
            hpath = self.files['humans'][filename]
            mpath = os.path.join( self.files['humans'][filename][0], "machines", "%s.json" % filename[:-4] )
            hp = os.path.sep.join( hpath )
            mp = os.path.join( mpath )
            #if force:
            #    self.grindFile(hpath,filename,mp)
            if not os.path.exists( mp ):
                self.grindFile(hpath,filename,mp)
                if self.opt.verbose:
                    print "Created: %s" % mp
            hmod = os.stat(hp)[ST_MTIME]
            mmod = os.stat(mp)[ST_MTIME]
            if hmod > mmod:
                if self.opt.verbose:
                    print "Old: %s" % mp
                self.grindFile(hpath,filename,mp)
            if not self.opt.processor:
                m = re.match("([a-z]*)_.*",filename)
                if m:
                    groupkey = m.group(1)
                    if not groups.has_key(groupkey):
                        groups[groupkey] = {"mtime":0,"tests":[]}
                    groups[groupkey]["tests"].append(filename)
                    if hmod > groups[groupkey]["mtime"]:
                        groups[groupkey]["mtime"] = mmod
        if len(self.args) < 2:
            for group in groups.keys():
                gp = os.path.join("tests","std","bundled","%s.js"%group)
                needs_gp = True
                if os.path.exists( gp ):
                    needs_gp = False
                    gt = os.stat(gp)[ST_MTIME]
                # if force or needs_gp or groups[group]["mtime"] > gt:
                if needs_gp or groups[group]["mtime"] > gt:
                    if self.opt.verbose:
                        sys.stdout.write("!")
                    ofh = open( os.path.join("tests","std", "bundled","%s.js" % group), "w+" )
                    group_text = '''dojo.provide("std.%s");
doh.register("std.%s", [
''' % (group,group)
                    ofh.write(group_text)
                    for filename in [x[:-4] for x in groups[group]["tests"]]:
                        if self.opt.verbose:
                            sys.stdout.write("+")
                        entry_text = '''    function(){
        var test = new StdRhinoTest("%s");
        doh.assertEqual(test.result, test.run());
    }, 
''' % filename
                        ofh.write(entry_text)
                    ofh.write("]);\n")

    def buildRunner(self):
        has_files = False
        ofh = open( os.path.join( "tests","runners","run.js"), "w+")
        header = 'dojo.require("doh.runner");\n'
        ofh.write(header)
        if self.opt.processor:
            testpath = os.path.join("tests","citeproc-js")
            nick = "citeproc_js"
        else:
            testpath = os.path.join("tests","std","bundled")
            nick = "std"
        if len(args) == 2:
            keys = self.files['humans'].keys()
            if len(keys):
                file = keys[0]
                set = os.path.split( self.files['humans'][file][0] )[-1]
                body = '''doh.register("%s.%s", [
    function(){
        var test = new StdRhinoTest("%s","%s");
        doh.assertEqual(test.result, test.run());
    },
])
''' % (set,file[:-4],file[:-4],set)
                ofh.write(body)
                has_files = True
        else:
            count = 0
            for file in [x for x in os.listdir(testpath)]:
                if not file.endswith('.js'): continue
                if len(self.args) and not file.startswith('%s.'%args[0]): continue
                has_files = True
                ofh.write('dojo.require("%s.%s");\n' % (nick,file[:-3]))
        ofh.write("tests.run();")
        if not has_files:
            raise NoFilesError

    def grindFile(self,hpath,filename,mp):
        if self.opt.verbose:
            sys.stdout.write(".")
        test = CslTest(opt,hpath,filename)
        test.parse()
        test.repair()
        test.dump(mp)

    def runTests(self,bundle=False):
        cp = ConfigParser()
        cp.read( os.path.join("tests","config","test.cnf") )
        if self.opt.tracemonkey:
            
            engine = cp.get("tracemonkey","command")
            nick = "tracemonkey"
        else:
            engine = cp.get("rhino","command")
            nick = "rhino"
        bundleext = ""
        if bundle:
            bundleext = "-bundled"
        runpath = os.path.join("tests","runners","%s%s.js" %(nick,bundleext))
        command = "%s %s" % (engine,runpath)
        ifh = sub.Popen(command,shell=True, stdout=sub.PIPE).stdout
        while 1:
            line = ifh.readline()
            if not line: break
            sys.stdout.write(line)

    def validateSource(self):
        skip_to_pos = 0
        if os.path.exists( self.pickle ):
            upfh = open(self.pickle)
            unpickler = Unpickler(upfh)
            old_opt,old_pos = unpickler.load()
            if self.opt == old_opt:
                skip_to_pos = old_pos
        pos = -1
        files = self.files['humans'].keys()
        files.sort()
        for filename in files:
            pos += 1
            if pos < skip_to_pos: continue
            p = self.files['humans'][filename]
            test = CslTest(opt,p,filename,pos=pos)
            test.parse()
            test.validate()
        if os.path.exists( self.pickle ):
            os.unlink(self.pickle)

    def initConfig(self):

        if not os.path.exists( os.path.join("tests", "config") ):
            os.makedirs( os.path.join("tests", "config") )

        if not os.path.exists( os.path.join("tests", "config", "test.cnf") ):
            test_template = '''[tracemonkey]
command: /home/bennett/src/jslibs/Linux_32_opt/jshost -u

[rhino]
command: java -client -jar ./rhino/js-1.7R2.jar -opt 8
'''
            ofh = open( os.path.join("tests", "config", "test.cnf"), "w+" )
            ofh.write(test_template)
            ofh.close()

class CslTest:
    def __init__(self,opt,hpath,testname,pos=0):
        self.opt = opt
        self.pos = pos
        self.testname = testname
        self.hpath = hpath
        self.hp = os.path.sep.join( hpath )
	self.CREATORS = ["author","editor","translator","recipient","interviewer"]
        self.CREATORS += ["composer","original-author","container-author","collection-editor"]
        self.RE_ELEMENT = '(?sm)^(.*>>=.*%s[^\n]+)(.*)(\n<<=.*%s.*)'
        self.RE_FILENAME = '^[a-z]+_[a-zA-Z0-9]+\.txt$'
        self.script = os.path.split(sys.argv[0])[1]
        self.pickle = ".".join((os.path.splitext( self.script )[0], "pkl"))
        self.data = {}
        self.raw = open( os.path.sep.join(hpath)).read()

    def parse(self):
        for element in ["MODE","CSL","RESULT"]:
            self.extract(element,required=True,is_json=False)
            if element == "CSL" and self.data['csl'].endswith('.csl'):
                self.data['csl'] = open( os.path.join("tests", "styles", self.data['csl'])).read()
        self.extract("INPUT",required=True,is_json=True)
        self.extract("CITATION-ITEMS",required=False,is_json=True)
        self.extract("CITATIONS",required=False,is_json=True)
        self.extract("BIBENTRIES",required=False,is_json=True)
        self.extract("BIBSECTION",required=False,is_json=True)

    def extract(self,tag,required=False,is_json=False):
        m = re.match(self.RE_ELEMENT %(tag,tag),self.raw)
        data = False
        if m:
            data = m.group(2).strip()
        elif required:
            raise ElementMissing(self.script,tag,self.testname)
        if data != False:
            if is_json:
                data = json.loads(data)
            self.data[tag.lower().replace('-','_')] = data
        else:
            self.data[tag.lower().replace('-','_')] = False

    def repair(self):
        self.fix_dates()
        input_str = json.dumps(self.data["input"],indent=4,sort_keys=True,ensure_ascii=False)
        m = re.match(self.RE_ELEMENT % ("INPUT", "INPUT"),self.raw)
        newraw = m.group(1) + "\n" + input_str + m.group(3)
        if self.data["citation_items"]:
            citations_str = json.dumps(self.data["citation_items"],indent=4,sort_keys=True,ensure_ascii=False)
            m = re.match(self.RE_ELEMENT % ("CITATION-ITEMS", "CITATION-ITEMS"),self.raw)
            newraw = m.group(1) + "\n" + citations_str + m.group(3)
        if self.data["citations"]:
            citations_str = json.dumps(self.data["citations"],indent=4,sort_keys=True,ensure_ascii=False)
            m = re.match(self.RE_ELEMENT % ("CITATIONS", "CITATIONS"),self.raw)
            newraw = m.group(1) + "\n" + citations_str + m.group(3)
        if self.raw != newraw:
            open(self.hp,"w+").write(newraw)

    def fix_dates(self):
        for pos in range(0, len(self.data["input"]),1):
            for k in ["issued", "event", "accessed", "container", "original-date"]:
                if self.data["input"][pos].has_key(k):
                    newdate = []
                    if not self.data["input"][pos][k].has_key("date-parts"):
                        start = []
                        for e in ["year","month","day"]:
                            if self.data["input"][pos][k].has_key(e):
                                start.append( self.data["input"][pos][k][e] )
                                self.data["input"][pos][k].pop(e)
                            else:
                                break
                        if start:
                            newdate.append(start)
                        end = []
                        for e in ["year_end","month_end","day_end"]:
                            if self.data["input"][pos][k].has_key(e):
                                end.append( self.data["input"][pos][k][e] )
                                self.data["input"][pos][k].pop(e)
                            else:
                                break
                        if end:
                            newdate.append(end)
                        self.data["input"][pos][k]["date-parts"] = newdate

    def dump(self, mpath):
        json.dump(self.data, open(mpath,"w+"), indent=4, sort_keys=True, ensure_ascii=False )

    def validate(self):
        if self.opt.verbose:
            print self.testname
        if not os.path.exists(os.path.join("..","jing")):
            print "Error: jing not found as sibling of processor archive."
            sys.exit()
        m = re.match("(?sm).*version=\"([.0-9a-z]+)\".*",self.data["csl"])
        if m:
            rnc_path = os.path.join("csl","%s" % m.group(1), "csl.rnc")
        else:
            print "Error: Unable to find CSL version in %s" % self.hp
            sys.exit()
        tfd,tfilename = tempfile.mkstemp(dir=".")
        os.write(tfd,self.data["csl"])
        os.close(tfd)
        
        jfh = os.popen("java -jar %s -c %s %s" % (os.path.join("..","jing","bin","jing.jar"),rnc_path,tfilename))
        success = True
        plural = ""
        while 1:
            line = jfh.readline()
            if not line: break
            line = line.strip()
            e = re.match("^fatal:",line)
            if e:
                print line
                sys.exit()
            m = re.match(".*:([0-9]+):([0-9]+):  *error:(.*)",line)
            if m:
              if success:
                  print "\n##"
                  print "#### Error%s in CSL for test: %s" % (plural,self.hp)
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
            pfh = open( self.pickle,"w+")
            pickler = Pickler( pfh )

            pickler.dump( (opt, self.pos) )
            sys.exit()
        
 
if __name__ == "__main__":

    from ConfigParser import ConfigParser
    from optparse import OptionParser

    os.environ['LANG'] = "en_US.UTF-8"

    usage = '\n%prog [options] [<group> [testname]]\n%prog -p [options] [testname]'

    description="This script."

    parser = OptionParser(usage=usage,description=description,epilog="Happy testing!")
    parser.add_option("-T", "--tracemonkey", dest="tracemonkey",
                      default=False,
                      action="store_true", 
                      help='Use the tracemonkey JS engine, rather than the Rhino default.')
    parser.add_option("-c", "--cranky", dest="cranky",
                      default=False,
                      action="store_true", 
                      help='Attempt to validate style code for testing against the CSL schema.')
    parser.add_option("-g", "--grind", dest="grind",
                      default=False,
                      action="store_true", 
                      help='Force grinding of human-readable test code into machine-readable form.')
    parser.add_option("-s", "--standard", dest="testrun",
                      default=False,
                      action="store_true", 
                      help='Run tests.')
    parser.add_option("-r", "--release", dest="bundle",
                      default=False,
                      action="store_true", 
                      help='Bundle processor, apply license to files, and test with bundled code.')
    parser.add_option("-p", "--processor", dest="processor",
                      default=False,
                      action="store_true", 
                      help='Run processor tests (cannot be used with -c, -g or -s opts, takes only test name as single argument).')
    parser.add_option("-v", "--verbose", dest="verbose",
                      default=False,
                      action="store_true", 
                      help='Display test names during processing.')
    (opt, args) = parser.parse_args()

    if not opt.testrun and not opt.grind and not opt.cranky and not opt.processor and not opt.bundle:
        parser.print_help()
        sys.exit()
    
    # Testing sequence:
    # + Get single tests working
    #   Get automatic grinding for single tests working
    #   Get forced grinding for single tests working
    #   Get forced grinding and testing for single tests working
    #   Get CSL integrity check working for single tests
    #   Check running of all tests
    #   Check grinding of all tests followed by testing
    #   Check CSL integrity check of all tests

    #
    # Validation
    #
    if opt.bundle and (opt.processor or opt.grind or opt.cranky or opt.testrun or len(args)):
        print parser.print_help()
        print "\nError: Option -r must be used alone"
        sys.exit()
    if opt.processor and (opt.grind or opt.cranky or opt.testrun):
        parser.print_help()
        print "\nError: Option -p cannot be used with options -c, -g or -s.\n"
        sys.exit()
    elif opt.processor and len(args) and len(args) != 1:
        parser.print_help()
        print "\nError: Use only one argument (the test name) with the -p option.\n"
        sys.exit()
    elif (opt.grind or opt.cranky or opt.testrun) and len(args) and len(args) != 2 and len(args) != 1:
        parser.print_help()
        print "\nError: Use one or two arguments with the -c, -g or -s options (group name plus"
        print "       optionally the test name).\n"
        sys.exit()

    #
    # Set up paths engine
    # 
    if opt.processor:
        params = Params(opt,args,force="citeproc_js")
    elif len(args) < 2:
        params = Params(opt,args,force="std")
    else:
        params = Params(opt,args)

    #
    # Will do something, so issue date stamp
    #
    start = datetime.now()
    START="%s:%s:%s <--------------START" % (start.hour,start.minute,start.second)
    print START

    if opt.bundle:
        opt.grind = True
        opt.verbose = True
        opt.testrun = True
    try:
        if opt.cranky or opt.grind or opt.testrun:
            params.getSourcePaths()
            if opt.grind:
                params.clearSource()
                params.refreshSource(force=True)
                print ""
            else:
                params.refreshSource()
            if opt.cranky:
                params.validateSource()
            if opt.bundle:
                bundle = Bundle()
                bundle.deleteOldBundle()
                bundle.createNewBundle()
                license = ApplyLicense()
                license.apply()
            if opt.testrun:
                params.buildRunner()
                params.runTests(bundle=opt.bundle)
        elif opt.processor:
            print "one"
            params.buildRunner()
            print "two"
            params.runTests()
            print "three"
    except (KeyboardInterrupt, SystemExit):
        for file in os.listdir("."):
            if not file.startswith("tmp") or not len(file) == 9: continue
            os.unlink(file)
        sys.exit()
    except MissingHumansFile as error:
        parser.print_help()
        print '''\nError: File \"%s\" not found.
       Looked in:''' % error[0]
        for path in error[1]:
            print '         %s' % path
    except NoFilesError:
        print '\nError: No files to process!\n'
    except NoLicense:
        print '\nError: No license found in load.js'

    end = datetime.now()
    END="%s:%s:%s <--------------END" % (end.hour,end.minute,end.second)
    print END

    diff = end-start
    print "Time: %s seconds" % (diff.seconds)
