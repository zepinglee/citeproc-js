#!/bin/bash

set -e

cd $(dirname $0)
cd ..

for i in $(find zotero-trunk/chrome/locale -name "zotero.properties"); do
  if [ "$(grep -c reportingDate $i)" -gt 0 ]; then
    echo Skipping $i
    continue
  fi
  LINE=$(cat $i \
     | sed "/.*itemField.*/,/^$/{/^$/=;d;};d")
  echo $i
  echo "  splitting at line: $LINE"
  echo $((LINE--)) > /dev/null
  head -n ${LINE} $i > ${i}.head
  echo $((LINE++)) > /dev/null
  tail -n +${LINE} $i > ${i}.tail
  cat ${i}.head ./miscellany/ADDED_PROPERTIES.txt ${i}.tail > ${i}.new
  mv ${i}.new ${i}
  rm ${i}.tail
  rm ${i}.head
done
