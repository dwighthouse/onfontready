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

    var startupIframe = function(outerShutdown, parent, iframe) {
        iframe = document.createElement('iframe');

        iframe.onload = function() {
            tryFinish(iframe.contentWindow.onresize = tryFinish);
        };

        shutdown = function() {
            outerShutdown(iframe.onload = (iframe.contentWindow || 0).onresize = 0);
        };

        iframe.style.width = '999%';

        parent.appendChild(iframe);
    };

    var shutdown = function() {
        if (root)
        {
            document.body.removeChild(root, root = 0);
        }
    };

    var tryFinish = function() {
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth)
        {
            onReady(shutdown());
        }
    };

    var root = document.createElement('div');

    tryFinish(document.body.appendChild(root).innerHTML =
        '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px \'' + fontName + '\',serif"> </div>' +
        '<div style="position:fixed;right:999%;bottom:999%;white-space:pre;font:999px \'' + fontName + '\',monospace"> </div>');

    if (root)
    {
        startupIframe(shutdown, root.firstChild);
    }
    if (root)
    {
        startupIframe(shutdown, root.lastChild);
    }
};
