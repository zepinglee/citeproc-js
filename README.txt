citeproc-js: Yet Another CSL Processor

Frank Bennett
Graduate School of Law, Nagoya University
2009.08.20
=========================================

This is an effort to implement a fast and robust CSL processor in
Javascript, for use by the Zotero project.


----------------
The architecture
----------------

The following link has (dated but to be maintained) JsDoc documentation 
that will eventually provide some guidance re how things fit together:

  http://gsl-nagoya-u.net/http/pub/citeproc-js-doc/index.html

In rough outline, there is a two-stage compiler (Build and Configure)
that can be used to construct an object with a few methods useful for
loading CSL styles and rendering citations and bibliographies.

The object has several sub-objects, the most important of which are
"registry", "citation", "bibliography", "citation_sort" and
"bibliography_sort".  The top-level methods on the main object apply
execution wrappers to token lists contained in "citation" and
"bibliography", to produce string or list-of-string output.  The
"registry" object provides a persistent store for managing
bibliography sort order and disambiguation.  The output queue in this
scenario is built as a nested hierarchy which is then collapsed into a
formatted string for output.


--------------------
Testing, testing ...
--------------------

As you can see from the sources, tests are kind of important here.
Javascript is notoriously unfriendly when it comes to debugging, the
processor is charged with an extremely complex formatting task, and
the target community (us) is unforgiving.  Things have to work
correctly, and the only way to assure that they do is to test the code
thoroughly.

Test suites are useful to us in all sorts of ways.  Standard tests
(housed under ./std) help to assure that the various CSL
implementations produce identical results.  The internal tests
specific to citeproc-js provide insurance against unexpected
side-effects in the event of wholesale refactoring (of which there has
been more than I would like to remember).  Tests are not just about
QA; they help to keep complexity from running out of control, by
forcing the programmer (me) to confront it regularly when changes are
made to the codebase.  The suites are an integral part of the
development process; if you modify or add code to the processor (and
contributions are welcome!), be sure to complement your changes with
tests.  It's the right thing to do.


--------------
Archive layout
--------------

The sources of the program are under ./src.  The ./locale and ./style
directories contain standard files from the CSL distribution, for 
use in testing.  The tests are located under ./tests (for those
specific to citeproc-js) and ./std (for the standard CSL test
fixtures).

The basic testing framework we use is DOH, from the Dojo project.
If your machine has Java installed, the ./dojo and ./rhino directories
provide the remaining infrastructure needed to run the tests via the
./runtests.sh or ./runtests.bat scripts.

The ./data directory contains input files for running tests.  Over
time, this material will be moved into the standard test suite
area, and this directory will eventually go away.  The ./ref directory
contains a grab-bag of documents and files stashed or shoved aside
during development.


-------------
Running tests
-------------

Standard tests are shipped in two subdirectories, ./std/humans and
./std/machines.  New tests and editorial changes should be made in the
./std/humans directory, populating the changes to the ./std/machines
directory using the ./std/grind.py Python script (grind.py can also be
used for validation -- run it with the --help option for more info).
The actual test runners use the machine-readable form of the tests.

The primary script that runs all the tests is ./runtests.sh, in the 
top-level directory.  Rintze Zelle has very kindly provided a 
./runtests.bat file as well, and the tests reportedly run (and we 
hope also break) equally well on Windows boxes.

If you have a Java interpreter installed and are on Linux (or possibly
a Mac), you can run the tests in a checkout from a terminal by
entering the top directory and just typing the runtests script
appropriate for your system.

On Windows, the ./runtests.bat file can be run from the command prompt, 
the only caveat being that the command prompt should be set to the drive 
harboring the SVN working copy, e.g. "D:\>D:\xbiblio\citeproc-js\
trunk\runtests.bat" works whereas "C:\>D:\xbiblio\citeproc-js\
trunk\runtests.bat" gives an error when executed.


-------------------
Running the program
-------------------

While development is mainly aimed at supporting Zotero, the processor
contains no Zotero dependencies, and should work as a standalone
formatting engine.  A sample is contained in the ./rpc-stuff directory.


----------
Other info
----------

Information on writing tests using the DOH framework can be found here:

  http://www.ibm.com/developerworks/web/library/wa-aj-doh/index.html

The DOH testing framework is part of the Dojo project.  The dojo
framework files under ./dojo are from a release instance of the
product compiled from the original source.  (Compiling from scratch
was necessary in order to run DOH from the command line as we do
here.) If you want to use DOH for your own projects, the sources for
Dojo are available here:

  http://download.dojotoolkit.org/

I had a small problem with timeouts on my (slow) machine, which
required commenting out one line of the DOH code.  That change is
incorporated in the configured instance of DOH included in these
sources.

The ./test.py script attempts to run the standard tests using a
standalone Spidermonkey interpreter similar to that used in Firefox.
The kit used for this purpose is the python-spidermonkey bridge done
by Paul Davis, which is available, with install instructions, here:

  http://github.com/davisp/python-spidermonkey/tree/master

The script is currently broken, but when repaired, it may be extended
to serve as the primary test runner for both Rhino and Spidermonkey.
More news later as the situation develops ...

Enjoy!
