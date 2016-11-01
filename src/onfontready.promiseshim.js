// Insert into page after onfontready to convert it to a promise style
// Catch should only occur if onTimeout would normally be called
(() => {
    const onfontreadyOriginal = window.onfontready;
    window.onfontready = (fontName, options) => {
        options = options || 0;
        return new Promise((resolve, reject) => {
            onfontreadyOriginal(fontName, resolve, {
                timeoutAfter: options.timeoutAfter,
                onTimeout: reject,
                sampleText: options.sampleText,
                generic: options.generic,
            });
        });
    };
})();
