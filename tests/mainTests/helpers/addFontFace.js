window.addFontFace = function(fontName, fontBasePath, svgName) {
    var style = document.createElement('style');
    style.type = 'text/css';

    var css = "@font-face { font-family: 'fontName'; src: url('fontBasePath.eot'); src: url('fontBasePath.eot?#iefix') format('embedded-opentype'), url('fontBasePath.woff') format('woff'), url('fontBasePath.ttf') format('truetype'); }".replace(/fontName/g, fontName).replace(/fontBasePath/g, fontBasePath);

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
