#!/bin/bash

cd $(dirname $0)
cd ../ref
./rst2html --stylesheet="./screen-citeprocjs.css" ./citeproc-doc.rst > ./citeproc-doc/index.html

if [ "$1" == "--upload" ]; then
  scp ./citeproc-doc/index.html gsl-nagoya-u.net:/http/pub/citeproc-doc.html
fi
