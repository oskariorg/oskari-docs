# Map module plugins

Map View Plugins are used to add or enhance functionality on the map module or adding controls that are shown on top of the map. There are some plugins that are included in the map module itself and can be activated by referencing them on the map configuration when the application is started (app setup configuration). Map module plugins can also be implemented in other bundles and registered on the map module when the bundle is instantiated.

Plugins have easy access to the map library instance (like OpenLayers) for easily extending the map capabilities. However when possible it's recommended to use the mapmodule functions for operating the map when possible to make plugins usable with other map engines as well.

Plugins with user-interfaces are usually located (DOM) containers on one of the corners of the map or on the center on top or bottom of the map. The map module provides the containers where plugins can be placed.

# Guidelines for implementing map plugins with UI

For maximum compatibility it's recommended to follow these guidelines when developing map plugins:

1) Expect plugin configuration object as the first constructor parameter

There are abstract base classes that save the first parameter received by the plugin so it can be accessed with getConfig() and setConfig(). This is especially important when developing a plugin that can be enabled on an embedded map with the `publisher` functionality.

The configuration structure can be whatever the plugin allows to be configured, but for the location of the plugin uses the following structure:
```
{
    "location": {
        "classes": "[ location string ]"
    }
}
```

Where location string is one of:
- top left
- top center
- top right
- bottom left
- bottom center
- bottom right

2) Extend base class

This makes it easy to work with in publisher etc.

The usual extension point is `BasicMapModulePlugin`([GitHub](https://github.com/oskariorg/oskari-frontend/blob/develop/bundles/mapping/mapmodule/plugin/BasicMapModulePlugin.js)).

For more lower level plugin you can extend `AbstractMapModulePlugin` ([GitHub](https://github.com/oskariorg/oskari-frontend/blob/develop/bundles/mapping/mapmodule/plugin/AbstractMapModulePlugin.js)).

```javascript
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
    function (config) {
        // _name is referenced in base class as part of getName()
        this._name = 'CoordinateToolPlugin';
        // clazz is used for publisher functionality to identify plugins that can or can't be in the same container
        this._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin';
        // _index is used to sort plugins that are shown in the same plugin container
        // the number is relative to other plugins values
        // the lower the number, the closer the edge of the screen it's shown (either on top or bottom)
        // on top containers lower is on top (~first)
        // on bottom containers lower is at the bottom (~last)
        this._index = 60;
        // if the plugin doesn't get location on config, this is where it starts
        this._defaultLocation = 'top right';
    }, {
        _createControlElement: function () {
            return jQuery('<div class="mapplugin coordinatetool"></div>');
        },
        _startPluginImpl: function () {
            // starting point of the plugin, called on mapmodule.startPlugin(plugin)
            this.setElement(this._createControlElement());
            this.addToPluginContainer(this.getElement());
            this.refresh();
        },
        refresh: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            // render the UI here
            // is called when map size changes desktop/mobile mode or theme changes etc
            // plugins can use Oskari.util.isMobile() to modify their appearance on smaller screens
        },
        resetUI: function () {
            // optional - close open popups etc reset the UI to starting state
            // used for example by publisher to prepare plugins for drag-n-drop mode
        },
        hasUI: function () {
            // override if the plugin has no UI/doesn't need to be refreshed when map size or theme etc changes
            return true;
        },
        _stopPluginImpl: function () {
            // remove plugin from screen, close popups etc
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
```

## Other tips for implementing plugins 

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
