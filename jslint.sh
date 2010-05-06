#!/bin/bash

rm -f jslint_results.txt

if [ "$1" == "" ]; then
    echo "#### jslint results for citeproc-js/src/*.js ####" > jslint_results.txt
    files=$(ls ./src/*.js)
else
	files="$1"
fi

for i in ${files}; do
    BASE=$(basename $i .js)
    if [ "xmldom" == "$BASE" ]; then
        continue
    fi
    if [ "xmle4x" == "$BASE" ]; then
        continue
    fi
    STARTSWITH=$(echo $BASE | sed -e "s/^\(.......\).*/\1/")
    if [ "$STARTSWITH" == "testing" ]; then
       continue
    fi
    if [ "$1" == "" ]; then
        echo "" >> jslint_results.txt
        echo "<<< ${i} >>>" >> jslint_results.txt
   	java -client -jar ./rhino/js-1.7R2.jar jslint.js $i >> jslint_results.txt
     else
        java -client -jar ./rhino/js-1.7R2.jar jslint.js $i
     fi
done
