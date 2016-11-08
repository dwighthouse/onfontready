// Insert into page after onfontready to convert it to a promise style

(() => {
    const onfontreadyOriginal = window.onfontready;
    window.onfontready = (fontName, options) => {
        options = options || 0;
        return new Promise((resolve, reject) => {
            onfontreadyOriginal(fontName, resolve, {
                timeoutAfter: options.timeoutAfter,

                // Catch should only occur if onTimeout would normally be called
                onTimeout: reject,

                sampleText: options.sampleText,

                generic: options.generic,
            });
        });
    };
})();
