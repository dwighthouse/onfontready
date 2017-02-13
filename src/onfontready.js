// * fontName: Font name used in the `@font-face` declaration
// * onReady: Function called upon successful font load and parse detection
// * options: Optional parameters
//   - options.timeoutAfter: Milliseconds to wait before giving up and calling options.onTimeout; unset or 0 will result in an indefinite wait
//   - options.onTimeout: Function called after options.timeoutAfter milliseconds have elapsed, if options.timeoutAfter is set
//   - options.sampleText: Text string used to test font loading, defaults to " " (space character)
//   - options.generic: If attempting to detect generic family font, set true
// * tryFinish: Undefined variable used by function
// * root1: Undefined variable used by function
// * root2: Undefined variable used by function
module.exports = (fontName, onReady, options, tryFinish, root1, root2) => {
    // tryFinish, root1, root2 parameters remove need for var statement

    if (process.env.isTest) {
        // Store a copy because later code will reuse the fontName variable
        // Use var to pull it out of the if block's scope into function scope
        var fontNameCopy = fontName;

        const tests = {};

        const tryCreate = (name) => {
            return tests[name] = tests[name] || {
                rootCount: 0,
                iframesCreated: false,
                timedOut: false,
                fontLoaded: false,
                requiredExtraTimeout: false,
            };
        };

        // A helper function tracks info about internal processes for testing
        window.reporter = window.reporter || {
            modifyRootCount(name, increment) {
                tryCreate(name).rootCount += increment;
            },
            iframesCreated(name) {
                tryCreate(name).iframesCreated = true;
            },
            timedOut(name) {
                tryCreate(name).timedOut = true;
            },
            fontLoaded(name) {
                tryCreate(name).fontLoaded = true;
            },
            requiredExtraTimeout(name) {
                tryCreate(name).requiredExtraTimeout = true;
            },
            getTests() {
                return tests;
            },
        };
    }

    // Ensure options is defined to prevent access errors
    // It doesn't matter what is defaulted, 1 compresses well
    options = options || 1;

    // A 0 timeoutAfter will prevent the timeout functionality
    if (options.timeoutAfter) {
        setTimeout(() => {
            // Prevent onTimeout call after shutdown
            if (root2) {
                if (process.env.isTest) {
                    window.reporter.modifyRootCount(fontNameCopy, -1);

                    if (options.onTimeout) {
                        window.reporter.timedOut(fontNameCopy);
                    }
                }

                // Combine onTimeout call to and shutdown, which happens first
                // Shutdown should occur even if onTimeout is not defined
                // If onTimeout is not defined, the default function is tryFinish, which contains a truthy if check on root2
                // Since root2 will be set to false before the function is called, this tryFinish call will do nothing
                // THROW CONDITION: If onTimeout is truthy, but not a function
                (options.onTimeout || tryFinish)(
                    // Return value of removeChild is the node removed
                    // root1 and root2 are always different, therefore an equality check always results in false
                    // Assigning false to root1 and root2 breaks the reference for the GC and sets up root2 as the sentinal false value in other if statements
                    root1 = root2 = document.body.removeChild(root1) == document.body.removeChild(root2)
                );
            }
        }, options.timeoutAfter);
    }

    // Measures the root elements to determine if the font has loaded
    // Always safe to call, even after shutdown
    // Using function assignment compresses better than function declaration
    tryFinish = () => {
        // Checking root2 truthiness will prevent unnecessary tests or onReady calls after shutdown
        // The width of the root nodes are influenced by the width of the text, so it is sufficient to measure the root nodes
        // clientWidth only measures to integer accuracy, which is why large font sizes are used (1111px)
        // Both values compared are integers, so double equality is sufficient
        if (root2 && root1.clientWidth == root2.clientWidth) {
            if (process.env.isTest) {
                window.reporter.modifyRootCount(fontNameCopy, -1);
                window.reporter.fontLoaded(fontNameCopy);
            }

            // Combine onReady call to and shutdown, which happens first
            onReady(
                // Return value of removeChild is the node removed
                // root1 and root2 are always different, therefore an equality check always results in false
                // Assigning false to root1 and root2 breaks the reference for the GC and sets up root2 as the sentinal false value in other if statements
                root1 = root2 = document.body.removeChild(root1) == document.body.removeChild(root2)
            );
        }
    };

    if (process.env.isTest) {
        window.reporter.modifyRootCount(fontNameCopy, 1);
    }

    if (!process.env.isLegacy) {
        // Save bytes by assigning the node reference inside the appendChild function
        document.body.appendChild(root2 = document.createElement('div'));

        // font allows both the font-size and font-family to be set in one value
        // The large, 1111px font size, ensures a significant difference between the two fallback fonts' widths
        // Using a pixel font size prevents problems with relative font sizes in global page styles
        // Generic fonts should be quote-less
        // In testing for width differences between any characters with differing widths, the generic fonts serif and sans-serif were sufficient
        root2.style.font = `1111px ${options.generic ? '' : "'"}${fontName}${options.generic ? '' : "'"},serif`;

        // white-space:pre ensures no text wrapping will occur
        root2.style.whiteSpace = 'pre';

        // position:fixed pulls the test node out of the page's flow, and also prevents the possibility of scrollbars
        root2.style.position = 'fixed';

        // top:111% pushes the test node beyond the viewport, so it can't be seen or interfere with the page
        // Using sequential 1's allows better compression, sharing numbers with the font-size (1111px)
        root2.style.top = '111%';

        // A single space is the text default
        root2.textContent = options.sampleText || ' ';

        // Changing the reference allows the creation of the second root node to be almost identical
        root1 = root2;

        document.body.appendChild(root2 = document.createElement('div'));
        root2.style.font = `1111px ${options.generic ? '' : "'"}${fontName}${options.generic ? '' : "'"},sans-serif`;
        root2.style.whiteSpace = 'pre';
        root2.style.position = 'fixed';
        root2.style.top = '111%';
        root2.textContent = options.sampleText || ' ';

        // Attempt to finish early if the font is already loaded
        tryFinish();
    }

    if (process.env.isLegacy) {
        document.body.appendChild(root2 = document.createElement('table')).innerHTML = 
            `<tr><td style="font:1111px serif;position:relative;white-space:pre">"<span style="font:1111px ${options.generic ? '' : "'"}${fontName}${options.generic ? '' : "'"},serif">${options.sampleText || ' '}</span>"`;
        root2.style.cssText = 'right:111%;bottom:111%;position:absolute;width:auto';

        root1 = root2;

        document.body.appendChild(root2 = document.createElement('table')).innerHTML = 
            `<tr><td style="font:1111px serif;position:relative;white-space:pre">"<span style="font:1111px ${options.generic ? '' : "'"}${fontName}${options.generic ? '' : "'"},sans-serif">${options.sampleText || ' '}</span>"`;
        root2.style.cssText = 'right:111%;bottom:111%;position:absolute;width:auto';

        tryFinish();


        // // Attempt to finish early if the font is already loaded
        // // The tryFinish call happens after the test elements are added
        // tryFinish(
        //     // Save bytes by creating and assigning the root div inside call
        //     // appendChild returns the root, allowing innerHTML usage inline
        //     document.body.appendChild(root = document.createElement('div')).innerHTML =
        //         // IE6 cannot create automatically sized divs that will
        //         //   contain an absolutely positioned element
        //         //   Such elements will instead break out of their bounds
        //         //   The only other method to associate the width of one
        //         //   element's natural size with the size of another is table
        //         // Style value with no spaces does not require quotes
        //         // position:absolute breaks the element out of page flow
        //         // IE6 does not support position:fixed
        //         // Out of bounds percentage bottom/right prevents scrollbars
        //         // width:auto prevents interference from width:100% styles
        //         //   which are commonly added
        //         '<table style=position:absolute;bottom:999%;right:999%;width:auto>' +
        //             // <tbody> tag is implied
        //             '<tr>' +
        //                 // position:relative allows the iframe's absolute
        //                 //   positioning to be relative to the <td>
        //                 '<td style=position:relative>' +
        //                 // </td> is implied
        //             // </tr> is implied
        //             '<tr>' +
        //                 // Inner <span> needs surrounding, equal-sized periods
        //                 //   to prevent some older browsers from collapsing the
        //                 //   whitespace character (space) at insertion time
        //                 // white-space:pre ensures no text wrapping will occur
        //                 '<td style="font:999px serif;white-space:pre">' +
        //                     // font combines font-size and font-family
        //                     // Font size 999px differentiates fallback fonts
        //                     // Using font size in pixels prevents possible
        //                     //   failure due to zero-sized default page fonts
        //                     '.<span style="font:999px ' +
        //                         // Generic fonts should be quote-less
        //                         //   (except in IE6 and IE7, due to bug)
        //                         (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
        //                         // Fallback font sizes text differently from
        //                         //   the adjacent div until the font has loaded
        //                         ',serif">' +
        //                             // A single space is the text default
        //                             (options.sampleText || ' ') +
        //                     '</span>.' +
        //         // Closing tags for <td>, <tr>, and <tbody> are implied
        //         '</table>' +
        //         '<table style=position:absolute;bottom:999%;right:999%;width:auto>' +
        //             '<tr>' +
        //                 '<td style=position:relative>' +
        //             '<tr>' +
        //                 '<td style="font:999px serif;white-space:pre">' +
        //                     '.<span style="font:999px ' +
        //                         (options.generic ? '' : "'") + fontName + (options.generic ? '' : "'") +
        //                         ',sans-serif">' +
        //                             (options.sampleText || ' ') +
        //                     '</span>.' +
        //         '</table>'
        // );
    }

    // If the font is already loaded, tryFinish will have already destroyed the root2 reference, so no need to insert iframes
    if (root2) {
        if (process.env.isTest) {
            window.reporter.iframesCreated(fontNameCopy);
        }

        if (!process.env.isLegacy) {
            // appendChild returns the iframe, allowing style usage inline
            // The iframe's width only needs to be relative to the parent's
            //   Since it is not absolutely positioned, the width of the iframe will influence the overall width of the parent div
            //   However, that influence is relative to the sample text's width, so this still works
            root1.appendChild(
                // Save bytes by assigning the node reference inside the appendChild function
                // The fontName data has already been consumed, so it can be reused for an iframe reference
                fontName = document.createElement('iframe')
            ).style.width = '111%';

            // contentWindow becomes available upon DOM insertion
            // Assigning a non-closure function to onresize prevents the possibility of memory leaks through event handlers
            fontName.contentWindow.onresize = tryFinish;

            // By reusing the fontName (via reassignment), the DOM reference to the first iframe is broken, reducing memory leak potential
            root2.appendChild(fontName = document.createElement('iframe')).style.width = '111%';
            fontName.contentWindow.onresize = tryFinish;
        }

        if (process.env.isLegacy) {
            root1.firstChild.firstChild.firstChild.appendChild(
                fontName = document.createElement('iframe')
            ).style.cssText = 'right:111%;bottom:111%;position:absolute;width:111%';

            if (fontName.attachEvent) {
                fontName.contentWindow.attachEvent('onresize', tryFinish);
            }
            else {
                fontName.contentWindow.onresize = tryFinish;
            }

            root2.firstChild.firstChild.firstChild.appendChild(
                fontName = document.createElement('iframe')
            ).style.cssText = 'right:111%;bottom:111%;position:absolute;width:111%';

            if (fontName.attachEvent) {
                fontName.contentWindow.attachEvent('onresize', tryFinish);
            }
            else {
                fontName.contentWindow.onresize = tryFinish;
            }

            // // The fontName value has already been used, reuse for reference
            // // Save bytes by creating and assigning the iframe inside call
            // // Save bytes by duplicating the deeply nested DOM insertion
            // // appendChild returns the iframe, allowing style usage inline
            // // position:absolute prevents the iframe from influencing the
            // //   table's width
            // // Some IE browsers will generate scrollbars if the iframe
            // //   isn't positioned to the top-left
            // // The iframe's width only needs to be relative to the parent's
            // root.firstChild.firstChild.firstChild.firstChild.appendChild(
            //     fontName = document.createElement('iframe')
            // ).style.cssText = 'position:absolute;bottom:999%;right:999%;width:999%';

            // // contentWindow becomes available upon DOM insertion
            // // Assigning a non-closure function to onresize prevents the
            // //   possibility of memory leaks through event handlers
            // // Older IE browsers require iframe onresize event handlers
            // //   to be attached via attachEvent
            // if (fontName.attachEvent) {
            //     fontName.contentWindow.attachEvent('onresize', tryFinish);
            // }
            // else {
            //     fontName.contentWindow.onresize = tryFinish;
            // }

            // // By reusing the fontName (via reassignment), the DOM reference
            // //   to the first iframe is broken, reducing memory leak potential
            // root.lastChild.firstChild.firstChild.firstChild.appendChild(
            //     fontName = document.createElement('iframe')
            // ).style.cssText = 'position:absolute;bottom:999%;right:999%;width:999%';

            // if (fontName.attachEvent) {
            //     fontName.contentWindow.attachEvent('onresize', tryFinish);
            // }
            // else {
            //     fontName.contentWindow.onresize = tryFinish;
            // }
        }

        if (!process.env.isTest) {
            // Because of iframe loading nuances, sometimes the font can finish loading after the root is inserted, but before the onresize
            //   event handler can be added to an iframe, creating a potential for a missed resize event
            // This setTimeout gives the browser an additional chance to catch a font load after returning control to the browser
            // By assigning the result of setTimeout (a timeout ID) to the fontName, the DOM reference to the second iframe is broken, reducing memory leak potential
            fontName = setTimeout(tryFinish);
        }

        if (process.env.isTest)
        {
            // When testing, report that this timeout was used
            fontName = setTimeout(function () {
                if (root1)
                {
                    window.reporter.requiredExtraTimeout(fontNameCopy);
                    tryFinish();
                }
            });
        }
    }
};
