window.onfontready = function (fontName, onReady, options) {

    options = options || fontName;

    if (options.timeoutAfter) {
        setTimeout(function () {
            if (root) {
                shutdown();
                if (options.onTimeout) {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    var startupIframe = function (outerShutdown, parent, iframe) {
        iframe = document.createElement('iframe');

        iframe.onload = function () {
            tryFinish(iframe.contentWindow.onresize = tryFinish, iframe.contentWindow.attachEvent && iframe.contentWindow.attachEvent('onresize', tryFinish));
        };

        shutdown = function () {
            outerShutdown(iframe.contentWindow && (iframe.contentWindow.onresize = iframe.contentWindow.attachEvent && iframe.contentWindow.detachEvent('onresize', tryFinish)), iframe.onload = iframe.attachEvent && iframe.detachEvent('onload', iframe.onload));
        };

        iframe.style.cssText = 'position:absolute;width:999%';

        parent.firstChild.firstChild.firstChild.appendChild(iframe, iframe.attachEvent && iframe.attachEvent('onload', iframe.onload));
    };


    var shutdown = function () {
        if (root) {
            document.body.removeChild(root);
            root = 0;
        }
    };

    var root = document.createElement('div');

    var tryFinish = function () {
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth) {
            onReady(shutdown());
        }
    };

    tryFinish(document.body.appendChild(root).innerHTML = '<table style=position:absolute;width:auto;right:999%;bottom:999%>' + '<tr>' + '<td style=position:relative>' + '<tr>' + '<td style="font:999px serif;white-space:pre">' + '.<span style="font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',serif">' + (options.sampleText || ' ') + '</span>.' + '</table>' + '<table style=position:absolute;width:auto;right:999%;bottom:999%>' + '<tr>' + '<td style=position:relative>' + '<tr>' + '<td style="font:999px serif;white-space:pre">' + '.<span style="font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',monospace">' + (options.sampleText || ' ') + '</span>.' + '</table>');


    if (root) {
        startupIframe(shutdown, root.firstChild);
    }
    if (root) {
        startupIframe(shutdown, root.lastChild);
    }
};