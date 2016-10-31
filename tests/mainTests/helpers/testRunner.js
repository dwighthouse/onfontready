window.testRunner = function(shutdownStateStatus, shutdownStateDescription) {

    var f;

    var testedFonts = [
        'f1',
        'f2',
        'Arial',
        'sans-serif',
        'cursive',
        'f3',
        'f4',
        'f9',
        'f5',
        'f8',
        'f6',
        'f_Fo',
        'f_Yu',
        'f7',
        'f10',
        'f_F1',
        'f_F2'
    ];

    var parts = {};

    for (f = 0; f < testedFonts.length; f += 1)
    {
        parts[testedFonts[f]] = 0;
    }

    document.documentElement.className += " f1Loading";
    window.addFontFace('f1', '../../tests/mainTests/customFonts/f1');
    document.documentElement.className += " f1Loaded";

    window.onfontready('f2', function() {
        document.documentElement.className += " f2Loaded";
    });
    document.documentElement.className += " f2Loading";
    window.addFontFace('f2', '../../tests/mainTests/customFonts/f2');

    document.documentElement.className += " arialLoading";
    window.onfontready('Arial', function() {
        document.documentElement.className += " arialLoaded";
    });

    document.documentElement.className += " sansSerifLoading";
    window.onfontready('sans-serif', function() {
        document.documentElement.className += " sansSerifLoaded";
    }, {
        generic: true
    });

    document.documentElement.className += " cursiveLoading";
    window.onfontready('cursive', function() {
        document.documentElement.className += " cursiveLoaded";
    }, {
        generic: false
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
        window.addFontFace('f3', '../../tests/mainTests/customFonts/f3');
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
        window.addFontFace('f4', '../../tests/mainTests/customFonts/f4');
    }, 10);
    setTimeout(function() {
        if (parts.f4 === 2)
        {
            document.documentElement.className += " f4LoadedAndTimedOut";
        }
    }, 100);

    window.onfontready('f9', (function() {
        document.documentElement.className += " f9Loaded";
        parts.f9 += 1;
    }), {
        timeoutAfter: -1,
        onTimeout: function() {
            document.documentElement.className += " f9TimedOut";
            parts.f9 += 1;
        }
    });
    setTimeout(function() {
        document.documentElement.className += " f9Loading";
        window.addFontFace('f9', '../../tests/mainTests/customFonts/f9');
    }, 10);
    setTimeout(function() {
        if (parts.f9 === 2)
        {
            document.documentElement.className += " f9LoadedAndTimedOut";
        }
    }, 100);

    window.onfontready('f5', function() {
        document.documentElement.className += " f5Loaded";
    }, {
        timeoutAfter: 1
    });
    setTimeout(function() {
        document.documentElement.className += " f5Loading";
        window.addFontFace('f5', '../../tests/mainTests/customFonts/f5');
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
        window.addFontFace('f8', '../../tests/mainTests/customFonts/f8');
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
    window.addFontFace('f6', '../../tests/mainTests/customFonts/f6');

    window.onfontready('f_Fo', function() {
        document.documentElement.className += " f_FoLoaded";
    }, {
        sampleText: 'oF' // f_Fo font only contains 'F' and 'o'
    });
    document.documentElement.className += " f_FoLoading";
    window.addFontFace('f_Fo', '../../tests/mainTests/customFonts/f_Fo');

    window.onfontready('f_Yu', function() {
        document.documentElement.className += " f_YuLoaded";
    }, {
        sampleText: 'Hello World' // f_Yu font only contains 'Y' or 'u'
    });
    document.documentElement.className += " f_YuLoading";
    window.addFontFace('f_Yu', '../../tests/mainTests/customFonts/f_Yu');

    window.onfontready('f7', function() {
        document.documentElement.className += " f7Loaded";
    }, {
        sampleText: 'Your Font' // f7 font does not contain 'Y', 'r', or 'u'
    });
    document.documentElement.className += " f7Loading";
    window.addFontFace('f7', '../../tests/mainTests/customFonts/f7');

    window.onfontready('f10', function() {
        document.documentElement.className += " f10Loaded";
    }, {
        sampleText: String.fromCharCode(0) // NULL character, it is always 0-width
    });
    document.documentElement.className += " f10Loading";

    window.onfontready('f_F1', function() {
        document.documentElement.className += " f_F1Loaded";
    }, {
        sampleText: 'F'
    });
    window.addFontFace('f_F1', '../../tests/mainTests/customFonts/f_F1');
    document.documentElement.className += " f_F1Loading";

    window.onfontready('f_F2', function() {
        document.documentElement.className += " f_F2Loaded";
    });
    window.addFontFace('f_F2', '../../tests/mainTests/customFonts/f_F2');
    document.documentElement.className += " f_F2Loading";

    function writeReport(fontName, fontTestResults) {

    }

    setTimeout(function() {
        var tests = window.reporter.getTests();

        // window.log(JSON.stringify(tests, null, '    '))
        // window.log(document.documentElement.className);

        var resultsElement;
        var testResults;
        var output;

        for (f = 0; f < testedFonts.length; f += 1)
        {
            resultsElement = document.getElementById(testedFonts[f] + 'Notes');
            resultsElement.style.color = '#000';

            output = '';
            testResults = tests[testedFonts[f]];

            if (testResults)
            {
                output += '<div style="border-left: 4px solid #999;padding-left: 10px;">';

                if (testResults.rootCount === 0)
                {
                    output += '<div style="color:#328332;">Detection elements were removed. </div>';
                }
                else
                {
                    output += '<div style="color:#ff9300;">Detection elements were not removed. </div>';
                }

                if (testResults.iframesCreated)
                {
                    output += '<div style="color:#ff9300;">iframes were created. </div>';
                }
                else
                {
                    output += '<div style="color:#328332;">iframes were not created. </div>';
                }

                if (testResults.timedOut)
                {
                    output += '<div style="color:#ff9300;">Detection timed out before font loaded. </div>';
                }
                else
                {
                    output += '<div style="color:#328332;">Font loaded before detection timed out. </div>';
                }

                if (testResults.fontLoaded)
                {
                    output += '<div style="color:#328332;">Font loaded. </div>';
                }
                else
                {
                    output += '<div style="color:#ff9300;">Font did not load (or was not detected as loaded). </div>';
                }

                if (testResults.requiredExtraTimeout)
                {
                    output += '<div style="color:#ff9300;">Detection required usage of additional timeout during startup. </div>';
                }
                else
                {
                    output += '<div style="color:#328332;">Detection did not require usage of additional timeout during startup. </div>';
                }

                output += '</div>';
            }
            else
            {
                output += 'No Notes';
            }

            resultsElement.innerHTML = output;
        }
    }, 5000);
};
