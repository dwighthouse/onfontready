module.exports = (fontName, onReady, options) => {
    if (process.env.isTest) {
        const tests = {};

        // A helper function that counts the creation and destruction of
        //   elements and event listeners for testing purposes
        window.reporter = window.reporter || (() => {
            function tryCreate(name) {
                tests[name] = tests[name] || {
                    root: 0,
                    load: 0,
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

    options = options || fontName;

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
            (parent.appendChild(iframe)).contentWindow.onresize = tryFinish;
        };
    }

    if (process.env.isLegacy) {
        var startupIframe = (outerShutdown, parent, iframe) => {
            iframe = document.createElement('iframe');

            if (process.env.isTest) {
                window.reporter.increment(fontName, 'load');
            }
            iframe.onload = () => {
                if (process.env.isTest) {
                    window.reporter.increment(fontName, 'resize');
                }
                tryFinish(
                    iframe.contentWindow.onresize = tryFinish,
                    iframe.contentWindow.attachEvent && iframe.contentWindow.attachEvent('onresize', tryFinish)
                );
            };

            shutdown = () => {
                if (process.env.isTest) {
                    window.reporter.decrement(fontName, 'load');
                    window.reporter.decrement(fontName, 'resize');
                }
                outerShutdown(
                    iframe.contentWindow && (iframe.contentWindow.onresize = iframe.contentWindow.attachEvent && iframe.contentWindow.detachEvent('onresize', tryFinish)),
                    iframe.onload = iframe.attachEvent && iframe.detachEvent('onload', iframe.onload)
                );
            };

            iframe.style.cssText = 'position:absolute;width:999%';

            parent.firstChild.firstChild.firstChild.appendChild(iframe, iframe.attachEvent && iframe.attachEvent('onload', iframe.onload));
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
                '<table style=position:absolute;width:auto;right:999%;bottom:999%>' +
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
                '<table style=position:absolute;width:auto;right:999%;bottom:999%>' +
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
};
