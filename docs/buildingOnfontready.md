# Building `onfontready`

`onfontready` is built using [gulp](http://gulpjs.com/). There are build commands and watch commands for every variation of the library, along with other helpers. Below are a list of command-line commands, from most to least useful. They all assume that gulp is installed globally.

* Builds `modern` and `legacy` versions of `onfontready`, the promise shim, the `onfontsready` multi-font wrapper, and the test builds.
    ```
    gulp all
    ```
* Builds `modern` and `legacy` versions of `onfontready`, the promise shim, the `onfontsready` multi-font wrapper, and the test builds. Then, it watches the source files and will rebuild each output as necessary.
    ```
    gulp allWatch
    ```
* Builds `modern` and `legacy` versions of `onfontready`.
    ```
    gulp build
    ```
* Builds `modern` and `legacy` versions of `onfontready`. Then, it watches the source files and will rebuild each output as necessary.
    ```
    gulp buildWatch
    ```
* Builds `modern` and `legacy` versions of `onfontready` with testing code injected.
    ```
    gulp buildTest
    ```
* Builds `modern` and `legacy` versions of `onfontready` with testing code injected. Then, it watches the source files and will rebuild each output as necessary.
    ```
    gulp buildTestWatch
    ```
* Builds Promise shim for `onfontready`.
    ```
    gulp promise
    ```
* Builds Promise shim for `onfontready`. Then, it watches the source file and will rebuild the output as necessary.
    ```
    gulp promiseWatch
    ```
* Builds `onfontsready` wrapper for multi-font detection.
    ```
    gulp onfontsready
    ```
* Builds `onfontsready` wrapper for multi-font detection. Then, it watches the source file and will rebuild the output as necessary.
    ```
    gulp onfontsreadyWatch
    ```
* Builds `modern` version of `onfontready`.
    ```
    gulp modern
    ```
* Builds `legacy` version of `onfontready`.
    ```
    gulp legacy
    ```
* Builds `modern` version of `onfontready` with testing code injected.
    ```
    gulp modernTest
    ```
* Builds `legacy` version of `onfontready` with testing code injected.
    ```
    gulp legacyTest
    ```


[◀ Back to Docs](README.md)
