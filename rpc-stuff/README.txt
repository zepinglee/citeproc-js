JSON RPC server demo

This is a simple wrapper that runs citeproc-js as an RPC web service.
It is provided only as an example, to give integrators a starting point
to work from.

The demo requires the following facilities in order to run:

  python 2.5
      If you find that other versions work, let me know.
  cjson, simplejson, or Python 2.6 json
      Trials were done with version 1.0.5, other versions should work.
  python-spidermonkey
      A bridge to run Javascript code in Python, using the
      spidermonkey JS interpreter from the Mozilla project.
  libjs.so
      This is a dependency of the python-spidermonkey bridge.
      It provides Javascript, which is kind of central to
      the ultimate objective.
  wget
      Required only because I'm too lazy to build a proper
      client.  I sincerely hope that someone somewhere will
      replace this with something more elegant.  Meanwhile,
      hey, it's a demo.

Once you have the above items installed on a Linux system, you should 
be able to run the server in a terminal window:

  ./server.py

To configure and control the processor, send commands as JSON objects
via HTTP POST requests.  Requests have two elements, "method" (a
string) and "params" (a list).  This API could be tidied up, and
it is by no means any sort of standard.  The ./wgetdemo.sh script
sends a series of hard-wired requests to the running server, and
reports the results to the terminal.

Transactions with the server are all done in JSON, which means that
the XML of the CSL file needs to be encoded before it is sent.  The
human-readable form of the CSL applied to the sample bib items
is in set_style.csl.  If you modify the CSL code, be sure to regenerate
the companion JSON file by running ./gen_set_style.py -- otherwise
your changes will be ignored.

Here is a short description of the sample transactions:

  style.json
    Prepares a processor loaded with a simple CSL style.
    
  insert_items.json
    Inserts a couple of items into the processor registry.
  
  bibliography.json (first invocation)
    Returns a rendered bibliography containing the first two
    entries loaded, sorted by author name and year.
    The returned citations contain some literal (unprocessed)
    inline markup.
  
  citation.json
    Returns a rendered citation cluster for two additional
    entries.  These items are automatically inserted into
    the processor registry, and will appear in the bibliography.
    Note that, as declared in the sample CSL style, the cites
    within the citation are sorted by year.  The citation
    contains some literal (unprocessed) inline markup.
  
  bibliography.json (second invocation)
    The second invocation of this command returns a bibliography
    of four items, correctly sorted.  This second rendering
    of the bibliography still contains unprocessed inline
    markup.
    
  inline.json
    This loads a configuration for inline markup tags.
    
  bibliography.json (third invocation)
    Returns a bibliography of the same four items as the
    second invocation, but with processed inline markup.

To run the tests with a different style file, copy the style
to ./rpc-stuff/src-csl/style.csl, and run the script
./rpc-stuff/tools/config_style.py.  This generates a JSON-encoded
version of the style, that will be loaded to the processor
when the client makes its configuration request through the
server API.  Citations and bib entries should be returned
as specified in the style.

If you have questions concerning the remainder of the API (the names
API is currently specific to citeproc-js, as it has not yet been
agreed and finalized in the CSL group), let me know.  Happy to
provide details.


Enjoy!

FB
2009-05-22
