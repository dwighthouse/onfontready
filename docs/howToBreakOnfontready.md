# Undetectable Fonts

#### Doc Links
* [Recipes and Usage Patterns](recipesAndUsagePatterns.md)
    - [Promise Shim Usage](promiseShimUsage.md)
    - [Multi-Font Detection](multiFontDetection.md)
* [Legacy Version Differences](legacyVersionDifferences.md)
* [How to Break `onfontready`](howToBreakOnfontready.md)
* [How it Works](howItWorks.md)
* [Compression Techniques](compressionTechniques.md)
* [Building `onfontready`](buildingOnfontready.md)
* [Docs Home](README.md)

If `onfontready` is used correctly with no misapplied options and run in a modern browser, it should be be able to detect all known fonts. There are some failure cases in IE6 and IE7 that are unavoidable (see [Main Tests](../tests/mainTests/index.html) for details). However, there are ways to construct a special font that would confuse it.

First of all, if a font contains a space character, then `onfontready` can detect it, even if that space character's width is zero. Thus, only fonts without a space character can possibly trick it.

When a font does not contain a space character, `onfontready` requires the option `sampleText` to be set to a string value of a character or characters that the font is known to support. However, there are three scenarios when doing so will still result in error.


## 1. Natural Zero-Width Characters
Some characters are naturally zero-width in most fonts. These include the various control characters, the newline (in most browsers), and other exotic characters. If these characters are zero-width in both fallback fonts, then `onfontready` will incorrectly assume that their equivalence means the tested font has been loaded.

Here are just some of the known zero-width characters in most browsers, via unicode numerical values (and ranges of values):

* 1-8
* 10-31
* 127-159
* 173
* 847
* 1159
* 1375
* 1425-1441


## 2. Equal Width Characters In Both Serif and Monospace Fonts
Some characters always have the same width, even in such different fonts as the browser's generic serif and monospace fonts. These mostly come in the form of mathematical symbols and non-English letters. Additionally, a font may specify a standard box glyph (the so-called 'tofu' glyph) if it does not have a glyph to display for a given character. Normally such tofu wouldn't be seen because the browser would fall back to another font. However, since these are generic fallback fonts, there are no further fonts to fall back to. If these generic fonts don't support it, then tofu glyphs can occur. Tofu glyphs are usually equivalent-width.

As with Scenario #1 above, since these characters are of equal width, `onfontready` may falsely assume the font has already been loaded.

Here is a small sampling of characters that share the exact same width in both serif and monospace fonts in one of my browsers (along with its unicode numerical value):

* ° - 176
* ± - 177
* µ - 181
* ÷ - 247
* Ɓ - 385
* Ƈ - 391
* ƈ - 392
* Ɗ - 394
* ƍ - 397
* Ɠ - 403
* Ɣ - 404
* ƕ - 405
* Ƙ - 408
* ƛ - 411
* Ƣ - 418
* ƣ - 419
* Ƥ - 420
* Ʀ - 422
* ƪ - 426
* Ƭ - 428
* Ʋ - 434
* Ƴ - 435
* ƴ - 436
* ƺ - 442
* Ƽ - 444
* ƽ - 445
* ƾ - 446
* ƿ - 447
* Ƕ - 502
* Ƿ - 503
* Ȝ - 540
* ȝ - 541
* ȡ - 545
* ȣ - 547
* ȴ - 564
* ȵ - 565
* ȶ - 566
* ɂ - 578
* Ƀ - 579
* Ʉ - 580
* Ʌ - 581
* Ɇ - 582
* ɇ - 583
* Ɉ - 584
* ɉ  - 585
* Ɋ - 586
* ɋ - 587
* Ɍ - 588
* ɍ - 589
* Ɏ - 590
* ɏ - 591
* ɕ - 597
* ɞ - 606
* ɣ - 611
* ɤ - 612
* ɬ - 620
* ɷ - 631
* ʆ - 646
* ʋ - 651
* ʐ - 656
* ʑ - 657
* ʓ - 659
* ʚ - 666
* ʛ - 667
* ʝ - 669
* ʤ - 676
* ʥ - 677
* ʨ - 680
* ˠ - 736
* Ͱ  - 880
* ͱ  - 881
* Ͳ - 882
* ͳ  - 883
* ʹ - 884
* ͵ - 885
* Ͷ - 886
* ͷ - 887


## 3. Carefully Constructed English Strings
It is infeasible, but possible, to construct a `sampleText` string of more than one character that together results in an equal width string, in spite of the fact that each individual letter in the string might be a different width. Doing so would be highly unlikely by chance and probably varies by browser.

I know of no examples, but it might look like this. Assume, for the sake of argument, the following character widths relative to fonts:

| Letter      | Width in serif | Width in monospace |
|-------------|----------------|--------------------|
| Capital M   | 504            | 480                |
| Lowercase i | 456            | 480                |

If constructing the string "Mi", the widths might be:

* `504 pixels ("M")` + `456 pixels ("i")` = 960 pixels in serif
* `480 pixels ("M")` + `480 pixels ("i")` = 960 pixels in monospace

As with Scenario #1 and #2 above, since these strings are of equal width, `onfontready` may falsely assume the font has already been loaded.


[◀ Back to Docs Home](README.md)
