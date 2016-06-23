# onfontready 1.0.2
Browser-based font load and parse detection with minimal size and maximum compatibility.


### Features
* Can be used to [prevent FOIT](https://www.filamentgroup.com/lab/font-events.html) or to create a more complex font loading experience
* Ridiculous browser support (IE9+, Edge, Chrome, Firefox, Safari, Opera, plus IE6, IE7, and IE8 with `legacy` version)
* Ludicrously small, at just 417 bytes (gzip -6), or 498 bytes (gzip -6) for the `legacy` version, GREAT for inlining
* Completely unopinionated (simple callback model, no Promises or other polyfilled structures)
* CommonJS compatible (but only works in a browser context)
* No dependencies other than a browser context


### Install

```
npm install --save onfontready
```


### Usage

In the CSS, describe the desired `@font-face`. Read [CSS-Tricks' Page on Font-Face](https://css-tricks.com/snippets/css/using-font-face/).

```css
@font-face {
    font-family: 'MyWebFont';
    src: url('myTheme/fonts/webfont.eot');
    src: url('myTheme/fonts/webfont.eot?#iefix') format('embedded-opentype'),
         url('myTheme/fonts/webfont.woff2') format('woff2'),
         url('myTheme/fonts/webfont.woff') format('woff'),
         url('myTheme/fonts/webfont.ttf')  format('truetype'),
         url('myTheme/fonts/webfont.svg#svgFontName') format('svg');
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
    },
    sampleText: 'Hello World'
});
```

The `onReady` and `onTimeout` callbacks can be used to attach classes to the document element, which can trigger elements in the page to change over to the custom web font using styles like this:

```css
.fancyFontElement {
    font-family: sans-serif;
}

.fontNotLoaded .fancyFontElement {
    font-family: sans-serif;
    color: #ddd;
}

.fontLoaded .fancyFontElement {
    font-family: 'MyWebFont', sans-serif;
}
```

This is the basic usage. More interesting patterns can make use of localStorage or cookies to optimize for second load, optimize for first load, or emulate font display behavior from previous browsers.


### API

The `onfontready` function is attached to the `window` object unless required directly via CommonJS-style. It has two required arguments and one optional argument.

```javascript
onfontready(fontName, onReady, [options={}])
```

* fontName - text name used in the `@font-face` declaration
* onReady - function callback that will be called upon successful detection of the font's load and parse by the browser
* options - an optional object with several settings
  - options.sampleText - text string added to the test string (defaults to "onfontready"). If specifying a font that does not contain the characters in the default text string, sampleText must be specified to correctly detect the font load and parse. Failing to do so will result in a false negative, where the font may be ready, but `onfontready` may be unable to detect that it is ready.
  - options.timeoutAfter - milliseconds to wait before giving up and calling the `options.onTimeout` callback. `onfontready` will wait indefinitely if `options.timeoutAfter` is unset or 0.
  - options.onTimeout - supplied callback called after `options.timeoutAfter` milliseconds have elapsed.


### Compression
The code for `onfontready` has been [code-golfed](https://en.wikipedia.org/wiki/Code_golf) for gzip compression. There are numerous 'bad-practice' code structures and lots of seemingly unnecessary repetition. However, the code is designed to be as small as possible after running it through standard [UglifyJS2](https://github.com/mishoo/UglifyJS2) and then gzipping it. Standard gzip compression (usually level 6) was used when building the library. The code, in its current form, gzips to 417 bytes (or 498 bytes for `legacy` version) at standard gzip level 6. Using [zopfli](https://en.wikipedia.org/wiki/Zopfli), the smallest possible gzip-compatible size, creates a version at 414 bytes (or 490 bytes for `legacy` version). Using [brotli](https://en.wikipedia.org/wiki/Brotli), a new higher-performing compression available to some modern browsers over HTTPS connections, creates a version at 321 bytes (or 379 bytes for `legacy` version). Read the comments in the source code to understand the various hacks and tricks used.


### Why?!
I was attempting to build a website with a [size budget of less than 14KB gzipped](https://www.filamentgroup.com/lab/performance-rwd.html) for all HTML, CSS, JS, SVGs, and some inline images. I encountered the Known Issue (below) with inline SVGs, which prompted me to research font loading in detail. The library I had been using, [fontfaceobserver](https://github.com/bramstein/fontfaceobserver), while small, still accounts for over 1KB when gzipped, which was a huge dent in my size budget. Using ideas from Back Alley Coder's [Element Resize Detector](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/), font load detection can be done on any browser without resorting to setTimeout polling at a much smaller size.


### Considerations
* Several missing features in IE6, IE7, and IE8 necessitate the use of the `legacy` version of `onfontready`. IE9+ and all modern browsers can use standard `onfontready`. If IE8 or lower support is desired, use the `legacy` version.
* Standard `onfontready` must create a div and iframe element. Any CSS styles applied via stylesheets or style tags that are applied globally to divs or iframes may interfere with the detection. Likewise, the `legacy` version of `onfontready` uses div, iframe, table, tbody, tr, or td tags. Globally applied CSS styles applied to these elements may interfere with the detection. Please use CSS classes when specifying styling behavior for these elements to avoid incorrect detection.
* `onfontready` cannot be used to detect whether a generic named font-family is ready. These following fonts, and probably more, must be specified without quotes, but `onfontready` uses quotes to account for [fonts with exotic names or made up of reserved words](https://mathiasbynens.be/notes/unquoted-font-family). However, detecting such a font is usually unnecessary because they will already be ready, due to their special status in the browser.
  * `serif`
  * `sans-serif`
  * `monospace`
  * `fantasy`
  * `cursive`
  * `menu`
  * `-apple-system`
  * `BlinkMacSystemFont`
  * others?
* IE6 uses same-sized box glyphs for missing glyphs in custom fonts. False-positive calls to `onReady` may occur if a custom font is missing glyphs in the `options.sampleText`. There is no feasible fix, but this is incorrect library usage anyway.
* IE7 uses serif font glyphs for missing glyphs in custom fonts, regardless of the specified fallback font. False-positive calls to `onReady` may occur if a custom font is missing glyphs in the `options.sampleText`. There is no feasible fix, but this is incorrect library usage anyway.


### Known Issues

A strange rendering bug can occur in Safari. The bug occurs if...

1. A font is switched using `onfontready` during the page load process, and
2. The page contains inline SVGs that use remote SVG resources containing either SVG masks or SVG filters, and
3. The remote reference SVG is positioned absolute or fixed, then
4. The custom font may either rendered as invisible or as the fallback font until the next browser repaint.

[More details here](https://github.com/bramstein/fontfaceobserver/issues/35). This can be mitigated by applying `style="display:block;height:0"` to the inline SVG tag acting as the remote SVG, rather than trying to absolutely position it.


### Future Plans
* Add some recipes for how `onfontready` might be used for various font loading experiences
