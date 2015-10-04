window.onfontready = function (fontName, onReady, options) {
    // Inspiration
    // Built with the desire to immitate fontfaceobserver without such a large
    //   code size cost. ( https://github.com/bramstein/fontfaceobserver )
    // Initially built as a test when debugging an obscure rendering bug in
    //   Safari. ( https://github.com/bramstein/fontfaceobserver/issues/35 )
    // The implementation's technique was inspired by Back Alley Coder's
    //   Element Resize Detector.
    //   ( http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/ )

    // Interface
    // `fontName` - custom font name provided in the @font-face.
    // `onReady` - callback function called when font is loaded and parsed.
    // `options` - additional, optional settings.
    // `options.sampleText` - text string used as a test string.
    //    For non-latin fonts, this can provide a more accurate font test.
    // `options.fontStyles` - string of css styles to apply to the font such as
    //    `font-weight`, `font-style`, and `font-variant` to match with the usage
    //    when these options can change which @font-face is requested
    // `options.timeoutAfter` - milliseconds to wait before giving up and calling
    //    the `options.onTimeout` callback. This function will wait indefinitely
    //    if `options.timeoutAfter` is unset or 0.
    // `options.onTimeout` - supplied callback called after `options.timeoutAfter`
    //    milliseconds have elapsed.
    options = options || {};

    // This noop function will serve as the tail end of a currying chain.
    // `shutdowns` is reassigned each time build is called,
    //    each previous function calling the last one, looping without a loop.
    function shutdowns() {}

    // `boxes` need only be an empty object: an area to attach keys to.
    // Defining it as a named local function, it provides an object reference
    //   while a repeating the above gzip-friendly pattern of `function x(){}`.
    function boxes() {};

    // Unsent arguments are used as local variables to avoid the `var` cost.
    function build(fallbackFont, box, obj, pastShutdown) {

        // How It Works
        // A div and an object are created.
        // The div is designed to be as wide as the text.
        // The object is designed to be as wide as the div.

        // Each fallback font has a unique second letter, usable as keys.
        // An extra local reference to `box` is more compact in later code.
        // Double assignment here is safe because all identifiers are defined.
        boxes[fallbackFont[1]] = box = document.createElement('div');
        obj = document.createElement('object');

        // How It Works
        // By equating the width of the object to the text width of the div,
        //   the object becomes resized any time the text width changes.

        // The styles that can be shared by both are repeated for gzip reasons.
        // `right` is set to 0 to ensure a horizontal scrollbar cannot appear
        //    by starting on the right of the screen and moving left.
        // Similarly, the `bottom` is set to 0 to ensure a vertical scrollbar
        //    will not appear no matter how tall the font is.
        // `obj` styles should more accurately use `display:block`.
        box.style.cssText = 'display:inline-block;position:absolute;bottom:0;right:0;opacity:0;white-space:nowrap;font:100px ' + fallbackFont + ';' + (options.fontStyles || '');
        obj.style.cssText = 'display:inline-block;position:absolute;bottom:0;right:0;width:100%;';

        // How It Works
        // Some arbitrary, but representative text is used to give many
        //   different widths in different fallback fonts.
        // When the real tested font is loaded and parsed, the lengths will
        //   all become equal because they have the same text and font.

        // The text used for sizing need only be a good representative text,
        //   it does not matter how long it is, only that it is not empty and
        //   it only contains characters defined in the custom font.
        // The default English representative is the object's `type`.
        obj.type = 'text/html';
        box.innerHTML = options.sampleText || obj.type;

        document.body.appendChild(box);

        // Generating a chain of shutdown functions by storing past references.
        pastShutdown = shutdowns;
        shutdowns = function() {
            pastShutdown();

            // These functions could store references in their closures.
            //   To prevent memory leaks, these are explicitly unassigned.
            // Since these `obj` will be immediately destroyed, by removing
            //   box, what they are assigned to does not matter.
            obj.contentDocument.defaultView.onresize = obj.onload = 0;

            // Since the assignment location is known, the parent of box need
            //   not be consulted to know where it should be removed from.
            document.body.removeChild(box);
        };

        // How It Works
        // The object tag represents a browsing context, like an iframe,
        //   but cheaper. The resize event is triggerable on it.
        // The resize event will be triggered once the font loads and is fully
        //   parsed by the browser. Waiting for this moment prevents FOIT.
        // By checking all instances for the same width value through the
        //   `left` proxy, the font is guaranteed loaded and parsed.

        // Some browsers do not immediately set their `contentDocument`,
        //   so the `onresize` assignment must wait for `onload`
        obj.onload = function() {

            // Here is another local variable using arguments.
            obj.contentDocument.defaultView.onresize = function(serifRight) {

                // Placing `getBoundingClientRect()` inline twice would
                //   be more compressable, but it is too expensive.
                serifRight = boxes.a.getBoundingClientRect().left;

                // The width is not needed. The `left` value will reflect
                //   differing widths, since the `right` styles all equal 0.
                // The values need only be equal to each other.
                // Since these are all known to be numbers, `==` is sufficient.
                if (boxes.a.getBoundingClientRect().left == serifRight &&
                    boxes.o.getBoundingClientRect().left == serifRight)
                {
                    shutdowns();
                    onReady();
                }

                // Note: The WebKit fallback bug may cause resize events even
                //   when the font has not yet been fully parsed, so the test
                //   cannot conclude upon the first resize event, nor after
                //   just three.
                // If a false negative situation occurs due to failure to
                //   specify a correct sampleText string, and no timeoutAfter
                //   value greater than 0 is set, the test divs, objects, and
                //   their event listeners will remain on the page.
                // ( https://bugs.webkit.org/show_bug.cgi?id=76684 )
            };

            // Without also setting the fallback font, the text will fallback
            //   to the cascaded fallback font, which is usually the same
            //   across all three tests, creating a false-positive.
            box.style.fontFamily = fontName + ',' + fallbackFont;
        };

        // What webpage does not matter, so a blank page is used.
        obj.data = 'about:blank';

        box.appendChild(obj);
    }

    // How It Works
    // All three commonly defined generic fonts are used as fallbacks.
    // No matter what browser/language/region, these fonts should have very
    //   different widths for most text.
    // To ensure a specific text is checked, use the `sampleText` option.

    // There will always be exactly these three calls.
    // Arrays and loops are unnecessary.
    build('serif');
    build('sans-serif');
    build('monospace');

    // Since `timeoutAfter` is a number, the value `0` means, 'no timeout'
    //   which also evaluates to false
    if (options.timeoutAfter)
    {
        setTimeout(function() {

            // Even though the loader is giving up, it needs to clean up after
            //   itself. Otherwise, `shutdowns` could have been a variable
            //   local to the `build` function
            shutdowns();

            // To avoid a TypeError when `onTimeout` is not provided while
            //   `timeoutAfter` is provided, a noop function is needed.
            // Just such a noop function is available above: the `boxes`
            //   function created for use as an object is also used here.
            (options.onTimeout || boxes)();

        }, options.timeoutAfter);
    }
};