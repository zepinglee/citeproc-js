#!/bin/bash

cd $(dirname $0)

cd ../ref/citeproc-doc
./rst2html4citeproc \
    --stylesheet="./screen-citeprocjs.css" \
    ./citeproc-doc.rst > ./index.html

cd ..
tar cfz ./citeproc-doc.tar.gz ./citeproc-doc/

if [ "$1" == "--upload" ]; then
  scp ./citeproc-doc/index.html gsl-nagoya-u.net:/http/pub/citeproc-doc.html
  scp ./citeproc-doc.tar.gz gsl-nagoya-u.net:/http/pub/citeproc-doc.tar.gz
fi
