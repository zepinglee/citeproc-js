#!/bin/bash

set -e

cd $(dirname $0)

#
# Be sure the machine side of the test suite is up to date
#
std/grind.py


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
rm -f tests/std_*.js
for i in std/machines/*.json; do
    BASE=$(basename $i .json)
    CATEGORY=$(echo ${BASE} | sed -e "s/^\([^_]\+\)_.*/\\1/")
    if [ ! -f "tests/std_"${CATEGORY}".js" ]; then
        OLDIFS=$IFS
        IFS=""
        echo $(header) | sed -e "s/::CATEGORY::/${CATEGORY}/" > "tests/std_"${CATEGORY}".js"
        IFS=$OLDIFS
    fi
done

for i in std/machines/*.json; do
    BASE=$(basename $i .json)
    CATEGORY=$(echo ${BASE} | sed -e "s/^\([^_]\+\)_.*/\\1/")
	echo '    function(){' >> "tests/std_"${CATEGORY}".js"
    echo '        var test = new StdRhinoTest("'${BASE}'");' >> "tests/std_"${CATEGORY}".js"
    echo '        doh.assertEqual(test.result, test.run());' >> "tests/std_"${CATEGORY}".js"
	echo '    },' >> "tests/std_"${CATEGORY}".js"
done

for i in tests/std_*.js; do
    OLDIFS=$IFS
    IFS=""
    echo $(footer) >> ${i}
    IFS=$OLDIFS
done