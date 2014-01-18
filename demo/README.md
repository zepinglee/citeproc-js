# `citeproc-js` Demo Page

The code in this folder can be used to spin up a local `citeproc-js`
demo page.  It is mainly intended as a sample of running code for
developers working with the processor.

The demo requires `node.js`, so install that first. The page is
provided by a tiny webserver that listens on port `8080` of the
machine on which it is run. To start the server, clone this repo to
your local machine, open a terminal, enter this `./demo` subdirectory,
and run the following command:

    node ./tiny-node-server-for-demo.js

Point a browser at the address reported by the server, and the
demo page should appear.

The code is in four files, which are:

`citeproc_generic.js`
: This contains the processor itself, bundled with the xmldom.js parser.

`sys.js`
: This contains a bare JavaScript object with two functions, `retrieveItem()` and `retrieveLocale()`. The former must return a valid CSL JSON object. The latter must return a valid *serialized* CSL locale (the processor will fail on a native XML object or buffer).

`builder.js`
: This defines a function used in the page to build processor instances, and places a dummy database object in memory for use by the `retrieveItem()` function contained in `sys.js`. Note that the CSL style code fed to the processor must, like the locale, be *serialized* XML.

`runner.js`
: This contains the JavaScript that runs the installed processor on the page.

This particular demo runs `citeproc-js` in the browser client, but the processor
can (of course) be run on the server side as well. It depends on your preferred
tradeoff between snappiness and server burden.

Hope this helps. If you run into any snags, feel free to give me a shout.

Frank Bennett
Nagoya
Japan
