# Recipes and Usage Patterns

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

`onfontready` can provide features to help with lots of different scenarios. The entire HTML page's content is included so there is no ambiguity. All instances of `onfontready` can either be the `modern` or `legacy` versions, depending on the desired browser support. Some optional tags (such as the head and body tags) are not included to save space.

These examples make some assumptions about both the server and the client:

* If the font VT323 is installed locally on the client machine, the output visuals may not flicker as described.
* If the testing browser's cache is not disabled or cleared prior to running Scenarios 1 through 5, the output visuals may not flicker as described.
* If the server does not send correct caching headers for font files, the browser may not cache the font. Future loads of Scenarios 6 and 7 may become susceptible to [FOIT](https://css-tricks.com/fout-foit-foft/). Fortunately, Google Fonts does return correct caching headers.

The following scenarios cover `onfontready` usage for detecting a single font. To make sure the font load experience works without Javascript enabled, read about [Handling Disabled Javascript](handlingDisabledJavascript.md). To detect multiple font loads as a single unit (or timeout as a single unit), read about patterns of [Multi-Font Detection](multiFontDetection.md). To use `onfontready` in a Promise-based form, read about [Promise Shim Usage](promiseShimUsage.md).


## Scenario 1: Show Fallback Until Font Loads

This emulates the [FOUT](https://css-tricks.com/fout-foit-foft/) problem. The fallback font monospace will display until VT323 loads. After the font loads, the new font is switched in with a class change.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Show Fallback Until Font Loaded</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('VT323', function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```


## Scenario 2: Hide Text Until Font Loads

This emulates the [FOIT](https://css-tricks.com/fout-foit-foft/) problem. The fallback font monospace will be used for layout, but the page will hide the text itself until VT323 loads. Once it has loaded, the font is switched and the text is made opaque simultaneously using a class change.

```html
<!doctype html>
<html class="notloaded">
    <meta charset="utf-8">
    <title>Hide Text Until Font Loaded</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .notloaded .font {
            color: transparent;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('VT323', function() {
            document.documentElement.className = document.documentElement.className.replace('notloaded', 'loaded');
        });
    </script>
</html>
```


## Scenario 3: Set Maximum Wait Time For Font Detection

`onfontready` provides an option to set a maximum time to wait for a font to be detected. If the font load fails or takes too long, a separate callback (`onTimeout`) will fire instead of `onReady`. Here, the timeout is set to one second in milliseconds. If the font takes longer to load than 1 second to be detected, the page will set the font color to grey.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Set Maximum Wait Time For Font Detection</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .timedOut .font {
            color: #777;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('VT323', function() {
            document.documentElement.className += ' loaded';
        }, {
            timeoutAfter: 1000,
            onTimeout: function() {
                document.documentElement.className += ' timedOut';
            }
        });
    </script>
</html>
```


## Scenario 4: Show Detected Generic Font

This will show a special generic system font for Chrome browsers running on OS X and a different fallback font for other browsers, but only if the Chrome generic font (BlinkMacSystemFont) is actually detected. Technically, this shouldn't be necessary, thanks to the font fallback system in browsers, but this is a good way to show the generic font family detection in `onfontready`.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Show Detected Generic Font</title>

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: BlinkMacSystemFont, monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('BlinkMacSystemFont', function() {
            document.documentElement.className += ' loaded';
        }, {
            generic: true
        });
    </script>
</html>
```


## Scenario 5: Detect Font With No Space Character

If a font does not contain a space character, extra care must be taken to properly detect the font. The `sampleText` string option must be set to a character that is both known to be in the font and for which the equivalent serif and monospace characters are of different lengths.

The space character is included in [IcoMoon](https://icomoon.io/app/)-generated icon fonts, [FontSquirrel's Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator) when explictly set to ignore the space character, and all normal fonts. There is only [one known font](http://processingjs.nihongoresources.com/the_smallest_font/) that does not define a space character. This example is included for completeness sake. VT323 actually does contain the space character, so specifying the `sampleText` here is not necessary.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Detect Font With No Space Character</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('VT323', function() {
            document.documentElement.className += ' loaded';
        }, {
            sampleText: 'A'
        });
    </script>
</html>
```


## Scenario 6: Use localStorage To Show Custom Font Immediately If Previously Loaded

This is nearly identical to Scenario 1. However, if the page had previously loaded the font, the page can show it immediately without a new detection test. Using this technique, the `onfontready` library only needs to run once on the first load of the first page with a given font. This also avoids any possible style flickers related to causing reflow after the page has already rendered once with the fallback font.

Such a technique might also be converted to use cookies instead of localStorage.

Be certain to send the [correct mime-types](https://github.com/h5bp/server-configs-apache/blob/master/src/media_types/media_types.conf#L56) and [caching headers](https://github.com/h5bp/server-configs-apache/blob/master/src/web_performance/expires_headers.conf#L75) for fonts when using this technique. This technique requires [localStorage support](http://caniuse.com/#search=localStorage).

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Use localStorage To Show Custom Font Immediately If Previously Loaded</title>

    <script>
        if (localStorage && localStorage.getItem && (/\bVT323\b/g).test(localStorage.getItem('fonts'))) {
            document.documentElement.className += ' loaded';
        }
    </script>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        if (!(/\bloaded\b/g).test(document.documentElement.className)) {
            window.onfontready('VT323', function() {
                document.documentElement.className += ' loaded';

                // Update localStorage 'fonts' value to contain list of font names separated by '<>'
                var fontList = (localStorage.getItem('fonts') || '').split('<>');
                fontList.push('VT323');
                // NOTE: Here might be a good place to remove font names that are no longer used from previous site versions

                localStorage.setItem('fonts', fontList.join('<>'));
            });
        }
    </script>
</html>
```


## Scenario 7: Only Show Fonts If Already Cached Using localStorage

Under this scenario, preventing font flickers is prioritized over everything else. When the user visits the site for the first time, the font is loaded into the cache, but not displayed. The next time the site is visited, or whenever the visitor proceeds to another page on the site, the font is immediately displayed. At no point will the font flip while the visitor is reading.

This is identical to Scenario 6 except that the `onReady` callback does not set the `loaded` class on the html tag.

Be certain to send the [correct mime-types](https://github.com/h5bp/server-configs-apache/blob/master/src/media_types/media_types.conf#L56) and [caching headers](https://github.com/h5bp/server-configs-apache/blob/master/src/web_performance/expires_headers.conf#L75) for fonts when using this technique. This technique requires [localStorage support](http://caniuse.com/#search=localStorage).

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Only Show Fonts If Already Cached Using localStorage</title>

    <script>
        if (localStorage && localStorage.getItem && (/\bVT323\b/g).test(localStorage.getItem('fonts'))) {
            document.documentElement.className += ' loaded';
        }
    </script>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        if (!(/\bloaded\b/g).test(document.documentElement.className)) {
            window.onfontready('VT323', function() {
                // Update localStorage 'fonts' value to contain list of font names separated by '<>'
                var fontList = (localStorage.getItem('fonts') || '').split('<>');
                fontList.push('VT323');
                // NOTE: Here might be a good place to remove font names that are no longer used from previous site versions

                localStorage.setItem('fonts', fontList.join('<>'));
            });
        }
    </script>
</html>
```


## Scenario 8: Detect If Font Is Intalled Locally

This scenario will switch to the VT323 font if a font by that name exists locally on the client machine. However, it only waits for 5 seconds before timing out. Notice how the example is not using Google Fonts.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Detect If Font Is Intalled Locally</title>

    <style>
        .font {
            font-family: monospace;
        }

        .installed .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('VT323', function() {
            document.documentElement.className += ' installed';
        }, {
            timeoutAfter: 5000,
            onTimeout: function() {
                // Do nothing
            }
        });
    </script>
</html>
```


[◀ Back to Docs Home](README.md)
