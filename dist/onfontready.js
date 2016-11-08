// * fontName : Font name used in the `@font-face` declaration
// * onReady  : Function called upon successful font load and parse detection
// * options  : Optional parameters
// * options.timeoutAfter : Milliseconds to wait before giving up
//                          Triggers options.onTimeout call
//                          Unset or 0 will result in an indefinite wait
// * options.onTimeout    : Called after options.timeoutAfter milliseconds
//                            have elapsed without an onReady call
// * options.sampleText   : Text string used to test font loading
//                          Defaults to " " (space character)
// * options.generic      : Boolean set to true if attempting to detect
//                            generic family font
// * root                 : Undefined variable used by function
// * tryFinish            : Undefined variable used by function
window.onfontready = function (fontName, onReady, options, root, tryFinish) {

    // Ensure options is defined to prevent access errors
    options = options || 0;

    // A 0 timeoutAfter will prevent the timeout functionality

    // root and tryFinish parameters prevent the need for var statement

    if (options.timeoutAfter) {
        setTimeout(function () {
            // Prevent onTimeout call after shutdown
            if (root) {

                // Shutdown should occur even if onTimeout is not defined
                document.body.removeChild(root);

                // Break the reference to the DOM element to allow GC to run
                // Assigning to 0 also results in falsy root tests elsewhere
                root = 0;

                // This won't prevent TypeError if onTimeout is not a function
                if (options.onTimeout) {
                    options.onTimeout();
                }
            }
        }, options.timeoutAfter);
    }

    // Measures the test elements to determine if the font has loaded
    // Always safe to call, even after shutdown
    // Using function assignment compresses better than function declaration
    tryFinish = function () {
        // Prevent test or onReady call after shutdown
        // The width of the parent elements are influenced by the children,
        //   so it is sufficient to measure the parents
        // clientWidth only measures to integer accuracy
        //   This is sufficient for such large font sizes (999px)
        // Both compared values are integers, so double equality is sufficient
        if (root && root.firstChild.clientWidth == root.lastChild.clientWidth) {

            document.body.removeChild(root);

            // Break the reference to the DOM element to allow GC to run
            // Assigning to 0 also results in falsy root tests elsewhere
            root = 0;

            onReady();
        }
    };

    // Attempt to finish early if the font is already loaded
    // The tryFinish call happens after the test elements are added
    tryFinish(
    // Save bytes by creating and assigning the root div inside call
    // appendChild returns the root, allowing innerHTML usage inline
    document.body.appendChild(root = document.createElement('div')).innerHTML =
    // position:fixed breaks the element out of page flow
    //   Being out of flow makes the div size to the text
    // white-space:pre ensures no text wrapping will occur
    // Out of bounds percentage bottom/right prevents scrollbars
    // font combines font-size and font-family
    // Font size 999px differentiates fallback fonts
    // Using font size in pixels prevents possible
    //   failure due to zero-sized default page fonts
    // Using a <pre> instead of a <div> tag might be smaller, but
    //   it is more likely to interfere with page styles
    '<div style="position:fixed;white-space:pre;bottom:999%;right:999%;font:999px ' + (
    // Generic fonts should be quote-less
    options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
    // Fallback font sizes text differently from
    //   the adjacent div until the font has loaded
    ',serif">' + (
    // A single space is the text default
    options.sampleText || ' ') + '</div>' + '<div style="position:fixed;white-space:pre;bottom:999%;right:999%;font:999px ' + (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") + ',monospace">' + (options.sampleText || ' ') + '</div>');


    // If the font is already loaded, tryFinish will have already destroyed
    //   the root reference, so the iframes will never be inserted
    if (root) {
        // The fontName value has already been used, reuse for reference
        // Save bytes by creating and assigning the iframe inside call
        // appendChild returns the iframe, allowing style usage inline
        // The iframe's width only needs to be relative to the parent's
        root.firstChild.appendChild(fontName = document.createElement('iframe')).style.width = '999%';

        // contentWindow becomes available upon DOM insertion
        // Assigning a non-closure function to onresize prevents the
        //   possibility of memory leaks through event handlers
        fontName.contentWindow.onresize = tryFinish;

        // By reusing the fontName (via reassignment), the DOM reference
        //   to the first iframe is broken, reducing memory leak potential
        root.lastChild.appendChild(fontName = document.createElement('iframe')).style.width = '999%';

        fontName.contentWindow.onresize = tryFinish;

        // Because of iframe loading nuances, sometimes the font can finish
        //   loading after the root is inserted, but before the onresize
        //   event handler can be added to an iframe, creating a potential
        //   for a missed resize event
        // This setTimeout gives the browser an additional chance to catch
        //   a font load after returning control to the browser
        // By assigning the result of setTimeout (a timeout ID) to the
        //   fontName, the DOM reference to the second iframe is broken,
        //   further reducing the posibility of memory leaks
        fontName = setTimeout(tryFinish);
    }
};