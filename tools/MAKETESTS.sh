#!/bin/bash

set -e

cd $(dirname $0)
cd ..
#
# Be sure the machine side of the test suite is up to date
#
tests/std/grind.py


#
# Start Gunk
#
OLDIFS=$IFS
IFS=""
HEADER=`cat<<EOF
dojo.provide("tests.std_::CATEGORY::");

doh.register("tests.std_::CATEGORY::", [
EOF
`
FOOTER=`cat<<EOF
]);
EOF
`
IFS=$OLDIFS

header (){
  OLDIFS=$IFS
  IFS=""
  echo $HEADER
  IFS=$OLDIFS
}

footer (){
  OLDIFS=$IFS
  IFS=""
  echo $FOOTER
  IFS=$OLDIFS
}
#
# End Gunk
#

#
# Initialize files
#
rm -f tests/javascript/std_*.js
for i in tests/std/machines/*.json; do
    BASE=$(basename $i .json)
    CATEGORY=$(echo ${BASE} | sed -e "s/^\([^_]\+\)_.*/\\1/")
    if [ ! -f "tests/javascript/std_"${CATEGORY}".js" ]; then
        OLDIFS=$IFS
        IFS=""
        echo $(header) | sed -e "s/::CATEGORY::/${CATEGORY}/" > "tests/javascript/std_"${CATEGORY}".js"
        IFS=$OLDIFS
    fi
done

for i in tests/std/machines/*.json; do
    BASE=$(basename $i .json)
    CATEGORY=$(echo ${BASE} | sed -e "s/^\([^_]\+\)_.*/\\1/")
	echo '    function(){' >> "tests/javascript/std_"${CATEGORY}".js"
    echo '        var test = new StdRhinoTest("'${BASE}'");' >> "tests/javascript/std_"${CATEGORY}".js"
    echo '        doh.assertEqual(test.result, test.run());' >> "tests/javascript/std_"${CATEGORY}".js"
	echo '    },' >> "tests/javascript/std_"${CATEGORY}".js"
done

for i in tests/javascript/std_*.js; do
    OLDIFS=$IFS
    IFS=""
    echo $(footer) >> ${i}
    IFS=$OLDIFS
done

tools/APPLY_LICENSE.py
