citeprocSys = {
    retrieveLocale: function (lang){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'locales-' + lang + '.xml', false);
        xhr.send(null);
        return xhr.responseText;
    },
    retrieveItem: function (id){
        return DATABASE[id];
    }
};
