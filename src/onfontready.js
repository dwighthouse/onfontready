module.exports = (fontName, onReady, options) => {
    options = options || 0;

    if (options.timeoutAfter) {
        setTimeout(() => {
            if (root) {
                document.body.removeChild(root);
                root = 0;
                if (options.onTimeout) {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    const tryFinish = () => {
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth) {
            document.body.removeChild(root);
            root = 0;
            onReady();
        }
    };

    let root = document.createElement('div');

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
                        '<td style="font:999px monospace;white-space:pre">' +
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
                        '<td style="font:999px monospace;white-space:pre">' +
                            '.<span style="font:999px ' +
                                (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
                                ',monospace">' +

                                (options.sampleText || ' ') +
                            '</span>.' +
                '</table>'
        );
    }

    if (!process.env.isLegacy) {
        if (root) {
            root.firstChild.appendChild(fontName = document.createElement('iframe')).style.width = '999%';
            fontName.contentWindow.onresize = tryFinish;
            fontName = 0;
        }
        if (root) {
            root.lastChild.appendChild(fontName = document.createElement('iframe')).style.width = '999%';
            fontName.contentWindow.onresize = tryFinish;
            fontName = 0;
        }
    }

    if (process.env.isLegacy) {
        if (root) {
            root.firstChild.firstChild.firstChild.firstChild.appendChild(fontName = document.createElement('iframe')).style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

            if (fontName.attachEvent) {
                fontName.contentWindow.attachEvent('onresize', tryFinish);
            }
            else {
                fontName.contentWindow.onresize = tryFinish;
            }

            fontName = 0;
        }

        if (root) {
            root.lastChild.firstChild.firstChild.firstChild.appendChild(fontName = document.createElement('iframe')).style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

            if (fontName.attachEvent) {
                fontName.contentWindow.attachEvent('onresize', tryFinish);
            }
            else {
                fontName.contentWindow.onresize = tryFinish;
            }

            fontName = 0;
        }
    }

    if (root) {
        setTimeout(tryFinish);
    }
};
