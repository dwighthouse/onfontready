// First 3 parameters are part of the API
// Last 6 parameters are used as local variables and will be overwritten
window.onfontready = function(fontName, onReady, options, areEqual, onResize, shutdown, startupIframe, root, onTimeout) {

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

    // Parameter serifLeft is used as local varible
    // Elements are positioned relative to right (999%)
    //   Thus, we can determine equal widths by checking on the left value
    // Only dealing with left number values, so == equality is safe
    // Looking up the childNodes each time compresses better
    areEqual = function(serifLeft) {
        serifLeft = root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().left;
        return serifLeft == root.childNodes[1].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().left &&
               serifLeft == root.childNodes[2].childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().left; 
    };

    onResize = function() {
        // Prevent equality check if shutdown already called
        if (root && areEqual())
        {
            // Two calls combined, shutdown is called first
            onReady(shutdown());
        }
    };

    shutdown = function() {
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
        // Setting onTimeout to 0 prevents scheduled timeout calls
        //   The onTimeout function is checked before being called
        // Combined assignment compresses better
        onTimeout = root = 0;
    };

    // IE6, IE7, and IE8 require attachEvent/detachEvent, not event assignment
    // Passing outerShutdown allows shutdown sequence in reverse order
    //   without variables or loops
    // Parameter onLoad is used as local variable
    startupIframe = function(iframe, outerShutdown, onLoad) {
        // The iframe is already positioned off the top-left of the page
        //   Thus, the positive right and bottom offsets do not matter
        // The 999% percentages allow strings to be shared with the tables
        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:100%';

        onLoad = function() {
            // Prevent onload startup if shutdown already called
            if (root)
            {
                if (areEqual())
                {
                    // Two calls combined, shutdown is called first
                    onReady(shutdown());
                }
                else
                {
                    // Inlining compresses better than separate function
                    if (iframe.contentWindow.attachEvent)
                    {
                        iframe.contentWindow.attachEvent('onresize', onResize);
                    }
                    else
                    {
                        iframe.contentWindow.onresize = onResize;
                    }
                    if ('test' === "production")
                    {
                        window.onfontreadyTestReporter.increment(fontName, 'resize');
                    }
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
                    iframe.contentWindow.detachEvent('onresize', onResize);
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
    };

    // Ensure options is an object to prevent access errors
    options = options || {};

    // Prevent reassignment from overwriting external API data
    onTimeout = options.onTimeout;

    // A 0 timeoutAfter will prevent the timeout functionality
    if (options.timeoutAfter)
    {
        setTimeout(function(onTimeoutTemp) {
            // shutdown breaks the onTimeout reference, so store a reference
            onTimeoutTemp = onTimeout;

            shutdown();
            if (onTimeoutTemp)
            {
                onTimeoutTemp();
            }
        }, options.timeoutAfter);
    }

    // Combine assignment and insertion
    document.body.appendChild(root = document.createElement('div'));
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

    // Check if font is already loaded startup time
    if (areEqual())
    {
        // Two calls combined, shutdown is called first
        onReady(shutdown());
    }
    else
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
