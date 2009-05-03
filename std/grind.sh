#!/bin/bash

set -e

if [ $(which gsed | grep -c "/" ) -gt 0 ]; then
    SED="gsed"
else
    SED="sed"
fi

echo using $SED

cd $(dirname $0)

for d in tmp csl machines; do
    if [ ! -d ${d} ]; then
        mkdir ${d}
    fi
done

rm -f csl/*.csl
rm -f machines/*.json

for filename in humans/*.txt; do
    BASENAME=$(basename ${filename} .txt)
    SRC=humans/${BASENAME}.txt
    RES=machines/${BASENAME}.json

    if [ $(echo ${BASENAME} | grep -c "_") -eq 0 ]; then
        echo ERROR $(basename $0): bad filename \"${BASENAME}\": must contain a _ character.
        exit 1
    fi

	CATEGORY=$(echo ${BASENAME} | $SED -e "s/^\([^_]*\)_.*/\\1/")
	NAME=$(echo ${BASENAME} | $SED -e "s/^[^_]*_\(.*\)/\\1/;s/\(.\)\([A-Z]\)/\\1 \\2/g")

    cat ${SRC} | $SED -e "s/^[[:space:]]*<<=/<<=/;s/^[[:space:]]*>>=/>>=/" > tmp/TMP.txt    
    cat tmp/TMP.txt | $SED -e "/^>>=.*CSL/,/^<<=.*CSL/!d" | $SED -e "/^\(>>=\|<<=\)/d" > csl/${BASENAME}.csl
    CSL=$(cat csl/${BASENAME}.csl | $SED -e 's~"~\\"~g' | $SED -e "s/$/\\\\n/" | tr -d '\r\n' | $SED -e "s/\\\\n$//")
    RESULT=$(cat tmp/TMP.txt | $SED -e "/^>>=.*RESULT/,/^<<=.*RESULT/!d" | $SED -e "/^\(>>=\|<<=\)/d" | $SED -e 's~"~\\"~g' |$SED -e '$!s~$~\\n~' | tr -d '\r\n')
    MODE=$(cat tmp/TMP.txt | $SED -e "/^>>=.*MODE/,/^<<=.*MODE/!d" | $SED -e "/^\(>>=\|<<=\)/d")
    INPUT=$(cat tmp/TMP.txt | $SED -e "/^>>=.*INPUT/,/^<<=.*INPUT/!d" | $SED -e "/^\(>>=\|<<=\)/d")
    SCHEMA=$(cat tmp/TMP.txt | $SED -e "/^>>=.*SCHEMA/,/^<<=.*SCHEMA/!d" | $SED -e "/^\(>>=\|<<=\)/d")
	if [ $(cat tmp/TMP.txt | grep -c CITATIONS) -gt 0 ]; then
        CITATIONS=$(cat tmp/TMP.txt | $SED -e "/^>>=.*CITATIONS/,/^<<=.*CITATIONS/!d" | $SED -e "/^\(>>=\|<<=\)/d")
    fi

    echo '{' > ${RES}
    
    echo '  "name": "'${NAME}'",' >> ${RES}
    echo '  "category": "'${CATEGORY}'",' >> ${RES}
    echo '  "mode": "'${MODE}'",' >> ${RES}
    if [ "${CITATIONS}" != "" ]; then
        echo '  "citations": '${CITATIONS}',' >> ${RES}
    fi
    echo '  "schema":"'${SCHEMA}'",' >> ${RES}
    echo '  "result": "'${RESULT}'",' >> ${RES}
    echo '  "csl": "'${CSL}'",' >> ${RES}
    echo '  "input": '${INPUT} >> ${RES}
    echo '}' >> ${RES}
done

rm tmp/*
rmdir tmp
