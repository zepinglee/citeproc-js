/*
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights
 * Reserved.
 *
 * The contents of this file are subject to the Common Public
 * Attribution License Version 1.0 (the “License”); you may not use
 * this file except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://bitbucket.org/fbennett/citeproc-js/src/tip/LICENSE.
 *
 * The License is based on the Mozilla Public License Version 1.1 but
 * Sections 1.13, 14 and 15 have been added to cover use of software over a
 * computer network and provide for limited attribution for the
 * Original Developer. In addition, Exhibit A has been modified to be
 * consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS”
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is the citation formatting software known as
 * "citeproc-js" (an implementation of the Citation Style Language
 * [CSL]), including the original test fixtures and software located
 * under the ./tests subdirectory of the distribution archive.
 *
 * The Original Developer is not the Initial Developer and is
 * __________. If left blank, the Original Developer is the Initial
 * Developer.
 *
 * The Initial Developer of the Original Code is Frank G. Bennett,
 * Jr. All portions of the code written by Frank G. Bennett, Jr. are
 * Copyright (c) 2009-2013 Frank G. Bennett, Jr. All Rights Reserved.
 *
 * Alternatively, the contents of this file may be used under the
 * terms of the GNU Affero General Public License (the [AGPLv3]
 * License), in which case the provisions of [AGPLv3] License are
 * applicable instead of those above. If you wish to allow use of your
 * version of this file only under the terms of the [AGPLv3] License
 * and not to allow others to use your version of this file under the
 * CPAL, indicate your decision by deleting the provisions above and
 * replace them with the notice and other provisions required by the
 * [AGPLv3] License. If you do not delete the provisions above, a
 * recipient may use your version of this file under either the CPAL
 * or the [AGPLv3] License.”
 */

var port = 16005;

var http = require('http');
var url = require('url');
var fs = require('fs');

// This is the list of files this server will serve - no others.
var filesToServe = [
    '/demo/demo.html',
    '/demo/local.css',
    '/xmldom.js',
    '/citeproc.js',
    '/demo/demo.js',
    '/demo/citations.json',
    '/demo/locales-en-US.xml',
    '/demo/chicago-fullnote-bibliography.csl',
    '/demo/README.md'
];

http.createServer(function (request, response) {
    var uriObj = url.parse(request.url);
    var uri_href = uriObj.href;
    console.log("Request for " + uri_href);

    // Root resources will redirect
    if (uri_href == '/') {
        response.writeHead(302, {'Location': '/demo/demo.html'});
        response.end();
    }

    else if (filesToServe.indexOf(uri_href) > -1) {
        // Translate URL path into filename.  This assumes the file is either
        // in the local directory (/demo) or in the parent.
        var filename = (uri_href.substr(0, 6) == '/demo/')
            ? uri_href.substr(6)
            : '../' + uri_href.substr(1);

        returnFile(response, filename);
    }

    else {
        resp_error(response, 400, "Sorry, I don't know about that file");
    }
}).listen(port);

function returnFile(response, filename) {
    fs.readFile(filename, function(err, data) {
        if (err) {
            resp_error(response, 500, "Error trying to retrieve that file: " + err);
        }
        else {
            response.writeHead(200, {'Content-Type': media_type(filename)});
            response.end(data);
        }
    });
};

function resp_error(response, status, msg) {
    console.log("  " + msg);
    response.writeHead(status, {'Content-Type': 'text/plain'});
    response.end(msg);
}

function media_type(filename) {
    if (filename.slice(-3) === '.js') {
        return 'text/javascript';
    }
    else if (filename.slice(-5) === '.json') {
        return 'application/json';
    }
    else if (filename.slice(-5) === '.html') {
        return 'text/html';
    }
    else if (filename.slice(-4) === '.css') {
        return 'text/css';
    }
    else if (filename.slice(-4) === '.xml') {
        return 'text/xml';
    }
    else {
        return "text/plain";
    }
}

console.log("Point your browser at http://localhost:" + port + "/");