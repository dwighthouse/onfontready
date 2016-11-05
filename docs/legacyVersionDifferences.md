# Legacy Version Differences

#### Doc Links
* [Recipes and Usage Patterns](recipesAndUsagePatterns.md)
    - [Handling Disabled Javascript](handlingDisabledJavascript.md)
    - [Promise Shim Usage](promiseShimUsage.md)
    - [Multi-Font Detection](multiFontDetection.md)
* [Legacy Version Differences](legacyVersionDifferences.md)
* [How to Break `onfontready`](howToBreakOnfontready.md)
* [How it Works](howItWorks.md)
* [Compression Techniques](compressionTechniques.md)
* [Building `onfontready`](buildingOnfontready.md)
* [Docs Home](README.md)

The `legacy` version of `onfontready` was designed to allow font load and parse detection in Internet Explorer 6, 7, and 8. The `legacy` version is forward-compatible with all known browsers. It only uses older, more compatible code structures that most browsers no longer need, and would be a waste to implement in the standard `modern` version.

## Inline Absolute Overflow
Modern browsers will allow absolutely positioned elements to be positioned relative to an inline (or inline-block) element that contains it. If available, this allows the sizing of an iframe based on the width of some text inside a div. If not, the absolutely positioned element's width will be based on the next highest relatively positioned parent (or the page). Without this feature, the only known automatic way to associate the size of text with the width of an element is to use a table.

The associated columns in successive rows in an HTML table are sized relative to each other. By including text in one, the adjacent table cell will be sized with an equivalent width so long as it doesn't contain anything that would cause its own width to change. By inserting an absolutely positioned element inside this cell, and setting the cell to relative positioning, the absolutely positioned element (the iframe) will be sizable relative to the text.

The only known browser with this issue is IE6. Absolutely positioned elements inside a block sized via text will always overflow their containers. There is no workaround. Thus, tables must be used instead of divs in the `legacy` version. See [tests](../tests/inlineAbsoluteOverflowTest/index.html).

## Fixed Positioning
Modern browsers support positioning elements with the value `fixed` in addition to `absolute`, `relative`, etc. Out-of-flow elements are needed for the library, and fixed positioning is sufficient for these cases. Fixed positioning also compresses better. However, [IE6 does not support fixed positioning](http://caniuse.com/#search=position%3Afixed). Thus, absolute positioning must be used in the `legacy` version. Furthermore, positioning of the absolute elements within the table must be more explicit to prevent unintentional scrollbars (see **iframe Positioning and Sizing** below).

## Initial Whitespace Collapse
At insertion time, even when specifying the style `white-space: pre;` on an element, some versions of Internet Explorer prior to IE9 will trim leading and trailing whitespace characters. These versions will also collapse the entire element's text if it only contains whitespace. This is a problem because, by default, `onfontready` uses a single space character as the text it measures. The browser may later restore the whitespace's width appropriately, but it can be incorrectly collapsed long enough to interfere with the tests.

To solve this, it is sufficient to surround the whitespace with some characters known to have widths. `onfontready` uses the period ("."). Unfortunately, simply surrounding the space character with periods could have negative consequences if the tested font does not contain the period character. In this scenario, the test would never complete, even after the font had loaded. To solve this, the outer text context is given a standard font size and family (`font: 999px monospace;` in `onfontready`). Then, an inner span element with the actual font test is styled and contains only the space character. Somehow, being both explicit about the span containing a space and having surrounding text in a known font causes these old Internet Explorer versions to correctly prevent the whitespace from collapsing.

The output looks something like this:

```html
...
<td style="font:999px monospace; white-space: pre;">
    .<span style="font:999px 'THE_FONT_NAME'"> </span>.
</td>
...
```

## iframe Positioning and Sizing
The `modern` version of `onfontready` can correctly associate an iframe's width relative to its container simply by specifying the width as `999%`. Though it will be outside the bounds of the parent, it is still guaranteed to change when the parent's width changes, which is sufficient for `onfontready`'s tests.

However, the usage of the table sizing method by the `legacy` version requires that the iframe be styled with `position: absolute; width: 999%;`. These styles are sufficient to do the tests, but it can sometimes cause horizontal scrollbars. To be safe, the more complete styles of `position: absolute; bottom: 999%; right: 999%; width: 999%;` are required. Fortunately, this is nearly identical to the style on the table element, so adding those extra styles does not affect the compressed size much.

## attachEvent Required
Some events can be assigned via the direct assignment (`element.onclick = function() { ... }`), but an iframe's `onresize` event is not one of them in IE 6, 7, and 8. This event requires the attachEvent. So instead of simply assigning to the event, a more complex mechanism must be used. 

So, while the `modern` version might use:

```javascript
iframe.contentWindow.onresize = callback;
```

The `legacy` version must use:

```javascript
if (iframe.attachEvent) {
    iframe.contentWindow.attachEvent('onresize', callback);
}
else {
    iframe.contentWindow.onresize = callback;
}
```


[◀ Back to Docs Home](README.md)
