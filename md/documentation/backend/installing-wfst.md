# Content editor

Oskari bundle **content-editor** extends Oskari functionality to support editing of wfs layer features and feature geometries.

Available in Oskari 1.36 or above.

## Prerequisites

These instructions build upon installation of the Jetty package. Download and install as intructed here: [Setup Jetty](/documentation/backend/setup-jetty).

### Front-end

This bundle needs Oskari version 1.36 or above

### Back-end

This functionality needs Oskari version 1.36 or above  (oskari-map.war and transport.war)

## Installation

Goto jetty folder

```
cd jetty-8.1.16-oskari
```


### Configuration

Add new permission type to oskari-ext.properties in `[jetty-home]/resources` folder

```
permission.types = EDIT_LAYER_CONTENT
permission.EDIT_LAYER_CONTENT.name.fi=Muokkaa tasoa
permission.EDIT_LAYER_CONTENT.name.en=Edit layer
```

Add `content-editor` bundle dynamically to correct roles (`Admin` in this case) in `oskari-ext.properties`. For example:

```
actionhandler.GetAppSetup.dynamic.bundles = admin-layerselector, admin-layerrights, admin-users, admin, content-editor
actionhandler.GetAppSetup.dynamic.bundle.content-editor.roles = Admin
```


Enter to jetty directory and start the Jetty by running
```
java -jar start.jar
```

## Use case in Oskari

1. Find/add a wfs layer to Oskari which has wfs-t enabled or import your own layer to Oskari Geoserver (e.g. with shp2pgsql-gui.exe)
2. Add 'Edit' right for the layer in Oskari Layer Rights.
3. Add the wfs layer to map and the 'feature editor' link is available in the selected layers flyout.

## Remarks

- Editing has been tested mostly for geometries in EPSG:3067 CRS for time being. Others may work, but are not tested.

- Update SRID to your wfst layer before editing, if it is 0 (default)

```
UPDATE [table] SET <geometry>=ST_SetSRID([geometry field],3067)
```

WFS layer doesn't work e.g. for MapClick, if there is mixed SRID in the [table]. Mixed Srid can be detected with this sql:
```
Select distinct(ST_SRID([geometry field])) as srid, count(*) from [table] group by srid;
```

- Features with overlapping geometries are not handled properly and cause problems.