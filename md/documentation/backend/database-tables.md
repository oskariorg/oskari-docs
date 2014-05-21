# Brief information about database tables

The SQL scripts that generate the PostgreSQL database are located in the directory `<work-dir>/content-resources/src/main/resources/sql/PostgreSQL/`.
The database structure is documented in detail [here](/documentation/architecture/database).

### 1. Bundle tables

* `portti_bundle` (definition of all available  bundles)
* `portti_view_bundle_seq` (bundle <--> view relations, plugin configs, state configs)

### 2. View tables

* `portti_view` (definition of all available views)
* `portti_view_supplement` (extra data for view)

### 3. Authorization tables

* `oskari_jaas_users` Used to authenticate user with JAAS and `org.eclipse.jetty.jaas.spi.DataSourceLoginModule`
* `oskari_users` Used to store user information
* `oskari_roles` Used to store roles
* `oskari_user_oskari_role` Mapping between users and their roles
* `oskari_permission` Permissions granted to roles

### 4. Map layer tables

* `portti_maplayer` (maplayer data: names, wms url, zoom min-max, opacity, layertype, etc )
* `portti_maplayer_metadata` (inspire metadata uuids for linking metadata to map layer)
* `portti_inspiretheme`  (inspire themes for grouping map layers)
* `portti_layerclass` (map service owners for grouping map layers )
* `portti_capabilities_cache` (prefetched wms capabilities requests )
