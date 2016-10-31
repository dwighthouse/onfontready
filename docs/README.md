# onfontready docs

`onfontready` is a very small Javascript library for detecting fonts in browsers. By detecting font loading and parsing with `onfontready`, pages can avoid Flash of Invisible Text (FOIT) and Flash of Unstyled Text (FOUT). `onfontready` can also be used to detect if a named font is already installed locally on the client machine.

At its core, `onfontready` is uses carefully crafted CSS and iframes to determine when a single font is both loaded and parsed by the browser, completely ready for use. Read about [How it Works](howItWorks.md) to understand `onfontready`'s inner workings.

`onfontready` does not make any assumptions about how it will be used. It is meant to be a foundation for other techniques, not a catch-all library for every scenario. Read about [Recipes and Usage Patterns](recipesAndUsagePatterns.md) to discover how to use `onfontready` for your project.

`onfontready` is heavily optimized for size. It uses strange code structures that result in the smallest possible size after gzip compression. Read about [Compression Techniques](compressionTechniques.md) used in the library.

`onfontready` can detect fonts in most, if not all browsers that support both custom fonts and Javascript. Even Internet Explorer 6, 7, and 8 are supported with the `legacy` version. Read about [Legacy Version Differences](legacyVersionDifferences.md).

With the right options, all known fonts should be detectable with `onfontready`. However, it is possible to create a font that `onfontready` cannot detect. Read about [How to Break `onfontready`](howToBreakOnfontready.md).

`onfontready` is built from a single source file into multiple versions for testing and distribution, as well as the legacy and modern variants. Read about [Building `onfontready`](buildingOnfontready.md).


## Other Resources

Here are some other font-related resources that might come in handy.

* [Practical Guide to System UI Fonts](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)
* [FontSquirrel's Font Generation Tool](https://www.fontsquirrel.com/tools/webfont-generator)
* [Other Techniques for Controlled Font Loading](https://www.filamentgroup.com/lab/font-loading.html)
* [Unusual Generic Font Families](http://furbo.org/2015/07/09/i-left-my-system-fonts-in-san-francisco/)
* [Font-Display Usage and Polyfill Techniques](https://css-tricks.com/font-display-masses/)
* [Unquoted CSS Font Family Name Validator](https://mothereff.in/font-family)
* [Special Case Minimal Font Exploration](http://processingjs.nihongoresources.com/the_smallest_font/)
