# Content editor

Tampere Oskari bundle **content-editor**

Extends Oskari functionality to support editing of wfs layer features and feature geometries.

Available in Oskari 1.36 or above.

## Prerequisites

These instructions are based on  jetty-8.1.16-oskari package.

### Front-end

This bundle needs Oskari version 1.36 or above

### Back-end

This functionality needs Oskari version 1.36 or above  (oskari-map.war and transport.war)

##### Database

Oskari database is needed without any special configuration

## Installation

Create base folder i.e. Tampere
```
mkdir Tampere
```

Change directory to Tampere

```
cd Tampere
```

http://oskari.org/download

Download Oskari (http://oskari.org/build/server/jetty-8.1.16-oskari.zip) and extract archive to current (new created) directory


Goto jetty folder

```
cd jetty-8.1.16-oskari
```


### Configuration

Add new permission type to oskari-ext.properties in [jetty-home]/resources folder

<pre class="event-code-block">
<code>
permission.types = EDIT_LAYER_CONTENT
permission.EDIT_LAYER_CONTENT.name.fi=Muokkaa tasoa
permission.EDIT_LAYER_CONTENT.name.en=Edit layer
</code>
</pre>

Add bundle dynamically to correct roles in oskari-ext.properties. For example:

<pre class="event-code-block">
<code>

actionhandler.GetAppSetup.dynamic.bundles = admin-layerselector, admin-layerrights, admin-users, admin, content-editor
actionhandler.GetAppSetup.dynamic.bundle.content-editor.roles = Admin

</code>
</pre>


Enter to jetty directory and run
```
java -jar start.jar
```

Use case in Oskari

<pre class="event-code-block">
<code>

Find out a wfs layer, which is enabled to wfs-t or import your own layer to Oskari Geoserver (e.g. with shp2pgsql-gui.exe)
Add 'Edit' right  to that layer in Oskari Layer Rights method.
Then select the wfst layer in Oskari and the 'feature editor' link is available in layer selection.

</code>
</pre>

### Remarks

<pre class="event-code-block">
<code>
Editing is only available for geometry in EPSG:3067 CRS for time being.
Update SRID  to your wfst layer before editing, if it is 0 (default)

**( UPDATE [table] SET <geometry>=ST_SetSRID([geometry field],3067) )**

WFS layer doesn't work e.g. for MapClick, if there is mixed SRID in the [table].
Mixed Srid could be checked with below sql:
**Select distinct(ST_SRID([geometry field])) as srid, count(*) from [table] group by srid;**

</code>
</pre>

### Known issues

Geometry type of geometry-column must be **Geometry, MultiPoint, MultiLineString or MultiPolygon** 
in Postgres wfs-t edit table (layer) for time being.

On the other words only MultiPoint, MultiLineString or MultiPolygon geometries are supported in Oskari feature edit (wfs-t). 