# Map layers

Note! This page is not complete but serves as a starting point for accumulating documentation for different configuration options.

Oskari servers as a registry for different kinds of spatial data infrastructure services. For example actual data for map layers are not stored in Oskari but layers are registered to Oskari so that they point to for example an existing OGC compliant data source.

Most of the registry data that is stored for such services is stored in the [database table](https://oskari.org/db/tables/oskari_maplayer.html) `oskari_maplayer`.

Most of the toggles that an admin can change in `oskari_maplayer` are located in the `attributes` column. The value of the column is a JSON-object and can have the following keys:

- `forceProxy`: true | false When true even layers that don't require authentication are proxied through the server. Without this the browser gets the data directly from a WMS/WMTS or similar endpoint.

The attributes column can also have configuration specific to a layer type.

See:
- [Configuration options for vector feature layers](maplayers/vectorlayers)
