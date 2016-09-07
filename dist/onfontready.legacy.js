// Tests run successfully on modern Chrome, IE6

window.onfontready = function(fontName, onReady, options) {

    options = options || 0;

    if (options.timeoutAfter)
    {
        setTimeout(function() {
            if (root)
            {
                (options.onTimeout || shutdown)(shutdown());
            }
        }, options.timeoutAfter);
    }

    var startupIframe = function(outerShutdown, parent, iframe, onLoad) {
        iframe = document.createElement('iframe');

        onLoad = function() {
            tryFinish();

            if (root)
            {
                if (iframe.contentWindow.attachEvent)
                {
                    iframe.contentWindow.attachEvent('onresize', tryFinish);
                }
                else
                {
                    iframe.contentWindow.onresize = tryFinish;
                }
            }
        };

        if (iframe.attachEvent)
        {
            iframe.attachEvent('onload', onLoad);
        }
        else
        {
            iframe.onload = onLoad;
        }

        shutdown = function() {
            if (iframe.contentWindow)
            {
                if (iframe.contentWindow.attachEvent)
                {
                    iframe.contentWindow.detachEvent('onresize', tryFinish);
                }
                else
                {
                    iframe.contentWindow.onresize = 0;
                }
            }

            if (iframe.attachEvent)
            {
                iframe.detachEvent('onload', onLoad);
            }
            else
            {
                iframe.onload = 0;
            }

            outerShutdown();
        };

        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

        parent.appendChild(iframe);
    };

    var tryFinish = function() {
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth)
        {
            onReady(shutdown());
        }
    };

    var shutdown = function() {
        if (root)
        {
            document.body.removeChild(root);
        }

        root = 0;
    };

    var root;

    document.body.appendChild(root = document.createElement('div')).innerHTML =
        '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
            '<tr><td style=position:relative>' +
            '<tr><td style=white-space:pre>.<span style="font:999px \'' + fontName + '\',serif"> </span>.' +
        '</table>' +
        '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
            '<tr><td style=position:relative>' +
            '<tr><td style=white-space:pre>.<span style="font:999px \'' + fontName + '\',monospace"> </span>.' +
        '</table>';

    tryFinish();

    if (root)
    {
        startupIframe(shutdown, root.firstChild.firstChild.firstChild.firstChild);
    }
    if (root)
    {
        startupIframe(shutdown, root.lastChild.firstChild.firstChild.firstChild);
    }
};
