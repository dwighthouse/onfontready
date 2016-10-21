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

    tryFinish(document.body.appendChild(root = document.createElement('div')).innerHTML = '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',serif">' + (options.sampleText || ' ') + '</div>' + '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',monospace">' + (options.sampleText || ' ') + '</div>');


    if (root) {
        root.firstChild.appendChild(fontName = document.createElement('iframe')).style.width = '999%';
        fontName.contentWindow.onresize = tryFinish;
        root.lastChild.appendChild(fontName = document.createElement('iframe')).style.width = '999%';
        fontName.contentWindow.onresize = tryFinish;


        fontName = 0;

        setTimeout(tryFinish);
    }
};