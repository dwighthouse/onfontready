window.onfontready = function (fontName, onReady, options, root, tryFinish) {
    options = options || 0;

    if (options.timeoutAfter) {
        setTimeout(function () {
            if (root) {
                document.body.removeChild(root);
                root = 0;
                if (options.onTimeout) {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    tryFinish = function () {
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth) {
            document.body.removeChild(root);
            root = 0;
            onReady();
        }
    };

    tryFinish(document.body.appendChild(root = document.createElement('div')).innerHTML = '<table style=position:absolute;right:999%;bottom:999%;width:auto>' + '<tr>' + '<td style=position:relative>' + '<tr>' + '<td style="font:999px monospace;white-space:pre">' + '.<span style="font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',serif">' + (options.sampleText || ' ') + '</span>.' + '</table>' + '<table style=position:absolute;right:999%;bottom:999%;width:auto>' + '<tr>' + '<td style=position:relative>' + '<tr>' + '<td style="font:999px monospace;white-space:pre">' + '.<span style="font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',monospace">' + (options.sampleText || ' ') + '</span>.' + '</table>');


    if (root) {
        root.firstChild.firstChild.firstChild.firstChild.appendChild(fontName = document.createElement('iframe')).style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

        if (fontName.attachEvent) {
            fontName.contentWindow.attachEvent('onresize', tryFinish);
        } else {
            fontName.contentWindow.onresize = tryFinish;
        }

        root.lastChild.firstChild.firstChild.firstChild.appendChild(fontName = document.createElement('iframe')).style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

        if (fontName.attachEvent) {
            fontName.contentWindow.attachEvent('onresize', tryFinish);
        } else {
            fontName.contentWindow.onresize = tryFinish;
        }


        fontName = 0;

        setTimeout(tryFinish);
    }
};