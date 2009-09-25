=======================
Citation Style Language
=======================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Manual for the ``citeproc-js`` Processor
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. class:: info-version

   version X.XX

.. class:: info-date

   October, 2009

.. class:: contributors

   Author
       * Frank G. Bennett Jr.

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


.. [#] For further details on required infrastructure, see the sections 
       `Locally Defined System Functions`_ and `Data Input`_ below.

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

.. admonition:: Hint

   See the section `Locally Defined System Functions`_ below for guidance
   on the definition of the functions contained in the ``sys``
   object.

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
   
   See the `Bundle formats`_ section below for more information
   on the structure of input to the ``makeCitationCluster()`` command.

.. code-block:: js

   var my_ids = [
       ["ID-1", {}],
       ["ID-2", {}]
   ]

   var mycite = makeCitationCluster( my_ids );


--------------------------------
Locally Defined System Functions
--------------------------------

As mentioned above in the section on `CSL.Engine()`_, three functions
must be defined separately and supplied to the processor upon
instantiation.  These functions are used by the processor to obtain
locale and item data from the surrounding environment.  The exact
definition of these functions may vary from one system to another.
The definitions given below assume the existence of a global ``DATA``
object in the context of the processor instance, and are are provided
only for the purpose of illustration.

####################
``retrieveLocale()``
####################

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



##################
``retrieveItem()``
##################

The ``retrieveItem()`` function is used by the processor to
fetch individual items from storage.

.. code-block:: js

   sys.retrieveItem = function(id){
	   return DATA._items[id];
   };

----------
Data Input
----------

##############
Bundle formats
##############

Hello.

^^^^^^^^^^^^^^^^^^
Bibliography items
^^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^
Citations
^^^^^^^^^

Hello.


#############
Field formats
#############

Hello.

^^^^^^^^^^^^^^
Text variables
^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^^^^^
Numeric variables
^^^^^^^^^^^^^^^^^

Hello.

^^^^^
Names
^^^^^

Hello.

^^^^^
Dates
^^^^^

Hello.

^^^^^^^
Locator
^^^^^^^

Hello.


------------
Dirty tricks
------------

Hello.

#################
Processor control
#################

Hello.

^^^^^^^^^^^^^^^^^^^
``suppress-author``
^^^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^^^
``author-only``
^^^^^^^^^^^^^^^

Hello.

#################
Input data rescue
#################

Hello.

^^^^^
Names
^^^^^

Hello.

^^^^^
Dates
^^^^^

Hello.

#####################
Multi-lingual content
#####################

Hello.

^^^^^
Names
^^^^^

Hello.

^^^^^
Title
^^^^^

Hello.

----------
Test Suite
----------

##############
Fixture layout
##############

Hello.

#############
Preprocessors
#############

Hello.

^^^^^^^^^^^^^^^^^^
``./std/grind.py``
^^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^^^^^^^^^^^^
``./tools/MAKETESTS.sh``
^^^^^^^^^^^^^^^^^^^^^^^^

Hello.

############
Test runners
############

Hello.

^^^^^^^^^^^^^^^^^
``./runtests.sh``
^^^^^^^^^^^^^^^^^

Hello.

^^^^^^^^^^^^^
``./test.py``
^^^^^^^^^^^^^

Hello.

---------------------
Running the Processor
---------------------

Hello.

########################################
Under python via ``python-spidermonkey``
########################################

Hello.

########################
Under Java via ``rhino``
########################

Hello.

