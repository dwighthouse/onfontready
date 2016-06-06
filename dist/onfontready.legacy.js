// First 3 parameters are part of the API
window.onfontready = function(fontName, onReady, options) {

    // Ensure options is an object to prevent access errors
    options = options || {};

    // A 0 timeoutAfter will prevent the timeout functionality
    if (options.timeoutAfter)
    {
        setTimeout(function() {
            if (root)
            {
                shutdown();
                if (options.onTimeout)
                {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    if ('test' === "production")
    {
        // A helper function that counts the creation and destruction of
        //   elements and event listeners for testing purposes
        function reporter() {
            var tests = {};

            return {
                increment: function(name, type) {
                    if (!tests[name])
                    {
                        tests[name] = {
                            root: 0,
                            load: 0,
                            resize: 0
                        };
                    }
                    tests[name][type] += 1;
                },
                decrement: function(name, type) {
                    if (!tests[name])
                    {
                        tests[name] = {
                            root: 0,
                            load: 0,
                            resize: 0
                        };
                    }
                    tests[name][type] -= 1;
                },
                fullReport: function() {
                    return tests;
                }
            };
        }
        window.onfontreadyTestReporter = window.onfontreadyTestReporter || reporter();
    }

    var root = document.createElement('div');

    var shutdown = function() {
        if (root)
        {
            // DEBUG: Comment to see the test elements on the page
            document.body.removeChild(root);
            if ('test' === "production")
            {
                window.onfontreadyTestReporter.decrement(fontName, 'root');
            }
        }

        // Setting root to 0 prevents extra tests and shutdowns
        root = 0;
    };

    // IE6, IE7, and IE8 require attachEvent/detachEvent, not event assignment
    // Passing outerShutdown allows shutdown sequence in reverse order
    //   without variables or loops
    // Parameter onLoad is used as local variable
    var startupIframe = function(iframe, outerShutdown, onLoad) {
        onLoad = function() {
            // Check if font is loaded at iframe onload time
            tryFinish();

            // If shutdown has already been called due to equality above
            //   root will already be destroyed and this code won't run
            if (root)
            {
                // Inlining compresses better than separate function
                if (iframe.contentWindow.attachEvent)
                {
                    iframe.contentWindow.attachEvent('onresize', tryFinish);
                }
                else
                {
                    iframe.contentWindow.onresize = tryFinish;
                }
                if ('test' === "production")
                {
                    window.onfontreadyTestReporter.increment(fontName, 'resize');
                }
            }
        };

        // Inlining compresses better than separate function
        if (iframe.attachEvent)
        {
            iframe.attachEvent('onload', onLoad);
        }
        else
        {
            iframe.onload = onLoad;
        }
        if ('test' === "production")
        {
            window.onfontreadyTestReporter.increment(fontName, 'load');
        }

        // Reassign the shutdown function to new wrapped shutdown function
        shutdown = function() {
            if (iframe.contentWindow)
            {
                // Inlining compresses better than separate function
                // If attachEvent exists, so does detactEvent
                if (iframe.contentWindow.attachEvent)
                {
                    iframe.contentWindow.detachEvent('onresize', tryFinish);
                }
                else
                {
                    // Break the references to remove event listener
                    iframe.contentWindow.onresize = 0;
                }
                if ('test' === "production")
                {
                    window.onfontreadyTestReporter.decrement(fontName, 'resize');
                }
            }

            // Inlining compresses better than separate function
            // If attachEvent exists, so does detactEvent
            if (iframe.attachEvent)
            {
                iframe.detachEvent('onload', onLoad);
            }
            else
            {
                // Break the references to remove event listener
                iframe.onload = 0;
            }
            if ('test' === "production")
            {
                window.onfontreadyTestReporter.decrement(fontName, 'load');
            }

            // The inner shutdown calls outerShutdown in reverse order
            // This prevents the need to return or store a shutdown function
            outerShutdown();
        };

        // The iframe is already positioned off the top-left of the page
        //   Thus, the positive right and bottom offsets do not matter
        // The 999% percentages allow strings to be shared with the tables
        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:100%';
    };

    var tryFinish = function() {
        // Prevent equality check if shutdown already called
        if (root)
        {
            // Elements are positioned relative to right (999%)
            //   We can determine equal widths by checking the left value
            // Only dealing with left number values, so == equality is safe
            // Only equality is checked, so `2 * x` should equal `y + z`
            // Inlined equality check compresses better
            // Looking up the childNodes each time compresses better
            // Inlined equality check compresses better
            if (root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().left * 2 ==
                root.childNodes[1].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().left +
                root.childNodes[2].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().left)
            {
                // Two calls combined, shutdown is called first
                onReady(shutdown());
            }
        }
    };

    document.body.appendChild(root);
    if ('test' === "production")
    {
        window.onfontreadyTestReporter.increment(fontName, 'root');
    }

    // DEBUG: Uncomment to see the test elements on the page
    // root.style.cssText = 'position:absolute;right:10px;bottom:10px';

    // In IE6, the only known way to associate an absolutely positioned
    //   element's width with some text is to use a table
    // An iframe, absolutely positioned within the relatively positioned tr,
    //   allows the iframe's width to be associated with the text's width
    //   Thus, if the text width changes, the iframe is resized
    // Font size of 999% shares the string with positioning styles
    //   The font size will be 999% of the html page's base font size
    //   As long as it's fairly large, the exact size doesn't matter
    // Optional <tbody>, </tbody>, </tr>, and </td> tags are valid HTML5
    //   http://blog.teamtreehouse.com/to-close-or-not-to-close-tags-in-html5
    // Font quotes are sometimes necessary, but prevent the use of onfontready
    //   to detect generic-named fonts' readiness
    // Here, sampleText defaults to 'onfontready' if not assigned
    root.innerHTML = '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
                         '<tr><td style=position:relative>' +
                         '<tr><td style="white-space:nowrap;font:999% \'' + fontName + '\',serif">' +
                              (options.sampleText || 'onfontready') +
                     '</table>' +
                     '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
                         '<tr><td style=position:relative>' +
                         '<tr><td style="white-space:nowrap;font:999% \'' + fontName + '\',sans-serif">' +
                              (options.sampleText || 'onfontready') +
                     '</table>' +
                     '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
                         '<tr><td style=position:relative>' +
                         '<tr><td style="white-space:nowrap;font:999% \'' + fontName + '\',monospace">' +
                              (options.sampleText || 'onfontready') +
                     '</table>';

    // Check if font is already loaded at startup time
    tryFinish();

    // If shutdown has already been called due to equality above
    //   root will already be destroyed and this code won't run
    if (root)
    {
        // Combine assignment and argument passing
        // Each element is only used once below, making assignment
        //   to a function object more compressable
        // The letter is based on the fallback font name
        //   sErif, sAns-serif, mOnospace
        startupIframe(startupIframe.e = document.createElement('iframe'), shutdown);
        startupIframe(startupIframe.a = document.createElement('iframe'), shutdown);
        startupIframe(startupIframe.o = document.createElement('iframe'), shutdown);

        // iframe elements will not trigger onload until added to the DOM
        //   To ensure everything is set up, the insertion is not interlaced
        //   Otherwise, the 2nd startupIframe might be called after shutdown
        // Looking up the childNodes each time compresses better
        root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].appendChild(startupIframe.e);
        root.childNodes[1].childNodes[0].childNodes[0].childNodes[0].appendChild(startupIframe.a);
        root.childNodes[2].childNodes[0].childNodes[0].childNodes[0].appendChild(startupIframe.o);
    }
};
