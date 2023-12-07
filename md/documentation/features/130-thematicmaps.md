# Thematic maps

Oskari can display statistical data and link it to map layers creating thematic maps. Currently choropleth maps are supported for areal data. The statistical data are combined with the map layer data with an ID field that must match between the data. Supported data sources for statistical data are PX-Web, SDMX REST and Sotkanet REST, more support can be added via adapters written in Java. When the requested statistical data is multi-dimensional the user has to slice each dimension to reach a tabular form of data.

See [requirements](thematicmaps/requirements) for using the thematic maps functionality in Oskari application.

See instructions for [configuring](thematicmaps/config) the thematic maps functionality.
