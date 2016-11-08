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

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('VT323').then(function() {
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

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.promiseshim.min.js"></script>
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

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('cursive', {
            generic: true
        }).then(function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```



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

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.promiseshim.min.js"></script>
    <script>
        window.onfontready('VT323', {
            sampleText: 'A'
        }).then(function() {
            document.documentElement.className += ' loaded';
        });
    </script>
</html>
```





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
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.promiseshim.min.js"></script>
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

    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.min.js"></script>
    <script src="https://cdn.rawgit.com/dwighthouse/onfontready/master/dist/onfontready.promiseshim.min.js"></script>
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
