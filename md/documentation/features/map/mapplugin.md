# Mapmodule plugin

## API 
- plugins should expect config object as first constructor parameter. The object can have location.classes path with a string value pointing to one of the possible plugin containers on map corners or center
- should create their UI in `_startPluginImpl()`. If they can't create UI because of dependencies that are started later the function can return a boolean true. This makes mapmodule call redrawUI() after the whole application has been started.
- `refresh()` is called when for example the theme changes or the UI needs to be updated for some reason. However plugins need to return true from hasUI() to be refreshed by mapmodule.
- `_stopPluginImpl()` is called when the plugin is shutdown (by for example publisher). The plugin should clean up after itself and consider 
- `getElement()` should return a reference to the plugin root element as jQuery object if they have the UI initialized
- `resetUI()` is a hook where the plugin should close any open popups they have etc "reset their UI". This is used by for example publisher when entering the plugin drag-n-drop mode
- `init()` the startPlugin() in base class registers the plugin to sandbox which in turn calls the init() function on startup.

- `_createControlElement()` should create a root element where the plugin is rendered. This is more of a convention than anything required from plugins and might not be necessary anymore.
- `teardownUI()` was used for changing between mobile <> desktop modes and is more of a convention in plugins than anything required from them. Plugins could refactor this out and most cases should be ok with just resetUI() and stopPlugin().

Changes that are being considered:
- `_createControlElement()` doesn't need to be an API function and plugins should create their root however they wish
- `redrawUI()` was previously used to re-render the UI when browser size changed between desktop/mobile modes. Currently the way to refresh plugins is done by calling their `refresh()` function. 
Currently `redrawUI()` is called if startPlugin() returns boolean true so it's still needed. However we could design around this or call it something like `lazyStartPlugin()` to make it more clear how it's different from `refresh()`
- An ES class should be implemented for plugin base classes so it's easier to call functions from base class. This would make _startPluginImpl() etc unnecessary as plugins could override startPlugin() and call super.startPlugin() from the override function.

Removed:
- `changeToolStyle()` -> `refresh()` should be used instead.