# onfontready
Browser-based font load and parse detection with minimal size and maximum compatibility.

**onfontready**

* allows pages to become readable immediately by allowing complete control over when fonts display, allowing the [prevention of FOIT](https://www.filamentgroup.com/lab/font-events.html) or the creation of a more complex mid-load experience
* is based on the concepts described in bramstein's [fontfaceobserver](https://github.com/bramstein/fontfaceobserver), but with a more efficient implementation based on Back Alley Coder's [Element Resize Detector](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/)
* has no dependencies
* compresses to just over 0.5 kb when gzipped, easily suitable for inlining into the HTML
* is CommonJS compatible, but only works in a Browser context
* partially tested on IE9+, Chrome, Firefox, Safari, and Opera


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

Include the `dist/onfontready.global.min.js` script in the HTML, either by adding it as a remote source...

```html
<html>
...
<script src="myScriptsLocation/onfontready.global.min.js"></script>
</html>
```

or by inlining it.

```html
<html>
...
<script>
window.onfontready=function(t,e,n){function o(){}function i(){} ... (n.onTimeout||i)()},n.timeoutAfter)};
</script>
</html>
```

onfontready may also be included into an existing codebase using `require('onfontready')` (CommonJS syntax).


After onfontready is loaded on the page, call it with the appropriate options for the web font.

```javascript
window.onfontready('MyWebFont', function() {
    document.documentElement.className += " fontLoaded";
}, {
    timeoutAfter: 5000, // if not loaded after 5 seconds, timeout
    onTimeout: function() {
        // additional fallback options
        document.documentElement.className += " fontNotLoaded";
    },
    sampleText: 'MmOoIi|='
});
```

The `onReady` and `onTimeout` callbacks can be used to attach classes to the document element, which can trigger elements in the page to change over to the custom web font using styles like this:

```css
.fancyFontElement {
    font-family: sans-serif;
}

.fontLoaded .fancyFontElement {
    font-family: 'MyWebFont', sans-serif;
}
```


### API

The onfontready function is attached to the `window` object unless required directly via CommonJS-style. It has two required arguments and one optional argument.

```javascript
onfontready(fontName, onReady, [options={}])
```

* fontName - text name used in the `@font-face` declaration
* onReady - function callback that will be called upon successful detection of the font's successful load and parse by the browser
* options - an optional object with several settings
  - options.sampleText - text string added to the test string (defaults to 'text/html'). If specifying a font that does not contain the characters in the default text string, sampleText must be specified to correctly detect the font load and parse. Failing to do so will result in a false negative, where the font may be ready, but onfontready may be unable to detect that it is ready.
  - options.fontStyles - string of css styles to apply to the font such as `font-weight`, `font-style`, and `font-variant` to match with the usage when these options can change which @font-face is requested
  - options.timeoutAfter - milliseconds to wait before giving up and calling the `options.onTimeout` callback. onfontready will wait indefinitely if `options.timeoutAfter` is unset or 0.
  - options.onTimeout - supplied callback called after `options.timeoutAfter` milliseconds have elapsed.


### Build

onfontready is built with gulp and minified with uglify. Right now, the only command is `global` which creates the minified and unminified global versions of the script in the `dist/` folder.

```
gulp global
```


### Known Issues

* A strange rendering bug can occur on Safari if this library is used and switches fonts if the page contains inline SVGs that use remote SVG resources containing either SVG masks or SVG filters AND the remote reference SVG is positioned absolute or fixed. [More detail here](https://github.com/bramstein/fontfaceobserver/issues/35).
* IE8 and lower do not appear to work, though they should. More investigation is planned.


### Future Plans

* onfontsready multi-font load test/callback
* more testing, especially on legacy browsers
* more compression, once the timing of DOM operations are properly understood
