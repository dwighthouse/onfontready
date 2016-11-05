# Recipes and Usage Patterns

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

`onfontready` can provide features to help with lots of different scenarios. The entire HTML page's content is included so there is no ambiguity. All instances of `onfontready` can either be the `modern` or `legacy` versions, depending on the desired browser support. Some optional tags (such as the head and body tags) are not included to save space.

These examples make some assumptions about both the server and the client:

* If the font VT323 is installed locally on the client machine, the output visuals may not flicker as described.
* If the testing browser's cache is not disabled or cleared prior to running Scenarios 1 through 5, the output visuals may not flicker as described.
* If the server does not send correct caching headers for font files, the browser may not cache the font and future loads of Scenarios 6 through 8 may become susceptible to [FOIT](https://css-tricks.com/fout-foit-foft/) again. Fortunately, Google Fonts does return correct caching headers.

The following scenarios only cover basic `onfontready` usage. To detect multiple font loads as a single unit (or timeout as a single unit), read about patterns of [Multi-Font Detection](multiFontDetection.md). To use `onfontready` in a Promise-based form, read about [Promise Shim Usage](promiseShimUsage.md).


## Scenario 1: Show Fallback Until Font Loads

This emulates the FOUT problem. The fallback font monospace will display until VT323 loads. After the font loads, the new font is switched in with a class change.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Show Fallback until Font Loaded</title>

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

This emulates the [FOIT](https://css-tricks.com/fout-foit-foft/) problem. The fallback font monospace will be used for layout, but the page will hide the text itself until VT323 loads. Once it has loaded, the font switch and the text will become opaque simultaneously.

```html
<!doctype html>
<html class="notloaded">
    <meta charset="utf-8">
    <title>Hide Text until Font Loaded</title>

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

If a font does not contain a space character, extra care must be taken to properly detect the font. Specify a `sampleText` string for a character that is known to exist in the font, **AND the equivalent serif and monospace characters are of different lengths**.

There is only [one known font](http://processingjs.nihongoresources.com/the_smallest_font/) that does not define a space character. Even IcoMoon-generated icon fonts include a defined space character. This example is included for completeness sake. VT323 actually does contain the space character.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Show Fallback until Font Loaded</title>

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


## Scenario 6: Use localStorage to Show Custom Font Immediately If Previously Loaded

This is the same as Scenario 1, except that the page attempts to show the font immediately if the localStorage has data indicating the font has already been loaded thanks to an earlier page load. Using this technique, the `onfontready` library only needs to run once on the first load of the first page with a given font. This also avoids any possible style flickers related to causing reflow after the page has already rendered once with the fallback font.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Use localStorage to Show Custom Font Immediately If Previously Loaded</title>

    <script>
        if (localStorage && localStorage.getItem && (/\bVT323\b/).test(localStorage.getItem('fonts'))) {
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
        if (!(/\bloaded\b/).test(document.documentElement.className)) {
            window.onfontready('VT323', function() {
                document.documentElement.className += " loaded";

                // Update localStorage 'fonts' value to contain list of font names separated by '<>'
                var fontList = localStorage.getItem('fonts').split('<>');
                fontList.push('VT323');
                // NOTE: Here might be a good place to remove font names that are no longer used from previous site versions

                localStorage.setItem('fonts', fontList.join('<>'));
            });
        }
    </script>
</html>
```


## Scenario 7: Use Cookie to Show Custom Font Immediately If Previously Loaded

The same as Scenario 6, but using cookies instead of localStorage. This technique works on older browsers that don't support localStorage.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Use Cookie to Show Custom Font Immediately If Previously Loaded</title>

    <script>
        (function() {
            var cookies = document.cookie.split(/; ?/g);
            var c;
            var key;
            var value;

            for (c = 0; c < cookies.length; c += 1) {
                parts = cookies[c].split('=');
                if (parts[0] === 'fonts' && (/\bVT323\b/).test(parts[1]))
                {
                    document.documentElement.className += ' loaded';
                    break;
                }
            }
        }());
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
        if (!(/\bloaded\b/).test(document.documentElement.className)) {
            window.onfontready('VT323', function() {
                document.documentElement.className += " loaded";

                // Update cookie 'fonts' value to contain list of font names separated by '<>'
                var cookies = document.cookie.split(/; ?/g);
                var c;
                var parts;
                var cookieOutput = [];

                for (c = 0; c < cookies.length; c += 1) {
                    parts = cookies[c].split('=');
                    if (parts[0] === 'fonts')
                    {
                        parts[1] = parts[1].split('<>').concat('VT323').join('<>');
                        // NOTE: Here might be a good place to remove font names that are no longer used from previous site versions
                    }
                    cookieOutput.push(parts.join('='));
                }
                document.cookie = cookieOutput.join('; ');
            });
        }
    </script>
</html>
```


## Scenario 8: Only Show Fonts If Already Cached Using localStorage

Under this scenario, preventing font flickers is prioritized over everything else. When the user visits the site for the first time, the font is loaded into the cache, but not displayed. The next time the site is visited, or whenever the visitor proceeds to another page on the site, the font is immediately displayed. At no point will the font flip while the visitor is reading.

This is identical to Scenario 6 except that the `onReady` callback does not set the `loaded` class on the html tag.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Use localStorage to Show Custom Font Immediately If Previously Loaded</title>

    <script>
        if (localStorage && localStorage.getItem && (/\bVT323\b/).test(localStorage.getItem('fonts'))) {
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
        if (!(/\bloaded\b/).test(document.documentElement.className)) {
            window.onfontready('VT323', function() {
                // Update localStorage 'fonts' value to contain list of font names separated by '<>'
                var fontList = localStorage.getItem('fonts').split('<>');
                fontList.push('VT323');
                // NOTE: Here might be a good place to remove font names that are no longer used from previous site versions

                localStorage.setItem('fonts', fontList.join('<>'));
            });
        }
    </script>
</html>
```


## Disabled Javascript Support

It is good to keep in mind that a user may have disabled Javascript, or previous scripts on the page might have caused an unrecoverable error. Though `onfontready` is designed to be inlined on every page of a site, it is still good practice to make custom font loading possible without Javascript enabled. There are two ways to do this.


### Disabled Javascript Support - Method 1

First, one can insert some overriding styles after the main stylesheet inside a noscript tag that forces custom font family usage. When scripts are enabled, this is skipped, and `onfontready` can run normally. This technique may only be possible in pages with HTML5 doctypes, due to rules about noscript and style tags.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Disabled Javascript Support - Method 1</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <noscript>
        <style>
            .font {
                font-family: 'VT323', monospace;
            }
        </style>
    </noscript>

    <p class="font">Lorem ipsum...</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script>
        window.onfontready('VT323', function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```


### Disabled Javascript Support - Method 2

Second, one can start off the page with the loaded styles, and then remove them as soon as Javascript is detected. Then they can be re-added as fonts are detected. If this removal happens before any usage of the font, the font will not actually begin loading.

```html
<!doctype html>
<html class="loaded">
    <meta charset="utf-8">
    <title>Disabled Javascript Support - Method 2</title>

    <script>
        document.documentElement.className = document.documentElement.className.replace('loaded', '');
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
        window.onfontready('VT323', function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```




[◀ Back to Docs Home](README.md)
