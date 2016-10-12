# How it Works

`onfontready` relies on the relative widths of the font being detected and at least two other fonts.

## Prerequisites

This document assumes basic knowledge of CSS, fonts, and browser loading patterns. Here are some articles that will inform the reader on those subjects.

* [Defining a Web Font](https://css-tricks.com/snippets/css/using-font-face/)
* [Generic Font Families](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#Values)
* [General Web Font Usage Considerations](http://www.html5rocks.com/en/tutorials/webfonts/quick/)
* [Web Font Techniques and Potential Problems](http://www.paulirish.com/2009/bulletproof-font-face-implementation-syntax/) - including discussion of the little-used `local` value
* [FOUT, FOIT, and FOFT Issues](https://css-tricks.com/fout-foit-foft/)
* [Modern Approach to Controlled Font Loading](https://www.filamentgroup.com/lab/font-events.html)
* [Browser Font Rendering Behavior](https://developers.google.com/web/updates/2016/02/font-display?hl=en) - part of a discussion about upcoming CSS `font-display` property

## Basic Idea

When a browser sees a list of fonts in a `font-family` or `font` property, it will attempt to use the first one in the list. If that font isn't available because the font is still downloading, or completely unavailable, the browser will try the next font as a fallback. And so it will proceed down the list of fallback fonts until it encounters a generic font family or the end of the list. Though some [browsers use different techniques](https://developers.google.com/web/updates/2016/02/font-display?hl=en) to control the visual display of fonts that it knows are still loading, `onfontready` can take advangage of the text geometry of fallback fonts to determine if the web font being detected has been loaded and parsed.

## Two Font Stacks

Consider the following HTML.

```html
<style>
.text1 {
    font-family: 'MyCustomFont', serif;
}

.text2 {
    font-family: 'MyCustomFont', monospace;
}
</style>
<span class="text1">hello</span>
<span class="text2">hello</span>
```

If `MyCustomFont` is not available, or still being loaded or parsed, fallback fonts will be used. The first span tag will use the `serif` generic font and the second span tag will use the `monospace` generic font. Even though the browser may hide the text itself, the width of the text will be determined by the width of the word "hello" in each span's generic fallback font. Because `serif` and `monospace` have different widths for the word "hello", the two span tags will also have different widths.

Once `MyCustomFont` becomes available, however, both span tags will have exactly the same width. Their fonts and contents now match exactly. Barring other interfering styles, they should be pixel-for-pixel identical, save for their location on the page.

`onfontready` simply provides a means to detect the difference in widths, along with a means to detect if the browser recently swapped the fallback font for the newly loaded web font.

## Detecting Font Swaps

There is no direct means for the page's Javascript to query the browser for the status or availability of a font, [at least not yet](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API). One cannot know if a font is already loaded or parsed directly. While measuring text widths on fallback stacks can detect at any given time if a font is available or not, there is no event that the browser will fire when it swaps one font for another. A method to detect the changing width of a tag's text is needed.

Other than upcoming APIs, there are three ways to do this:

1. Polling with `setTimeout`
2. Sized Container Scroll Events
3. Sized Iframe Resize Events

### setTimeout Polling

Using a `setTimeout` delay, repeatedly check the widths of two or more font stacks looking for equality. This is highly inefficient. If the delay is too short, the browser will be bogged down with blocking requests for DOM measurements. If the delay is too long, the library will be late detecting the readiness of the web font.

### Sized Container Scroll Events

The `resize` event only fires on the top-level context, which is the browser window object in most cases. However, the desire is to detect a resize on a specific element. Starting from an initially detected element size, a complex set of DOM elements can be set up to detect the resizing of a specific element. This is done by making two elements that have widths and heights calculated relative to their parent element. Using `position: absolute` and carefully controlling the overflow and scroll position, `scroll` events detect any size changes. If the parent element shrinks, one of the ruler elements will fire a `scroll` event. If the parent element expands, the other ruler element will fire a `scroll` event. The rulers must then be immediately reset relative to the new size, and the process begins again for the next resize occurance. This technique works well. It is very efficient for font-loading purposes. However, Internet Exporer 9 and lower simply do not detect `scroll` events unless they are initiated directly by the user (see [tests](../tests/scroll_based_resize_detection_test/index.html)). Setting up the rulers are relatively complex and prone to error. This technique is used by [Font Face Observer](https://github.com/bramstein/fontfaceobserver/).

### Sized Iframe Resize Events

Because an iframe has its own window context, it can detect `resize` events on itself. By ensuring that an iframe's size is relative to the width of a tag's text, any change to the text size will cause the iframe to fire a `resize` event. This is not memory-efficient due to the cost of starting up and shutting down an iframe context, even for a blank page. However, the technique is very well supported, working even in Internet Explorer 6. Furthermore, the technique is much simpler to implement and compresses very well. This technique was pioneered by [Back Alley Coder](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/) and is used by both the standard and `legacy` versions of `onfontready`.

### Space Character

Previous versions of `onfontready` had to rely on a special test string for detecting widths. The selection of the test string was very important for some fonts. If a font contained only a subset of characters, skipping ASCII for example, the default test string of "onfontready" would use fonts from the fallback font instead. This was undesirable, because if even one letter in the test string was not found in the web font, the test string would forever remain unequal in width, even if the web font finished loading. To account for this, `onfontready` versions prior to `2.0.0` allowed the specification of a `sampleText` value. The library user could specify their own custom text to measure, hopefully containing only characters that the web font contained. The concept was error prone, but effective. It also relied on the assumption that a given string will always have a different width in `serif`, `sans-serif`, and `monospace`. While it is highly probable that the font widths will be different, it is not impossible for them to all share the same width for a carefully constructed test string.

More recently, the common availability of the humble [space character](https://en.wikipedia.org/wiki/Whitespace_character) (ASCII #32) revealed its usefulness. With exactly [one known special-case exception](http://stackoverflow.com/q/39172165/195068), every font available or generated contains the space character. Every browser appears to have vastly different space character widths for the `serif` and `monospace` generic font families (see [test data](../tests/space_character_sizes/fontsizes.txt)). With this knowledge, `onfontready` uses a single space as the test string, removing the need to specify a test string. In addition to simplifying library usage, this improvement reduced the size and memory usage of `onfontready` greatly.