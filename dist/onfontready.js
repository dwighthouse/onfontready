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

        iframe.onload = function () {
            tryFinish(iframe.contentWindow.onresize = tryFinish);
        };

        shutdown = function () {
            outerShutdown((iframe.contentWindow || 0).onresize = iframe.onload = 0);
        };

        iframe.style.width = '999%';

        parent.appendChild(iframe);
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

    tryFinish(document.body.appendChild(root).innerHTML = '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',serif">' + (options.sampleText || ' ') + '</div>' + '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',monospace">' + (options.sampleText || ' ') + '</div>');


    if (root) {
        startupIframe(shutdown, root.firstChild);
    }
    if (root) {
        startupIframe(shutdown, root.lastChild);
    }
};