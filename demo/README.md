# `citeproc-js` Demo Page

The code in this folder can be used to spin up a local `citeproc-js`
demo page.  It is mainly intended as a code sample of running for
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

`one`
: this is a pen
