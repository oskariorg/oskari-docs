# Publisher tools

Functionalities can provide a tool object that publisher discover by querying Oskari for classes with protocol `Oskari.mapframework.publisher.Tool` (TODO: elaborate what this means).

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
- `getTool()` TODO: add documentation

For older jQuery-based tools:
- `getExtraOptions()` should return a jQuery-object that allows users to do additional selections for the tool.
For React-based tools:
- `getComponent()` TODO: add documentation
