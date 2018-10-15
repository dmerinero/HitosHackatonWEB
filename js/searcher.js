var dirty = false;

function search() {
    var text = document.getElementById("searchBar").value.trim();

    if (text.length > 0) {
        var listContainers = document.getElementsByClassName("content");

        for (var i = 0; i < listContainers.length; i++) {
            cleanAndSearch(text, listContainers[i]);
        }
    }
}

function clean(DOMElement) {
    eraseHighlighted(DOMElement.innerHTML).then(content => {
        DOMElement.innerHTML = content;
    });
}

function cleanPageUnderline() {
    if(dirty){
        var listContainers = document.getElementsByClassName("content");
    
        for (var i = 0; i < listContainers.length; i++) {
            clean(listContainers[i])
        }

        dirty = false;
    }
}

function cleanAndSearch(text, DOMElement) {
    eraseHighlighted(DOMElement.innerHTML).then(content => {
        highlight(text, content).then(content => {
            DOMElement.innerHTML = content;
            dirty = true;
        });
    });
}

function eraseHighlighted(innerHTML) {
    return new Promise(function (resolve, reject) {
        findAndReplace('<span class="highlight">', "", innerHTML).then(content => {
            findAndReplace("</span>", "", content).then(content => {
                resolve(content);
            });
        });
    });
}

function findAndReplace(find, replace, where) {
    return new Promise(function (resolve, reject) {
        var index = where.toLowerCase().indexOf(find.toLowerCase());

        if (index >= 0) {
            var substring = where;
            where = "";

            do {
                where = where + substring.substring(0, index) + replace;
                substring = substring.substring(index + find.length);

                index = substring.toLowerCase().indexOf(find.toLowerCase());
            } while (index >= 0);

            resolve(where + substring);
        } else {
            resolve(where);
        }
    });
}

function highlight(text, innerHTML) {
    return new Promise(function (resolve, reject) {
        var index = innerHTML.toLowerCase().indexOf(text.toLowerCase());

        if (index >= 0) {
            var substring = innerHTML;
            innerHTML = "";

            do {
                innerHTML = innerHTML + substring.substring(0, index) + "<span class='highlight'>"
                    + substring.substring(index, index + text.length) + "</span>";
                substring = substring.substring(index + text.length);

                index = substring.toLowerCase().indexOf(text.toLowerCase());
            } while (index >= 0);

            resolve(innerHTML + substring);
        } else {
            resolve(innerHTML);
        }
    });
}