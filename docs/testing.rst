========================
Exploring the test suite
========================

.. include:: substitutions.txt

|CCBYSA|_

------------------------

------------
Introduction
------------

The CSL test suite is an essential backdrop to |citeproc-js|
development. This chapter explains the options to the ``test.py``
script, the use of alternative JavaScript engines, the use of the
optional |jing| schema validator in the test framework, and the syntax
of the CSL test fixtures.

The matters covered in this chapter are not essential to deployment,
but familiarity with the test framework is helpful when isolating
formatting issues and other processor bugs encountered in production.

-------------------
System requirements
-------------------

For faster processing, install a standalone JS engine
compiled for your platform.  Supported engines are:

   * `Mozilla Spidermonkey`__
   * `WebKit JavaScriptCore`__
   * `Google V8`__

   Packaged binaries of these engines (with names such as ``js24``,
   ``jsc``, or ``d8``) may be available for your platform.

__ https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Build_Documentation

__ https://github.com/Lichtso/JSC-Standalone

__ https://github.com/v8/v8/wiki/Building%20with%20Gyp



+++++
Rhino
+++++

To run the test suite with the default Rhino interpreter, enter the
project directory and invoke the test script as follows::

    cd citeproc-js
    ./test.py -r

++++++++++++++++++++++++++++++
Alternative JavaScript Engines
++++++++++++++++++++++++++++++

Tests run much faster with an alternative JavaScript engine. Here are
some comparison timings on a 64-bit Ubuntu laptop:

.. table:: Completion times for citeproc-js tests

   +---------------+----------------+
   |**Engine**     |**(seconds)**   |
   +---------------+----------------+
   |Rhino          |              66|
   +---------------+----------------+
   |Spidermonkey 24|              31|
   |               |                |
   +---------------+----------------+
   |V8             |              22|
   +---------------+----------------+
   |JavaScriptCore |              20|
   +---------------+----------------+

To run tests with an alternative engine, begin by installing one of
those listed under :ref:`Basic Requirements: JavaScript
<javascript-engines>` above, and confirm that it can be invoked from
the command line. Then edit the configuration file at
``./tests/config/test.cnf`` as required.

.. literalinclude:: ../tests/config/test.cnf

For example, if you compile a version of Mozilla Spidermonkey in your
path that can be invoked with the command ``js38``, you would replace
the ``command:`` entry under ``[mozjs]`` with ``js38``.

Note that the entry for the Google V8 engine (``d8``) is called via
a shell script. 
