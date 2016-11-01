# onfontready 1.1.0
Browser-based font load and parse detection with minimal size and maximum compatibility.


## Features
* Can be used to [prevent FOIT or FOUT](https://www.filamentgroup.com/lab/font-events.html) or to [create a more complex font loading experience](docs/recipesAndUsagePatterns.md) for pages
* Ridiculous browser support, supporting IE9+, Edge, Chrome, Firefox, Safari, Opera, and even IE6+ with [the `legacy` version](docs/legacyVersionDifferences.md)
* The smallest known font detection library at a ludicrously small 371 bytes gzipped (or 444 bytes gzipped in the [IE6+ supporting `legacy` version](docs/legacyVersionDifferences.md))
* With correct settings, it can detect all known fonts including [generic font families](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/), [zero-width fonts](https://github.com/adobe-fonts/adobe-blank), and other [weird fonts](http://processingjs.nihongoresources.com/the_smallest_font/)
* The simple, unopinionated, callback-based architecture that can easily be used as the basis of other tools and architectures, such as a [Promise-based architecture](docs/promiseShimUsage.md)
* Tons of [Documentation](docs/README.md) and [Examples](docs/recipesAndUsagePatterns.md)
* Can be used as CommonJS module or window global in a browser context
* No dependencies


## Install

Installation is primarily done via [NPM](https://nodejs.org/en/):

```
npm install --save onfontready
```

Or, use pre-built distribution versions from the `dist` directory:

* [Modern version](dist/onfontready.js)
* [Legacy version](dist/onfontready.legacy.js)
* [Modern version, minified](dist/onfontready.min.js)
* [Legacy version, minified](dist/onfontready.legacy.min.js)


## Basic Usage

In the CSS, describe the desired `@font-face`. Read [CSS-Tricks' Page on Font-Face](https://css-tricks.com/snippets/css/using-font-face/) for additional options.

```css
@font-face {
    font-family: 'MyWebFont';
    src: url('myTheme/fonts/webfont.woff2') format('woff2'),
         url('myTheme/fonts/webfont.woff') format('woff');
}
```

Or import a font with one of the many web font services, such as [Google Fonts](https://www.google.com/fonts).

Include the `dist/onfontready.min.js` script in the HTML, either by adding it as a remote source...

```html
<html>
...
<script src="js/onfontready.min.js"></script>
</html>
```

or by inlining it.

```html
<html>
...
<script>
// From js/onfontready.min.js
window.onfontready=...;
</script>
</html>
```

`onfontready` may also be included into an existing codebase using `require('onfontready')` (CommonJS syntax).

After `onfontready` is loaded on the page, call it with the appropriate options for the web font.

```javascript
window.onfontready('MyWebFont', function() {
    document.documentElement.className += " fontLoaded";
}, {
    timeoutAfter: 5000, // if not loaded after 5 seconds, timeout
    onTimeout: function() {
        // additional fallback options
        document.documentElement.className += " fontNotLoaded";
    }
});
```

The `onReady` and `onTimeout` callbacks can be used to attach classes to the document element, which can trigger elements in the page to change over to the custom web font using styles like this:

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

This is the basic usage. More interesting patterns can make use of localStorage or cookies to optimize for second load, optimize for first load, or emulate font display behavior from previous browsers. Read about [Recipes and Usage Patterns](docs/recipesAndUsagePatterns.md) to discover how to use `onfontready` for your project.


## API

The `onfontready` function is attached to the `window` object unless required directly via CommonJS-style. It has two required arguments and one optional argument.

```javascript
onfontready(fontName, onReady, [options={}])
```

* fontName - (string) The text name used in the `@font-face` declaration, the name of the font on the local client machine, or a generic font family name.
* onReady - (function callback) This callback will be called upon successful detection of the font's load and parse by the browser.
* options - (Object) An optional object with several settings:
  - options.timeoutAfter - (number) The number of milliseconds to wait before giving up and calling the `options.onTimeout` callback. `onfontready` will wait indefinitely if `options.timeoutAfter` is unset or 0. Negative numbers are allowed and act as [a near-instant timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified).
  - options.onTimeout - (function callback) This callback will be called after `options.timeoutAfter` milliseconds have elapsed without having called the `onReady` callback.
  - options.generic - (boolean) Set this option to `true` if and only if testing for the existance of a generic font family in a browser (such as `fantasy`, `cursive`, `san-serif`, or `BlinkMacSystemFont`)
  - options.sampleText - (string) Text used for font width testing. By default, it is set to a single space character (" "). The only use for this setting is when the tested font has no defined space character. There is only [one known font](http://processingjs.nihongoresources.com/the_smallest_font/) that does not have a space character, and it is unlikely to ever be used in a webpage, so this option can almost always be safely ignored.


## Foundational Structure
`onfontready` does not assume how it might be used. It purely detects when fonts are loaded and parsed by a browser. However, `onfontready` can be used as the core detection code upon which other, more complex and specific tools can be built.

* `onfontready` does not attempt to initiate font loads itself via ajax as the [CSS Font Loading API](https://drafts.csswg.org/css-font-loading/#font-face-set-load) does.
* `onfontready` does not feature Promise support, though [Promise support](docs/promiseShimUsage.md) can be added with a [simple shim](src/onfontready.promiseshim.js).
* `onfontready` does not provide tools to attempt to load or fail to load multiple fonts as one unit, though [multi-font support](docs/multiFontDetection.md) can be added in the form of [`onfontsready`](src/onfontsready.md). 


## Compression
The code for `onfontready` has been [code-golfed](https://en.wikipedia.org/wiki/Code_golf) for gzip compression. There are some 'bad-practice' code structures and lots of seemingly unnecessary repetition. However, the code is designed to be as small as possible after running it through standard [UglifyJS2](https://github.com/mishoo/UglifyJS2) and then gzipping it. Standard gzip compression (usually level 6) was used when building the library. The code, in its current form, gzips to 371 bytes (or 444 bytes for `legacy` version) at standard gzip level 6. Using [zopfli](https://en.wikipedia.org/wiki/Zopfli), the smallest possible gzip-compatible size, creates a version at 368 bytes (or 434 bytes for `legacy` version). Using [brotli](https://en.wikipedia.org/wiki/Brotli), a new higher-performing compression available to some modern browsers over HTTPS connections, creates a version at 277 bytes (or 327 bytes for `legacy` version). Read more about the [Compression Techniques](compressionTechniques.md) used in the library, or read through the [fully-commented source code](src/onfontready.js).


## Motivation
I was attempting to build a website with a [size budget of less than 14KB gzipped](https://www.filamentgroup.com/lab/performance-rwd.html) for all HTML, CSS, JS, SVGs, and some inline images. I encountered a strange issue with inline SVGs (described below), which prompted me to research font loading in detail. The library I had been using, [fontfaceobserver](https://github.com/bramstein/fontfaceobserver), while small, still accounts for over 1KB when gzipped, which was a huge dent in my size budget. Using ideas from Back Alley Coder's [Element Resize Detector](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/), font load detection can be done on any browser without resorting to setTimeout polling at a much smaller size.


## Considerations
* Several missing features in IE6, IE7, and IE8 necessitate the use of the `legacy` version of `onfontready`. IE9+ and all modern browsers can use standard `onfontready`. If IE8 or lower support is desired, use the `legacy` version.
* Standard `onfontready` must create styled div and iframe elements. The `legacy` version of `onfontready` uses div, iframe, table, tbody, tr, and td tags. Any CSS styles applied via stylesheets or style tags that are applied globally to these elements, as well as any styles that directly influence page fonts (such as `body { font-size: 0; }`) may interfere with the font load detection. Please use CSS classes when specifying styling behavior for these elements to avoid incorrect detection.
* `onfontready` takes steps to produce reasonable results even if the library is used incorrectly. However, IE6 and IE7 have several quirks when dealing with fallback fonts and generic font names that can cause some unintended results when using `onfontready` incorrectly. For full details, see the IE6 and IE7 notes in the [Main Tests](tests/mainTests/index.html).


## Known SVG Issue
A strange rendering bug can occur in Safari. This bug was the inspiration for the creation of `onfontready`.

The bug occurs if...

1. A font is switched at some critical moment during the page load process (such as with a font load detection library like `onfontready`), and
2. The page contains inline SVGs that use remote SVG resources containing either SVG masks or SVG filters, and
3. The remote reference SVG is positioned absolute or fixed, then
4. The custom font may either rendered as invisible or as the fallback font until the next page repaint.

[More details here](https://github.com/bramstein/fontfaceobserver/issues/35). This can be mitigated by applying `style="display:block;height:0"` to the inline SVG tag acting as the remote SVG, rather than trying to absolutely position it.


## Future Plans
* Add ES module support once tooling becomes realistic.
* Produce a new modern version specifically for browsers with ES6 (ES2015) native support as the world switches to those browsers.
* Make note about the upcoming [font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) feature, which can aleviate the need for much of `onfontready` in very new browsers.
* Add support for [ResizeObserver](https://developers.google.com/web/updates/2016/10/resizeobserver)-based detection when it becomes more widely supported, using the iframe resize method as the fallback.
* Investigate source-code permutation techniques to generate the smallest possible compressed sizes by mere rearrangement of order-independent code and alternate equivalent structures.
