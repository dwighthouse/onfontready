# Promise Shim Usage

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

`onfontready` can be used as a Promise-returning library using the [Promise shim](../src/onfontready.promiseshim.js). It wraps `onfontready`, permanently changing it into a Promise-returning format. Using `Promise.all()`, multiple fonts can be detected as a single unit.


## Usage

The `onfontready` function is attached to the `window` object. The shim assumes that the `onfontready` function is already attached to the window object, so be sure to include that script first. By adding this shim script after the primary `onfontready` script, the `onfontready` function is overwritten with a new function that returns Promises instead of expecting callback parameters. To use the function outside of a global window context, the source code must be modified, which is left as an exercise for the user.

The Promise shim also assumes that the browser either natively supports promises, or has already loaded a Promise polyfill. Check the [browser support for Promises](http://caniuse.com/#search=promise) to determine if a polyfill is necessary for your needs.

The script to include on the page may be either the [commented source code](../src/onfontready.promiseshim.js) or the [minified distribution version](../dist/onfontready.promiseshim.min.js).


## API

Note that there is no `onReady` or `options.onTimeout` callback in this API. They are instead handled via the Promise APIs. `onReady` is replaced by the `then` chained callback. `options.onTimeout` is replaced by the `catch` chained callback.

```javascript
onfontready(fontName, [options={}])
```

* `fontName` - (string) Name used in `@font-face` declaration, font name on the local client machine, or generic font family name.
* `options` - (Object) Optional object for settings.
  - `options.timeoutAfter` - (number) Milliseconds waited before rejecting the Promise. `onfontready` will wait indefinitely if `options.timeoutAfter` is unset or 0. Negative numbers are allowed and act as a ["fast" timeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified).
  - `options.generic` - (boolean) Causes `onfontready` to detect generic font families like fantasy, cursive, san-serif, or BlinkMacSystemFont if set to `true`.
  - `options.sampleText` - (string) Text used for font width testing. This option should only be used for fonts that have no space character. There is only [one known font](http://processingjs.nihongoresources.com/the_smallest_font/) without a space character.
* **Returns** : (Promise) - A Promise object is returned by the call to `onfontready` that will resolve upon successful font load, or reject in the event of a timeout prior to a successful font load.

Read the [commented source code](../src/onfontready.promiseshim.js) for more details.


## Scenario 1: Show Fallback Until Font Loaded

This is the most basic usage of the Promise version of `onfontready`.

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

    <p class="font">onfontready</p>

    <script src="onfontready.min.js"></script>
    <script src="onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('VT323').then(function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```


## Scenario 2: Timeout Usage

If the font fails to load before `timeoutAfter`, the `catch` chained callback will be called instead of the `then` chained callback.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Timeout Usage</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }

        .timedOut .font {
            color: #777;
        }
    </style>

    <p class="font">onfontready</p>

    <script src="onfontready.min.js"></script>
    <script src="onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('VT323', {
            timeoutAfter: 5000
        }).then(function() {
            document.documentElement.className += ' loaded';
        }).catch(function() {
            document.documentElement.className += ' timedOut';
        });
    </script>
</html>
```


## Scenario 3: Generic Font Family Usage

An example of the `generic` option being used.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Generic Font Family Usage</title>

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: cursive, monospace;
        }
    </style>

    <p class="font">onfontready</p>

    <script src="onfontready.min.js"></script>
    <script src="onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('cursive', {
            generic: true
        }).then(function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```


## Scenario 4: `sampleText` Usage

An example of the `sampleText` option being used.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>sampleText Usage</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">

    <style>
        .font {
            font-family: monospace;
        }

        .loaded .font {
            font-family: 'VT323', monospace;
        }
    </style>

    <p class="font">onfontready</p>

    <script src="onfontready.min.js"></script>
    <script src="onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('VT323', {
            sampleText: 'A'
        }).then(function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```


## Scenario 5: Show Fallback Until All Fonts Loaded

Using the `Promise.all()` function, multiple fonts can be detected as a single unit. The `then` chained callback will only be called when all fonts have been loaded.

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

    <script src="onfontready.min.js"></script>
    <script src="onfontready.promiseshim.min.js"></script>
    <script>
        Promise.all([
            window.onfontready('VT323'),
            window.onfontready('Comfortaa')
        ]).then(function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```


## Scenario 6: Show Fallback Until All Fonts Loaded With Timeout

Using the `Promise.all()` function, multiple fonts can be detected as a single unit. They can also fail as a single unit. The `then` chained callback will only be called when all fonts have been loaded. If the font loading for any or all fonts takes more than 5 seconds, the `catch` chained callback will be called instead. Note that the options for each font are included. It is entirely possible to provide different `timeoutAfter` time spans, but only use one timeout handler.

```html
<!doctype html>
<html>
    <meta charset="utf-8">
    <title>Show Fallback Until All Fonts Loaded With Timeout</title>

    <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">

    <style>
        .font1 {
            font-family: monospace;
            font-size: 50px;
        }

        .loaded .font1 {
            font-family: 'VT323', monospace;
        }

        .font2 {
            font-family: monospace;
            font-size: 50px;
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

    <script src="onfontready.min.js"></script>
    <script src="onfontready.promiseshim.min.js"></script>
    <script>
        Promise.all([
            window.onfontready('VT323', { timeoutAfter: 5000 }),
            window.onfontready('Comfortaa', { timeoutAfter: 5000 })
        ]).then(function() {
            document.documentElement.className += ' loaded';
        }).catch(function() {
            document.documentElement.className += ' timedOut';
        });
    </script>
</html>
```


[◀ Back to Docs Home](README.md)
