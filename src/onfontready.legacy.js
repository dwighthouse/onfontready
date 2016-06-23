// * fontName - Font name used in the `@font-face` declaration
// * onReady - Function called upon successful font load and parse detection
// * options - Optional parameter
//   - options.sampleText - Text string used to test font loading
//                          Defaults to "onfontready"
//   - options.timeoutAfter - Milliseconds to wait before giving up
//                            Calls the `options.onTimeout` callback
//                            Unset or 0 will result in an indefinite wait
//   - options.onTimeout - Called after `options.timeoutAfter` milliseconds
//                           have elapsed without an `onReady` call
module.exports = function(fontName, onReady, options) {

    // Ensure options is defined to prevent access errors
    // The defaulted 'onfontready' works as an object and is more compressable
    options = options || 'onfontready';

    // A 0 timeoutAfter will prevent the timeout functionality
    if (options.timeoutAfter)
    {
        setTimeout(function() {
            // Prevent timeout after shutdown
            if (root)
            {
                // Shutdown should occur whether onTimeout exists or not
                // Two calls combined, shutdown is called first
                // onTimeout should not be called if undefined in options
                //   Since shutdown called a second time is effectively a
                //   no-op, use that as a default function
                (options.onTimeout || shutdown)(shutdown());
            }
        }, options.timeoutAfter);
    }

    if ('test' === process.env.NODE_ENV)
    {
        var testName = fontName;
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

    var tryFinish = function() {
        // Prevent equality check if shutdown already called
        if (root)
        {
            // Save off the serif width inline with the comparison and use
            //   it to directly compare to other two widths
            // Reuse the fontName variable for serif width, since it has
            //   already been fully used by the time this tryFinish is called
            // Using clientWidth is smaller than getBoundingClientRect().left
            //   It rounds to nearest integer instead of using floating point
            //   However, this is safe due to the large font sizes
            // Looking up the childNodes each time compresses better
            if ((fontName = root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].clientWidth) ==
                root.childNodes[1].childNodes[0].childNodes[0].childNodes[0].clientWidth &&
                fontName == root.childNodes[2].childNodes[0].childNodes[0].childNodes[0].clientWidth)
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
                window.testReporter.decrement(testName, 'root');
            }
        }

        // Setting root to 0 prevents extra tests and shutdowns while safely
        //   breaking the reference for the garbage collector
        root = 0;
    };

    // Passing outerShutdown allows shutdown sequence in reverse order
    //   without variables or loops
    // iframe parameter is used as a local variable
    // onLoad parameter is used as a local variable
    var startupIframe = function(outerShutdown, appendToChildIndex, iframe, onLoad) {
        // Attempts to add more compression by combining this line
        //   with other operations have failed
        iframe = document.createElement('iframe');

        onLoad = function() {
            // Check if font is loaded at iframe onload time
            tryFinish();

            // If shutdown has already been called due to a tryFinish above
            //   root will already be destroyed and this code won't run
            if (root)
            {
                // Check if font is loaded during iframe resize
                // IE6, IE7, and IE8 require attachEvent, not event assignment
                // Inlining compresses better than separate function
                if (iframe.contentWindow.attachEvent)
                {
                    iframe.contentWindow.attachEvent('onresize', tryFinish);
                }
                else
                {
                    iframe.contentWindow.onresize = tryFinish;
                }
                if ('test' === process.env.NODE_ENV)
                {
                    window.testReporter.increment(testName, 'resize');
                }
            }
        };

        // IE6, IE7, and IE8 require attachEvent, not event assignment
        // Inlining compresses better than separate function
        if (iframe.attachEvent)
        {
            iframe.attachEvent('onload', onLoad);
        }
        else
        {
            iframe.onload = onLoad;
        }
        if ('test' === process.env.NODE_ENV)
        {
            window.testReporter.increment(testName, 'load');
        }

        // Reassign the shutdown function to new wrapped shutdown function
        // Removes the need to store off shutdown functions, use loops,
        //   or assume all three startupIframe calls occurred
        shutdown = function() {
            if (iframe.contentWindow)
            {
                // Using attachEvent as the test compresses better
                // IE6, IE7, and IE8 require detachEvent, not event assignement
                if (iframe.contentWindow.attachEvent)
                {
                    iframe.contentWindow.detachEvent('onresize', tryFinish);
                }
                else
                {
                    iframe.contentWindow.onresize = 0;
                }
                if ('test' === process.env.NODE_ENV)
                {
                    window.testReporter.decrement(testName, 'resize');
                }
            }

            // Using attachEvent as the test compresses better
            // IE6, IE7, and IE8 require detachEvent, not event assignement
            if (iframe.attachEvent)
            {
                iframe.detachEvent('onload', onLoad);
            }
            else
            {
                iframe.onload = 0;
            }
            if ('test' === process.env.NODE_ENV)
            {
                window.testReporter.decrement(testName, 'load');
            }

            // The inner shutdown calls outerShutdown in reverse order
            outerShutdown();
        };

        // The right and bottom attributes are not required
        //   However, including them allows better compression
        // Using 999% instead of 100% is more compressable
        // We are not measuring the width of the iframes, only using them
        //   to detect resizes, so it does not matter their exact width
        //   However, 100% or greater is likely required in special cases
        iframe.style.cssText = 'position:absolute;right:999%;bottom:999%;width:999%';

        // Appending must be last to allow the iframe's onload to be setup
        //   early enough
        // Looking up the childNodes each time compresses better
        root.childNodes[appendToChildIndex].childNodes[0].childNodes[0].childNodes[0].appendChild(iframe);
    };

    var root;

    // Pulling this value out into a variable compresses better in legacy
    // Here, sampleText defaults to 'onfontready' if not assigned
    var sampleText = options.sampleText || 'onfontready';

    // An iframe within an out-of-flow table, allows the iframe's width to be
    //   associated with the text's width
    //   If the text width changes, the iframe is resized
    // Specifying the font size inside the font shorthand removes the need
    //   to declare both font-size and font-family
    // Font size of 999% shares the string with positioning styles
    //   The font size will be 999% of the html page's base font size
    //   As long as it's fairly large, the exact size doesn't matter
    // Font quotes are sometimes necessary, but prevent the use of onfontready
    //   to detect generic-named fonts' readiness
    // It is more compressable to assign root here (oddly)
    // The return value of appendChild is the appended element,
    //   so the innerHTML assignment can be done immediately
    document.body.appendChild(root = document.createElement('div')).innerHTML =
        '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
            '<tr><td style=position:relative>' +
            '<tr><td style="white-space:pre;font:999% \'' + fontName + '\',serif">' +
                 sampleText +
        '</table>' +
        '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
            '<tr><td style=position:relative>' +
            '<tr><td style="white-space:pre;font:999% \'' + fontName + '\',sans-serif">' +
                 sampleText +
        '</table>' +
        '<table style=position:absolute;right:999%;bottom:999%;width:auto>' +
            '<tr><td style=position:relative>' +
            '<tr><td style="white-space:pre;font:999% \'' + fontName + '\',monospace">' +
                 sampleText +
        '</table>';
    // -Unapplied Compressions-
    // Modern browsers (except Edge and IE12) can allow the space between
    //   999% and the quote for the font name to be removed

    if ('test' === process.env.NODE_ENV)
    {
        window.testReporter.increment(testName, 'root');
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
