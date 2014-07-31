# Index Map

<table class="table">
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin.html)</td>
  </tr>
</table>

## Description

This plugin adds an indexmap for the map it is registered to.

## Screenshot

![closed](/images/bundles/indexmap_closed.png)

Closed

![open](/images/bundles/indexmap_open.png)

Open

## Bundle configuration

No configuration is required, in which case the indexmap appears on the right bottom corner of the map by default. If there are many elements in the same location (containerClasses), variable position defines the order of elements. Below are the default values.

```javascript
var containerClasses = 'bottom right',
var position = 5;
```

If you wish to change to location of the indexmap, you have two possibilities: <br>
1) define location on a map by changing value of variables containerClasses and position <br>
2) define container for the indexmap by configuring containerId

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

This plugin doesn't sends any requests.

## Events the plugin listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> Updates ui to current map location</td>
  </tr>
</table>

## Events the plugin sends out

<table class="table">
  <tr>
    <th> Event </th><th> Why/When</th>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> After map has moved</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> not linked, assumes its linked by map </td>
    <td> Uses OpenLayers.Control.OverviewMap to render the index map.</td>
  </tr>
</table>
