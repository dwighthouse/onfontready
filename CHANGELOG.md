# Change Log

## [1.1.0] - 2016-11-XX

### All Changes
- Added ability to detect generic font families
- Removed the need to specify `sampleText` in all but [one known font](http://processingjs.nihongoresources.com/the_smallest_font/)
- Reduced RAM and DOM usage by approximately 1/3rd
- Added a shim to convert `onfontready` from a callback architecture to a Promise architecture if desired
- Improved compression by 46 bytes (modern) and 54 bytes (legacy) thanks to in-depth research on font structure, browser memory leaks, and standard character widths
- Maintained full backwards compatibility
- Added comprehensive documentation for design, usage, special cases, and other in-depth details
- Added built-in generation of zopfli and brotli compressions for size comparisons
- Added many new tests, both for new functionality and additional special cases
- Updated tests with more information and explanation of browser quirks and special cases
- Unified Main Tests into a single test for both `modern` and `legacy` versions
- Merged modern and legacy versions into single version differentiated with `process.env` flags
- Reduced font format variations used in tests and recommended in documentation relative to actual worldwide usage patterns
- Rebuilt build system to generate better intermediate distribution versions using Babel and some plugins
- Updated build system commands to be more consistent and easy to use
- Updated documentation for testing legacy versions of IE
- Unified all folder and file names under camelCase naming
- Updated README about changes and added new Future Plans

### Update Guide
- Remove `sampleText` usage, it should no longer be needed even for non-English fonts
- Add `generic: true` to the `options` object to test for generic font families
- If you prefer a Promise architecture over callbacks, use the new Promise shim

## [1.0.2] - 2016-06-23

- Improved compression by 50 bytes (modern) and 41 bytes (legacy)
- Made modern and legacy versions more structurally similar
- Updated comments, including adding comments about the API structure in the source itself
- Updated README with additional considerations about styling practices
- Updated README with new compression information, and added data about brotli compression

## [1.0.1] - 2016-06-14

- Improved compression by 25 bytes (modern) and 30 bytes (legacy)
- Made modern and legacy versions more structurally similar
- Updated README

## [1.0.0] - 2016-06-02

### Possibly Breaking Changes
- Removed the `options.fontStyles` option, relatively useless
- Changed `options.sampleText` to default to "onfontready" instead of "text/html"
- Removed the `.global` suffix from distribution build filenames

### Other Changes
- Rewrote entire library to be more compatible and smaller
- The library is also more likely to exit early if the font is already cached or locally installed, reducing memory usage
- Added legacy version for IE6, IE7, and IE8 compatibility
- Added test code to the library that only runs under the 'test' build environments, checking for memory leaks
- Added numerous test pages for the library itself and individual techniques related to the library
- Changed tests to use of custom font hosted locally, rather than relying on Google Fonts
- Added file (`tests/TestingOldIE.md`) containing tips for how to test old versions of IE
- Updated the gulp build system for many new options
- Updated README with new details about usage, compression, considerations, and motivations

## [0.1.1] - 2015-05-09
- Prevented test elements from rendering on top of page content for some versions of Internet Explorer, pull request from @bfred-it

## [0.1.0] - 2016-10-04
- Initial version