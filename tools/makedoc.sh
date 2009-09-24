#!/bin/bash

cd $(dirname $0)
cd ../ref
./rst2html --stylesheet="./screen-citeprocjs.css" ./citeproc-doc.rst > ./tmp.html

scp ./tmp.html gsl-nagoya-u.net:/http/pub/citeproc-doc.html
rm ./tmp.html
