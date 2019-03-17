=============
`citeproc-js`
=============
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
A JavaScript implementation of the Citation Style Language
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:Authors: Frank Bennett


.. image:: https://travis-ci.org/Juris-M/citeproc-js.svg?branch=master
   :target: https://travis-ci.org/Juris-M/citeproc-js

-----
About
-----

The `Citation Style Language <https://citationstyles.org/>`_ (CSL) is
an XML grammar for expressing the detailed requirements of a citation
style. A `CSL processor
<https://citationstyles.org/developers/#csl-processors>`_ is a tool
that generates citations and bibliographies by applying style rules
described in CSL to bibliographic data.

The ``citeproc-js`` CSL processor is over a decade in service, a fact
that shows through in ways both good and bad. On the downside, the
code base is not pretty, and can serve as a solid
illustration of the burden of technical debt (in case you need one of
those for your computer science class). On the upside, though,
``citeproc-js`` passes a suite of 1,400 integration tests with flying
colors. When run in CSL-M mode [1]_ it can handle multilingual and
legal content with a flexibility and precision unrivaled by any other
tool at any price. And it has been quite heavily field-tested, as the
citation formatter driving word processor integration in both
`Mendeley <https://www.mendeley.com/>`_ and `Zotero
<https://www.zotero.org/>`_.

More important than badges of popularity, though, is the CSL
standard. Developers can take comfort in the technical strength of the
`CSL Specification
<http://docs.citationstyles.org/en/1.0.1/specification.html>`_, and
the existence of `other processors
<https://citationstyles.org/developers/#csl-processors>`_ under active
development.  CSL is the modern way to handle bibliographic projects,
and ``citeproc-js`` is a convenient way to take advantage of it.

-----------
Quick Setup
-----------

The quickest way to install the processor is for use with Node.js, via `npm`::

    npm install citeproc

If you are working with the processor for the first time, running the
test suite is a good way to build confidence and begin exploring the
`documentation <https://citeproc-js.readthedocs.org/en/latest/index.html>`_.
Start by cloning the repo and its submodules::

    git clone --recursive https://github.com/Juris-M/citeproc-js.git

Then set up the test framework::

    cd citeproc-js
    npm install

You can now run the test script::
      
    node ./tests/runtests.js
  
This will return a help text about the test runner::

    Error: Exactly one of -s, -g, or -a must be invoked. No option found.
    
    Usage: runtests.js [-s testName|-g groupName|-a] <-c> <-v|-q>
      -s testName, --single=testName
        Run a single local or standard test fixture
      -g groupName, --group=groupName
        Run a group of tests with the specified prefix
      -a, --all
        Run all tests

    
---------------------------

.. [1] CSL-M is set of private extensions to official CSL used by the
       `Jurism <https://juris-m.github.io>`_ reference manager, a
       variant of Zotero.

| 2019.03.17
| FB
