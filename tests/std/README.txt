/*
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./std subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) Frank G. Bennett, Jr. 2009. All Rights Reserved.
 */
# CSL test file: README.txt
# Frank Bennett 2009.04.05

### Intro ###

This is a test source file for use in testing processors of the
Citation Style Language (CSL)

Test source files (like this one) are ground into valid JSON by
the ./grind.py script in the root directory of the test archive.


A test consists of four required blocks: MODE, RESULT, CSL and INPUT,
and one optional block CITATIONS.

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
# processor being tested.  The shorthand syntax of name strings
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
# (Names in non-Roman, non-Cyrillic fonts are to be combined
# to single joined-up strings in sort ordering, with no other
# processing.)
#
# The shorthand syntax is parsed into a machine-friendly
# form by the grind.py script.  That form, which should
# be recognized by the processor API, looks like this:
#
# "author": [
#     {
#         "comma_suffix": true, 
#         "prefix": "van", 
#         "primary-key": "Doe", 
#         "secondary-key": "Jeffrey", 
#         "sticky": false, 
#         "suffix": "Jr."
#     }
# ] 
#
# For Western names, primary-key and secondary-key correspond
# to surname and given name respectively, but these fields have
# no fixed semantic meaning: names from other languages should be 
# assigned to these fields according to the preferred sorting priority,
# not according to whether the name is a "family" name.  For Chinese and
# Japanese names, the field assignment will be the same as for
# Western names (i.e. primary-key = surname).  For Icelandic names,
# the primary-key field should contain the patronymic.  For
# Mongolian names, it should contain the given name, with the
# patronymic assigned to the secondary-key field.
#
# The comma_suffix flag indicates whether a suffix (such as Jr.
# or III) should be preceded by a comma.  Ordinarily to comma
# is used.
#
# The sticky flag may be set on transliterated Chinese, Japanese and 
# other foreign names to indicate that they should always
# be presented in sort order, rather than in given name - last name
# order.  Such a name ordering convention is uncommon, but this
# flag permits it to be supported.

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

#
# A CITATIONS section may be included in a test that has
# MODE set to "citation".  When used, this section permits
# several separate citations to be rendered in the test,
# with control over which input items are included in each
# citation, and the options appended to each item.  Each
# cite is a two-element list, with the first element the
# ID of the input item to be used, and the second element
# a hash object providing fields for "locator", "prefix",
# et cetera.  This is wrapped in two layers of nesting, to
# permit multiple citations with multiple cites in each.
#

>>===== CITATIONS ====>>
[
  [
    ["ITEM-1",{"prefix":"As written in"}]
  ]
]
<<===== CITATIONS ====<<
