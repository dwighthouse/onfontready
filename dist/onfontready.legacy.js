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

    // var startupIframe = (outerShutdown, parent, iframe) => {
    //     iframe = document.createElement('iframe');

    //     shutdown = () => {
    //         if (process.env.isTest) {
    //             window.reporter.decrement(fontName, 'resize');
    //         }
    //         iframe.contentWindow.onresize = 0;
    //         if (iframe.contentWindow.attachEvent)
    //         {
    //             iframe.contentWindow.detachEvent('onresize', tryFinish);
    //         }
    //         outerShutdown();
    //     };

    //     iframe.style.cssText = 'position:absolute;width:999%';

    //     parent.firstChild.firstChild.firstChild.appendChild(iframe);

    //     iframe.contentWindow.onresize = tryFinish;

    //     if (iframe.contentWindow.attachEvent) {
    //         if (process.env.isTest) {
    //             window.reporter.increment(fontName, 'resize');
    //         }
    //         iframe.contentWindow.attachEvent('onresize', tryFinish);
    //     }
    // };

    var startupIframe = function (outerShutdown, parent, iframe) {
        iframe = document.createElement('iframe');

        var onLoad = function () {
            if (iframe.contentWindow.attachEvent) {
                iframe.contentWindow.attachEvent('onresize', tryFinish);
            } else {
                iframe.contentWindow.onresize = tryFinish;
            }

            tryFinish();
        };

        if (iframe.attachEvent) {
            iframe.attachEvent('onload', onLoad);
        } else {
            iframe.onload = onLoad;
        }

        shutdown = function () {
            if (iframe.contentWindow) {
                // Using attachEvent as the test compresses better
                // IE6, IE7, and IE8 require detachEvent, not event assignement
                if (iframe.contentWindow.attachEvent) {
                    iframe.contentWindow.detachEvent('onresize', tryFinish);
                } else {
                    iframe.contentWindow.onresize = 0;
                }
            }

            if (iframe.attachEvent) {
                iframe.detachEvent('onload', onLoad);
            } else {
                iframe.onload = 0;
            }

            outerShutdown();
        };

        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

        parent.firstChild.firstChild.firstChild.appendChild(iframe);
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
};