# Oskari Core

The Oskari core functionality is located in `/sources/framework/`. The core is a normal Oskari class that is initiated in the `mapfull` bundle. The core is responsible for keeping references to selected map layers and other common functionality. It also provides handlers for common requests. The core is usually not accessed directly from bundles but through Oskari sandbox. An exception is made with request handlers which get reference to the core directly.

## Sandbox

Sandbox offers access to the core methods. It can be used to register modules, send requests and events etc. Sandbox can also be used to get references to registered bundles, available map layers and much more. Currently bundle instances get reference to it through a global variable in start method with:


    // the getSandbox method takes an optional sandbox name as an argument
    var sandbox = Oskari.getSandbox();

Bundles should take the reference at start and pass it along to functionalities and not reference it through the global variable after that since it can change at some point.

![Sandbox](/images/documentation/sandbox.png)