module.exports = function(fontName, onReady, options) {

    // Ensure options is defined to prevent access errors
    options = options || 'onfontready';

    // A 0 timeoutAfter will prevent the timeout functionality
    if (options.timeoutAfter)
    {
        setTimeout(function() {
            // Prevent timeout after shutdown
            if (root)
            {
                // Shutdown should occur whether onTimeout exists or not
                shutdown();

                // This will not protect against assigning onTimeout to a
                //   non-function, only lack of assignment (falsy values)
                if (options.onTimeout)
                {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    if ('test' === process.env.NODE_ENV)
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

    var root;

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
            document.body.removeChild(root);
            if ('test' === process.env.NODE_ENV)
            {
                window.testReporter.decrement(fontName, 'root');
            }
        }

        // Setting root to 0 prevents extra tests and shutdowns while safely
        //   breaking the reference for the garbage collector
        root = 0;
    };

    // Passing outerShutdown allows shutdown sequence in reverse order
    //   without variables or loops
    // iframe parameter is used as a local variable
    // Having three parameters guarantees that this function declaration
    //   will have the same signature (when minified) as the outer closure
    //   which will save some bytes when compressed
    var startupIframe = function(outerShutdown, appendToChildIndex, iframe) {
        // Attempts to add more compression by combining this line
        //   with other operations have failed
        iframe = document.createElement('iframe');

        iframe.onload = function() {
            // Check if font is loaded at iframe onload time
            tryFinish();

            // If shutdown has already been called due to a tryFinish above
            //   root will already be destroyed and this code won't run
            if (root)
            {
                // Check if font is loaded during iframe resize
                iframe.contentWindow.onresize = tryFinish;
                if ('test' === process.env.NODE_ENV)
                {
                    window.testReporter.increment(fontName, 'resize');
                }
            }
        };
        if ('test' === process.env.NODE_ENV)
        {
            window.testReporter.increment(fontName, 'load');
        }

        // Reassign the shutdown function to new wrapped shutdown function
        // Removes the need to store off shutdown functions, use loops,
        //   or assume all three startupIframe calls occurred
        shutdown = function() {
            // Test is up here because outerShutdown acts recursively
            if ('test' === process.env.NODE_ENV)
            {
                window.testReporter.decrement(fontName, 'resize');
                window.testReporter.decrement(fontName, 'load');
            }

            // Perform shutdown operation inside function call for compression
            // Break the references to remove event listeners by 0 assignment
            // If the iframe.contentWindow is already gone,
            //   perform reference break assignment to meaningless string
            //   This is safe and compresses better

            // The inner shutdown calls outerShutdown in reverse order
            // This prevents the need to return or store a shutdown function
            outerShutdown(iframe.onload = (iframe.contentWindow || 'onfontready').onresize = 0);
        };

        // The iframe must only have a width relative to the text's width
        // Using 999% instead of 100% is more compressable
        // We are not measuring the width of the iframes, only using them
        //   to detect resizes, so it does not matter their exact width
        //   However, 100% or greater is likely required in special cases
        iframe.style.width = '999%';

        // Appending must be last to allow the iframe's onload to be setup
        //   early enough
        root.childNodes[appendToChildIndex].appendChild(iframe);
    };

    // An iframe within an out-of-flow div, allows the iframe's width to be
    //   associated with the text's width
    //   If the text width changes, the iframe is resized
    // Specifying the font size inside the font shorthand removes the need
    //   to declare both font-size and font-family
    // Font size of 999% shares the string with positioning styles
    //   The font size will be 999% of the html page's base font size
    //   As long as it's fairly large, the exact size doesn't matter
    // Font quotes are sometimes necessary, but prevent the use of onfontready
    //   to detect generic-named fonts' readiness
    // Here, sampleText defaults to 'onfontready' if not assigned
    // It is more compressable to assign root here (oddly)
    // The return value of appendChild is the appended element,
    //   so the innerHTML assignment can be done immediately
    document.body.appendChild(root = document.createElement('div')).innerHTML =
        '<div style="position:fixed;right:999%;bottom:999%;white-space:nowrap;font:999% \'' + fontName + '\',serif">' +
            (options.sampleText || 'onfontready') +
        '</div>' +
        '<div style="position:fixed;right:999%;bottom:999%;white-space:nowrap;font:999% \'' + fontName + '\',sans-serif">' +
            (options.sampleText || 'onfontready') +
        '</div>' +
        '<div style="position:fixed;right:999%;bottom:999%;white-space:nowrap;font:999% \'' + fontName + '\',monospace">' +
            (options.sampleText || 'onfontready') +
        '</div>';
    // -Unapplied Compressions-
    // Modern browsers (except Edge and IE12) can allow the space between
    //   999% and the quote for the font name to be removed
    // Using <pre> tags instead of <div> tags would allow us to ignore
    //   white-space:nowrap in modern browsers, and compress much better,
    //   but this is more likely to interfere with user's page styles

    if ('test' === process.env.NODE_ENV)
    {
        window.testReporter.increment(fontName, 'root');
    }

    // Check if font is already loaded at startup time
    tryFinish();

    // Checking the root each time for previous shutdowns allows startupIframe
    //   to safely create and inject the iframe in an interlaced fashion
    // It is more compressable to put the root checks outside the function
    // Passing the shutdown reference each time is more compressable than
    //   creating an assignment within the startupIframe function
    // Passing the index of the child to append to is more compressable
    //   than sending the child itself
    // The parameter order is also for compression reasons
    if (root)
    {
        startupIframe(shutdown, 0);
    }
    if (root)
    {
        startupIframe(shutdown, 1);
    }
    if (root)
    {
        startupIframe(shutdown, 2);
    }
};
