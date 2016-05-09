# Content editor

Tampere Oskari bundle **content-editor**

Extends Oskari functionality to support editing of wfs layer features and feature geometries.

Available in Oskari 1.36.0 and up.

## Prerequisites

These uses jetty-8.1.16-oskari version

### Front-end

This bundle needs new Oskari version (jetty-8.1.16-oskari or above)

### Back-end


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

Download Oskari (http://oskari.org/build/server/jetty-8.1.16-oskari.zip) and extract archive to current (new created) directory


Goto jetty folder

```
cd jetty-8.1.16-oskari
```


### Configuration

Add new permission type to oskari-ext.properties
```
permission.types = EDIT_LAYER_CONTENT
permission.EDIT_LAYER_CONTENT.name.fi=Muokkaa tasoa
permission.EDIT_LAYER_CONTENT.name.en=Edit layer
```

Add bundle dynamically to correct roles in oskari-ext.properties. For example:
```
actionhandler.GetAppSetup.dynamic.bundles = admin-layerselector, admin-layerrights, admin-users, admin, content-editor
actionhandler.GetAppSetup.dynamic.bundle.content-editor.roles = Admin
```


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

Remarks

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