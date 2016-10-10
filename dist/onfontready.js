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

        shutdown = function () {
            outerShutdown(iframe.contentWindow.onresize = 0);
        };

        iframe.style.width = '999%';

        parent.appendChild(iframe).contentWindow.onresize = tryFinish;
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