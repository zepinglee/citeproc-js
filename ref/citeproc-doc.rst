=======================
Citation Style Language
=======================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Manual for the ``citeproc-js`` Processor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. |link| image:: link.png

.. class:: info-version

   version X.XX

.. class:: info-date

   October, 2009

.. class:: contributors

   Author
       * Frank G. Bennett, Jr.

   Contributors
       * Bruce D'Arcus
       * Rintze Zelle

========

.. contents:: Table of Contents

========


------------
Introduction
------------

This is the site administrator's manual for ``citeproc-js``, a
Javascript implementation of the Citation Style Language (CSL) used by
Zotero, Mendeley and other popular reference managers.  The processor
complies with version 1.0 of the CSL specification, has been written
and tested as an independent module, and can be run by any
ECMAscript-compliant interpreter.  With an appropriate supporting
environment, [#]_ it can be deployed in a browser plugin, as part of a
desktop application, or as a formatting backend for a website or web
service.

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

--------
Commands
--------

The command set will be a grave disappointment to those well versed in
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

   See the section |link| `Local Environment → System Functions`__ below for guidance
   on the definition of the functions contained in the ``sys``
   object.

__  _`System Functions`

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
command takes no arguments, and dumps a formatted bibliography
containing all items currently registered in the processor:

.. code-block:: js

   var mybibliography = citeproc.makeBibliography();

The value returned is a two-element list, composed of a Javascript
array containing certain formatting parameters, and a rendered
string representing the bibliography itself.  The first element—the 
array of formatting parameters—contains the key/value pairs shown
below (the values shown are the processor defaults):

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
   
   See the |link| `Data Input → Citations`__ section below concerning
   the elements recognized as supplementary data, and their
   usage.

__ `Citation fields`_

.. code-block:: js

   var my_ids = [
       ["ID-1", {}],
       ["ID-2", {}]
   ]

   var mycite = makeCitationCluster( my_ids );


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

.. admonition:: Important

   A simplified format for delivering particles and name suffixes
   to the processor is described below in the section 
   |link| `Dirty Tricks → Input data rescue → Names`__.

__ `dirty-names`_

.. code-block:: js

   { "author" : [
       { "family" : "Humboldt",
         "given" : "Alexander",
         "dropping-particle" : "von"
       },
       { "family" : "Gough",
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

!!!!!!!!!!!!!!!!!!!
"Non-Western" names
!!!!!!!!!!!!!!!!!!!

Names written in non-Western scripts are always displayed
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

Sometimes it might be desired to handle a name written in roman or 
Cyrillic script as a non-Western name.  This behavior can be
prompted by including a ``static-ordering`` element in the name array.
The actual value of the element is irrelevant, so long as it
returns true when tested by the Javascript interpreter.

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

   { "literal" : "My Aunt Sally 23"
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

.. [#] For a list of valid CSL locator label strings, see the
       CSL specification, available via  http://citationstyles.org/.

------------
Dirty Tricks
------------

This section presents features of the ``citeproc-js`` processor that
are not properly speaking a part of the CSL specification.  Some of
the functionality described here may or may not be found in other CSL
1.0 compliant processors when they arrive on the scene.

#################
Processor control
#################

In the ordinary operation of the ``makeCitationCluster()`` command,
the processor generates citation strings suitable for a given position
in the document.


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
       { "family" : "von Humboldt",
          "given" : "Alexander"
       },
       { "family" : "Gough",
         "given" : "Vincent van"
       }
     ]
   }

The extraction of particles is done by scanning for leading terms that
consist entirely of lowercase letters.  For some names, leading lowercase
terms should be treated as part of the name itself, and not as floating particles.
Such names should (always) be passed to the processor wrapped in quotation marks:

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


.. _`Multi-lingual content`:

###################################
Multi-lingual content [forthcoming]
###################################

Hello.

^^^^^^^^^^^^^^^^^^^
Names [forthcoming]
^^^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^^^^^^^
Title [forthcoming]
^^^^^^^^^^^^^^^^^^^

Hello.

------------------------
Test Suite [forthcoming]
------------------------

############################
Fixture layout [forthcoming]
############################

Hello.

###########################
Preprocessors [forthcoming]
###########################

Hello.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
``./std/grind.py`` [forthcoming]
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
``./tools/MAKETESTS.sh`` [forthcoming]
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Hello.

##########################
Test runners [forthcoming]
##########################

Hello.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
``./runtests.sh`` [forthcoming]
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^^^^^^^^^^^^^^^
``./test.py`` [forthcoming]
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Hello.

-----------------------------------
Running the Processor [forthcoming]
-----------------------------------

Hello.

######################################################
Under Python via ``python-spidermonkey`` [forthcoming]
######################################################

Hello.

######################################
Under Java via ``rhino`` [forthcoming]
######################################

Hello.

