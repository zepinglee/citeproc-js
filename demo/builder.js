function getProcessor (styleID) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', styleID + '.csl', false);
    xhr.send(null);
    var styleAsText = xhr.responseText;
    var citeproc = new CSL.Engine(citeprocSys,styleAsText);
    return citeproc;
};

var xhr = new XMLHttpRequest();
xhr.open('GET', 'database.json', false);
xhr.send(null);

DATABASE = JSON.parse(xhr.responseText);;
