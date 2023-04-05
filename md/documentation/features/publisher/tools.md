# Publisher tools

Bundles in Oskari can provide a tool object(/Oskari clazz) that the `publisher` bundle/functionality discovers at runtime. This allows bundles to extend the publisher user-interface by adding new options for the user to see when that particular bundle is part of an application.

The tools are discovered by querying Oskari for classes with protocol `Oskari.mapframework.publisher.Tool`
 (See example tool class below with `'protocol': ['Oskari.mapframework.publisher.Tool']`).

```javascript
Oskari.clazz.define('Oskari.mybundle.publisher.MyPluginTool', function () {},
{
    // in which group this tools should be in. Every group gets its own panel in publisher UI
    group: 'data',
    // bundleName is used only by this tool
    bundleName: 'mybundle',
    // definition of what plugin is controlled by this tool
    // and what is its starting configuration when the tool is enabled
    getTool: function () {
        return {
            id: 'Oskari.mybundle.MyPlugin',
            // title is the UI label for the tool
            title: Oskari.getMsg('mybundle', 'tool.label'),
            config: {
                ...(this.state.pluginConfig || {})
            }
        };
    },
    // process the embedded map "data"/app setup and detect if this tool was enabled on it
    init: function (data) {
        if (!data || !data.configuration[this.bundleName]) {
            return;
        }
        const conf = data.configuration[this.bundleName].conf || {};
        this.storePluginConf(conf);
        this.setEnabled(true);
    },
    // return values to be saved based on if this tool was enabled or not
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
3) `mapmodule` is queried for plugins with `plugin.isShouldStopForPublisher()` returning true (this defaults to `plugin.hasUI()` returning true). All of these plugins are shutdown/stopped to clean the map state for publisher functionality.
4) Gathers/discovers all tool classes that are available on the application, creates an instance of them and groups the tools based on the group value of the tools
5) Creates the panels based on tool groups and calls `tool.init(data)` for all tools
6) Any panels that have tools where `tool.isDisplayed(data)` returns true are shown to the end user

When the user exits the publisher:
1) On save: calls `tool.getValues()` to gather a payload for saving the embedded map based on end user selections to database
2) calls `tool.stop()` - this is where the tool should clean up anything that it has started when the publisher functionality was running
3) Starts all plugins that were stopped on the step 3 of startup to restore normal geoportal functionality.

# Publisher tool API

Many of these are handled by the `publisher/tools/AbstractPluginTool` base class. Take a look at it before overriding the functions:

- `init(dataObject)` receives the data for the embedded map and should use that data to detect if the tool is enabled when a user edits an embedded map.
- `isDisplayed(dataObject)` should return true if a selection for the tool should be shown to user. The function receives the publisher data as parameter and can use the data to detect if it should be shown. Most of the tools return true, but some examples of cases for this are:
    - the feature data table isn't shown if there are no layers that have feature data
    - LogoPlugin isn't displayed as a selection to user as it's always included. However a tool is provided for it to allow user to select the placement for the logo on the embedded map.
    - statistical data tools return false if there are no statistical data on the map
- `setEnabled(boolean)` Try using the version from base class and use _setEnableImpl() instead when possible. Starts/stops the functionality on the map (like map plugin). Should send `Publisher2.ToolEnabledChangedEvent` to allow the plugin placement mode to be activated when a tool is selected when the mode is active. Called when the user selects/deselects the tool on the publisher.
- `_setEnabledImpl(boolean)` setEnabled is implemented on `AbstractPluginTool` base class. This is an extension hook for custom handling for enabling/disabling the tool.
- `isEnabled()` should return true if the tool is selected
- `isDisabled()` related to isDisplayed(). This allows the selection to be shown even if user can't select it. A tooltip can be included to show the user why the tool is disabled. An example is that map legeneds selection is shown but is disabled if layers on the map don't have legend available.
- `stop()` called when the user exits publisher functionality. The tool should clean up after itself on this function (for example shutting down things added to the map while on publisher).
- `getValues()` should return how the user selections for the tool should affect the appsetup JSON on the embedded map. This should match the logic that `init()` uses for detecting if the tool should be enabled when editing an embedded map.
- `getTool()` This should return an object with keys:
    - id: the value should match a plugin class name that this tool controls. If this doesn't control a plugin it can be any unique value, but then you need to override some of the functions in base class
    - title: This should return a label that is shown to the user as a selection what this tool does (jQuery-based tools assume this is a key reference to get the label from localization)
    - config: This should return the plugin config that the tool.init() received when the tool is started
    - hasNoPlugin: If the tool is NOT handling a plugin that is referenced in the id, you can return true here to have `AbstractPluginTool` skip starting and stopping the plugin.
    - disabledReason: Oskari.getMsg('mybundle', 'tool.toolDisabledReason') This can be used to return a string to show the user as a tooltip when the tool is disabled for letting the user know why it can't be selected. (Works only for React-based tools currently)

For older jQuery-based tools:
- `getExtraOptions()` should return a jQuery-object that allows users to do additional selections for the tool.
For React-based tools:
- `getComponent()` This is used by new tools that create the tool "extra options" using React. Returns an object that can have keys (if keys are missing the tool doesn't have extra options):
    - component: React-component that is rendered to show the extra options for this tool
    - handler: Reference to a `UIhandler` for handling the extra options
