window.log = (function() {
    var consoleElement = document.getElementById('console');

    return function(text) {
        consoleElement.innerHTML = consoleElement.innerHTML + '<br>' + text;
    };
}());

window.addFontFace = function(fontName, fontBasePath, svgName) {
    var style = document.createElement('style');
    style.type = 'text/css';

    var css = "@font-face { font-family: 'fontName';src: url('fontBasePath.eot');src: url('fontBasePath.eot?#iefix') format('embedded-opentype'),url('fontBasePath.woff2') format('woff2'),url('fontBasePath.woff') format('woff'),url('fontBasePath.ttf') format('truetype'),url('fontBasePath.svg#svgName') format('svg'); }".replace(/fontName/g, fontName).replace(/fontBasePath/g, fontBasePath).replace(/svgName/g, svgName);

    document.body.appendChild(style);

    if (style.styleSheet)
    {
        style.styleSheet.cssText = css;
    }
    else
    {
        style.appendChild(document.createTextNode(css));
    }
}

window.generateTestRunner = function(startButton, shutdownStateStatus, shutdownStateOutput) {

    var parts = {
        arial: 0,
        f1: 0,
        f2: 0,
        f3: 0,
        f4: 0,
        f5: 0,
        f6: 0,
        f7: 0,
        f_Fo: 0,
        f_Yu: 0
    };

    return function() {
        startButton.setAttribute('disabled', 'disabled');

        document.documentElement.className += " f1Loading";
        window.addFontFace('f1', '../../tests/main/custom_fonts/f1', 'comfortaalight');
        document.documentElement.className += " f1Loaded";

        window.onfontready('f2', function() {
            document.documentElement.className += " f2Loaded";
        });
        document.documentElement.className += " f2Loading";
        window.addFontFace('f2', '../../tests/main/custom_fonts/f2', 'comfortaalight');

        window.onfontready('Arial', function() {
            document.documentElement.className += " arialLoading";
            document.documentElement.className += " arialLoaded";
        });

        window.onfontready('f3', (function() {
            document.documentElement.className += " f3Loaded";
            parts.f3 += 1;
        }), {
            timeoutAfter: 1,
            onTimeout: function() {
                document.documentElement.className += " f3TimedOut";
                parts.f3 += 1;
            }
        });
        setTimeout(function() {
            document.documentElement.className += " f3Loading";
            window.addFontFace('f3', '../../tests/main/custom_fonts/f3', 'comfortaalight');
        }, 10);
        setTimeout(function() {
            if (parts.f3 === 2)
            {
                document.documentElement.className += " f3LoadedAndTimedOut";
            }
        }, 100);

        window.onfontready('f4', function() {
            document.documentElement.className += " f4Loaded";
            parts.f4 += 1;
        }, {
            timeoutAfter: 0,
            onTimeout: function() {
                document.documentElement.className += " f4TimedOut";
                parts.f4 += 1;
            }
        });
        setTimeout(function() {
            document.documentElement.className += " f4Loading";
            window.addFontFace('f4', '../../tests/main/custom_fonts/f4', 'comfortaalight');
        }, 10);
        setTimeout(function() {
            if (parts.f4 === 2)
            {
                document.documentElement.className += " f4LoadedAndTimedOut";
            }
        }, 100);

        window.onfontready('f5', function() {
            document.documentElement.className += " f5Loaded";
        }, {
            timeoutAfter: 1
        });
        setTimeout(function() {
            document.documentElement.className += " f5Loading";
            window.addFontFace('f5', '../../tests/main/custom_fonts/f5', 'comfortaalight');
        }, 10);

        window.onfontready('f8', function() {
            document.documentElement.className += " f8Loaded";
            parts.f8 += 1;
        }, {
            onTimeout: function() {
                document.documentElement.className += " f8TimedOut";
                parts.f8 += 1;
            }
        });
        setTimeout(function() {
            document.documentElement.className += " f8Loading";
            window.addFontFace('f8', '../../tests/main/custom_fonts/f8', 'comfortaalight');
        }, 10);
        setTimeout(function() {
            if (parts.f8 === 2)
            {
                document.documentElement.className += " f8LoadedAndTimedOut";
            }
        }, 100);

        window.onfontready('f6', function() {
            document.documentElement.className += " f6Loaded";
        }, {
            sampleText: 'Hello World, onfontready'
        });
        document.documentElement.className += " f6Loading";
        window.addFontFace('f6', '../../tests/main/custom_fonts/f6', 'comfortaalight');

        window.onfontready('f_Fo', function() {
            document.documentElement.className += " f_FoLoaded";
        }, {
            sampleText: 'oF' // f_Fo font only contains 'F' and 'o'
        });
        document.documentElement.className += " f_FoLoading";
        window.addFontFace('f_Fo', '../../tests/main/custom_fonts/f_Fo', 'comfortaalight');

        window.onfontready('f_Yu', function() {
            document.documentElement.className += " f_YuLoaded";
        }, {
            sampleText: 'Hello World' // f_Yu font only contains 'Y' or 'u'
        });
        document.documentElement.className += " f_YuLoading";
        window.addFontFace('f_Yu', '../../tests/main/custom_fonts/f_Yu', 'comfortaalight');

        window.onfontready('f7', function() {
            document.documentElement.className += " f7Loaded";
        }, {
            sampleText: 'Your Font' // f7 font does not contain 'Y', 'r', or 'u'
        });
        document.documentElement.className += " f7Loading";
        window.addFontFace('f7', '../../tests/main/custom_fonts/f7', 'comfortaalight');

        setTimeout(function() {
            var fullReport = window.testReporter.fullReport();
            var hasStandardError = false;

            var fonts = ['Arial', 'f2', 'f3', 'f4', 'f5', 'f6', 'f8', 'f_Fo'];
            var f;

            for (f = 0; f < fonts.length; f += 1)
            {
                hasStandardError = hasStandardError || (fonts[f].root > 0 || fonts[f].load > 0 || fonts[f].resize > 0);
            }

            var f7PartialFallbackSupported = fullReport.f7.root === 1 && fullReport.f7.load === 3 && fullReport.f7.resize === 3;
            var f_YuPartialFallbackSupported = fullReport.f_Yu.root === 1 && fullReport.f_Yu.load === 3 && fullReport.f_Yu.resize === 3;

            var f7PartialFallbackUnsupported = fullReport.f7.root <= 0 && fullReport.f7.load <= 0 && fullReport.f7.resize <= 0;
            var f_YuPartialFallbackUnsupported = fullReport.f_Yu.root <= 0 && fullReport.f_Yu.load <= 0 && fullReport.f_Yu.resize <= 0;

            if (!hasStandardError && f7PartialFallbackSupported && f_YuPartialFallbackSupported)
            {
                shutdownStateStatus.innerHTML = 'OK';
                document.documentElement.className += ' shutdownStatesValid';
            }
            else if (!hasStandardError && f7PartialFallbackUnsupported && f_YuPartialFallbackUnsupported)
            {
                shutdownStateStatus.innerHTML = 'OK';
                document.documentElement.className += ' shutdownStatesPartiallyValid';
            }
            else
            {
                shutdownStateStatus.innerHTML = 'X';
                document.documentElement.className += ' shutdownStatesInvalid';
            }

            shutdownStateOutput.innerHTML = 'hasStandardError: ' + hasStandardError + ',<br>f7PartialFallbackSupported: ' + f7PartialFallbackSupported + ', f_YuPartialFallbackSupported: ' + f_YuPartialFallbackSupported + ',<br>f7PartialFallbackUnsupported: ' + f7PartialFallbackUnsupported + ', f_YuPartialFallbackUnsupported: ' + f_YuPartialFallbackUnsupported;
        }, 5000);
    };
};
