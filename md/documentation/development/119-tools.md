# Development Tools

## Sequence Diagrams

Framework supports generating runtime Sequence Diagrams when debug mode is enabled (setting `Oskari.setDebugMode(true);`). Run this in browser console to get a Sequence Diagram of requests and events:

```javascript
Oskari.getSandbox().popUpSeqDiagram();
```

## API documentation

The JavaScript API documentation is created from source comments/annotations using [​YUIDoc](http://yui.github.io/yuidoc/). The results can be seen in [here](/api/latest).

### Object type quick guide

* Text = `{String}`
* Boolean = `{Boolean}`
* Numeric values = `{Number}`
* Oskari class = `{Oskari.<mynamespace>.bundle.<mybundle>.MyClass}`
* Multiple possible values = for example `{Number/OpenLayers.Bounds}`
* JSON "configuration" = `{Object}`
* Try not to use Array or Object if you have any chance to be more specific. For example instead of `{Array}` you could use `{String[]}`

* Class documentation with `@class <class name>`
* Method documentation with `@method <method name>`
* Mark methods that are only used internally with `@private` and prefix method name with _.
* Mark parameters with `@param {<Type>} <paramname>`
* Mark return value with `@return {<Type>}`

## Editors

* [VS Code](https://code.visualstudio.com/) is the Oskari team's editor of choice for JavaScript development
* [IntelliJ IDEA](https://www.jetbrains.com/idea/) has been found useful IDE for Oskari Java development.
* If you're developing on a Windows machine, we recommend using [cmder](https://cmder.app/)

## Profiler

<div class="row">
    <div class="col-md-2">
        <img src="/images/logo/yourkit.png" />
    </div>
    <div class="col-md-10">
        For any profiling purposes YourKit has been very useful in debugging hard to solve issues while developing Oskari.
        YourKit supports open source projects with innovative and intelligent tools for monitoring and profiling Java and .NET applications.
        YourKit is the creator of <a href="https://www.yourkit.com/java/profiler/" target="_blank" rel="noopener noreferrer">YourKit Java Profiler</a>, 
        <a href="https://www.yourkit.com/dotnet-profiler/features/" target="_blank" rel="noopener noreferrer">YourKit .NET Profiler</a>, and 
        <a href="https://www.yourkit.com/youmonitor/download/" target="_blank" rel="noopener noreferrer">YourKit YouMonitor</a>.
    </div>
</div>


