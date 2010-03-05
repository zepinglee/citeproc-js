#!/bin/bash

set -e

DIR=$(dirname $1)
BASE=$(basename $1 .js)

echo $DIR/$BASE

cat $1 | sed -e "s/function(/function (/" | \
         sed -e "s/^\([^/]*\)){/\1) {/" | \
	 sed -e "/.*\(match\|indexOf\|\/\).*/!{s/,\([^ ]\)/, \1/g;}" | \
	 sed -e "s/++/ += 1/g" | \
	 sed -e "s/--/ += -1/g" | \
	 sed -e "s/\([-0-9]\)+\([-0-9]\)/\1 + \2/g" | \
	 sed -e "s/\([-0-9]\)-\([-0-9]\)/\1 - \2/g" | \
	 sed -e "s/\([^=!]\)==\([^=]\)/\1===\2/g" | \
	 sed -e "s/ *=== */ === /g" | \
	 sed -e "s/\([^=!]\)=!\([^=]\)/\1!==\2/g" | \
	 sed -e "s/^};*/};/" | \
	 sed -e "/^}.*/!s/};$/}/" | \
	 sed -e "s/ *!== */ !== /g" > ${DIR}/${BASE}.tmp
mv ${DIR}/${BASE}.js ${DIR}/${BASE}.orig
mv ${DIR}/${BASE}.tmp ${DIR}/${BASE}.js
