// Insert into page after onfontready to convert it to a promise style
// Catch should only occur if onTimeout would normally be called
window.onfontready = function () {
    var onfontreadyOriginal = window.onfontready;

    return function (fontName, options) {
        options = options || {};
        return new Promise(function (resolve, reject) {
            onfontreadyOriginal(fontName, resolve, {
                timeoutAfter: options.timeoutAfter,
                onTimeout: reject,
                sampleText: options.sampleText,
                generic: options.generic
            });
        });
    };
}();