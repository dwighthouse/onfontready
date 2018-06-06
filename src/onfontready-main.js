import ie6 from './onfontready-ie6.js';

export default (fontName, onReady, options, sampleText) => {
    options = options || 0;
    fontName = options.generic ? fontName : `'${fontName}'`;
    sampleText = options.sampleText || ' ';

    let active = true;

    if (options.timeoutAfter) {
        setTimeout(() => {
            if (active && options.onTimeout) {
                options.onTimeout();
            }
        }, options.timeoutAfter);
    }

    ie6(fontName, sampleText, () => {
        if (active) {
            active = false;
            onReady();
        }
    });
};
