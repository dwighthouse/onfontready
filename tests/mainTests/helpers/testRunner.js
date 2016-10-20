window.testRunner = function(shutdownStateStatus, shutdownStateDescription) {

    var parts = {
        arial: 0,
        f1: 0,
        f2: 0,
        f3: 0,
        f4: 0,
        f5: 0,
        f6: 0,
        f7: 0,
        f8: 0,
        f9: 0,
        f10: 0,
        f_Fo: 0,
        f_Yu: 0
    };

    document.documentElement.className += " f1Loading";
    window.addFontFace('f1', '../../tests/mainTests/custom_fonts/f1');
    document.documentElement.className += " f1Loaded";

    window.onfontready('f2', function() {
        document.documentElement.className += " f2Loaded";
    });
    document.documentElement.className += " f2Loading";
    window.addFontFace('f2', '../../tests/mainTests/custom_fonts/f2');

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
        window.addFontFace('f3', '../../tests/mainTests/custom_fonts/f3');
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
        window.addFontFace('f4', '../../tests/mainTests/custom_fonts/f4');
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
        window.addFontFace('f9', '../../tests/mainTests/custom_fonts/f9');
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
        window.addFontFace('f5', '../../tests/mainTests/custom_fonts/f5');
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
        window.addFontFace('f8', '../../tests/mainTests/custom_fonts/f8');
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
    window.addFontFace('f6', '../../tests/mainTests/custom_fonts/f6');

    window.onfontready('f_Fo', function() {
        document.documentElement.className += " f_FoLoaded";
    }, {
        sampleText: 'oF' // f_Fo font only contains 'F' and 'o'
    });
    document.documentElement.className += " f_FoLoading";
    window.addFontFace('f_Fo', '../../tests/mainTests/custom_fonts/f_Fo');

    window.onfontready('f_Yu', function() {
        document.documentElement.className += " f_YuLoaded";
    }, {
        sampleText: 'Hello World' // f_Yu font only contains 'Y' or 'u'
    });
    document.documentElement.className += " f_YuLoading";
    window.addFontFace('f_Yu', '../../tests/mainTests/custom_fonts/f_Yu');

    window.onfontready('f7', function() {
        document.documentElement.className += " f7Loaded";
    }, {
        sampleText: 'Your Font' // f7 font does not contain 'Y', 'r', or 'u'
    });
    document.documentElement.className += " f7Loading";
    window.addFontFace('f7', '../../tests/mainTests/custom_fonts/f7');

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
    window.addFontFace('f_F1', '../../tests/mainTests/custom_fonts/f_F1');
    document.documentElement.className += " f_F1Loading";

    window.onfontready('f_F2', function() {
        document.documentElement.className += " f_F2Loaded";
    });
    window.addFontFace('f_F2', '../../tests/mainTests/custom_fonts/f_F2');
    document.documentElement.className += " f_F2Loading";

    setTimeout(function() {
        var tests = window.reporter.getTests();
        window.log(JSON.stringify(tests, null, '    '))
        window.log(document.documentElement.className);

        var hasStandardError = false;
        var hasFailureError = false;

        var standardFontTests = ['Arial', 'sansSerif', 'f2', 'f3', 'f4', 'f5', 'f6', 'f8', 'f9', 'f10', 'f_Fo', 'f_F1'];
        var f;

        for (f = 0; f < standardFontTests.length; f += 1)
        {
            hasStandardError = hasStandardError || (standardFontTests[f].root > 0 || standardFontTests[f].resize > 0);
        }

        var failureFontTests = ['cursive', 'f_Yu', 'f7', 'f_F2'];
        var t;
        var r;
        var failureResult;

        for (t = 0; t < failureFontTests.length; t += 1)
        {
            r = tests[failureFontTests[t]];
            if (window.isLegacyVersion && (window.isIE6 || window.isIE7))
            {
                hasFailureError = hasFailureError || (r.root > 0 || r.resize > 0);
            }
            else
            {
                hasFailureError = hasFailureError || (r.root !== 1 || r.resize !== 2);
            }
        }

        if (!hasStandardError && !hasFailureError)
        {
            shutdownStateStatus.innerHTML = 'OK';
            document.documentElement.className += ' shutdownStatesValid';
            shutdownStateDescription.innerHTML = 'Everything shut down in the expected way. Incorrect Usages and Old IE Differences may not have shut down, but they behaved as expected under those conditions.';
        }
        else if (!hasStandardError && hasFailureError)
        {
            shutdownStateStatus.innerHTML = 'OK';
            document.documentElement.className += ' shutdownStatesPartiallyValid';
            shutdownStateDescription.innerHTML = 'All normal cases shut down as expected. Some Incorrect Usages or Old IE Differences did not shut down in the expected way.';
        }
        else
        {
            shutdownStateStatus.innerHTML = 'X';
            document.documentElement.className += ' shutdownStatesInvalid';
            shutdownStateDescription.innerHTML = 'Something went very wrong with the shutdown process.';
        }
    }, 5000);
};
