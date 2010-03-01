#!/bin/bash

echo "##########"

java -client -jar ./rhino/js-1.7R2.jar jslint.js $@

