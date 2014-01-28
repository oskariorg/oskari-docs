# Oskari Features

## General

* Support for multiple languages. Currently English, Finnish and Swedish are available.
* Works with all major browsers: IE8+, latest versions of Firefox, Chrome and Safari
* The interface should work with modern tablets and smartphones, currently no separate mobile/tablet-optimized version
* Some Oskari modules can make use of role-based user management. Users belonging to different roles can be given access to specific functionality

### Map window

* Supports displaying WMS and WMTS layers
* WFS layers are supported and can be displayed (requires backend)
* Tile size and image format parameters are configurable
* Coordinate system is configurable
* Coordinate display adapts according to configured coordinate system
* Zoom bar with a configurable number of zoom levels
* Pan map view
* Restore initial map state
* Scale bar

### GetFeatureInfo

* Always active, starts by a single click / tap on the map
* All GFI enabled map layers are queried on the single click
* Response is shown in a popup dialog
* Response can be styled using XSLT transformation (requires backend)
* Multiple response types are supported

### Mouse click functions

* Panning by dragging
* Zoom in by double clicking on the map
* GetFeatureInfo action with a single click on all map layers with GFI enabled
* Feature information is returned also from WFS layers

### Menu bar

* Menu entries can be configured individually
* Menu can be hidden (together with the toolbar)

### Location search

* One-field search which can return search results from multiple sources, such as placename, address, cadastral parcel or similar services
* Service access parameters are configurable in the backend

### Map layers

* List of available map layers, grouped either by theme or by data provider
* Add map layer to map view
* Filter layers function
* Show metadata for layers (link to the metadata display module, which accesses CSW interface)
* Supported layer types are: map layer, map layer stack, WFS layer, thematic map layer, background map layer
* New map layer types can be added programmatically

### Selected layers

* List of layers displayed in the map view
* Layers have localized titles and subtitles (optional)
* Layer opacity can be controlled using a slidebar or by entering opacity percentage
* Layers can be temporarily hidden and shown
* Show metadata for layer (link to the metadata display portlet, which accesses CSW interface)
* Layers can be organized in the layer stack by dragging and dropping
* WFS layers provide a link to attribute information table

### WFS layer attribute data table

* Attribute data from WFS layers can be displayed in an attribute table
* Table view is synchronized with the map view: attribute rows are shown only for the features visible on the map
* Columns to be shown can be selected
* Data can be sorted ascending/descending
* Features can be highlighted by clicking either on the map or in the table rows
* Shift / Ctrl can be used to select multiple rows

### Map Legends

* Flyout shows map legends from all selected layers

### Create map mode (requires backend)

* Tool for creating embedded map windows
* The embeddable map window is shown in WYSIWYG mode
* The embedded map has same basic functions as the main map
* Embedded map parameters are name, website and language
* Size can be configured
* Tools available in the embedded map: scale bar, index map, zoom bar, search field
* Map functions which can be enabled or disabled: panning by dragging, GetFeatureInfo
* Created embedded maps are saved and can be later edited
* Status of an embedded map can be either published or unpublished

### My Data (requires backend)

* Points, lines and areas can be created and saved
* Multigeometries and creation of holes is supported
* Multiple layers can be created
* Symbology is separately configurable for each layer
* Map views can be saved and restored
* Description of map view can be edited and may contain links to external resources

### Toolbar

* Toolbar buttons can be disabled and enabled individually
* Toolbar can be hidden
* Restore initial map state button
* Map view history manager: back and forward buttons
* Rubber band zoom button
* Drag & pan button (enabled by default)
* Measurement tools: distance and area
* Link map view: creates an url which opens the current map view
* Print map view: starts the print mode
* Tools can be made to appear when a specific map layer is added to selected layers list

### Print mode (requires backend)

* Paper size and layout selection
* Automatic Print preview window
* Printout format selection: PNG or PDF
* Title, scalebar, date and a logo can be added

### Flyout manager

* Flyouts can be opened from the menu, moved around the map window and closed by the user or programmatically
* Flyout size adapts to screen size
* Some flyouts can be resized by the user

### Digiroad Feature selector

* Adds a grid to display features fetched via WFS or some other protocol supported by OpenLayers
* Users can view the features and edit their attributes
* Features get added to the grid when the user clicks on the map. Alt and Ctrl keys can be used as modifiers
* A proxy is needed in case features are fetched via WFS

## Features in the 2013 roadmap

* Thematic mapping tools
* Spatial analysis tools
* Customization of embedded maps
* Improved WFS access (performance, stored query support)
* Improved tools for visualization of WFS features