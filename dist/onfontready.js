window.onfontready = function(fontName, onReady, options) {

    // Ensure options is an object to prevent access errors
    options = options || {};

    // A 0 timeoutAfter will prevent the timeout functionality
    if (options.timeoutAfter)
    {
        setTimeout(function() {
            // Prevent timeout after shutdown
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
        window.testReporter = window.testReporter || reporter();
    }

    var root = document.createElement('div');

    var tryFinish = function() {
        // Prevent equality check if shutdown already called
        if (root)
        {
            // Elements are positioned relative to right (999%)
            //   We can determine equal widths by checking the left value
            // Only dealing with left number values, so == equality is safe
            // Only equality is checked, so `2 * x` should equal `y + z`
            // Looking up the childNodes each time compresses better
            if (root.childNodes[0].getBoundingClientRect().left * 2 ==
                root.childNodes[1].getBoundingClientRect().left +
                root.childNodes[2].getBoundingClientRect().left)
            {
                // Two calls combined, shutdown is called first
                onReady(shutdown());
            }
        }
    };

    var shutdown = function() {
        // Prevent double-removal of root
        if (root)
        {
            // DEBUG: Comment to see the test elements on the page
            document.body.removeChild(root);
            if ('test' === "production")
            {
                window.testReporter.decrement(fontName, 'root');
            }
        }

        // Setting root to 0 prevents extra tests and shutdowns
        root = 0;
    };

    // Passing outerShutdown allows shutdown sequence in reverse order
    //   without variables or loops
    // fakeParam1 is added to improve compression, gaining the same
    //   signature text as the outer closure function at the top
    var startupIframe = function(iframe, outerShutdown, fakeParam1) {
        iframe.onload = function() {
            // Check if font is loaded at iframe onload time
            tryFinish();

            // If shutdown has already been called due to equality above
            //   root will already be destroyed and this code won't run
            if (root)
            {
                // Check if font is loaded during iframe resize
                iframe.contentWindow.onresize = tryFinish;
                if ('test' === "production")
                {
                    window.testReporter.increment(fontName, 'resize');
                }
            }
        };
        if ('test' === "production")
        {
            window.testReporter.increment(fontName, 'load');
        }

        // Reassign the shutdown function to new wrapped shutdown function
        shutdown = function() {
            if ('test' === "production")
            {
                window.testReporter.decrement(fontName, 'resize');
                window.testReporter.decrement(fontName, 'load');
            }

            // Perform shutdown operation inside function call for compression
            // Break the references to remove event listeners
            // If the iframe.contentWindow is already gone,
            //   perform reference break assignment to empty object
            //   This is safe, and compresses better

            // The inner shutdown calls outerShutdown in reverse order
            // This prevents the need to return or store a shutdown function
            outerShutdown(iframe.onload = (iframe.contentWindow || {}).onresize = 0);
        };

        // The iframe is already positioned off the top-left of the page
        //   Thus, the positive right and bottom offsets do not matter
        // Most of the string is shared with the styles below
        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:100%';
    };

    document.body.appendChild(root);
    if ('test' === "production")
    {
        window.testReporter.increment(fontName, 'root');
    }

    // DEBUG: Uncomment to see the test elements on the page
    // root.style.cssText = 'position:absolute;right:10px;bottom:10px';

    // An iframe, absolutely positioned within the absolutely positioned div,
    //   allows the iframe's width to be associated with the text's width
    //   Thus, if the text width changes, the iframe is resized
    // Font size of 999% shares the string with positioning styles
    //   The font size will be 999% of the html page's base font size
    //   As long as it's fairly large, the exact size doesn't matter
    // Font quotes are sometimes necessary, but prevent the use of onfontready
    //   to detect generic-named fonts' readiness
    // Here, sampleText defaults to 'onfontready' if not assigned
    root.innerHTML = '<div style="position:absolute;right:999%;bottom:999%;white-space:nowrap;font:999% \'' + fontName + '\',serif">' +
                          (options.sampleText || 'onfontready') +
                     '</div>' +
                     '<div style="position:absolute;right:999%;bottom:999%;white-space:nowrap;font:999% \'' + fontName + '\',sans-serif">' +
                          (options.sampleText || 'onfontready') +
                     '</div>' +
                     '<div style="position:absolute;right:999%;bottom:999%;white-space:nowrap;font:999% \'' + fontName + '\',monospace">' +
                          (options.sampleText || 'onfontready') +
                     '</div>';

    // Check if font is already loaded at startup time
    tryFinish();

    // If shutdown has already been called due to equality above
    //   root will already be destroyed and this code won't run
    if (root)
    {
        // Combine assignment and argument passing
        // Each element is only used once below, making assignment
        //   to a function object more compressable
        // The letter is based on the fallback font name:
        //   sErif, sAns-serif, mOnospace
        startupIframe(startupIframe.e = document.createElement('iframe'), shutdown);
        startupIframe(startupIframe.a = document.createElement('iframe'), shutdown);
        startupIframe(startupIframe.o = document.createElement('iframe'), shutdown);

        // iframe elements will not trigger onload until added to the DOM
        //   To ensure everything is set up, the insertion is not interlaced
        //   Otherwise, the 2nd startupIframe might be called after shutdown
        // Looking up the childNodes each time compresses better
        root.childNodes[0].appendChild(startupIframe.e);
        root.childNodes[1].appendChild(startupIframe.a);
        root.childNodes[2].appendChild(startupIframe.o);
    }
};
