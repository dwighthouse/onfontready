# Building `onfontready`

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

`onfontready` is built using [gulp](http://gulpjs.com/). There are build commands and watch commands for every variation of the library, along with other helpers. Below are a list of command-line commands, from most to least useful. They all assume that gulp is installed globally.

* Builds `modern` and `legacy` versions of `onfontready`, the promise shim, the `onfontsready` multi-font wrapper, and the test builds.

    ```shell
    gulp all
    ```

* Builds `modern` and `legacy` versions of `onfontready`, the promise shim, the `onfontsready` multi-font wrapper, and the test builds. Then, it watches the source files and will rebuild each output as necessary.

    ```shell
    gulp allWatch
    ```

* Builds `modern` and `legacy` versions of `onfontready`.

    ```shell
    gulp build
    ```

* Builds `modern` and `legacy` versions of `onfontready`. Then, it watches the source files and will rebuild each output as necessary.

    ```shell
    gulp buildWatch
    ```

* Builds `modern` and `legacy` versions of `onfontready` with testing code injected.

    ```shell
    gulp buildTest
    ```

* Builds `modern` and `legacy` versions of `onfontready` with testing code injected. Then, it watches the source files and will rebuild each output as necessary.

    ```shell
    gulp buildTestWatch
    ```

* Builds Promise shim for `onfontready`.

    ```shell
    gulp promise
    ```

* Builds Promise shim for `onfontready`. Then, it watches the source file and will rebuild the output as necessary.

    ```shell
    gulp promiseWatch
    ```

* Builds `onfontsready` wrapper for multi-font detection.

    ```shell
    gulp onfontsready
    ```

* Builds `onfontsready` wrapper for multi-font detection. Then, it watches the source file and will rebuild the output as necessary.

    ```shell
    gulp onfontsreadyWatch
    ```

* Builds `modern` version of `onfontready`.

    ```shell
    gulp modern
    ```

* Builds `legacy` version of `onfontready`.

    ```shell
    gulp legacy
    ```

* Builds `modern` version of `onfontready` with testing code injected.

    ```shell
    gulp modernTest
    ```

* Builds `legacy` version of `onfontready` with testing code injected.

    ```shell
    gulp legacyTest
    ```


[◀ Back to Docs Home](README.md)
