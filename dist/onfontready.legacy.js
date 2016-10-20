window.onfontready = function (fontName, onReady, options) {

    options = options || 0;

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

        shutdown = function () {

            // Using attachEvent as the test compresses better
            // IE6, IE7, and IE8 require detachEvent, not event assignment
            outerShutdown(iframe.attachEvent ? iframe.contentWindow.detachEvent('onresize', tryFinish) : iframe.contentWindow.onresize = 0);
        };

        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

        parent.firstChild.firstChild.firstChild.appendChild(iframe);

        if (iframe.attachEvent) {
            iframe.contentWindow.attachEvent('onresize', tryFinish);
        } else {
            iframe.contentWindow.onresize = tryFinish;
        }
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

    tryFinish(document.body.appendChild(root).innerHTML = '<table style=position:absolute;right:999%;bottom:999%;width:auto>' + '<tr>' + '<td style=position:relative>' + '<tr>' + '<td style="font:999px serif;white-space:pre">' + '.<span style="font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',serif">' + (options.sampleText || ' ') + '</span>.' + '</table>' + '<table style=position:absolute;right:999%;bottom:999%;width:auto>' + '<tr>' + '<td style=position:relative>' + '<tr>' + '<td style="font:999px serif;white-space:pre">' + '.<span style="font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',monospace">' + (options.sampleText || ' ') + '</span>.' + '</table>');


    if (root) {
        startupIframe(shutdown, root.firstChild);
    }
    if (root) {
        startupIframe(shutdown, root.lastChild);
    }
    if (root) {
        setTimeout(tryFinish);
    }
};