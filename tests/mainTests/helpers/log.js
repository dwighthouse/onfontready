window.log = (function() {
    var consoleElement = document.getElementById('console');

    return function(text) {
        consoleElement.innerHTML = consoleElement.innerHTML + '<br>' + text;
    };
}());