# Handling Disabled Javascript

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

It is good to keep in mind that a user may have disabled Javascript or previous scripts on the page might have caused an unrecoverable error. Using the following techniques, custom font loading can still occur without Javascript enabled.


## Disabled Javascript Support - Method 1

The page can override the font styles inside a noscript tag. When scripts are enabled, this is skipped, and `onfontready` can run normally. This technique may only be possible in pages with HTML5 doctypes, due to rules about noscript and style tags.

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


## Disabled Javascript Support - Method 2

Second, the page can start off with the loaded class, and then remove it as soon as Javascript is detected. The loaded class can be re-added normally via `onfontready` actions if Javascript is enabled. Since this removal happens before any usage of the font, the font will not actually begin loading on browsers that are optimized to prevent downloads of unused fonts. This will prevent FOIT when Javascript is enabled, and fall back to FOIT when Javascript is disabled.

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
