# Multi-Font Detection

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

`onfontsready` can be used if a page needs to perform a font detection test on more than one font as a single unit. It wraps the functionality of `onfontready` for this purpose, even propogating options to each detection test, as needed.


## API

The API for `onfontsready` is almost identical to `onfontready`, except that it takes an array of fonts for the first argument, and propagates options across multiple detection tests. The `onfontsready` function is attached to the `window` object. It assumes that the `onfontready` function is already attached to the window object. To use the function outside of a global window context, the source code must be modified, which is left as an exercise to the user. The function has two required arguments and one optional argument.

```javascript
onfontsready(fontNames, onReady, [options={}])
```

* `fontNames` - (array of strings) Names used in `@font-face` declaration, font name on the local client machine, or generic font family name.
* `onReady` - (function callback) Called upon successful detection of the successful loading and parsing of all fonts tested. No parameters.
* `options` - (Object) Optional object for settings.
  - `options.timeoutAfter` - (number) Milliseconds waited before calling `options.onTimeout` callback. `onfontsready` will wait indefinitely if `options.timeoutAfter` is unset or 0. Negative numbers are allowed and act as a ["fast" timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified).
  - `options.onTimeout` - (function callback) Called after `options.timeoutAfter` milliseconds have elapsed without an `onReady` call.
  - `options.generic` - (boolean or array of booleans) Causes each tested font to detect generic font families like fantasy, cursive, san-serif, or BlinkMacSystemFont if set to `true`. If an array is passed, each index's boolean will correspond to the generic setting associated with each font.
  - `options.sampleText` - (string or array of strings) Text used for font width testing. This option should only be used for fonts that have no space character. There is only [one known font](http://processingjs.nihongoresources.com/the_smallest_font/) without a space character. If an array is passed, each index's string will correspond to the test text associated with each font's width test.

Read the [commented source code](../src/onfontsready.js) for more details.


```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Show Fallback Until All Fonts Loaded</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: 'Comfortaa', monospace;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['VT323', 'Comfortaa'], function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```



```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Timeout Usage</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: 'Comfortaa', monospace;
        }

        .timedOut .font1, .timedOut .font2 {
            color: #777;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['VT323', 'Comfortaa'], function() {
            document.documentElement.className += ' loaded';
        }, {
            timeoutAfter: 5000,
            onTimeout: function() {
                document.documentElement.className += ' timedOut';
            }
        });
    </script>
</html>
```




```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>All Generic Fonts</title>

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: cursive, monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: fantasy, monospace;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['cursive', 'fantasy'], function() {
            document.documentElement.className += ' loaded';
        }, {
            generic: true
        });
    </script>
</html>
```





```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Some Generic Fonts</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: fantasy, monospace;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['VT323', 'fantasy'], function() {
            document.documentElement.className += ' loaded';
        }, {
            generic: [false, true]
        });
    </script>
</html>
```




```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Shared sampleText</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: 'Comfortaa', monospace;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['VT323', 'Comfortaa'], function() {
            document.documentElement.className += ' loaded';
        }, {
            sampleText: 'A'
        });
    </script>
</html>
```




```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Shared sampleText</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: 'Comfortaa', monospace;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['VT323', 'Comfortaa'], function() {
            document.documentElement.className += ' loaded';
        }, {
            sampleText: 'A'
        });
    </script>
</html>
```




```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Differing sampleText</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
        }

        .loaded .font2 {
            font-family: 'Comfortaa', monospace;
        }
    </style>

    <p class="font1">onfontready</p>
    <p class="font2">onfontready</p>

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontsready.min.js"></script>
    <script>
        window.onfontsready(['VT323', 'Comfortaa'], function() {
            document.documentElement.className += ' loaded';
        }, {
            sampleText: ['A', 'B']
        });
    </script>
</html>
```











[◀ Back to Docs Home](README.md)
