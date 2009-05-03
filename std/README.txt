# CSL test file: README.txt
# Frank Bennett 2009.04.05

### Intro ###

This is a test source file for use in testing processors of the
Citation Style Language (CSL)

Test source files (like this one) are ground into valid JSON by
the ./grind.sh script in the root directory of the test archive.


A test consists of four required blocks: MODE, RESULT, CSL and INPUT

Blocks of the test are delimited as show below.  Only the leading
>>= or <<= and the block name (which must be in all caps) are
signficant.  Everything outside of the block delimiters is ignored,
but you may wish to set of comments with a comment character, for
clarity.


## Test ##

# The MODE block is a single string, either "citation" or "bibliography"
# (without quotes).  This specifies the type of output that the processor
# should deliver for testing.

                  >>===== MODE =====>>
citation
                  <<===== MODE =====<<


# The RESULT block is a simple string.  If quotes are included in the
# result, they should not be escaped; just write what would appear
# on the monitor if the result of processing were dumped to standard
# output.


                  >>===== RESULT =====>>
Doe 2000a,b;2001
                  <<===== RESULT =====<<


# The CSL block should be a valid CSL style file.  These blocks
# are separately saved to the ./csl subdirectory in the test
# archive, so that they can be validated if desired.

>>===== CSL =====>>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" xml:lang="en">
    <citation>
        <layout delimiter=";">
            <option name="year-suffix-delimiter" value=","/>
            <option name="disambiguate-add-year-suffix" value="true"/>
            <option name="collapse" value="year-suffix"/>
            <group delimiter=" ">
                <names variable="author">
                    <name form="short"/>
                </names>
                <date variable="issued">
                    <date-part name="year"/>
                </date>
            </group>
            <text variable="year-suffix"/>
        </layout>
    </citation>
</style>
<<===== CSL =====<<

# The INPUT block is a list of input objects, written as
# valid JSON.
#
# Note that names are written as a simple string that must
# be parsed into the internal representation required by the
# processor being tested.  The hinting syntax of name strings
# is as follows:
#
# Literal name (for institutions and the like):
#    name="Ministry of Fear, Loathing and Error !!"
# 
# Simple western name:
#    name="Doe, John"
#
# Western name with articular:
#    name="van Doe, John"
#
# Western name with capitalized articular:
#    name="VAN Doe, John"
#
# Western name with suffix (no comma in output):
#    name="Doe, John, III"
#
# Western name with suffix (comma delimiter in output):
#    name="Doe, John,! Jr."
#
# Names fixed in sort ordering (common in East and Southeast Asia):
#    name="Takeda, Shingen !"
#
# Names in non-Roman, non-Cyrillic fonts are to be combined
# to single joined-up strings in sort ordering, with no other
# processing.

>>===== INPUT =====>>
[
  {
    "id":"ITEM-1",
    "type": "book",
    "author": [
      { "name":"Doe, John" }
    ],
    "issued": {"year": "2000"},
    "title": "Paper 1"
  },
  {
    "id":"ITEM-2",
    "type": "book",
    "author": [
      { "name":"Doe, John" }
    ],
    "issued": {"year": "2000"},
    "title": "Paper 2"
  },
 {
    "id":"ITEM-3",
    "type": "book",
    "author": [
      { "name":"Doe, John" }
    ],
    "issued": {"year": "2001"},
    "title": "Paper 3"
  }
]
<<===== INPUT =====<<
