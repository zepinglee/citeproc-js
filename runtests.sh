#!/bin/sh
START="$(date) <--------------START"
cd $(dirname $0)
RHINO="${PWD}"/rhino/js-1.7R1.jar
DOJO="${PWD}"/dojo/dojo/dojo.js
DOH="${PWD}"/dojo/util/doh/

TARGET="${PWD}"/tests/run.js

java -client -jar "${RHINO}" -opt 1 "${TARGET}" dojoUrl="${DOJO}"  testModule="" 

#
# Ah, Spidermonkey has no I/O capabilities.  How very interesting.
#
#if [ $(which smjs | grep -c "/" ) -gt 0 ]; then
#    echo "Using spidermonkey"
#    rm dojo
#    ln -sf dojo-spidermonkey dojo
#    smjs "${TARGET}" dojoUrl="${DOJO}"  testModule="" 
#else
#    echo "Using java/rhino"
#    rm dojo
#    ln -sf dojo-rhino dojo
#    java -client -jar "${RHINO}" "${TARGET}" dojoUrl="${DOJO}"  testModule="" 
#fi

echo $START
echo $(date) \<--------------END
