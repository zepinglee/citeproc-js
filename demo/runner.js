function buildAndRun () {
    var simpleBibliographies = document.getElementsByClassName('simple-bibliography');
    for (var i=0,ilen=simpleBibliographies.length;i<ilen;i+=1) {
        var bibNode = simpleBibliographies[i];
        var citeproc = getProcessor(bibNode.id);
        var itemIDs = [];
        for (var key in DATABASE) {
            itemIDs.push(key);
        }
        citeproc.updateItems(itemIDs);
        var bibResult = citeproc.makeBibliography();
        bibNode.innerHTML = bibResult[1].join('\n');
    }
}
