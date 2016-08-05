# Mobile mode

Oskari supports mobile mode, which means that certain map plugins adapt to changes in map size. Mobile mode is made primarily for published maps, but it also works in main map view.

Published map changing to mobile mode:

<img src="/images/documentation/published_map_mobile.png" alt="Oskari mobile mode published" height="350"/>

Main map view changing to mobile mode:

<img src="/images/documentation/main_map_mobile.png" alt="Oskari mobile mode main view" height="350"/>

When the device is detected as mobile client or map size is small enough (max 500x400px) the map calls for plugins to redraw the UI in "mobile mode". This happens by calling the redrawUI() for any plugin that is registered on the mapmodule and has such a function. Mapmodule provides an extra toolbar and a container for plugins to use in "mobile mode".

## Mapmodule plugins and redrawUI()

Plugin UI rendering/starting calls setEnabled and setVisible:

    this.setEnabled(blnEnabled);
    this.setVisible(blnVisible);

If getElement() doesn't return an element, setVisible(true) calls a new function redrawUI(blnUseMobileMode, blnForced), which is responsible for renderering the UI. Plugins using the default implementation in BasicMapModulePlugin don't do anything after the initial redrawUI call. **Any plugin that supports mobile mode should override the default redrawUI()** to move it's UI to a "mobile mode" meaning a more compact UI in the plugin container or adding a button to the mobile toolbar that can be used to open a larger ui in a popup on top of the map. There are additional functions to help registering the toolbar buttons on BasicMapModulePlugin like addToolbarButtons().

<img src="/images/documentation/mobile_toolbar.PNG" alt="Oskari mobile mode toolbar" height="300"/>

If a plugin supports mobile mode and requires toolbar bundle for it, but toolbar isn't available when the plugin is started, the redrawUI should return with boolean true value signalling that it needs another attempt to create the UI. If the second parameter for redrawUI() is a boolean true, the plugin should make any effort possible to create it's UI even if it means creating the desktop UI in mobile mode. This is in a case when all the bundles of the application have been started and toolbar has not been part of the application or is not available. Another call to redrawUI() is done by mapmodule for any plugin that returned true from previous redrawUI call(). The call is done when the toolbar is loaded.

RedrawUI() is also called when the mapsize changes from mode to another or on any other occasion when the UI needs to be redrawn (style change etc). It should teardown any UI it has created before recreating another version of the UI.

Calls to redrawUI() are done in orderly fashion. Plugins are sorted by values from plugin.getIndex() function, or if no such function exist, the plugin is treated as having a large index value.

