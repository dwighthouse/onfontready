# Compression Techniques

#### Doc Links
* [Recipes and Usage Patterns](recipesAndUsagePatterns.md)
    - [Promise Shim Usage](promiseShimUsage.md)
    - [Multi-Font Detection](multiFontDetection.md)
* [Legacy Version Differences](legacyVersionDifferences.md)
* [How to Break `onfontready`](howToBreakOnfontready.md)
* [How it Works](howItWorks.md)
* [Compression Techniques](compressionTechniques.md)
* [Building `onfontready`](buildingOnfontready.md)
* [Docs Home](README.md)

One of `onfontready`'s primary features is its small compressed size. Gzipped, `onfontready` is about 3.5 times smaller than its primary competitor [FontFaceObserver](https://github.com/bramstein/fontfaceobserver), even if its Promise shim is not included. Optimistically, `onfontready` should be small enough to include inline on every page, removing the need for an extra HTTP request for pages without much Javascript. Adding only 371 bytes to the gzipped total size of a page, `onfontready` is very suitable for inlining.

To achieve such high levels of compression, much research was performed into browser implementations, alternative techniques, fonts, font loading behaviors, [code golfing](https://en.wikipedia.org/wiki/Code_golf), and the nature of gzipped compression. A complete explanation of all techniques used is too large to fit here, but below are some major highlights and findings.

Unlike most small libraries, which are optimized for minified character size, `onfontready` is optimized for smallest size after gzipping. A larger minified file with lots of unnecessary duplication may gzip to a much smaller size than code that was only optimized for minified size. The techniques for compressing for gzip are different from standard code-golfing. Since [you should always be gzipping your code](https://css-tricks.com/the-difference-between-minification-and-gzipping/) anyway, the gzip size is ultimately more important than the minified size.


## Know Thy Problem
If there is one thing I've found, it is that no amount of code golfing techniques can improve compression better than recognizing fundamentally simpler ways to solve a given problem. With possession of knowledge about how browsers will react to certain sequences, what DOM elements are available when, and the nature of fonts in browsers, huge chucks of code can be removed entirely or rearranged into simpler forms.

### You Don't Need Three Tests
Many font detection libraries (including `onfontready`) rely on the fact that the browser will fall back to a fallback font when the custom font isn't available. Using the differences in size from different fallback fonts, the library can detect when the custom font has loaded because the character sequences will suddenly become equal in width. Understandably, library-makers wanted to prevent false-positives in the unlikely event that a character might be the same width in two fallback fonts. So, they generated fallback tests using serif, sans-serif, and monospace fonts.

In my research, I documented character widths across all three of these generic fonts for thousands of characters. The data shows that for characters that are different in three fonts, they will also be different in just two. And, as a corollary, characters that share the same width in two fonts also tended to share the same width in all three. Thus, it is no use to use three tests. Two fallback fonts are enough for every known case. This has the added benefit of removing 1/3rd of the processing and RAM needed by the library.

### You Don't Need Custom Sample Text
Some fonts may not contain definitions or glyphs for some characters, including those characters used by default in the test cases by `onfontready`. Thus, a mechanism had to be put in place to allow the user to specify what characters were supported so width tests could be done accurately.

However, except for the [one known exception](http://processingjs.nihongoresources.com/the_smallest_font/), all fonts appear to have the definition for the space character. By defaulting `sampleText` to a space, we can effectively support detection on 100% of fonts. This also simplified the library's usage by removing the need to specify `sampleText` on non-English fonts.

### You Don't Need `onload`
Common wisdom on the internet [claims that `onload` must be called](https://davidwalsh.name/iframe-contentwindow-null) prior to accessing an iframe's `contentWindow`. Other places show that [simply appending the iframe](http://stackoverflow.com/a/10433550/195068) is sufficient to access `contentWindow`.

Doing my own [research](tests/contentWindowAvailabilityTest/index.html), I found that `contentWindow` becomes available in every browser immediately after appending an iframe to the DOM, even in IE6. The lack of a finish-attempt at `onload` time did necessitate an extra deferred finish-attempt in the form of a `setTimeout`, but that was still a very beneficial trade.

### You Don't Need Shutdown Code
As a good code citizen, it is generally considered good practice to manually remove event listeners prior to removing elements from the DOM. In older browsers, failing to do so could cause memory leaks. On modern browsers, this is no longer a problem, because the browser's garbage collector can effectively detect circular references. Without effective understanding of how event listener references and closure functions affected the garbage collector, shutdown code had to be called to unregister event listeners.

I was able to gain a stronger understanding of what caused memory leaks, even in older browsers, by writing [more accurate tests](../tests/memoryLeakTest/index.html), reducing and simplifying the code run in event handlers, and extensive testing. The result of the research showed that even older browsers need not have shutdown code if the event listener was not a closure and references to DOM elements themselves were destroyed. This resulted in the removal of event listener shutdown code entirely and replacing it with simple DOM reference reassignments.

Here are some of the resources I used when researching memory leak behavior:

* [Memory leak patterns in JavaScript - IBM](https://www.ibm.com/developerworks/library/wa-memleak/)
* [JScript Memory Leaks - Douglas Crockford](http://javascript.crockford.com/memory/leak.html)
* [Understanding and Solving Internet Explorer Leak Patterns - MSDN](https://msdn.microsoft.com/en-us/library/bb250448(v=vs.85).aspx)
* [Memory Leaks - javascript.info](http://javascript.info/tutorial/memory-leaks)
* [Avoiding closures to avoid memory leaks - StackOverflow](http://stackoverflow.com/a/5712273/195068)
* [Setting element to null to avoid memory leaks - StackOverflow](http://stackoverflow.com/a/11838510/195068)



## Know Your HTML and CSS

* Many tags are [optional](https://www.w3.org/TR/html5/syntax.html#optional-tags), such as the `<tbody>` tag in tables.
* Many end tags are optional as well, such as `</tr>` and `</td>`.
* Quotes around attributes are [often optional](https://mothereff.in/unquoted-attributes), especially if there are no spaces in the value. Instead of `<div style="position:relative">`, try `<div style=position:relative>`.
* Use alternate styles where it makes sense. If you only need to break an element out of flow, `position:fixed;` is smaller than `position:absolute;`. If you want to prevent text wrapping, `white-space:pre;` is smaller than `white-space:nowrap;`.
* Rather than using a complex set of nested, absolutely positioned divs to guarantee an element won't create a scrollbar by extending off the right or bottom of the page, align the element relative to the bottom/right using percentages greater than 100%. This forces the element to start out-of-bounds to the top-left.


## Know Your DOM API

* `element.firstChild` is cheaper than `element.childNodes[0]`.
* If you know an element only contains two children, or you just need the last one, you can shortcut with `element.lastChild` rather than using `element.childNode[N]`.
* If setting more than one CSS property on an element, it is likely cheaper to assign them all at once using `element.style.cssText = '...';`.


## Design For Duplication
Gzip compression (and most other forms of compression) rely on the concept of reusing duplicated sequences. The longer or more frequent a sequence, the more the compressor can reduce the final size. This leads to an interesting situation where it may be optimal to increase your uncompressed size through unnecessary duplication to ultimately result in a smaller compressed size, as was discovered with [SASS mixins vs extends](http://csswizardry.com/2016/02/mixins-better-for-performance/).

Testing and iteration are necessary to achieve good results. How gzip compression will affect a specific piece of code is rarely fully predictable. However, here are some rules of thumb:

* If two or more sequences are identical except for one change, try inlining them rather than using a function.
* If it is possible to rearrange code safely, try to put the sequence differences at the beginning or end of each sequence. Remember, the longer the exact duplication, the more the compressor can compress in a single step.
* Gzip compression seems to use 2-byte references to refer back to previous similar sequences.
    - If you are generating 3-character duplicated sequences or longer, gzip will probably be able to compress them well.
  - If you are generating 2-character duplicated sequences, gzip probably won't be able to help.
  - If you can choose between a duplicated sequence of characters and using a single character alternative, you should generally use the single character. That's only 1 byte, compared to 2 bytes for a reference.
* Sometimes, very rarely, it can be beneficial to actually add code that is technically not needed in order to generate a longer duplicated sequence than would otherwise be possible. Just be careful to only add code that you know won't have a negative effect.

### Prefer Assigned Function Expressions to Function Declarations
Creating an anonymous function and assigning it to a variable often compresses better than defining functions using the `function myFunction(...) {...}` style. Since your code will likely include at least one other anonymous function, making all functions be function expressions allows the compressor to compress away all instances of `function(`, and possibly more characters with the assignment operator.

### Avoid Functions Completely
You may find that functions can be completely removed in favor of inlining code. These duplicated sequences may be highly repeatable, and thus compress well without the cost of a function expression definition.


## Apply Code Golfing Techniques
Read through [140bytes' Byte Saving Techniques](https://github.com/jed/140bytes/wiki/Byte-saving-techniques) and this [StackExchange post about Code Golfing](http://codegolf.stackexchange.com/questions/2682/tips-for-golfing-in-javascript). These are all good tips to know. However, some of them are actually detrimental to gzip compression because they favor character compression over binary compression.

Some techniques particularly helpful in `onfontready`:

* Have a "wholistic" approach to variables and state. Create all needed variables up front in the outer scope so that inner functions can just reference them, rather than relying on passed values.
* Reuse variables where possible.
* When breaking references, don't assign `null`, assign 0.
* Use truthiness and falsiness of values rather than explicit booleans where possible.
* Use fake parameters in some functions to make all functions that take parameters have the same number of parameters. After minification, these function definitions can often share their entire parameter list, increasing the duplicated sequence length.
* Use fake parameters instead of declaring variables. This can sometimes be longer than just declaring them as variables because you might have to assign them and that's two characters instead of one, per variable instance.
* Chain things where possible. If a DOM function returns the value you need to modify, even if you already have a reference, it's sometimes cheaper to just add a dot ('.') and continue operating on the returned value.
* Stick code inside function calls. Instead of `i++;someFunction();`, you can instead do `someFunction(i++);`. This is safe so long as someFunction does not expect a variable.


## Use a Minifier
There is no reason why you have to manually minify your code when a good minifier like [UglifyJS](https://github.com/mishoo/UglifyJS2) can do it for you. I have found that a majority of code golfing techniques I might otherwise apply, namely identifier mangling, can be applied automatically as a build step by Uglify. I do not recommend Closure Compiler, however. It is not as effective at this time for various reasons.


## Don't Confuse the Minifier
Be careful that you don't use code-golfed sequences that prevent the minifier from doing its job. Generally, I have found that using simple logic that is fully expanded, such as using if/else statements instead of clever boolean logic and ternary operators, has resulted in smaller code than I could have generated on my own. Minifiers like UglifyJS like simple code best. It's not that they can't compress those more complex forms, but they have to work with fewer assumptions. Don't confuse them, use simple code until you recognize a need to make it more complex. Also, you should probably never use `eval` for compression. That removes almost all assumptions the minifier might make.


## Rule of Threes
As a general principle, I have found that if you have to do something three or more times, use a function. If you have to do something only twice, inline the code. Mileage will vary, but this is one of the general principles I have found when optimizing for gzip compression. This usually works better for code than strings. Strings seem to compress better via inlining, even at three or more times.


## Rearrange Order-Independent Code 
A few bytes here and there can be saved by rearranging order-independent code and styles. Obviously, rearranging code to generate longer sequences will make for better compression. However, even simple rearrangements that seem to have no effect on the compression, such as the order in which functions are defined, can vary by several bytes. Try different variations to find an optimal order for the various parts of the program. In the future, it may be beneficial to write a permutative code generator that can try all possible combinations of code arrangement to find the smallest possible size.


## Test Test Test!
Everything above may not work. You have to just try it and test it, until you work down to the smallest code you can. Gzip compression is a dark art, but it can be learned with practice.


[◀ Back to Docs Home](README.md)
