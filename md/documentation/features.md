# Oskari Features
​
## General
​
* Support for multiple languages. Currently English, Finnish and Swedish are available. A limited set of functionalities have been translated into following languages:
  * Estonian
  * German
  * French
  * Italian
  * Spanish
  * Dutch
  * Nynorsk
  * Norsk bokmål
  * Slovenian
  * Slovakian
  * Icelandic
* Works with all major browsers: IE9+, latest versions of Firefox, Chrome and Safari
* The interface should work with modern tablets and smartphones, currently there is no separate mobile/tablet-optimized version of the main map
  * Embedded map tools are gradually developed into responsive tools which work well with smaller screens and are touch-friendly
* Some Oskari modules can make use of role-based user management. Users belonging to different roles can be given access to specific functionality
* Authentication and SSO is supported using SAML 2.0

### Map window
​
* Supported layer types:
 * WMS
 * WMTS
 * WFS (requires backend)
 * ArcGIS Cache layers
 * ArcGIS REST feature layers
* Tile size and image format parameters are configurable
* Coordinate system is configurable
* Coordinate display adapts according to configured coordinate system
* Zoom bar with a configurable number of zoom levels
* Pan map view
* Restore initial map state
* Scale bar

### GetFeatureInfo
​
* Always active, starts by a single click / tap on the map
* All GFI enabled map layers are queried on the single click
* Response is shown in a popup dialog
* Response can be styled using XSLT transformation (requires backend)
* Multiple response types are supported

### Mouse click functions
​
* Panning by dragging
* Zoom in by double clicking on the map
* GetFeatureInfo action with a single click on all map layers with GFI enabled
* Feature information is returned also from WFS layers

### Menu bar
​
* Menu entries can be configured individually
* Menu can be hidden (together with the toolbar)

### Location search
​
* One-field search which can return search results from multiple sources, such as placename, address, cadastral parcel or similar services
* Service access parameters are configurable in the backend

### Metadata search
​
* Search for metadata from a CSW backend
* Advanced search options
* Display resulting layers on the map

### Map layer selector
​
* List of available map layers, grouped either by theme or by data provider
* Add map layer to map view
* Filter layers function
* Show metadata for layers (link to the metadata display module, which accesses CSW interface)
* Supported layer types are:
 * map layer
 * map layer stack,
 * background map layer
 * WFS layer
 * thematic map layer
 * analysis results layer
 * own data layer
 * time-enabled WMS layer (WMS-T)
* New map layer types can be added programmatically

### Selected map layers
​
* List of layers displayed in the map view
* Layers have localized titles and subtitles (optional)
* Layer opacity can be controlled using a slidebar or by entering opacity percentage
* Layers can be temporarily hidden and shown
* Show metadata for layer (link to the metadata display portlet, which accesses CSW interface)
* Layers can be organized in the layer stack by dragging and dropping
* WFS layers provide a link to attribute information table
* WFS layer style can be changed on a temporary basis
* GeoServer-backed WMS-layers can be visualized as heatmaps
* For WMS-layers the available styles can be viewed and selected for use

### Map Legends
​
* Flyout shows map legends from all selected layers

### Toolbar
​
* Toolbar buttons can be disabled and enabled individually
* Toolbar can be hidden
* Restore initial map state button
* Map view history manager: back and forward buttons
* Rubber band zoom button
* Drag & pan button (enabled by default)
* Measurement tools: distance and area
* Marker tool: markers with associated text can be created on the map and sent as link
* Link map view: creates an url which opens the current map view
* Print map view: starts the print mode
* Save map view: Map view configurations can be saved by logged-in user
* Find nearest place tool: Find the nearest placename by clicking on the map
* Tools can be made to appear when a specific map layer is added to selected layers list

### Flyout manager
​
* Flyouts can be opened from the menu, moved around the map window and closed by the user or programmatically
* Flyout size adapts to screen size
* Some flyouts can be resized by the user

### WFS layers and attribute data table (requires backend)
​
* Attribute data from WFS layers can be displayed in an attribute table
* Also complex schema WFS layers can be displayed
* Table view is synchronized with the map view: attribute rows are shown only for the features visible on the map
* Columns to be shown can be selected
* Data can be sorted ascending/descending
* Features can be highlighted by clicking either on the map or in the table rows
* Shift / Ctrl can be used to select multiple rows

### Create map mode (requires backend)
​
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
​
* Points, lines and areas can be created and saved
* Multigeometries and creation of holes is supported
* Multiple layers can be created
* Symbology is separately configurable for each layer
* Description of map view can be edited and may contain links to external resources

### Print mode (requires backend)
​
* Paper size and layout selection
* Automatic Print preview window
* Printout format selection: PNG or PDF, also PDF/A
* Title, scalebar, date and a logo can be added, also text and markers of your choice

### Import data (requires backend)
​
* Supported format for importing data as zipped files
 * Shapefile
 * Mapinfo MID/MIF
 * GPX trace
 * KMX (zipped KML)

### Embedded map features (requires backend)
​
* Zooming and panning
* Measure tools
* GetFeatureInfo
* WFS tabular data display
* Map layer menu
* Supported layer types
 * WMS
 * WMTS
 * WFS
 * My Data
 * Imported data
 * Thematic Maps and Tables
 * Analysis results
 * ArcGIS rest Feature Layer
* Address, placename and real estate search
* Customizable layout (colours and tool positioning)
* Customizable size (preset size, fill space available)
* Find my location
* RPC API for interaction with the web site where the map is embedded
* RPC API features are listed separately here: http://oskari.org/examples/rpc-api/rpc_example.html

### Thematic Maps (requires backend)

http://www.oskari.org/documentation/bundles/framework/mapstats
​
* Creation of thematic maps by joining statistical data and administrative units
* Importing own statistical indicators
* Downloading of indicator data into CSV/Excel formats

### Spatial Analysis (requires backend)
http://www.oskari.org/documentation/bundles/framework/mapanalysis
​
* Available analysis methods:
 * Buffer
 * Descriptive statistics
 * Union
 * Clip
 * Geometric filter
 * Analysis Layer Union
 * Buffers and sectors
 * Difference Computation
 * Spatial join
* Draw your own feature to be used in analysis
* Clip a feature
* The analysis tool also provides functionality to use search channel results as input for analysis.

### Authentication and user management (requires backend)
​
* Bundle for user management
* Bundle for management of layers privileges

### Digiroad Feature selector
​
* Adds a grid to display features fetched via WFS or some other protocol supported by OpenLayers
* Users can view the features and edit their attributes
* Features get added to the grid when the user clicks on the map. Alt and Ctrl keys can be used as modifiers
* A proxy is needed in case features are fetched via WFS

### Features in the 2016 roadmap
​
* Improvements and additions to RPC API functionalities
* Oskari 2.0 - even more modularity
* Improved mobile device support
* Support for 3D visualization
* Quality improvements and code restructuring
* Thematic mapping tools with access to several types of statistical data (JSON, JSON-stat, SDMX)
* Coordinate system changeable on-the-fly
