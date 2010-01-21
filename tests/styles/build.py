#!/usr/bin/env python

import sys,os,re
from xml.etree import ElementTree


if __name__ == "__main__":
    from optparse import OptionParser
    usage = '''
      %prog [options] [[testname] ...]
'''.rstrip()

    description='''
      This is a script to build a CSL style file from a simple config file and a bundle of
      library macros and sort key blocks.
    '''
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
