#!/usr/bin/python

import sys

text = open(sys.argv[1]).read().decode("utf8")

for char in text:
    if ord(char) > 256:
        sys.stdout.write("\u%s" % (hex(ord(char))[2:],))
    else:
        sys.stdout.write(char)
        
        
    