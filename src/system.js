dojo.provide("csl.retrieval");
if (!CSL){
	load("./src/csl.js");
}

/**
 * System localization wrappers.
 * <p>Wrappers for commands that may require adaptation
 * depending upon the environment in which <code>citeproc-js</code>
 * is deployed.
 * @namespace System wrappers
 */
CSL.System = {};
