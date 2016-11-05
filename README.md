# onfontready 1.1.0
Font load and parse detection with minimal size and maximum compatibility.


## Features
* Can [create sophisticated font loading experiences](docs/recipesAndUsagePatterns.md) for pages, helping prevent [FOIT or FOUT](https://www.filamentgroup.com/lab/font-events.html).
* Detects all known fonts including [generic font families](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/), [zero-width fonts](https://github.com/adobe-fonts/adobe-blank), and other [weird fonts](http://processingjs.nihongoresources.com/the_smallest_font/).
* Supports IE9+, Edge, Chrome, Firefox, Safari, and Opera.
* Supports IE6+, Edge, Chrome, Firefox, Safari, and Opera with [`legacy` version](dist/onfontready.legacy.js).
* 371 bytes gzipped (or 444 bytes for `legacy`). More than 3.5 times smaller than [FontFaceObserver](https://github.com/bramstein/fontfaceobserver). Fantastic for inlining!
* Uses unopinionated callback-based architecture. Easily extended to other tools and architectures, like Promises with the [Promise shim](docs/promiseShimUsage.md).
* Tons of [Documentation](docs/README.md) and [Examples](docs/recipesAndUsagePatterns.md).
* Available as a CommonJS module or window global.
* No dependencies or polyfills needed inside a browser context.


## Install

Installation via [NPM](https://nodejs.org/en/):

```shell
npm install --save onfontready
```

Installation via [yarn](https://yarnpkg.com/):

```shell
yarn add onfontready
```

Pre-built distribution versions from the `dist` directory:

* [Modern version](dist/onfontready.js)
* [Legacy version](dist/onfontready.legacy.js)
* [Modern version, minified](dist/onfontready.min.js)
* [Legacy version, minified](dist/onfontready.legacy.min.js)


## Basic Usage

Here is a very simple example usage that prevents FOIT, but will timeout the font loading attempt after 5 seconds. For more advanced usage, read [Recipes and Usage Patterns](docs/recipesAndUsagePatterns.md).

1. Import the desired font.

    * Describe a `@font-face` in CSS. ([Using Font-Face at CSS-Tricks](https://css-tricks.com/snippets/css/using-font-face/)).

        ```css
        @font-face {
            font-family: 'MyWebFont';
            src: url('myTheme/fonts/webfont.woff2') format('woff2'),
                 url('myTheme/fonts/webfont.woff') format('woff');
        }
        ```

    * Or import the font using a web font service, such as [Google Fonts](https://www.google.com/fonts).
        ```html
        <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">
        ```

2. Include `onfontready`.

    * Inline `onfontready` at the bottom of the HTML (recommended).

        ```html
        <html>
            ...
            <script>
                // From onfontready.min.js
                window.onfontready=...;
            </script>
        </html>
        ```

    * Or use script src to import `onfontready` at the bottom of the HTML.

        ```html
        <html>
            ...
            <script src="dist/onfontready.min.js"></script>
        </html>
        ```

    * Or include `onfontready` into Javascript codebase via CommonJS.

        ```javascript
        var onfontready = require('onfontready');
        ```

3. Call `onfontready` with appropriate options. This pattern attempts to load the font, but will timeout after 5 seconds. Read [Recipes and Usage Patterns](docs/recipesAndUsagePatterns.md) for more options and usage patterns.

    ```javascript
    onfontready('MyWebFont', function() {
        document.documentElement.className += " fontLoaded";
    }, {
        timeoutAfter: 5000, // 5 seconds in milliseconds
        onTimeout: function() {
            document.documentElement.className += " fontNotLoaded";
        }
    });
    ```

4. Define actions to take upon successful load (`onReady` is called) and/or load failure (`options.onTimeout` is called). In this pattern, `fancyFontElement` initially uses a sans-serif font. If the font loads successfully, the element will use the MyWebFont font. If the font fails to load, the element will use the monospace font and have grey text.

    ```css
    .fancyFontElement {
        font-family: sans-serif;
    }

    .fontNotLoaded .fancyFontElement {
        font-family: monospace;
        color: #ddd;
    }

    .fontLoaded .fancyFontElement {
        font-family: 'MyWebFont', sans-serif;
    }
    ```

There are many other patterns possible. For example:

* Cookies or localStorage APIs can be used to optimize for second load.
* Emulate font loading behavior of other browsers.
* FOUT flickering can be prevented on first load.
* Generic font family support can be detected.
* Local installs of fonts can be detected.
* Multiple fonts can be loaded or timed out as a unit.

Read [Recipes and Usage Patterns](docs/recipesAndUsagePatterns.md) for more.


## API

By default, the `onfontready` function is attached to the `window` object. Using CommonJS, the function becomes available via the `require()` syntax. The function has two required arguments and one optional argument.

```javascript
onfontready(fontName, onReady, [options={}])
```

* `fontName` - (string) Name used in `@font-face` declaration, font name on the local client machine, or generic font family name.
* `onReady` - (function callback) Called upon successful detection of the font's load and parse by the browser. No parameters.
* `options` - (Object) Optional object for settings.
  - `options.timeoutAfter` - (number) Milliseconds waited before calling `options.onTimeout` callback. `onfontready` will wait indefinitely if `options.timeoutAfter` is unset or 0. Negative numbers are allowed and act as a ["fast" timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified).
  - `options.onTimeout` - (function callback) Called after `options.timeoutAfter` milliseconds have elapsed without an `onReady` call.
  - `options.generic` - (boolean) Causes `onfontready` to detect generic font families like fantasy, cursive, san-serif, or BlinkMacSystemFont if set to `true`.
  - `options.sampleText` - (string) Text used for font width testing. This option should only be used for fonts that have no space character. There is only [one known font](http://processingjs.nihongoresources.com/the_smallest_font/) without a space character.


## Foundational Structure
`onfontready` only detects when fonts are loaded and parsed by a browser. It is intended to do only one thing, and serve as the foundation for more sophisticated tools.

* `onfontready` does not attempt to initiate font loads itself via ajax as the [CSS Font Loading API](https://drafts.csswg.org/css-font-loading/#font-face-set-load) does.
* `onfontready` does not feature Promise support, though [Promise support](docs/promiseShimUsage.md) can be added with a [simple shim](src/onfontready.promiseshim.js).
* `onfontready` does not provide tools for loading or timing out fonts as a single unit, though [multi-font support](docs/multiFontDetection.md) can be added using the [`onfontsready` function](src/onfontsready.js).


## Compression
`onfontready` has been [code-golfed](https://en.wikipedia.org/wiki/Code_golf) for gzip output size, not minified size. It is probably the smallest font detection library possible without `setTimeout` polling. To achieve this, `onfontready` contains some 'bad-practice' code structures and lots of seemingly unnecessary repetition. [Code should always be gzipped](https://css-tricks.com/the-difference-between-minification-and-gzipping/), so the gzip size is ultimately more important than the minified size.

As this table demonstrates, `onfontready` is significantly smaller than comparable font detection libraries. All values are in bytes.

| Compression | `onfontready` | `onfontready` legacy | FontFaceObserver ◦ |
|-------------|---------------|----------------------|--------------------|
| Minified *  | 901           | 1393                 | 3981               |
| gzip †      | **371**       | **444**              | **1479**           |
| zopfli ‡    | 368           | 434                  | 1463               |
| brotli ¶    | 277           | 327                  | 1209               |

\* - [UglifyJS](https://github.com/mishoo/UglifyJS2) was used for minification.  
† - gzip level 6, the default compression level.  
‡ - [Zopfli](https://en.wikipedia.org/wiki/Zopfli), an exhaustive search compression. It typically produces the smallest possible gzip-compatible output.  
¶ - [Brotli](https://en.wikipedia.org/wiki/Brotli), a new higher-performing compression available to some modern browsers over HTTPS connections.  
◦ - [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) Standalone version 2.0.5 included for comparison. FontFaceObserver was already minified using the [Google Closure compiler](https://developers.google.com/closure/compiler/). For the table above, the minified code was run through UglifyJS to further compress it. Without UglifyJS, the compressed sizes would be larger for FontFaceObserver.

To learn more, read about the [Compression Techniques](docs/compressionTechniques.md) used and read through the [fully-commented source code](src/onfontready.js).


## Motivation
I was attempting to build a website with a [size budget of less than 14KB gzipped](https://www.filamentgroup.com/lab/performance-rwd.html) for all HTML, CSS, JS, SVGs, and some inline images. I encountered a strange issue with inline SVGs (described below), which prompted me to research font loading in detail. The library I had been using, [FontFaceObserver](https://github.com/bramstein/fontfaceobserver), while small, still accounts for over 1KB when gzipped, which was a huge dent in my size budget. Using ideas from Back Alley Coder's [Element Resize Detector](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/), font load detection can be done on any browser without resorting to setTimeout polling at a much smaller size.


## Considerations
* Several missing features in IE6, IE7, and IE8 necessitate the use of the `legacy` version of `onfontready`. IE9+ and all modern browsers can use standard `onfontready`. If IE8 or lower support is desired, use the `legacy` version.
* Standard `onfontready` must create styled div and iframe elements. The `legacy` version of `onfontready` uses div, iframe, table, tbody, tr, and td tags. Any CSS styles applied via stylesheets or style tags that are applied globally to these elements, as well as any styles that directly influence page fonts (such as `body { font-size: 0; }`) may interfere with the font load detection. Please use CSS classes when specifying styling behavior for these elements to avoid incorrect detection.
* `onfontready` takes steps to produce reasonable results even if the library is used incorrectly. However, IE6 and IE7 have several quirks when dealing with fallback fonts and generic font names that can cause some unintended results when using `onfontready` incorrectly. For full details, see the IE6 and IE7 notes in the [Main Tests](tests/mainTests/index.html).


## Known SVG Issue
A strange rendering bug can occur in Safari. This bug was the inspiration for the creation of `onfontready`.

In Safari, if...

1. A font is switched at some critical moment during the page load process (such as with a font load detection library like `onfontready`), and
2. The page contains inline SVGs that use remote SVG resources containing either SVG masks or SVG filters, and
3. The remote reference SVG is positioned absolute or fixed, then
4. The custom font may either render as invisible or as the fallback font until the next page repaint.

[More details here](https://github.com/bramstein/fontfaceobserver/issues/35). This can be mitigated by applying `style="display:block;height:0"` to the inline SVG tag acting as the remote SVG, rather than trying to absolutely position it.


## Future Plans
* Add ES module support once tooling becomes realistic.
* Produce a new modern version specifically for browsers with ES6 (ES2015) native support as the world switches to those browsers.
* Make note about the upcoming [font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) feature, which can alleviate the need for much of `onfontready` in very new browsers.
* Add support for [ResizeObserver](https://developers.google.com/web/updates/2016/10/resizeobserver)-based detection when it becomes more widely supported, using the iframe resize method as the fallback.
* Investigate source-code permutation techniques to generate the smallest possible compressed sizes by mere rearrangement of order-independent code and alternate equivalent structures.
