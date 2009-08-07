#!/bin/bash

if [ $(echo ${SHELL} | grep -c "bash")  -eq "1" ]; then
  export LANG="en_US.UTF-8"
else
  setenv LANG "en_US.UTF-8"
fi


echo =====================================================================
rhino ./break_js_encoding.js
echo "  (ran Rhino with locale $LANG (should be en_US.UTF-8)."
echo =====================================================================
