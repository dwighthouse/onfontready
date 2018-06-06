export default (fontName, sampleText, onLoaded, root, iframeRef) => {
    document.body.appendChild(root = document.createElement('div')).innerHTML =
        '<table style=position:absolute;bottom:999%;right:999%;width:auto>' +
            '<tr>' +
                '<td style=position:relative>' +
            '<tr>' +
                '<td style="font:999px monospace;white-space:pre">' +
                    '.<span style="font:999px ' + fontName + ',serif">' + sampleText + '</span>.' +
        '</table>' +
        '<table style=position:absolute;bottom:999%;right:999%;width:auto>' +
            '<tr>' +
                '<td style=position:relative>' +
            '<tr>' +
                '<td style="font:999px monospace;white-space:pre">' +
                    '.<span style="font:999px ' + fontName + ',monospace">' + sampleText + '</span>.' +
        '</table>';

    const tryFinish = () => {
        if (root.firstChild.clientWidth == root.lastChild.clientWidth) {
            document.body.removeChild(root);
            root = 0;
            onLoaded();
        }
    };

    // Font may already be loaded
    tryFinish();

    if (root) {
        root.firstChild.firstChild.firstChild.firstChild.appendChild(
            iframeRef = document.createElement('iframe')
        ).style.cssText = 'position:absolute;bottom:999%;right:999%;width:999%';

        if (iframeRef.attachEvent) {
            iframeRef.contentWindow.attachEvent('onresize', tryFinish);
        }
        else {
            iframeRef.contentWindow.onresize = tryFinish;
        }

        root.lastChild.firstChild.firstChild.firstChild.appendChild(
            iframeRef = document.createElement('iframe')
        ).style.cssText = 'position:absolute;bottom:999%;right:999%;width:999%';

        if (iframeRef.attachEvent) {
            iframeRef.contentWindow.attachEvent('onresize', tryFinish);
        }
        else {
            iframeRef.contentWindow.onresize = tryFinish;
        }

        iframeRef = setTimeout(tryFinish);
    }
};
