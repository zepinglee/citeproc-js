===========================
`Citation Style Language`__
===========================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Manual for the ``citeproc-js`` Processor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

__ `Table of Contents`_

.. class:: double-border
   
   .. image:: counter.gif
      :align: center

.. class:: info-version

   version 1.00##a18##

.. class:: info-date

   =D=6 October 2009=D=

.. class:: contributors

   Author
       * Frank G. Bennett, Jr.

   Contributors
       * Bruce D'Arcus
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
managers.  The processor complies with version 1.0 of the CSL
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
will be gladly received and eventually despatched with.  My email address
is `biercenator@gmail.com`_

.. class:: first

   .. [#] For further details on required infrastructure, see the sections 
          |link| `Local Environment`_ 
          and |link| `Data Input`_ below.

.. _biercenator@gmail.com: mailto:biercenator@gmail.com

-------------------
System requirements
-------------------

The processor and its test framework can be run in two commonly
available Javascript environments, using the scripts ``test.py`` or
``runtest.sh``.  This manual does not cover the nitty-gritty of
setting up the environment for these scripts, but the basic system
requirements are described below.  If you get stuck and want advice,
or if you find something in this manual that is out of date or just
wrong, please feel free to drop me a line.

###################################
Getting the ``citeproc-js`` sources
###################################

The ``citeproc-js`` sources are hosted |link| `on a BitBucket account`__.
To obtain the sources, install the |link| `Mercurial version control system`__
on a computer within your control (if you're on a Linux distro or a Mac,
just do a package install), and run the following command:

__ http://bitbucket.org/fbennett/citeproc-js/

__ http://mercurial.selenic.com/wiki/


   ::

      hg clone http://bitbucket.org/fbennett/citeproc-js/


##########################
``runtest.sh`` + ``rhino``
##########################

The simplest configuration for running tests is to use the ``runtest.sh``
script (or ``runtest.bat`` on Windows systems).  If your OS has Java installed
(which most desktop and laptop systems nowadays seem to do), this will run
the full set of processor tests using a copy of the ``rhino`` Javascript interpreter
that ships with the ``citeproc-js`` sources.

#####################################
``test.py`` + ``python-spidermonkey``
#####################################

It is also possible to run the processor tests in the ``spidermonkey``
interpreter using the ``test.py`` script.  This exciting alternative
displays exactly the same console trace through a *totally different
set of underlying libraries*.  Playstation\ |reg|\ 3, you say?  Ha!
Wii\ |trade|?  Tame stuff!  Xbox 360 :superscript:`©2004 Microsoft
Corporation and/or its suppliers`?  Hardly.  You can set these mere
toys aside, ladies and gentlemen.  *This* is *the real adventure*.  A
challenge that comes but once in a product cycle.  A task that demands
sturdy fingers, strong coffee and ...

.. |reg| unicode:: U+00AE
.. |trade| unicode:: U+02122
.. |copy| unicode:: U+00A9

Ahem.

To use the ``test.py`` script, you will need to install the following items
on your computer:

Python 2.5 or higher
      (Available as a package install in most Linux distributions.)

Python-spidermonkey bridge by Paul Davis
      http://github.com/davisp/python-spidermonkey

Spidermonkey system library
      (Available as a package install in most Linux distributions.
      You may also be able to use the Spidermonkey sources that ship
      with the ``python-spidermonkey`` bridge.)

If your Python is version 2.5, you will also need to install a
JSON package, such as ``simplejson`` or ``cjson``.  Python 2.6
ships with a bundled JSON module, so there is no need to install
one separately if that's your version.

------------------
Processor Commands
------------------

The processor command set will be a grave disappointment to those well versed in
the tormented intricacies of reference management and bibliography
formatting.  The processor is instantiated with a single command, and
controlled with three others.


################
``CSL.Engine()``
################

A working instance of the processor can (well, must) be created using the
``CSL.Engine()`` command, as shown in the code illustration below.  
This command takes two required and one optional argument:

.. admonition:: Important

   See the section |link| `Local Environment → System functions`__ below for guidance
   on the definition of the functions contained in the ``sys``
   object.

__  `System functions`_

.. code-block:: js

   var citeproc = CSL.Engine(sys, style, lang)

*sys*
    A Javascript object containing the functions
    ``retrieveLocale()`` and ``retrieveItem()``.

*style*
    A CSL style in serialized (string) form.

*lang* (optional)
    A language tag compliant with RFC 4646.  Defaults to ``en``.


#################
``updateItems()``
#################

Before citations or a bibliography can be generated, an ordered
list of reference items must be loaded into the processor using
the ``updateItems()`` command, as shown below.  This command
takes a list of item IDs as its sole argument, and will reconcile
the internal state of the processor to the provided list of
items, making any necessary insertions and deletions, and making
any necessary adjustments to internal registers related to
disambiguation and so forth.

.. admonition:: Hint

   The sequence in which items are listed in the
   argument to ``updateItems()`` will be reflected in the ordering
   of bibliographies only if the style installed in the processor
   does not impose its own sort order.

.. code-block:: js

   var my_ids = [
       "ID-1",
       "ID-53",
       "ID-27"
   ]
   
   citeproc.updateItems( my_ids );

Note that only IDs may be used to identify items.  The ID is an
arbitrary, system-dependent identifier, used by the locally customized
``retrieveItem()`` and ``retrieveItems()`` methods to retrieve
actual item data.  



######################
``makeBibliography()``
######################

The ``makeBibliography()`` command does what its name implies.  The
command takes one optional argument.  If invoked without an argument,
it dumps a formatted bibliography containing all items currently
registered in the processor:

.. code-block:: js

   var mybib = citeproc.makeBibliography();

.. _`commands-categories`:

The optional argument is an arbitrary category name, used to obtain a
bibliography containing only items loaded to the processor with a
matching ``category`` element.

.. admonition:: Hint

   The format of the ``category`` field is described below under
   `Dirty Tricks → Bibliography categories`__

__ `bib-categories`_

.. code-block:: js

   var mybib = cp.makeBibliography("1990s");

To print items that are not associated with any category, use
the reserved category name ``none``:

.. code-block:: js

   var mybib = cp.makeBibliography("none");

The value returned by either form of this command is a two-element
list, composed of a Javascript array containing certain formatting
parameters, and a rendered string representing the bibliography
itself.  The first element—the array of formatting parameters—contains
the key/value pairs shown below (the values shown are the processor
defaults):

.. code-block:: js

	{ "maxoffset": 0,
	  "entryspacing": 1,
	  "linespacing": 1
	};

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

   


#########################
``makeCitationCluster()``
#########################

Use the ``makeCitationCluster()`` command to generate the text
of citations containing one or more references, for insertion into
footnotes or the main text of the document.  This command takes a 
single argument, composed of a list of IDs, each accompanied by
a simple Javascript object containing (optional) supplementary data.

.. admonition:: Hint
   
   See the |link| `Data Input → Citation fields`__ section below concerning
   the elements recognized as supplementary data, and their
   usage.

__ `Citation fields`_

.. code-block:: js

   var my_ids = [
       ["ID-1", {}],
       ["ID-2", {}]
   ]

   var mycite = makeCitationCluster( my_ids );

#####################
``setOutputFormat()``
#####################

The output format of the processor can be changed after instantiation
using the ``setOutputFormat()`` command.  This command is specific
to the ``citeproc-js`` processor.

.. admonition:: Hint

   See the section `Output Formatting`__ below for notes
   on defining new output formats.

__ `Output Formatting`_

.. code-block:: js

   citeproc.setOutputFormat("rtf");



####################################
``setContainerTitleAbbreviations()``
####################################

A list of journal title abbreviations can be set on the processor
using the ``setContainerTitleAbbreviations()`` command.
This command is also specfic to ``citeproc-js``:

.. class:: clothesline

   ..

      .. admonition:: Hint

         See the section `Dirty Tricks → Journal abbreviation lists`__ below
         for further details.

.. code-block:: js

   cp.setContainerTitleAbbreviations( abbr );


__ `Journal abbreviation lists`_

-----------------
Local Environment
-----------------

While ``citeproc-js`` does a great deal of the heavy lifting needed
for correct formatting of citations and bibliographies, a certain
amount of programming is required to prepare the environment for its
correct operation.


############################
State-aware data preparation
############################

The CSL 1.0 specification anticipates the availability of several
dynamic variables whose value depends upon the sequence and context
of references generated with the ``makeCitationCluster()`` command:
   
.. class:: hello

   =============================== =======
   Variable                        Type
   =============================== =======
   ``position``                    numeric
   ``first-reference-note-number`` numeric
   ``near-note``                   boolean
   =============================== =======

Correct calculation of these values demands client-specific awareness
of transaction details, such as the identity and position of a
particular footnote within a word processing program or typesetting
system, that is beyond the generic capabilities of the ``citeproc-js``
processor.  It is therefore the responsibility of the calling
application, when invoking ``makeCitationCluster()``, to supply
correct values for these three variables.

A detailed explanation of the role and expected values of these
variables under various processing scenarios is beyond the scope of
this document.  For further information on the role each plays in citation
formatting, please refer to the CSL specification, available via
http://citationstyles.org/.

################
System functions
################

As mentioned above in the section on |link| `CSL.Engine()`_, two functions
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


.. code-block:: js

   sys.retrieveLocale = function(lang){
	   var ret = DATA._locales[ CSL.localeRegistry[lang] ];
	   return ret;
   };



^^^^^^^^^^^^^^^^^^
``retrieveItem()``
^^^^^^^^^^^^^^^^^^

The ``retrieveItem()`` function is used by the processor to
fetch individual items from storage.

.. code-block:: js

   sys.retrieveItem = function(id){
	   return DATA._items[id];
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

.. code-block:: js

   { "title" : "My Anonymous Life",
     "volume" : "10"
   }

^^^^^
Names
^^^^^

When present in the item data, CSL name variables must
be delivered as a list of Javascript arrays, with one
array for each name represented by the variable.
Simple personal names are composed of ``family`` and ``given`` elements,
containing respectively the family and given name of the individual.

.. code-block:: js

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

.. code-block:: js

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
Name suffixes such as the "Jr." in "Frank Bennett Jr." can be 
delivered as a ``suffix`` element.

.. admonition:: Hint

   A simplified format for delivering particles and name suffixes
   to the processor is described below in the section 
   |link| `Dirty Tricks → Input data rescue → Names`__.

__ `dirty-names`_

.. admonition:: Important

   Note the escaped quotation marks around the last example.
   This is a side effect of the dirty trickery described
   under the link above.

.. code-block:: js

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
       { "family" : "\"van der Vlist\"",
         "given" : "Eric"
       }
     ]
   }

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

.. code-block:: js

   { "author" : [
       { "family" : "村上",
         "given" : "春樹"
       }
     ]
   }

.. admonition:: Hint

   When the romanized transliteration is selected from a multi-lingual
   name field, the ``static-ordering`` flag is not required.  See the section
   |link| `Dirty Tricks → Multi-lingual content`__ below for further details.

__ `Multi-lingual content`_

Sometimes it might be desired to handle a Latin or Cyrillic
transliteration as if it were a fixed (non-Byzantine) name.  This
behavior can be prompted by including a ``static-ordering`` element in
the name array.  The actual value of the element is irrelevant, so
long as it returns true when tested by the Javascript interpreter.

.. code-block:: js

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

Date fields are Javascript arrays, and may contain ``year``, ``month``
and ``day`` elements.

.. admonition:: Hint

   A simplified format for providing date input
   is described below in the section 
   |link| `Dirty Tricks → Input data rescue → Dates`__.

__ `dirty-dates`_

.. code-block:: js

   { "year" : "2000",
     "month" : "1",
     "day" : "15"
   }

Date elements may be expressed either as numeric strings or as
numbers.

.. code-block:: js
   
   { "year" : 1895,
     "month" : 11
   }

The ``year`` element may be negative, but never zero.

.. code-block:: js

   { "year" : -200
   }

A ``season`` element may
also be included.  If present, string or number values between ``1`` and ``4``
will be interpreted to correspond to Spring, Summer, Fall, and Winter, 
respectively.

.. code-block:: js

   { "year" : 1950,
     "season" : "1"
   }

Other string values are permitted in the ``season`` element, 
but note that these will appear in the output
as literal strings, without localization:

.. code-block:: js

   { "year" : 1975,
     "season" : "Trinity"
   }

For approximate dates, a ``circa`` element should be included,
with a non-nil value:

.. code-block:: js

   { "year" : -225,
     "circa" : 1
   }

To input a date range, add an element with an ``_end`` suffix
to correspond with each ``year``, ``month`` and ``day`` in
the field data:

.. admonition:: Important

   As shown in this example, in ranged input, 
   *all* date elements in the input data must have an explicit corresponding
   ``_end`` counterpart, even when the values are identical.

.. code-block:: js

   { "year" : 2000,
     "month" : 11,
     "year_end" : 2000,
     "month_end" : 12
   }

To specify an open-ended range, pass nil values for the ``_end`` elements:

.. code-block:: js

   { "year" : 2008,
     "month" : 11,
     "year_end" : 0,
     "month_end" : 0
   }



A literal string may be passed through as a ``literal`` element:

.. code-block:: js

   { "literal" : "13th century"
   }

###############
Citation fields
###############

As noted above under |link| `makeCitationCluster()`_, that function takes
as its single argument a list item IDs, each paired with a Javascript
array containing supplementary data.  The supplementary array must be present,
but may be empty:

.. code-block:: js

   var my_ids = [
       ["ID-1", {}],
       ["ID-2", {}]
   ]


^^^^^^^
Locator
^^^^^^^

To include pinpoint locator information in a cite, include a ``locator`` element
with the string data describing the cited location, and a ``label`` element
with a valid CSL label string. [#]_

.. code-block:: js

   var my_ids = [
       ["ID-1", { "locator": "21", "label": "paragraph" }],
       ["ID-2", {}]
   ]

If the ``label`` element is not included, a value of "page" will
be assumed.

.. code-block:: js

   var my_ids = [
       ["ID-1", { "locator": "21" }],
       ["ID-2", {}]
   ]

.. class:: first

   .. [#] For information on valid CSL variable names, please
          refer to the CSL specification, available via http://citationstyles.org/.

.. [#] The Latin and Cyrillic scripts are referred to here collectively
       as "Byzantine scripts", after the confluence of cultures in the first
       millenium that spanned both.

.. [#] For a list of valid CSL locator label strings, see the
       CSL specification, available via  http://citationstyles.org/.

-----------------
Output Formatting
-----------------

The test fixtures assume HTML output, which the processor supports out
of the box as its default mode.  It is currently the only mode
supported in the distributed version of the code, but additional modes
can be created by adding definitions for them to the source file ``./src/formats.js``.
See `the file itself`__ for details; it's pretty straightforward.

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
``non-dropping-particle`` and ``dropping-particle``
elements on a name by including them in the ``family``
or ``given`` fields, respectively:

.. code-block:: js

   { "author" : [ 
       { "family" : "Humboldt",
          "given" : "Alexander von"
       },
       { "family" : "van Gogh",
         "given" : "Vincent"
       }
     ]
   }

The extraction of "non-dropping" particles is done by scanning the
``family`` field for leading terms that contain no uppercase letters.
The extraction of "dropping" particles is done by scanning the
``given`` field for trailing terms that contain no uppercase letters.

For some names, leading lowercase terms in the ``family`` field should
be treated as part of the name itself, and not as particles.  Such
names should (always) be passed to the processor wrapped in quotation
marks:

.. code-block:: js

   { "author" : [
       { "family" : "\"van der Vlist\"",
          "given" : "Eric"
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

.. code-block:: js

   { "raw" : "25 Dec 2004"
   }

Note that the parsing of raw date strings is not part of the CSL 1.0
standard.  Clients that need to interoperate with other CSL
processors should be capable of preparing input in the form described
above under `Data Input → Dates`__.

__ `input-dates`_


.. _`bib-categories`:

#######################
Bibliography categories
#######################

Bibliographic output can be divided into sections by including a
``category`` element in each item.  A bibliography of items associated
with a particular category can then be produced by calling the
``makeBibliography()`` command with the category label as an argument,
as described above under `Processor Commands → makeBibliography()`__.
When a ``category`` element is present in item data, it must be a
Javascript array containing a list of strings:

__ `commands-categories`_

.. code-block:: js

   { "author" : [
       { "family" : "Derby", "given" : "George" }
     ],
     "title" : "Phoenixiana",
     "issued" : { "year" : 1873 },
     "category" : [ "humor", "satire" ]
   }

Note that the ``category`` field is not part of the CSL
specification, and like the other Dirty Tricks described here, may not
be available in other processors.


##########################
Journal abbreviation lists
##########################

To enable automatic abbreviation of journal titles, a set
of Javascript key/value pairs composed of full titles and their 
abbreviations may be installed using the ``setContainerTitleAbbreviations``
command, after instantiating the processor.

.. code-block:: js
   
   var abbreviations = {
       "Pacific Rim Law &amp; Policy Journal" 
           : "Pac. Rim L. &amp; Pol'y J.",
       "Temple Journal of International &amp; Comparative Law" 
           : "Temple J. Int'l &amp; Comp. L."
   };
   
   var citeproc = new CSL.Engine(sys,style);
   
   citeproc.setContainerTitleAbbreviations(abbreviations);

A later version of the CSL specification may provide for
selecting an appropriate list of abbreviations through
a declaration in the CSL style file itself.  For the present,
this facility is available as a non-standard extension to
the processor.


#################
Processor control
#################

In the ordinary operation of the ``makeCitationCluster()`` command,
the processor generates citation strings suitable for a given position
in the document.  To support some use cases, the processor is
capable of delivering special-purpose fragments of a citation.


^^^^^^^^^^^^^^^
``author-only``
^^^^^^^^^^^^^^^

When ``makeCitationCluster()`` is invoked with a non-nil ``author-only``
element, everything but the author name in a cite is suppressed.
The name is returned without decorative markup (italics, superscript, and
so forth).

.. code-block:: js

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

.. code-block:: js

   var my_ids = [
       ["ID-1", { "locator": "21", "suppress-author": 1 }]
   ]

This option is useful on its own.  It can also be used in
combination with the ``author-only`` element, as described below.


^^^^^^^^^^^^^^^^^^^^^^^^^^
Automating text insertions
^^^^^^^^^^^^^^^^^^^^^^^^^^

Calls to the ``makeCitationCluster()`` command with the ``author-only`` 
and ``suppress-author`` control elements can be used to produce
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
can be obtained with ordinary calls to ``makeCitationCluster()``.  The
cite to Roe must be obtained in two parts: the first with a call
controlled by the ``author-only`` element; and the second with
a call controlled by the ``suppress-author`` element, *in that order*:

.. code-block:: js

   var my_ids = { 
     ["ID-3", {"author-only": 1}]
   }

   var result = citeproc.makeCitationCluster( my_ids );

... and then ...
   
.. code-block:: js

   var my_ids = { 
     ["ID-3", {"suppress-author": 1}]
   }

   var result = citeproc.makeCitationCluster( my_ids );

In the first call, the processor will automatically suppress decorations (superscripting).
Also in the first call, if a numeric style is used, the processor will provide a localized 
label in lieu of the author name, and include the numeric source identifier, free of decorations.
In the second call, if a numeric style is used, the processor will suppress output, since
the numeric identifier was included in the return to the first call.

Detailed illustrations of the interaction of these two control
elements are in the processor test fixtures in the
"discretionary" category: 

* `AuthorOnly`__
* `CitationNumberAuthorOnlyThenSuppressAuthor`__
* `CitationNumberSuppressAuthor`__
* `SuppressAuthorSolo`__

__ http://bitbucket.org/fbennett/citeproc-js/src/tip/std/humans/discretionary_AuthorOnly.txt
__ http://bitbucket.org/fbennett/citeproc-js/src/tip/std/humans/discretionary_CitationNumberAuthorOnlyThenSuppressAuthor.txt
__ http://bitbucket.org/fbennett/citeproc-js/src/tip/std/humans/discretionary_CitationNumberSuppressAuthor.txt
__ http://bitbucket.org/fbennett/citeproc-js/src/tip/std/humans/discretionary_SuppressAuthorSolo.txt



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


^^^^^^^^^^^^^^^^^^^^^^^^
The ``lang`` declaration
^^^^^^^^^^^^^^^^^^^^^^^^

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
   
.. code-block:: xml
      
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
a language setting that conforms to `RFC 4646`__ (typically constructed
from components listed in the `IANA Language Subtag Registry`__).  Recognized extension
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

.. code-block:: xml

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

.. code-block:: xml

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

.. code-block:: js

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
   |link| `non-Byzantine names`__.  When such
   names are transliterated, the ``static-ordering`` element is
   set on them, to preserve their original formatting behavior.

__ `input-byzantine`_



.. code-block:: js

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
immediately below.  In prepare the tests for use, each is ground into
a machine-friendly form (JSON), and a Javascript execution wrapper for
each fixture is registered in the processor test framework.  The tests
are then processed in a separate operation by invoking one of the
top-level test runner commands.  

This section describes the arrangement of the files, the internal
layout of the human-readable version of the text fixtures, the scripts
used to manage the text fixture bundle, and the commands used to
actually run the tests.


##############
Fixture layout
##############

The human-readable version of each test fixture is composed in
the format below.  The five sections ``MODE``, ``SCHEMA``,
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
   
         Three additional sections are available for special
         purposes.  The optional sections ``ABBREVIATIONS``, ``BIBENTRIES``, 
         and ``CITATIONS`` are also explained
         below.

.. code-block:: text

   >>===== MODE =====>>
   citation
   <<===== MODE =====<<
   
   >>===== SCHEMA =====>>
   1.0
   <<===== SCHEMA =====<<


   # Everything between the section blocks is
   # ignored.  Comment markup can be used for clarity,
   but it is not required.

      
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
   [{
      "id":"ID-1",
      "type": "book",
      "author": [
           { "name":"Doe, John" }
      ],
      "issued": {"year": "1965", "month":"6", "day":"1"},
      "title": "His Anonymous Life"
   }]
   <<===== INPUT =====<<


^^^^^^^^^^^^^^^^^
Required sections
^^^^^^^^^^^^^^^^^

The following five sections are required in all test fixtures.

!!!!
MODE
!!!!

A single string tells whether to test ``citation`` or ``bibliography``
output, using the ``makeCitationCluster()`` and ``makeBibliography()``
processor commands, respectively:

.. code-block:: text

   >>===== MODE =====>>
   citation
   <<===== MODE =====<<

!!!!!!
SCHEMA
!!!!!!

A string indicates the version of the CSL schema against
which the test should be run.  All tests currently are for
CSL 1.0:

.. code-block:: text

   >>===== SCHEMA =====>>
   1.0
   <<===== SCHEMA =====<<

!!!
CSL
!!!

The code to be used in the test must be valid
as a complete, if minimal, CSL style:

.. code-block:: text

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
neither a ``BIBENTRIES`` nor a ``CITATIONS`` section,
a citation or bibligraphy is requested for *all* of the
items in the ``INPUT`` section (where one of those two
optional sections is included, the testing behavior is slightly
different; see the discussion of the relevant sections below
for details):

.. code-block:: text

   >>===== INPUT =====>>
   [
    {
      "id":"ID-1",
      "author": [
           { "name":"Noakes, John" },
           { "name":"Doe, John" },
           { "name":"Roe, Jane" }
      ],
      "issued": { "year" : 2005 }
    },
    {
      "id":"ID-2",
      "author": [
           { "name":"Stoakes, Richard" }
      ],
      "issued": { "year" : 1898 }
    }
   ]
   <<===== INPUT =====<<

!!!!!!
RESULT
!!!!!!

A string to compare with the citation or bibliography output
received from the processor.

.. code-block:: text

   >>===== RESULT =====>>
   (Noakes, et al. 2005; Stoakes 1898)
   <<===== RESULT =====<<

Note that in ``bibliography`` mode, the HTML string output 
used for testing will be affixed with a standard set of 
wrapper tags, which must be written into the result string
used for comparison:

.. code-block:: text

   >>===== RESULT =====>>
   <div class="csl-bib-body">
     <div class="csl-entry">J. Noakes, J. Doe, J. Roe (2005)</div>
     <div class="csl-entry">R. Stoakes (1898)</div>
   </div>
   <<===== RESULT =====<<


^^^^^^^^^^^^^^^^^
Optional sections
^^^^^^^^^^^^^^^^^

Three optional sections may be included in a fixture
to exercise special aspects of processor behavior.

!!!!!!!!!!!!!
ABBREVIATIONS
!!!!!!!!!!!!!

To test the operation of journal-title abbreviation lists,
add an ``ABBREVIATIONS`` section:

.. class:: clothesline

   ..

      .. admonition:: Hint

         To be meaningful, such a test must naturally include the relevant 
         journal title in its ``INPUT`` data, and render the title
         via the CSL written into the fixture.

.. code-block:: text

   >>== ABBREVIATIONS ==>>
   {
     "Journal of Irreproducible Results" : "J. Irrep. Res."
   }
   <<== ABBREVIATIONS ==<<


!!!!!!!!!!
BIBENTRIES
!!!!!!!!!!

The ``citeproc-js`` processor maintains a persistent internal 
registry of citation data, and permits the addition, deletion
and rearrangement of registered items.  The correct operation
of this functionality is quite important, because interaction 
with word processors and other authoring systems depends upon it.
The behavior of the processor across a series of update transactions
can be tested by including ``BIBENTRIES`` section.  
When included, the section should
consist of a two-tier list, consisting of discrete lists of IDs,
which must 
correspond to items registered in the ``INPUT`` section:

.. class:: clothesline

   ..

      .. admonition:: Hint

         The test of output will be run after first updating the
         processor's internal registry to reflect each of the
         requested citation sets, and should correctly reflect the
         last in the series.

.. code-block:: text

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


!!!!!!!!!
CITATIONS
!!!!!!!!!

When testing in ``citation`` mode, the data items to be
processed are ordinarily rendered as a single citation.
To test operations that depend upon or may be affected
by the internal state of the processor across a session,
a ``CITATIONS`` section may be included in the test fixture.
Each cite consists of a two-element array containing an
item ID and a Javascript object with supplementary data.
A single citation is composed of a list of cites, and
the full entry consists of a list of such citations:

.. code-block:: text

   >>===== CITATIONS =====>>
   [
     [
       ["ITEM-1",{"note_distance":4}]
     ],
     [
       ["ITEM-2",{"label": "page", "locator": "23"}]
       ["ITEM-3",{}]
     ]
   ]
   <<===== CITATIONS =====<<



###############################
Preparing and running the tests
###############################

The following commands are used to process and run
the tests.  For further information, see the source
code of the relevant scripts, or drop me a line.

**Test preparation**

.. admonition:: Important

   Any broken JSON syntax in the ``INPUT`` section,
   or in the optional sections ``ABBREVIATIONS``, 
   ``BIBENTRIES`` or ``CITATIONS`` 
   will raise an error during
   this phase of processing.

..

   ::
   
       ./tools/MAKETESTS.sh

The command above performs two tasks: (a) it writes Javascript
wrappers for each fixture to an appropriate file in the ``./tests/``
directory; and (b) it invokes the ``./std/grind.py`` command to
processs the human-readable test fixtures under ``./std/humans/``
into the machine-friendly JSON format, storing the resulting files
under ``./std/machines/``.  After this command is run successfully,
the tests are ready to go.

**Running the tests**

.. admonition:: Hint

   Under Windows, the ``./runtests.bat`` command has the same effect.

..

   ::

      ./runtests.sh

The command above will run the full set of tests using the
Java-based Rhino interpreter.  To run the tests using the
Spidermonkey interpreter, use the following command:

   ::

      ./tests.py


