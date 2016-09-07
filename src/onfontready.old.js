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
            if ((fontName = root.childNodes[0].clientWidth) == root.childNodes[1].clientWidth &&
                fontName == root.childNodes[2].clientWidth)
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
                    window.testReporter.increment(testName, 'resize');
                }
            }
        };
        if ('test' === process.env.NODE_ENV)
        {
            window.testReporter.increment(testName, 'load');
        }

        // Reassign the shutdown function to new wrapped shutdown function
        // Removes the need to store off shutdown functions, use loops,
        //   or assume all three startupIframe calls occurred
        shutdown = function() {
            // Test is up here because outerShutdown acts recursively
            if ('test' === process.env.NODE_ENV)
            {
                window.testReporter.decrement(testName, 'resize');
                window.testReporter.decrement(testName, 'load');
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

    var root;

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
        '<div style="font:999% \'' + fontName + '\',serif;position:fixed;right:999%;bottom:999%;white-space:pre">' +
            (options.sampleText || 'onfontready') +
        '</div>' +
        '<div style="font:999% \'' + fontName + '\',sans-serif;position:fixed;right:999%;bottom:999%;white-space:pre">' +
            (options.sampleText || 'onfontready') +
        '</div>' +
        '<div style="font:999% \'' + fontName + '\',monospace;position:fixed;right:999%;bottom:999%;white-space:pre">' +
            (options.sampleText || 'onfontready') +
        '</div>';
    // -Unapplied Compressions-
    // Modern browsers (except Edge and IE12) can allow the space between
    //   999% and the quote for the font name to be removed
    // Using <pre> tags instead of <div> tags would allow us to ignore
    //   white-space:pre in modern browsers, and compress much better,
    //   but this is more likely to interfere with user's page styles

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