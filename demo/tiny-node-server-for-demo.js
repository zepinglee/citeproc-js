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

var http = require('http');
var url = require('url');
var fs = require('fs');
var filesToServe = [
    'demo.html',
    'local.css',
    'simple-grid.css',
    'citeproc_generic.js',
    'sys.js',
    'builder.js',
    'runner.js',
    'database.json',
    'locales-en-US.xml',
    'chicago-fullnote-bibliography.csl'
]
http.createServer(function (request, response) {
    var uriObj = url.parse(request.url);
    request.on('end', function(){
        var stubName = uriObj.href.replace(/^.*\/(.*)$/,'$1');
        if (filesToServe.indexOf(stubName) > -1) {
            var mimeType;
            if (stubName.slice(-3) === '.js') {
                mimeType = 'text/javascript';
            } else if (stubName.slice(-5) === '.json') {
                mimeType = 'application/json';
            } else if (stubName.slice(-5) === '.html') {
                mimeType = 'text/html';
            } else if (stubName.slice(-4) === '.css') {
                mimeType = 'text/css';
            } else {
                mimeType = 'text/xml';
            }
            returnFile(response,mimeType,stubName);
        } else {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end("Sorry, I don't know about that file");
        }
    });
    function returnFile (response,mimeType,fileName) {
        var file = fs.readFile(fileName,function(err,data){
            response.writeHead(200, {'Content-Type': mimeType});
            response.end(data);
        });
    };
}).listen(8080);
console.log("Listening on http://127.0.0.1:8080/demo.html");