// Insert into page after onfontready to add a multi-font detection version

// * fontName : Array of font names used in `@font-face` declarations
// * onReady  : Function called upon successful font load and parse detection
// * options  : Optional parameters
// * options.timeoutAfter : Milliseconds to wait before giving up
//                          Triggers options.onTimeout call
//                          Unset or 0 will result in an indefinite wait
// * options.onTimeout    : Called after options.timeoutAfter milliseconds
//                            have elapsed without an onReady call
// * options.sampleText   : Text string used to test font loading
//                          Defaults to " " (space character)
//                          May be an array of strings matching the length of
//                            fontNames array, for individual font control
// * options.generic      : Boolean set to true if attempting to detect
//                            generic family font
//                          May be an array of booleans matching the length of
//                            fontNames array, for individual font control
// * fIterator            : Undefined variable used by function
// * finishedCount        : Undefined variable used by function
window.onfontsready = function (fontNames, onReady, options, fIterator, finishedCount) {
    // Ensure options is defined to prevent access errors
    options = options || 0;

    // Combine assignment for compression
    fIterator = finishedCount = 0;

    for (; fIterator < fontNames.length; fIterator++) {
        window.onfontready(fontNames[fIterator], function () {
            // fIterator was not counted down here because some font
            //   detections might operate synchronously
            // Prefix increment allows inline increment with comparison
            if (++finishedCount >= fontNames.length) {
                // All fonts have been loaded and parsed
                onReady();
            }
        }, {
            // The timeoutAfter is included here to force onfontready to
            //   shutdown the detection elements in the event of a timeout
            // The onTimeout callback is handled below
            timeoutAfter: options.timeoutAfter,
            sampleText: options.sampleText instanceof Array ? options.sampleText[fIterator] : options.sampleText,
            generic: options.generic instanceof Array ? options.generic[fIterator] : options.generic
        });
    }

    if (options.timeoutAfter && options.onTimeout) {
        setTimeout(function () {
            // Prevent timeout call if already finished
            if (finishedCount < fontNames.length) {
                // All comparisions to NaN are false, preventing onReady call
                // Combine two operations, setting finishedCount value first
                options.onTimeout(finishedCount = NaN);
            }
        }, options.timeoutAfter);
    }
};