#!/bin/bash

cd $(dirname $0)

rm -f results/*.result

##
## Configure processor
##
wget -q --post-file ./data/config.json -O ./results/config.result http://localhost:8027/

if [ "$?" -ne "0" ]; then
    echo wget exited with error ... is server.py running?
    exit 1
fi



echo -------------------------
echo result of config.json
echo -------------------------

echo -n '---> '
cat ./results/config.result
echo
echo

##
## Insert items to bibliography without rendering citations
##
wget -q --post-file ./data/insert.json -O ./results/insert.result http://localhost:8027/


echo ---------------------------
echo result of insert.json
echo ---------------------------

echo -n '---> '
cat ./results/insert.result
echo
echo

##
## Render bibliography (1)
##
wget -q --post-file ./data/bibliography.json -O ./results/bibliography1.result http://localhost:8027/

echo -------------------------------
echo result of bibliography.json \(1\)
echo -------------------------------

echo -n '---> '
cat ./results/bibliography1.result
echo
echo

##
## Render citations
##
wget -q --post-file ./data/citation.json -O ./results/citation.result http://localhost:8027/

echo ------------------------------------
echo result of citation.json
echo ------------------------------------

echo -n '---> '
cat ./results/citation.result
echo
echo

##
## Render bibliography (2)
##
wget -q --post-file ./data/bibliography.json -O ./results/bibliography2.result http://localhost:8027/

echo -------------------------------
echo result of bibliography.json \(2\)
echo -------------------------------

echo -n '---> '
cat ./results/bibliography2.result
echo
echo

##
## Register flipflops
##
wget -q --post-file ./data/inline.json -O ./results/inline.result http://localhost:8027/

echo --------------------------------
echo result of inline.json
echo --------------------------------

echo -n '---> '
cat ./results/inline.result
echo
echo

##
## Render bibliography (3)
##
wget -q --post-file ./data/bibliography.json -O ./results/bibliography3.result http://localhost:8027/

echo -------------------------------
echo result of bibliography.json \(3\)
echo -------------------------------

echo -n '---> '
cat ./results/bibliography3.result
echo
echo

