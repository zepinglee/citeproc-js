#!/bin/sh

if [ $(echo ${SHELL} | grep -c "bash")  -eq "1" ]; then
  export LANG="C"
else
  setenv LANG "en_US.UTF-8"
fi

START="$(date) <--------------START"
cd $(dirname $0)
RHINO="${PWD}"/rhino/js-1.7R1.jar
DOJO="${PWD}"/dojo/dojo/dojo.js
DOH="${PWD}"/dojo/util/doh/

TARGET="${PWD}"/tests/runner_rhino.js

java -client -jar "${RHINO}" -opt 1 "${TARGET}" dojoUrl="${DOJO}"  testModule="" 

echo $START
echo $(date) \<--------------END
