import ie6 from './onfontready-ie6.js';

export default (fontName, onReady, options) => {
    options = options || 0;

    let active = true;

    if (options.timeoutAfter) {
        setTimeout(() => {
            if (active && options.onTimeout) {
                options.onTimeout();
            }
        }, options.timeoutAfter);
    }

    ie6(options.generic ? fontName : `'${fontName}'`, options.sampleText || ' ', () => {
        if (active) {
            active = false;
            onReady();
        }
    });
};
