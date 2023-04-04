# Publisher tools

Functionalities can provide a tool object that the `publisher` functionalities discover by querying Oskari for classes with protocol `Oskari.mapframework.publisher.Tool` (See example tool class below with `'protocol': ['Oskari.mapframework.publisher.Tool']`).

```javascript
Oskari.clazz.define('Oskari.mapframework.publisher.tool.CoordinateTool', function () {},
{
    getTool: function () {
        return {
            id: 'Oskari.mybundle.MyPlugin',
            title: 'UI label for the tool',
            config: {
                ...(this.state.pluginConfig || {})
            }
        };
    },

    bundleName: 'mytool',

    init: function (data) {
        if (!data || !data.configuration[this.bundleName]) {
            return;
        }
        var conf = data.configuration[this.bundleName].conf || {};
        this.storePluginConf(conf);
        this.setEnabled(true);
    },
    getValues: function () {
        if (!this.isEnabled()) {
            return null;
        }
        return {
            [this.bundleName]: {
                whatever: 'config'
            }
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
```

When the user starts the publisher:
1) `UIChangeEvent` is sent to notify other functioanalities to shut themselves down to avoid conflicts for screen space.
2) `StateHandler.SetStateRequest` is used to set the application state (based on the embedded map that is being edited).
3) `mapmodule` is queried for plugins with isShouldStopForPublisher() returning true (this defaults to hasUI() returning true). All of these plugins are shutdown/stopped to clean the map state for publisher functionality.
4) Gathers all tool classes, creates an instance of them and groups the tools based on panels
5) Creates the panels based on tool groups and calls tool.init() for all tools

When the user exits the publisher:
1) On save: calls tool.getValues() to gather a payload for saving to database
2) calls tool.stop()
3) Starts all plugins that were stopped on the step 3 of startup to restore normal geoportal functionality.

# Publisher tool API

Many of these are handled by the `publisher/tools/AbstractPluginTool` base class. Take a look at it before overriding the functions:

- `setEnabled(boolean)` starts/stops the functionality on the map (like map plugin). Should send `Publisher2.ToolEnabledChangedEvent` to allow the plugin placement mode to be activated when a tool is selected when the mode is active. Called when the user selects/deselects the tool on the publisher.
- `_setEnabledImpl(boolean)` setEnabled is implemented on AbstractPluginTool base class. This is an extension hook for custom handling for enabling/disabling the tool.
- `isEnabled()` should return true if the tool is selected
- `init(dataObject)` receives the data for the embedded map and should use the data to detect if the tool is enabled when a user edits an embedded map.
- `isDisplayed(dataObject)` should return true if a selection for the tool should be shown to user. The function receives the publisher data as parameter and can use the data to detect if it should be shown. Most of the tools return true, but some examples of cases for this are:
    - the feature data table isn't shown if there are no layers that have feature data
    - LogoPlugin isn't displayed as a selection to user as it's always included. However a tool is provided for it to allow user to select the placement for the logo on the embedded map.
- `isDisabled()` related to isDisplayed(). This allows the selection to be shown even if user can't select it. A tooltip can be included to show the user why the tool is disabled. An example is that map legeneds selection is shown but is disabled if layers on the map don't have legend available.
- `stop()` called when the user exits publisher functionality. The tool should clean up after itself on this function (for example shutting down things added to the map while on publisher).
- `getTool()` This should return an object with keys:
    - id: the value should match a plugin class name that this tool controls. If this doesn't control a plugin it can be any unique value, but then you need to override some of the functions in base class
    - title: This should return a label that is shown to the user as a selection what this tool does
    - config: This should return the plugin config that the tool.init() received when the tool is started
    - TODO: add documentation as there can be others as well (something that handles )

For older jQuery-based tools:
- `getExtraOptions()` should return a jQuery-object that allows users to do additional selections for the tool.
For React-based tools:
- `getComponent()` This is used by new tools that create the tool "extra options" using React. TODO: add documentation
