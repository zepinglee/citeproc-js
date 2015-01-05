====================
Module Legal Support
====================

The sources of law and the conventions for citing them vary among
jurisdictions. The current approach in CSL-m styles is to support all
jurisdictions in a single style file. This is not sustainable.  For
maintainability, styles should cover the relevant guide's requirements
for secondary and non-legal sources, and refer to an appropriate legal
support module when legal items are encountered. This will require
several changes:

1. A mechanism for loading additional style code into the running processor;
2. A CSL element for invoking the loading mechanism on demand;
3. A set of fixed coding conventions (a kind of macro API) for legal style modules.

This document lays out a rough specification for these facilities, for
reference in building modular legal support.

