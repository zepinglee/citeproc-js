======================================
The ``citeproc-js`` Citation Processor
======================================
~~~~~~~~~~~~~~~~~~~
Integrator's Manual
~~~~~~~~~~~~~~~~~~~

.. class:: fixed

   `citationstyles.org`__

__ http://citationstyles.org/



.. class:: info-version

   version 1.00##a80##

.. class:: info-date

   =D=23 May 2010=D=

.. class:: contributors

   Author of this manual
       * Frank G. Bennett, Jr.

   With important feedback from
       * Bruce D'Arcus
       * Lennard Fuller
       * Fergus Gallagher
       * Simon Kornblith
       * Dan Stillman
       * Rintze Zelle


.. |link| image:: link.png

========

.. contents:: Table of Contents

========

------------
Introduction
------------

This is the site administrator's manual for ``citeproc-js``, a
Javascript implementation of the |link| `Citation Style Language
(CSL)`__ used by Zotero, Mendeley and other popular reference
tools to format citations in any of the hundreds of styles
supplied by the CSL style repository. [#]_  The processor complies with version 1.0 of the CSL
specification, has been written and tested as an independent module,
and can be run by any ECMAscript-compliant interpreter.  With an
appropriate supporting environment, [#]_ it can be deployed in a
browser plugin, as part of a desktop application, or as a formatting
backend for a website or web service.

__ http://citationstyles.org/

This manual covers the basic operation of the processor, including the
command set, the local system code that must be supplied by the integrator, and the
expected format of input data.  In addition, notes are provided on the test suite,
on the infrastructure requirements for running the processor in particular
environments, and on extended functionality that is available to address certain 
special requirements.

Comments and complaints relating to this document and to the processor itself
will be gladly received and eventually despatched with.  The best channel
for providing feedback and getting help is the |link| `project mailing list`_.

.. class:: first

   .. [#] The repository is currently housed at `zotero.org`__.  Note that
          styles in the Zotero styles repository are currently at CSL version
          0.8.1.  Use the `tools provided by the CSL project`__ to convert CSL 0.8.1 
          styles to the version 1.0 syntax supported by this processor.

.. [#] For further details on required infrastructure, see the sections 
       `Local Environment`_ 
       and `Data Input`_ below.

.. _`project mailing list`: http://groups.google.com/group/citeproc-js

__ http://zotero.org/styles

__ http://bitbucket.org/bdarcus/csl-utils/

-----------------------------
Setup and System Requirements
-----------------------------

The processor is written in Javascript, one of the interesting
features of which is the lack of a standard method of I/O.  As a
result, the processor must be wrapped in other code to get data in and
out of it, and every installation is going to be a little different.
This manual does not cover the nitty-gritty of setting up the
environment for running the processor in a particular environment, but
the basic system requirements are described below.  If you get stuck
and want advice, or if you find something in this manual that is out
of date or just wrong, please feel free to drop a line to the |link|
`project list`_.

.. _`project list`: http://groups.google.com/group/citeproc-js

###################################
Getting the ``citeproc-js`` sources
###################################

The ``citeproc-js`` sources are hosted on |link| `BitBucket`__.
To obtain the sources, install the |link| `Mercurial version control system`__
on a computer within your control (if you're on a Linux distro or a Mac,
just do a package install), and run the following command:

__ http://bitbucket.org/fbennett/citeproc-js/

__ http://mercurial.selenic.com/wiki/


   ::

      hg clone http://bitbucket.org/fbennett/citeproc-js/

This should get you a copy of the sources, and you should be able to
exercise the test framework using the ``./test.py`` script.

####################################
Obtaining the Standard Test Fixtures
####################################

To run the test suite, the standard test fixtures must be added to the
processor source bundle.  To do so, enter the directory ``./tests/fixtures``,
and issue the following command:

   ::

      hg clone https://fbennett@bitbucket.org/fbennett/citeproc-test std

Note the explicit target directory "std" following the repository
address.


#######################
Javascript interpreters
#######################

A ECMAscript interpreter with E4X support is required to run the
processor.  The Rhino, Spidermonkey and Tracemonkey Javascript
interpreters all satisfy this requirement. The V8 interpreter used by
Google Chrome and Node does not.  The task of tying a Javascript
interpreter into a given web framework or application is beyond
the scope of this manual; but in Python-based environments, the
|link| `python-spidermonkey bridge module`__ by Paul Davis may be worth a
look.

__ http://github.com/davisp/python-spidermonkey

Instructions on running the processor test suite can be found
in the section `Running the test suite`_ at the end of this manual.



####################
Loading runtime code
####################

The primary source code of the processor is located under ``./src``,
for ease of maintenance.  The files necessary for use in a runtime
environment are catenated, in the appropriate sequence, in the
``citeproc.js`` file, located in the root of the source archive.  This
file and the test fixtures can be refreshed using the 
``./test.py -r`` command.

To build the processor, the ``citeproc.js`` source code should be
loaded into the Javascript interpreter context, together with a
``sys`` object provided by the integrator (see below), and the desired
CSL style (as a string).

------------------
Processor Commands
------------------

The processor command set will be a grave disappointment to those well versed in
the tormented intricacies of reference management and bibliography
formatting.  The processor is instantiated with a single command,
controlled with three others, and has just two commands for adjustments
to its runtime configuration.


################
``CSL.Engine()``
################

A working instance of the processor can (well, must) be created using the
``CSL.Engine()`` command, as shown in the code illustration below.  
This command takes up to three arguments, two of them required, and 
one of them optional:

.. admonition:: Important

   See the section `Local Environment`_ → `System functions`_ below for guidance
   on the definition of the functions contained in the ``sys``
   object.

.. sourcecode:: js

   var citeproc = new CSL.Engine(sys, 
                                 style, 
                                 lang)

*sys*
    A Javascript object containing the functions
    ``retrieveLocale()`` and ``retrieveItem()``.

*style*
    The CSL code for a style, as XML in serialized (string) form
    (not a filename or style name, but the code itself).

*lang* (optional)
    A language tag compliant with RFC 4646.  Defaults to ``en``.
    Styles that contain a ``default-locale`` declaration
    on the ``style`` node will ignore this option.

The version of the processor itself can be obtained
from the attribute ``processor_version``.  The supported
CSL version can be obtained from ``csl_version``.



#################
``updateItems()``
#################

Before citations or a bibliography can be generated, an ordered list
of reference items must ordinarily be loaded into the processor using
the ``updateItems()`` command, as shown below.  This command takes a
list of item IDs as its sole argument, and will reconcile the internal
state of the processor to the provided list of items, making any
necessary insertions and deletions, and making any necessary
adjustments to internal registers related to disambiguation and so
forth.

.. admonition:: Hint

   The sequence in which items are listed in the
   argument to ``updateItems()`` will be reflected in the ordering
   of bibliographies only if the style installed in the processor
   does not impose its own sort order.

.. sourcecode:: js

   var my_ids = [
       "ID-1",
       "ID-53",
       "ID-27"
   ]
   
   citeproc.updateItems( my_ids );

Note that only IDs may be used to identify items.  The ID is an
arbitrary, system-dependent identifier, used by the locally customized
``retrieveItem()`` method to retrieve
actual item data.  



######################
``makeBibliography()``
######################

The ``makeBibliography()`` command does what its name implies.  
If invoked without an argument,
it dumps a formatted bibliography containing all items currently
registered in the processor:

.. sourcecode:: js

   var mybib = citeproc.makeBibliography();

.. _`commands-categories`:

.. admonition:: Important
   
   Matches against the content of name and date variables
   are not possible, but empty fields can be matched for all
   variable types.  See the ``quash`` example below
   for details.

^^^^^^^^^^^^^^^^
Selective output
^^^^^^^^^^^^^^^^

The ``makeBibliography()`` command accepts one optional argument,
which is a nested Javascript object that may contain
*one of* the objects ``select``, ``include`` or ``exclude``, and
optionally an additional  ``quash`` object.  Each of these four objects
is an array containing one or more objects with ``field`` and ``value``
attributes, each with a simple string value (see the examples below).
The matching behavior for each of the four object types, with accompanying
input examples, is as follows:

``select``
   For each item in the bibliography, try every match object in the array against
   the item, and include the item if, and only if, *all* of the objects match.

.. admonition:: Hint

   The target field in the data items registered in the processor
   may either be a string or an array.  In the latter case,
   an array containing a value identical to the
   relevant value is treated as a match.

.. sourcecode:: js

   var myarg = {
      "select" : [
         {
            "field" : "type",
            "value" : "book"
         },
         {  "field" : "categories",
             "value" : "1990s"
         }
      ]
   }

   var mybib = cp.makeBibliography(myarg);

``include``
   Try every match object in the array against the item, and include the
   item if *any* of the objects match.

.. sourcecode:: js

   var myarg = {
      "include" : [
         {
            "field" : "type",
            "value" : "book"
         }
      ]
   }

   var mybib = cp.makeBibliography(myarg);

``exclude``
   Include the item if *none* of the objects match.

.. sourcecode:: js

   var myarg = {
      "exclude" : [
         {
            "field" : "type",
            "value" : "legal_case"
         },
         {
            "field" : "type",
            "value" : "legislation"
         }
      ]
   }

   var mybib = cp.makeBibliography(myarg);

``quash``
   Regardless of the result from ``select``, ``include`` or ``exclude``,
   skip the item if *all* of the objects match.


.. admonition:: Hint

   An empty string given as the field value will match items
   for which that field is missing or has a nil value.

.. sourcecode:: js

   var myarg = {
      "include" : [
         {
            "field" : "categories",
            "value" : "classical"
         }
      ],
      "quash" : [
         {
            "field" : "type",
            "value" : "manuscript"
         },
         {
            "field" : "issued",
            "value" : ""
         }
      ]
   }

   var mybib = cp.makeBibliography(myarg);

^^^^^^^^^^^^
Return value
^^^^^^^^^^^^

The value returned by this command is a two-element list, composed of
a Javascript array containing certain formatting parameters, and a
list of strings representing bibliography entries.  It is the responsibility
of the calling application to compose the list into a finish string
for insertion into the document.  The first
element —- the array of formatting parameters —- contains the key/value
pairs shown below (the values shown are the processor defaults in the
HTML output mode):

.. sourcecode:: js

   [
      { 
         "maxoffset": 0,
         "entryspacing": 0,
         "linespacing": 0,
         "hangingindent": 0,
         "second-field-align": false,
         "bibstart": "<div class=\"csl-bib-body\">\n",
         "bibend": "</div>"
      },
      [
         "<div class=\"csl-entry\">Book A</div>",
         "<div class=\"csl-entry\">Book C</div>"
      ]
   ]

*maxoffset*
   Some citation styles apply a label (either a number or an
   alphanumeric code) to each bibliography entry, and use this label
   to cite bibliography items in the main text.  In the bibliography,
   the labels may either be hung in the margin, or they may be set
   flush to the margin, with the citations indented by a uniform
   amount to the right.  In the latter case, the amount of indentation
   needed depends on the maximum width of any label.  The
   ``maxoffset`` value gives the maximum number of characters that
   appear in any label used in the bibliography.  The client that
   controls the final rendering of the bibliography string should use
   this value to calculate and apply a suitable indentation length.

*entryspacing*
   An integer representing the spacing between entries in the bibliography.

*linespacing*
   An integer representing the spacing between the lines within
   each bibliography entry.

*hangingindent*
   The number of em-spaces to apply in hanging indents within the
   bibliography.

*second-field-align*
   When the ``second-field-align`` CSL option is set, this returns
   either "flush" or "margin".  The calling application should
   align text in bibliography output as described in the `CSL specification`__.
   Where ``second-field-align`` is not set, this return value is set to ``false``.

*bibstart*
   A string to be appended to the front of the finished bibliography
   string.
   
*bibend*
   A string to be appended to the end of the finished bibliography
   string.


__ http://citationstyles.org/downloads/specification.html#bibliography-specific-options


#################
Citation commands
#################

Citation commands generate strings for insertion into the text of a
target document.  Citations can be added to a document in one of two
ways: as a batch process (BibTeX, for example, works in this way) or
interactively (Endnote, Mendeley and Zotero work in this way, through
a connection to the user's word processing software).  These two modes
of operation are supported in ``citeproc-js`` by two separate
commands, respectively ``appendCitationCluster()``, and
``processCitationCluster()``.  A third, simpler command
(``makeCitationCluster()``), is not covered by this manual.
It is primarily useful as a tool for testing the processor, as it
lacks any facility for position evaluation, which is needed in
production environments. [#]_

The ``appendCitationCluster()`` and
``processCitationCluster()`` commands use a similar input format
for citation data, which is described below in the `Data Input`_
→ `Citation data object`_ section below.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^
``appendCitationCluster()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``appendCitationCluster()`` command takes a single citation
object as argument, and an optional flag to indicate whether
a full list of bibliography items has already been registered
in the processor with the ``updateItems()`` command.  If the flag
is true, the command should return an array containing exactly
one two-element array, consisting of the current index position
as the first element, and a string for insertion into the document
as the second.  To wit:

.. sourcecode:: js

   citeproc.appendCitationCluster(mycitation,true);

   [
      [ 5, "(J. Doe 2000)" ]
   ]

If the flag is false, invocations of the command may return
multiple elements in the list, when the processor sense that
the additional bibliography items added by the citation require 
changes to other citations to achieve disambiguation.  In this
case, a typical return value might look like this:

.. sourcecode:: js

   citeproc.appendCitationCluster(mycitation);

   [
      [ 2, "(Jake Doe 2000)" ],
      [ 5, "(John Doe 2000)" ]
   ]


^^^^^^^^^^^^^^^^^^^^^^^^^^^^
``processCitationCluster()``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``processCitationCluster()`` command is used to generate and
maintain citations dynamically in the text of a document.  It takes three
arguments: a citation object, a list of citation ID/note index pairs
representing existing citations that precede the target citation, and
a similar list of pairs for citations coming after the target.  Like
the ``appendCitationCluster()`` command run without a flag, its
return array may contain multiple elements, where the edit or
addition of a citation triggers changes to other citations:

.. sourcecode:: js

   var citationsPre = [ ["citation-abc",1], ["citation-def",2] ];

   var citationsPost = [ ["citation-ghi",4] ];

   citeproc.processCitationCluster(citation,citationsPre,citationsPost);

   [
      [ 1,"(Ronald Snoakes 1950)" ],
      [ 3,"(Richard Snoakes 1950)" ]
   ]

A worked example showing the result of multiple transactions can be
found in the |link| `processor test suite`__.

__ http://bitbucket.org/fbennett/citeproc-js/src/tip/tests/std/humans/integration_IbidOnInsert.txt


#####################
``setOutputFormat()``
#####################

The output format of the processor can be changed after instantiation
using the ``setOutputFormat()`` command.  This command is specific
to the ``citeproc-js`` processor.

.. admonition:: Hint

   See the section `Output Formatting`_ below for notes
   on defining new output formats.

.. sourcecode:: js

   citeproc.setOutputFormat("rtf");



######################
``setAbbreviations()``
######################

The processor recognizes abbreviation lists for journal titles, series
titles, authorities (such as the Supreme Court of New York), and
institution names (such as International Business Machines).  A list
can be set in the processor using the ``setAbbreviations()`` command,
with the name of the list as sole argument.  The named list is fetched
and installed by the ``sys.getAbbreviations()`` command, documented
below under `Local Environment`_ → `System Functions`_.

.. sourcecode:: js

   citeproc.setAbbreviations("default");

At runtime, whenever an abbreviation is requested but unavailable,
an empty abbreviation entry is opened in the processor ``.transform``
object.  Entries are keyed on the abbreviation category and the long form of
the field value.  Abbreviation catetories are as follows: ``container-title``,
``collection-title``, ``authority``, ``institution``, ``title``, 
``publisher``, ``publisher-place``, ``hereinafter``.

After any run of the ``makeBibliography()`` or citation rendering commands,
the full set of registered abbreviations (including the empty entries identified at
runtime) can be read from the processor.  For example, if the processor
instance is named ``citeproc``, a structure as shown in `Local Environment`_
→ `System Functions`_ → `getAbbreviations()`_ can be obtained as follows:

.. sourcecode:: js

   var myabbrevs = citeproc.transform;

The structure thus obtained can then be edited, via the user interface
of the calling application, to alter the abbreviations applied at the
next run of the processor.

.. [#] For illustrations of the input syntax for the ``makeBibliography()``
       command, see any test in the |link| `test suite`_ that uses the
       `CITATION-ITEMS`_ environment -- it accepts a bare
       array of ``citationItems`` objects, as described under
       `Data Input`_ → `Citation data object`_, below.


-----------------
Local Environment
-----------------

While ``citeproc-js`` does a great deal of the heavy lifting needed
for correct formatting of citations and bibliographies, a certain
amount of programming is required to prepare the environment for its
correct operation.


################
System functions
################

As mentioned above in the section on `CSL.Engine()`_, two functions
must be defined separately and supplied to the processor upon
instantiation.  These functions are used by the processor to obtain
locale and item data from the surrounding environment.  The exact
definition of each may vary from one system to another; those given below
assume the existence of a global ``DATA`` object in the context of the
processor instance, and are provided only for the purpose of
illustration.

^^^^^^^^^^^^^^^^^^^^
``retrieveLocale()``
^^^^^^^^^^^^^^^^^^^^

The ``retrieveLocale()`` function is used internally by the processor to
retrieve the serialized XML of a given locale.  It takes a single RFC
4646 compliant language tag as argument, composed of a single language
tag (``en``) or of a language tag and region subtag (``en-US``).  The
name of the XML document in the CSL distribution that contains the
relevant locale data may be obtained from the ``CSL.localeRegistry``
array.  The sample function below is provided for reference
only.


.. sourcecode:: js

   sys.retrieveLocale = function(lang){
	   var ret = DATA._locales[ CSL.localeRegistry[lang] ];
	   return ret;
   };



^^^^^^^^^^^^^^^^^^
``retrieveItem()``
^^^^^^^^^^^^^^^^^^

The ``retrieveItem()`` function is used by the processor to
fetch individual items from storage.

.. sourcecode:: js

   sys.retrieveItem = function(id){
	   return DATA._items[id];
   };

^^^^^^^^^^^^^^^^^^^^^^
``getAbbreviations()``
^^^^^^^^^^^^^^^^^^^^^^

The ``getAbbreviations()`` command is invoked by the processor
at startup, and when the ``setAbbreviations()`` command is
invoked on the instantiated processor.  The abbreviation list
retrieved by the processor should have the following structure:

.. sourcecode:: js

   ABBREVS = { 
      "default": {
         "container-title":{
            "Journal of Irreproducible Results":"J. Irrep. Res."
         },
         "collection-title":{
            "International Rescue Wildlife Series":"I.R. Wildlife Series"
         },
         "authority":{
            "United States Patent and Trademark Office": "USPTO"
		 },
         "institution":{
            "Bureau of Gaseous Unformed Stuff":"BoGUS"
         },
         "title": {},
         "publisher": {},
         "publisher-place": {},
         "hereinafter": {}
      };
   };

If the object above provides the abbreviation store for the system,
an appropriate ``sys.getAbbreviations()`` function might look
like this:

.. sourcecode:: js

   sys.getAbbreviations = function(name){
      return ABBREVS[name];
   };


----------
Data Input
----------


###########
Item fields
###########

The locally defined ``retrieveItem()`` function must return data
for the target item as a simple Javascript array containing recognized
CSL fields. [#]_  The layout of the three field types is described below.

^^^^^^^^^^^^^^^^^^^^^^^^^^
Text and numeric variables
^^^^^^^^^^^^^^^^^^^^^^^^^^

Text and numeric variables are not distinguished in the data layer; both
should be presented as simple strings.

.. sourcecode:: js

   {  "title" : "My Anonymous Life",
      "volume" : "10"
   }

.. _clean-names:


^^^^^
Names
^^^^^

When present in the item data, CSL name variables must
be delivered as a list of Javascript arrays, with one
array for each name represented by the variable.
Simple personal names are composed of ``family`` and ``given`` elements,
containing respectively the family and given name of the individual.

.. sourcecode:: js

   { "author" : [
       { "family" : "Doe", "given" : "Jonathan" },
       { "family" : "Roe", "given" : "Jane" }
     ],
     "editor" : [
       { "family" : "Saunders", 
         "given" : "John Bertrand de Cusance Morant" }
     ]
   }

Institutional and other names that should always be presented
literally (such as "The Artist Formerly Known as Prince",
"Banksy", or "Ramses IV") should be delivered as a single
``literal`` element in the name array:

.. sourcecode:: js

   { "author" : [
       { "literal" : "Society for Putting Things on Top of Other Things" }
     ]
   }

!!!!!!!!!!!!!!!!!!!!
Names with particles
!!!!!!!!!!!!!!!!!!!!

Name particles, such as the "von" in "Werner von Braun", can
be delivered separately from the family and given name,
as ``dropping-particle`` and ``non-dropping-particle`` elements.

.. sourcecode:: js

   { "author" : [
       { "family" : "Humboldt",
         "given" : "Alexander",
         "dropping-particle" : "von"
       },
       { "family" : "Gogh",
         "given" : "Vincent",
         "non-dropping-particle" : "van"
       },
       { "family" : "Stephens",
         "given" : "James",
         "suffix" : "Jr."
       },
       { "family" : "van der Vlist",
         "given" : "Eric"
       }
     ]
   }

!!!!!!!!!!!!!!!!!!!!!!!
Names with an articular
!!!!!!!!!!!!!!!!!!!!!!!

Name suffixes such as the "Jr." in "Frank Bennett, Jr."  and the "III"
in "Horatio Ramses III" can be delivered as a ``suffix`` element.

.. admonition:: Hint

   A simplified format for delivering particles and name suffixes
   to the processor is described below in the section 
   `Dirty Tricks`_ → `Input data rescue`_ → `Names`__.

__ `dirty-names`_

.. sourcecode:: js

   { "author" : [
       { "family" : "Bennett",
         "given" : "Frank G.",
         "suffix" : "Jr.",
         "comma-suffix": "true"
       },
       { "family" : "Ramses",
         "given" : "Horatio",
         "suffix" : "III"
       }
     ]
   }

Note the use of the ``comma-suffix`` field in the example above.  This
hint must be included for suffixes that are preceded by a comma, which
render differently from "ordinary" suffixes in the ordinary long
form.

.. _`input-byzantine`:

!!!!!!!!!!!!!!!!!!!!!
"non-Byzantine" names
!!!!!!!!!!!!!!!!!!!!!

Names not written in the Latin or Cyrillic 
scripts [#]_ are always displayed
with the family name first.  No special hint is needed in
the input data; the processor is sensitive to the character
set used in the name elements, and will handle such names
appropriately.

.. sourcecode:: js

   { "author" : [
       { "family" : "村上",
         "given" : "春樹"
       }
     ]
   }

.. admonition:: Hint

   When the romanized transliteration is selected from a multi-lingual
   name field, the ``static-ordering`` flag is not required.  See the section
   `Dirty Tricks`_ → `Multi-lingual content`_ below for further details.

Sometimes it might be desired to handle a Latin or Cyrillic
transliteration as if it were a fixed (non-Byzantine) name.  This
behavior can be prompted by including a ``static-ordering`` element in
the name array.  The actual value of the element is irrelevant, so
long as it returns true when tested by the Javascript interpreter.

.. sourcecode:: js

   { "author" : [
       { "family" : "Murakami",
         "given" : "Haruki",
         "static-ordering" : 1
       }
     ]
   }


.. _`input-dates`:

^^^^^
Dates
^^^^^

Date fields are Javascript objects, within which the "date-parts" element
is a nested Javascript array containing a start
date and optional end date, each of which consists of a year,
an optional month and an optional day, in that order if present.

.. admonition:: Hint

   A simplified format for providing date input
   is described below in the section 
   |link| `Dirty Tricks`_ → `Input data rescue`_ → `Dates`__.

__ `dirty-dates`_

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [
            [ "2000", "1", "15" ]
         ]
      }
   }

Date elements may be expressed either as numeric strings or as
numbers.

.. sourcecode:: js
   
   {  "issued" : {
         "date-parts" : [ 
            [ 1895, 11 ]
         ]
      }
   }

The ``year`` element may be negative, but never zero.

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [ 
            [ -200 ]
         ]
      }
   }

A ``season`` element may
also be included.  If present, string or number values between ``1`` and ``4``
will be interpreted to correspond to Spring, Summer, Fall, and Winter, 
respectively.

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [ 
            [ 1950 ]
         ],
         "season" : "1"
      }
   }

Other string values are permitted in the ``season`` element, 
but note that these will appear in the output
as literal strings, without localization:

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [
            [ 1975 ]
         ],
         "season" : "Trinity"
      }
   }

For approximate dates, a ``circa`` element should be included,
with a non-nil value:

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [
            [ -225 ]
         ],
         "circa" : 1
      }
   }

To input a date range, add an array representing the end date,
with corresponding elements:

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [
            [ 2000, 11 ],
            [ 2000, 12 ]
         ]
      }
   }

To specify an open-ended range, pass nil values for the end elements:

.. sourcecode:: js

   {  "issued" : {
         "date-parts" : [
            [ 2008, 11 ],
            [ 0, 0 ]
         ]
      }
   }



A literal string may be passed through as a ``literal`` element:

.. sourcecode:: js

   {  "issued" : {
         "literal" : "13th century"
      }
   }

####################
Citation data object
####################

A minimal citation data object, used as input by both the ``processCitationCluster()``
and ``appendCitationCluster()`` command, has the following form:

.. sourcecode:: js

   {
      "citationItems": [
         {
            "id": "ITEM-1"
         }
      ], 
      "properties": {
         "noteIndex": 1
      }
   }

The ``citationItems`` array is a list of one or more citation item
objects, each containing an ``id`` used to retrieve the bibliographic
details of the target resource.  A citation item object may contain
one or more additional optional values:

* ``locator``: a string identifying a page number or other pinpoint
  location or range within the resource; 
* ``label``: a label type, indicating whether the locator is to a
  page, a chapter, or other subdivision of the target resource.  Valid
  labels are defined in the |link| `CSL specification`__.
* ``suppress-author``: if true, author names will not be included in the
  citation output for this cite;
* ``author-only``: if true, only the author name will be included
  in the citation output for this cite -- this optional parameter
  provides a means for certain demanding styles that require the
  processor output to be divided between the main text and a footnote.
  (See the section `Processor control`_, in the `Dirty Tricks`_ section
  below for more details.)
* ``prefix``: a string to print before this cite item;
* ``suffix``: a string to print after this cite item.

__ http://citationstyles.org/

In the ``properties`` portion of a citation, the ``noteIndex``
value indicates the footnote number in which the citation is located
within the document.  Citations within the main text of the document
have a ``noteIndex`` of zero.

The processor will add a number of data items to a citation
during processing.  Values added at the top level of the citation
structure include:

* ``citationID``: A unique ID assigned to the citation, for
  internal use by the processor.  This ID may be assigned by the
  calling application, but it must uniquely identify the citation,
  and it must not be changed during processing or during an
  editing session.
* ``sortedItems``: This is an array of citation objects and accompanying
  bibliographic data objects, sorted as required by the configured
  style.  Calling applications should not need to access the data
  in this array directly.

Values added to individual citation item objects may include:

* ``sortkeys``: an array of sort keys used by the processor to produce
  the sorted list in ``sortedItems``.  Calling applications should not
  need to touch this array directly.
* ``position``: an integer flag that indicates whether the cite item
  should be rendered as a first reference, an immediately-following
  reference (i.e. *ibid*), an immediately-following reference with locator
  information, or a subsequent reference.
* ``first-reference-note-number``: the number of the ``noteIndex`` of
  the first reference to this resource in the document.
* ``near-note``: a boolean flag indicating whether another reference
  to this resource can be found within a specific number of notes,
  counting back from the current position.  What is "near" in
  this sense is style-dependent.

Citations are registered and accessed by the processor internally
in arrays and Javascript objects.  Calling applications should
not need to access this data directly, but it is available in
the processor registry, at the following locations:

.. sourcecode:: js

   citeproc.registry.citationreg.citationById

   citeproc.registry.citationreg.citationByIndex

   citeproc.registry.citationreg.citationByItemId


.. [#] For information on valid CSL variable names, please
          refer to the CSL specification, available via http://citationstyles.org/.

.. [#] The Latin and Cyrillic scripts are referred to here collectively
       as "Byzantine scripts", after the confluence of cultures in the first
       millenium that spanned both.


-----------------
Output Formatting
-----------------

The test fixtures assume HTML output, which the processor supports out
of the box as its default mode.  It is currently the only mode
supported in the distributed version of the code, but additional modes
can be created by adding definitions for them to the source file ``./src/formats.js``.
See |link| `the file itself`__ for details; it's pretty straightforward.

__ http://bitbucket.org/fbennett/citeproc-js/src/tip/src/formats.js

------------
Dirty Tricks
------------

This section presents features of the ``citeproc-js`` processor that
are not properly speaking a part of the CSL specification.  The
functionality described here may or may not be found in other CSL 1.0
compliant processors, when they arrive on the scene.

#################
Input data rescue
#################



.. _dirty-names:

^^^^^
Names
^^^^^

Systems that use a simple two-field entry format can encode
``non-dropping-particle``, ``dropping-particle`` and ``suffix`` name
sub-elements by writing them appropriately in the ``family`` or
``given`` name fields and setting a ``parse-names`` flag on the name
object.  The processor will then attempt to parse out the elements
and convert them to the explicit form (as documented under `Data input`_
→ `Names`__ above) before rendering.  With the ``parse-names`` flag,
sub-elements are recognized as follows.

__ `clean-names`_

!!!!!!!!!!!!!!!!!!!!!!!!!
``non-dropping-particle``
!!!!!!!!!!!!!!!!!!!!!!!!!

A string at the beginning of the ``family`` field consisting
of spaces and lowercase roman or Cyrillic characters will
be treated as a ``non-dropping-particle``.

.. sourcecode:: js

   { "author" : [ 
       { "family" : "van Gogh",
         "given" : "Vincent",
         "parse-names" : "true"
       }
     ]
   }


!!!!!!!!!!!!!!!!!!!!!
``dropping-particle``
!!!!!!!!!!!!!!!!!!!!!

A string at the end of the ``given`` name field consisting
of spaces and lowercase roman or Cyrillic characters will
be treated as a ``dropping-particle``.

.. sourcecode:: js

   { "author" : [ 
       { "family" : "Humboldt",
         "given" : "Alexander von",
         "parse-names" : "true"
       }
     ]
   }

!!!!!!!!!!!!!!!!!!!!!
``suffix`` (ordinary)
!!!!!!!!!!!!!!!!!!!!!

Content following a comma in the ``given`` name field
will be parse out as a name ``suffix``.

.. sourcecode:: js

   { "author" : [ 
       { "family" : "King",
         "given" : "Martin Luther, Jr.",
         "parse-names" : "true"
       }, 
       { "family" : "Gates",
         "given" : "William Henry, III",
         "parse-names" : "true"
       }
     ]
   }

!!!!!!!!!!!!!!!!!!!!!!!!!
``suffix`` (forced comma)
!!!!!!!!!!!!!!!!!!!!!!!!!

Modern typographical convention does not place a
comma between suffixes such as "Jr." and the last
name, when rendering the name in normal order:
"John Doe Jr."  If an individual prefers that the
traditional comma be used in rendering their name, the
comma can be force by placing a exclamation mark
after the comma:

.. sourcecode:: js

   { "author" : [ 
       { "family" : "Bennett",
         "given" : "Frank G.,! Jr.",
         "parse-names" : "true"
       }
     ]
   }


!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Particles as part of the last name
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

The particles preceding some names should be treated
as part of the last name, depending on the cultural
heritage and personal preferences of the individual.
To suppress parsing and treat such particles as part
of the ``family`` name field, enclose the ``family``
name field content in double-quotes:

.. sourcecode:: js

   { "author" : [ 
       { "family" : "\"van der Vlist\"",
         "given" : "Eric",
         "parse-names" : "true"
       }
     ]
   }

.. _dirty-dates:

^^^^^
Dates
^^^^^

The ``citeproc-js`` processor contains its own internal
parsing code for raw date strings.  Clients may take advantage of the
processor's internal parser by supplying date strings as a single
``raw`` element:

.. sourcecode:: js

   {  "issued" : {
         "raw" : "25 Dec 2004"
      }
   }

Note that the parsing of raw date strings is not part of the CSL 1.0
standard.  Clients that need to interoperate with other CSL
processors should be capable of preparing input in the form described
above under `Data Input`_ → `Dates`__.

__ `input-dates`_


#################
Processor control
#################

In ordinary operation, the processor generates citation strings
suitable for a given position in the document.  To support some use
cases, the processor is capable of delivering special-purpose
fragments of a citation.


^^^^^^^^^^^^^^^
``author-only``
^^^^^^^^^^^^^^^

When the ``makeCitationCluster()`` command (not documented here) is
invoked with a non-nil ``author-only`` element, everything but the
author name in a cite is suppressed.  The name is returned without
decorative markup (italics, superscript, and so forth).

.. sourcecode:: js

   var my_ids = { 
     ["ID-1", {"author-only": 1}]
   }

You might think that printing the author of a cited work,
without printing the cite itself, is a useless thing to do.
And if that were the end of the story, you would be right ...


^^^^^^^^^^^^^^^^^^^
``suppress-author``
^^^^^^^^^^^^^^^^^^^

To suppress the rendering of names in a cite, include a ``suppress-author``
element with a non-nil value in the supplementary data:

.. sourcecode:: js

   var my_ids = [
       ["ID-1", { "locator": "21", "suppress-author": 1 }]
   ]

This option is useful on its own.  It can also be used in
combination with the ``author-only`` element, as described below.


^^^^^^^^^^^^^^^^^^^^^^^^^^
Automating text insertions
^^^^^^^^^^^^^^^^^^^^^^^^^^

Calls to the ``makeCitationCluster()`` command with the ``author-only`` 
and to ``processCitationCluster()`` or ``appendCitationCluster()`` with the
``suppress-author`` control elements can be used to produce
cites that divide their content into two parts.  This permits the
support of styles such as the Chinese national standard style GB7714-87,
which requires formatting like the following:

   **The Discovery of Wetness**

   While it has long been known that rocks are dry :superscript:`[1]`  
   and that air is moist :superscript:`[2]` it has been suggested by Source [3] that 
   water is wet.

   **Bibliography**

   [1] John Noakes, *The Dryness of Rocks* (1952).

   [2] Richard Snoakes, *The Moistness of Air* (1967).

   [3] Jane Roe, *The Wetness of Water* (2000).

In an author-date style, the same passage should be rendered more or
less as follows:

   **The Discovery of Wetness**

   While it has long been known that rocks are dry (Noakes 1952)  
   and that air is moist (Snoakes 1967) it has been suggested by Roe (2000)
   that water is wet.

   **Bibliography**

   John Noakes, *The Dryness of Rocks* (1952).

   Richard Snoakes, *The Moistness of Air* (1967).

   Jane Roe, *The Wetness of Water* (2000).

In both of the example passages above, the cites to Noakes and Snoakes
can be obtained with ordinary calls to citation processing commands.  The
cite to Roe must be obtained in two parts: the first with a call
controlled by the ``author-only`` element; and the second with
a call controlled by the ``suppress-author`` element, *in that order*:

.. sourcecode:: js

   var my_ids = { 
     ["ID-3", {"author-only": 1}]
   }

   var result = citeproc.makeCitationCluster( my_ids );

... and then ...
   
.. sourcecode:: js

   var citation = { 
     "citationItems": ["ID-3", {"suppress-author": 1}],
     "properties": { "noteIndex": 5 }
   }

   var result = citeproc.processCitationCluster( citation );

In the first call, the processor will automatically suppress decorations (superscripting).
Also in the first call, if a numeric style is used, the processor will provide a localized 
label in lieu of the author name, and include the numeric source identifier, free of decorations.
In the second call, if a numeric style is used, the processor will suppress output, since
the numeric identifier was included in the return to the first call.

Detailed illustrations of the interaction of these two control
elements are in the processor test fixtures in the
"discretionary" category: 

* |link| `AuthorOnly`__
* |link| `CitationNumberAuthorOnlyThenSuppressAuthor`__
* |link| `CitationNumberSuppressAuthor`__
* |link| `SuppressAuthorSolo`__

__ http://bitbucket.org/fbennett/citeproc-js/src/tip/tests/std/humans/discretionary_AuthorOnly.txt
__ http://bitbucket.org/fbennett/citeproc-js/src/tip/tests/std/humans/discretionary_CitationNumberAuthorOnlyThenSuppressAuthor.txt
__ http://bitbucket.org/fbennett/citeproc-js/src/tip/tests/std/humans/discretionary_CitationNumberSuppressAuthor.txt
__ http://bitbucket.org/fbennett/citeproc-js/src/tip/tests/std/humans/discretionary_SuppressAuthorSolo.txt



.. _`Multi-lingual content`:

#####################
Multi-lingual content
#####################

.. role:: sc

The version of ``citeproc-js`` described by this manual incorporates
an experimental mechanism for supporting cross-lingual and
mixed-language citation styles, such as 我妻栄 [Wagatsuma Sakae], 
:sc:`債権各論 [Obligations in Detail]` (1969).  While the scheme
described below cannot be considered
a permanent and stable solution to the problem of multi-lingual
citation management, it provides a platform for proof of concept, and
for the development of styles to support more robust multilingual support
when it arrives.


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The ``default-locale`` declaration
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``style`` tag in a CSL style may contain a ``default-locale`` attribute.


.. The clothesline construct below removes the hint box from the
   normal flow, so that it overlays the code block below.  This
   is necessary wherever the edge of the table containing the
   code block might extend to the edge of a hint/important box.

.. class:: clothesline

   ..

      .. admonition:: Hint
   
         When the ``default-locale`` attribute is omitted, 
         the default language is set to ``en-US``.
   
.. sourcecode:: xml
      
   <style 
       xmlns="http://purl.org/net/xbiblio/csl"
       class="in-text"
       version="1.0"
       default-locale="de">
     <info>
       <id />
       <title />
       <updated>2009-08-10T04:49:00+09:00</updated>
     </info>
     <citation>
       <layout>
         <names variable="author">
           <name />
         </names>
       </layout>
     </citation>
   </style>

For multi-lingual operation, a style may be set to request alternative
versions and translations of the ``title`` field, and of the author
and other name fields, using an extension to the ``default-locale``
attribute.  Extensions consist of an extension tag, followed by
a language setting that conforms to |link| `RFC 4646`__ (typically constructed
from components listed in the |link| `IANA Language Subtag Registry`__).  Recognized extension
tags are as follows:

__ http://www.ietf.org/rfc/rfc4646.txt

__ http://www.iana.org/assignments/language-subtag-registry


``-x-pri-``
   Sets a preferred language or translitertion for the title field.

``-x-sec-``
   Sets an optional secondary translation for the title field. 
   If this tag is present, a translation in the target language 
   will (if available) be placed in square braces immediately  after the title text.

``-x-sort-``
   Sets the preferred language or transliteration to be used for both the 
   title field and for names.

``-x-name-``
   Sets the preferred language or transliteration for names.

The tags are applied to a style by appending them to the language
string in the ``default-locale`` element:

.. sourcecode:: xml

   <style 
       xmlns="http://purl.org/net/xbiblio/csl"
       class="in-text"
       version="1.0"
       default-locale="en-US-x-pri-ja-Hrkt">

Multiple tags may be specified, and tags are cumulative, and for
readability, individual tags may be separated by newlines within the
attribute.  The following will attempt to render titles in either
Pinyin transliteration (for Chinese titles) or Hepburn romanization
(for Japanese titles), sorting by the transliteration.

.. sourcecode:: xml

   <style 
       xmlns="http://purl.org/net/xbiblio/csl"
       class="in-text"
       version="1.0"
       default-locale="en-US
           -x-pri-zh-Latn-pinyin
           -x-pri-ja-Latn-hepburn
           -x-sort-zh-Latn-pinyin
           -x-sort-ja-Latn-hepburn">

Multi-lingual operation depends upon the presence of alternative
representations of field content embedded in the item data.  When
alternative field content is not availaable, the "real" field content
is used as a fallback.  As a result, configuration of language and
script selection parameters will have no effect when only a single
language is available (as will normally be the case for an ordinary
Zotero data store).


^^^^^
Title
^^^^^

For titles, alternative representations are appended
directly to the field content, separated by the appropriate
language tag with a leading and trailing colon:

.. sourcecode:: js

   { "title" : "民法 :ja-Latn-hepburn-heploc: Minpō :en: Civil Code"
   }

^^^^^
Names
^^^^^

For personal names, alternative representations should be presented
as separate "name" entries, immediately following the original
for the name element to which they apply.  For example:

.. admonition:: Hint

   As described above, fixed ordering is used for
   `non-Byzantine names`__.  When such
   names are transliterated, the ``static-ordering`` element is
   set on them, to preserve their original formatting behavior.

__ `input-byzantine`_



.. sourcecode:: js

   { "author" : [
       { "family" : "穂積",
         "given" : "陳重"
       },
       { "family" : ":ja-Latn: Hozumi",
         "given" : "Nobushige"
       },
       { "family" : "中川",
         "given" : "善之助"
       },
       { "family" : ":ja-Latn: Nakagawa",
         "given" : "Zennosuke"
       }
     ]
   }



----------
Test Suite
----------

``Citeproc-js`` ships with a large bundle of test data and a set of
scripts that can be used to confirm that the system performs correctly
after installation.  The tests begin as individual human-friendly
fixtures written in a special format, shown in the sample file
immediately below.  Tests are prepared for use by grinding them into a
machine-friendly form (JSON), and by preparing an appropriate Javascript
execution wrapper for each.  These operations are performed automatically
by the top-level test runner script that ships with the sources.


######################
Running the test suite
######################

Tests are controlled by the ``./test.py`` script in the root
directory of the archive.  To run all standard tests in the suite using
the ``rhino`` interpreted shipped with the processor, use
the following command::

    ./test.py -s

Options and arguments can be used to select an alternative
Javascript interpreter, or  to change or limit the set of tests
run.  The script options are as follows:

``--help``: 
     List the script options with a brief description
     of each and exit
``--tracemonkey``
     Use the tracemonkey JS engine, rather than the Rhino
     default.
``--cranky``
     validate style code for testing against the
     CSL schema using the ``jing`` XML tool.
``--grind``
     Force grinding of human-readable test code into machine-
     readable form.
``--standard``
     Run standard tests.
``--release``
     Bundle processor, apply license to files, and test with
     bundled code.
``--processor``
     Run processor tests (cannot be used with the ``-c``, ``-g`` or ``-s``
     opts, takes only test name as single argument).
``--verbose``      
     Display test names during processing.

The ``--tracemonkey`` option requires the ``jslibs`` Javascript
development environment.  The sources for ``jslibs`` can be obtained from |link| `Google Code`_.
After installation, adjust the path to the ``jshost`` utility in ``./tests/config/test.cnf``.


.. _`Google Code`: http://code.google.com/p/jslibs/

##############
Fixture layout
##############

The human-readable version of each test fixture is composed in
the format below.  The five sections ``MODE``,
``RESULT``, ``CSL`` and ``INPUT`` are required, and may be 
arranged in any order within the fixture file.  As the
sample below illustrates, text outside of the section
delimiters is ignored.  The sample file below shows the
layout of a typical fixture.  See the explanations of
the individual sections further below for information on
the usage of each.

.. class:: clothesline

   ..

      .. admonition:: Hint
   
         Four additional sections are available for special
         purposes.  The optional sections 
         ``BIBENTRIES``, ``BIBSECTION``, ``CITATIONS`` and ``CITATION-ITEMS``
         are also explained below.

.. sourcecode:: text

   >>===== MODE =====>>
   citation
   <<===== MODE =====<<
   
   # Everything between the section blocks is
   # ignored.  Comment markup can be used for 
   # clarity, but it is not required.

      
   >>===== RESULT =====>>
   John Doe
   <<===== RESULT =====<<
   
   
   >>===== CSL =====>>
   <style 
         xmlns="http://purl.org/net/xbiblio/csl"
         class="in-text"
         version="1.0">
     <info>
       <id />
       <title />
       <updated>2009-08-10T04:49:00+09:00</updated>
     </info>
     <citation>
       <layout>
         <names variable="author">
           <name />
         </names>
       </layout>
     </citation>
   </style>
   <<===== CSL =====<<
   
   
   >>===== INPUT =====>>
   [
      {
         "id":"ID-1",
         "type": "book",
         "author": [
            { "name":"Doe, John" }
         ],
         "issued": {
            "date-parts": [
               [
                  "1965", 
                  "6", 
                  "1"
               ]
            ]
         }
      }
   ]
   <<===== INPUT =====<<


^^^^^^^^^^^^^^^^^
Required sections
^^^^^^^^^^^^^^^^^

The following four sections (``MODE``, ``CSL``, ``INPUT``, ``RESULT``)
are required in all test fixtures.

!!!!
MODE
!!!!

A single string tells whether to test ``citation`` or ``bibliography``
output.  In the former case, the test will be performed using 
the ``makeCitationCluster()`` command if a ``CITATION-ITEMS`` area is 
included in the test fixture, or if neither that nor a ``CITATIONS`` 
area is included.  If a ``CITATIONS`` area is included,
``citation`` mode uses the ``processCitationCluster`` command.

In the case of ``bibliography`` mode, the ``makeBibliography()``
command is used, with output possibly filtered by the conditions
specified in a ``BIBSECTION`` area:

.. sourcecode:: text

   >>===== MODE =====>>
   citation
   <<===== MODE =====<<

!!!
CSL
!!!

The code to be used in the test must be valid
as a complete, if minimal, CSL style:

.. sourcecode:: text

   >>===== CSL =====>>
   <style 
         xmlns="http://purl.org/net/xbiblio/csl"
         class="in-text"
         version="1.0">
     <info>
       <id />
       <title />
       <updated>2009-08-10T04:49:00+09:00</updated>
     </info>
     <citation
       et-al-min="3"
       et-al-use-first="1">
       <layout delimiter="; ">
         <group delimiter=" ">
           <names>
             <name form="short"/>
           </names>
           <date 
               variable="issued" 
               date-parts="year" 
               form="text"
               prefix="("
               suffix=")"/>
         </group>
       </layout>
     </citation>
     <bibliography>
       <layout>
         <group delimiter=" ">
           <names variable="author">
             <name delimiter=" " initialize-with="."/>
           </names>
           <date 
               variable="issued" 
               date-parts="year" 
               form="text"
               prefix="("
               suffix=")"/>
         </group>
       </layout>
     </bibliography>
   </style>
   <<===== CSL =====<<


!!!!!
INPUT
!!!!!

The ``INPUT`` section provides the item data to be registered
in the processor.  In a simple test fixture that contains
none of the optional areas ``BIBENTRIES``, ``BIBSECTION`` ``CITATIONS``
or ``CITATION-ITEMS``,
a citation or bibligraphy is requested for *all* of the
items in the ``INPUT`` section (where one of those two
optional sections is included, the testing behavior is slightly
different; see the discussion of the relevant sections below
for details):

.. sourcecode:: text

   >>===== INPUT =====>>
   [
    {
      "id":"ID-1",
      "author": [
           { "name":"Noakes, John" },
           { "name":"Doe, John" },
           { "name":"Roe, Jane" }
      ],
      "issued": {
         "date-parts": [
            [
               2005
            ]
         ]
      }
    },
    {
      "id":"ID-2",
      "author": [
           { "name":"Stoakes, Richard" }
      ],
      "issued": {
         "date-parts": [
            [
               1898
            ]
         ]
      }
    }
   ]
   <<===== INPUT =====<<

!!!!!!
RESULT
!!!!!!

A string to compare with the citation or bibliography output
received from the processor.

.. sourcecode:: text

   >>===== RESULT =====>>
   (Noakes, et al. 2005; Stoakes 1898)
   <<===== RESULT =====<<

Note that in ``bibliography`` mode, the HTML string output 
used for testing will be affixed with a standard set of 
wrapper tags, which must be written into the result string
used for comparison:

.. sourcecode:: text

   >>===== RESULT =====>>
   <div class="csl-bib-body">
     <div class="csl-entry">J. Noakes, J. Doe, J. Roe (2005)</div>
     <div class="csl-entry">R. Stoakes (1898)</div>
   </div>
   <<===== RESULT =====<<


^^^^^^^^^^^^^^^^^
Optional sections
^^^^^^^^^^^^^^^^^

Four optional sections are available for use in a fixture
to exercise special aspects of processor behavior.

!!!!!!!!!!
BIBENTRIES
!!!!!!!!!!

The ``citeproc-js`` processor maintains a persistent internal registry
of citation data, and permits the addition, deletion and rearrangement
of registered items.  The behavior of the processor across a series of
update transactions can be tested by including ``BIBENTRIES`` section.
When included, the section should consist of a two-tier list,
consisting of discrete lists of IDs, which must correspond to items
registered in the ``INPUT`` section:

.. class:: clothesline

   ..

      .. admonition:: Hint

         The test of output will be run after first updating the
         processor's internal registry to reflect each of the
         requested citation sets, and should correctly reflect the
         last in the series.

.. sourcecode:: text

   >>===== BIBENTRIES =====>>
   [
     [
       "ITEM-1",
       "ITEM-2",
       "ITEM-3",
       "ITEM-4",
       "ITEM-5"
     ],
     [
       "ITEM-1",
       "ITEM-4",
       "ITEM-5"
     ]
   ]
   <<===== BIBENTRIES =====<<

!!!!!!!!!!
BIBSECTION
!!!!!!!!!!

When ``bibliography`` mode is used, a ``BIBSECTION`` area
can be used to limit the output of the bibligraphy, through
the interface described above under the `makeBibliography()`_
command:

.. sourcecode:: text

   >>===== BIBSECTION =====>>
   {
      "include" : [
         {
            "field" : "categories",
            "value" : "classical"
         }
      ],
      "quash" : [
         {
            "field" : "type",
            "value" : "manuscript"
         },
         {
            "field" : "issued",
            "value" : ""
         }
      ]
   }
   <<===== BIBSECTION =====<<


!!!!!!!!!!!!!!
CITATION-ITEMS
!!!!!!!!!!!!!!

When testing in ``citation`` mode, the data items to be
processed are ordinarily rendered as a single citation.
To test operations that depend upon or may be affected
by the internal state of the processor across a session,
either a ``CITATION-ITEMS`` or a ``CITATIONS`` section
may be included in the test fixture (only one may be used
in a single test fixture).

``CITATION-ITEMS`` is the simpler of the two, used in
most of the standard processor formatting test fixtures.
The data input in this area should consist of a list array
of cite data, where each cite consists of a Javascript object
containing, at least, item ID.
A single citation is composed of a list of cites, and
the full entry consists of a list of such citations:

.. sourcecode:: text

   >>===== CITATION-ITEMS =====>>
   [
     [
       {"id": "ITEM-1"}
     ],
     [
       {"id": "ITEM-2", "label": "page", "locator": "23"},
       {"id":"ITEM-3"}
     ]
   ]
   <<===== CITATION-ITEMS =====<<

!!!!!!!!!
CITATIONS
!!!!!!!!!

A ``CITATIONS`` area can be used (instead of ``CITATION-ITEMS``)
to mimic a series of interactions with a word processor plugin.
In this case, the area should contain a list array of citation
data objects with explict ``citationID`` values and ID list values
for subsequent invocations of the ``processCitationCluster()`` command,
like the following:

.. sourcecode:: text

   >>===== CITATIONS =====>>
   [
      [
         {
            "citationID": "CITATION-1",
            "citationItems": [
               {
                  "id": "ITEM-1"
               }
            ], 
            "properties": {
               "noteIndex": 1
            }
         },
         [],
         []
      ],
      [
         {
            "citationID": "CITATION-2",
            "citationItems": [
               {
                  "id": "ITEM-2",
                  "locator": 15
               },
               {
                  "id": "ITEM-3"
               }
            ], 
            "properties": {
               "noteIndex": 2
            }
         },
         [
           [
             "CITATION-1",
             1
           ]
         ],
         []
      ]
   ]
   <<===== CITATIONS =====<<

---------
Live Demo
---------

When accessed using a Javascript-enabled browser with E4X support
(such as |link| `Firefox`__), the ``./demo/demo.html`` file in the source archive
(or |link| `online`__) will invoke the processor to render a few citations.  The Javascript
files accompanying the page in the ``./demo`` directory show the basic
steps required to load and run the processor, whether in the browser
or server-side.

__ http://www.mozilla.com/

__ http://gsl-nagoya-u.net/http/pub/citeproc-demo/demo.html