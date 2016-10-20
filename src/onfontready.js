module.exports = (fontName, onReady, options) => {
    if (process.env.isTest) {
        const tests = {};

        // A helper function that counts the creation and destruction of
        //   elements and event listeners for testing purposes
        window.reporter = window.reporter || (() => {
            function tryCreate(name) {
                tests[name] = tests[name] || {
                    root: 0,
                    resize: 0
                };
                return tests[name];
            }

            return {
                increment: (name, type) => tryCreate(name)[type] += 1,
                decrement: (name, type) => tryCreate(name)[type] -= 1,
                getTests: () => tests,
            };
        })();
    }

    options = options || 0;

    if (options.timeoutAfter) {
        setTimeout(() => {
            if (root) {
                shutdown();
                if (options.onTimeout) {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    if (!process.env.isLegacy) {
        var startupIframe = (outerShutdown, parent, iframe) => {
            iframe = document.createElement('iframe');

            shutdown = () => {
                if (process.env.isTest) {
                    window.reporter.decrement(fontName, 'resize');
                }
                outerShutdown(iframe.contentWindow.onresize = 0);
            };

            iframe.style.width = '999%';

            if (process.env.isTest) {
                window.reporter.increment(fontName, 'resize');
            }
            parent.appendChild(iframe);

            iframe.contentWindow.onresize = tryFinish;
        };
    }

    if (process.env.isLegacy) {
        var startupIframe = (outerShutdown, parent, iframe) => {
            iframe = document.createElement('iframe');

            shutdown = function() {
                if (process.env.isTest) {
                    window.reporter.decrement(fontName, 'resize');
                }

                // Using attachEvent as the test compresses better
                // IE6, IE7, and IE8 require detachEvent, not event assignment
                outerShutdown(iframe.attachEvent ? iframe.contentWindow.detachEvent('onresize', tryFinish) : iframe.contentWindow.onresize = 0);
            };

            iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

            parent.firstChild.firstChild.firstChild.appendChild(iframe);

            if (process.env.isTest) {
                window.reporter.increment(fontName, 'resize');
            }
            if (iframe.attachEvent) {
                iframe.contentWindow.attachEvent('onresize', tryFinish);
            }
            else {
                iframe.contentWindow.onresize = tryFinish;
            }
        };
    }

    let shutdown = () => {
        if (root) {
            if (process.env.isTest) {
                window.reporter.decrement(fontName, 'root');
            }
            document.body.removeChild(root);
            root = 0;
        }
    };

    if (process.env.isTest) {
        window.reporter.increment(fontName, 'root');
    }
    let root = document.createElement('div');

    const tryFinish = () => {
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth) {
            onReady(shutdown());
        }
    };

    if (!process.env.isLegacy) {
        tryFinish(
            document.body.appendChild(root).innerHTML =
                '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px ' +
                    (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
                ',serif">' +
                    (options.sampleText || ' ') +
                '</div>' +
                '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px ' +
                    (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
                ',monospace">' +
                    (options.sampleText || ' ') +
                '</div>'
        );
    }
    
    if (process.env.isLegacy) {
        tryFinish(
            document.body.appendChild(root).innerHTML =
                '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
                    '<tr>' +
                        '<td style=position:relative>' +
                    '<tr>' +
                        '<td style="font:999px serif;white-space:pre">' +
                            '.<span style="font:999px ' +
                                (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
                                ',serif">' +

                                (options.sampleText || ' ') +
                            '</span>.' +
                '</table>' +
                '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
                    '<tr>' +
                        '<td style=position:relative>' +
                    '<tr>' +
                        '<td style="font:999px serif;white-space:pre">' +
                            '.<span style="font:999px ' +
                                (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
                                ',monospace">' +

                                (options.sampleText || ' ') +
                            '</span>.' +
                '</table>'
        );
    }

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
