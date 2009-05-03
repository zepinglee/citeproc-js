#!/bin/bash

rm -f *.result

##
## Configure processor
##
wget -q --post-file set_style.json -O set_style.result http://localhost:8027/


echo -------------------------
echo result of set_style.json
echo -------------------------

echo -n '---> '
cat set_style.result
echo
echo

##
## Insert items to bibliography without rendering citations
##
wget -q --post-file insert_items.json -O insert_items.result http://localhost:8027/


echo ---------------------------
echo result of insert_items.json
echo ---------------------------

echo -n '---> '
cat insert_items.result
echo
echo

##
## Render bibliography
##
wget -q --post-file make_bibliography.json -O make_bibliography.result http://localhost:8027/

echo --------------------------------
echo result of make_bibliography.json
echo --------------------------------

echo -n '---> '
cat make_bibliography.result
echo
echo

##
## Render citations
##
wget -q --post-file make_citation_cluster.json -O make_citation_cluster.result http://localhost:8027/

echo ------------------------------------
echo result of make_citation_cluster.json
echo ------------------------------------

echo -n '---> '
cat make_citation_cluster.result
echo
echo

##
## Render bibliography
##
wget -q --post-file make_bibliography.json -O make_bibliography.result http://localhost:8027/

echo --------------------------------
echo result of make_bibliography.json
echo --------------------------------

echo -n '---> '
cat make_bibliography.result
echo
echo

