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
