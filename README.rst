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

Development of the `citeproc-js` processor began in 2009, a fact that
shows through in ways both good and bad. On the down side, the code
base is not pretty, and could in fact serve as a solid illustration of
the burden technical debt if you need one of those for your computer
science class. On the up side, though, `citeproc-js` passes a suite of
`1,400 integration tests <https://github.com/juris-m/citeproc-js>`_
with flying colors, it has been very heavily field-tested, [2]_ and
when run in CSL-M mode, [1]_ it can handle multilingual and legal
content with a flexibility and precision unrivaled by any other tool
at any price.

More important than the badges of popularity, though, is the
underlying CSL standard. Developers can take comfort in the technical
strength of the `CSL Specification
<http://docs.citationstyles.org/en/1.0.1/specification.html>`_, and
the existence of `other processors
<https://citationstyles.org/developers/#csl-processors>`_ under active
development.  CSL is the modern way to handle bibliographic projects,
and `citeproc-js` is one way to take advantage of it.

-----------
Quick Setup
-----------

The quickest way to get started is to 

Documentation is available on `ReadTheDocs
<https://citeproc-js.readthedocs.org/en/latest/index.html>`_.


hello

---------------------------

.. [1] CSL-M is set of private extensions to official CSL used by the
       `Jurism <https://juris-m.github.io>`_ reference manager, a
       variant of Zotero.

.. [2] In addition to numerous Web deployments, `citeproc-js` is the
       citation formatter behind document integration in both Zotero
       and Mendeley.

| 2016.03.08
| FB
