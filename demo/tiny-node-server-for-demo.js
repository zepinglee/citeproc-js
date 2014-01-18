var http = require('http');
var url = require('url');
var fs = require('fs');
var filesToServe = [
    'demo.html',
    'local.css',
    'simple-grid.css',
    'citeproc-dom.js',
    'sys.js',
    'builder.js',
    'runner.js',
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