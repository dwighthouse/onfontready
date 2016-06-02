# Change Log

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