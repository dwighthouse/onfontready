window.testRunner = function(shutdownStateStatus, shutdownStateOutput) {

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

    document.documentElement.className += " fantasyLoading";
    window.onfontready('fantasy', function() {
        document.documentElement.className += " fantasyLoaded";
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
        sampleText: '\n'
    });
    document.documentElement.className += " f10Loading";

    setTimeout(function() {
        var tests = window.reporter.getTests();
        // console.log(JSON.stringify(tests, null, '    '))

        var hasStandardError = false;

        var fonts = ['Arial', 'fantasy', 'cursive', 'f2', 'f3', 'f4', 'f5', 'f6', 'f8', 'f9', 'f_Fo'];
        var f;

        for (f = 0; f < fonts.length; f += 1)
        {
            hasStandardError = hasStandardError || (fonts[f].root > 0 || fonts[f].load > 0 || fonts[f].resize > 0);
        }

        var f7PartialFallbackSupported = tests.f7.root === 1 && tests.f7.load === 2 && tests.f7.resize === 2;
        var f_YuPartialFallbackSupported = tests.f_Yu.root === 1 && tests.f_Yu.load === 2 && tests.f_Yu.resize === 2;

        var f7PartialFallbackUnsupported = tests.f7.root <= 0 && tests.f7.load <= 0 && tests.f7.resize <= 0;
        var f_YuPartialFallbackUnsupported = tests.f_Yu.root <= 0 && tests.f_Yu.load <= 0 && tests.f_Yu.resize <= 0;

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
