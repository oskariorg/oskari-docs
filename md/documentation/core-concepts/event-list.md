# List of Oskari events

In order to start receiving or sending events, you need the defining bundle to be present in your application setup. The ones that are defined in `core` are automatically available.

The availability of an event when sending one can always be checked from the sandbox: `Oskari.getSandbox().getEventBuilder('eventName')` which returns `undefined` if the event is not available.

Search the [api](/api/latest/) for more info of a particular event.

<table class="table table-hover oskari-sortable">
    <thead>
        <tr>
            <th class="oskari-sortable-th" data-sort="string-ins">Name</th>
            <th>Description</th>
            <th class="oskari-sortable-th" data-sort="string-ins">Defining bundle</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`AfterChangeMapLayerOpacityEvent`</td>
            <td>Sent after the opacity of a map layer is changed.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterChangeMapLayerStyleEvent`</td>
            <td>Sent after the style of a map layer is changed.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterDimMapLayerEvent`</td>
            <td> Sent when a given "highlighted" map layer has been requested to be "dimmed" on map.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterHideMapMarkerEvent`</td>
            <td> Sent after markers are hidden. </td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterAddMarkerEvent`</td>
            <td> Sent after marker is added. </td>
            <td>[framework/mapmodule-plugin/markersplugin](/documentation/bundles/framework/mapmodule/markersplugin)</td>
        </tr>
        <tr>
            <td>`AfterRemoveMarkersEvent`</td>
            <td> Sent after markers have been removed. </td>
            <td>[framework/mapmodule-plugin/markersplugin](/documentation/bundles/framework/mapmodule/markersplugin)</td>
        </tr>
        <tr>
            <td>`MarkerClickEvent`</td>
            <td> Sent when a marker is clicked. </td>
            <td>[framework/mapmodule-plugin/markersplugin](/documentation/bundles/framework/mapmodule/markersplugin)</td>
        </tr>
        
        <tr>
            <td>`AfterHighlightMapLayerEvent`</td>
            <td> Sent when a given map layer has been requested to be "highlighted" on map.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterMapLayerAddEvent`</td>
            <td>Sent after a map layer is added to the map.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterMapLayerRemoveEvent`</td>
            <td>Sent after a map layer is removed from the map.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterMapMoveEvent`</td>
            <td>Sent each time the map is moved or zoomed in/out.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterRearrangeSelectedMapLayerEvent`</td>
            <td> Used to notify that maplayer order has been changed in Oskari core.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`AfterShowMapLayerInfoEvent`</td>
            <td> Triggers on Oskari.mapframework.request.common.ShowMapLayerInfoRequest. Populates the layer reference matching the id in request.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`BackendStatus.BackendStatusChangedEvent`</td>
            <td> Sent when the backend status of a map layer has changed.</td>
            <td>`framework/backendstatus`</td>
        </tr>
        <tr>
            <td>`DrawFilterPlugin.FinishedDrawFilteringEvent`</td>
            <td> Used to notify components that the drawing has been finished.</td>
            <td>`framework/geometryeditor`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.ActiveDrawingEvent`</td>
            <td>Sent whenever the geometry of a drawn feature is edited.</td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.AddedFeatureEvent`</td>
            <td>Sent when a new geometry was added whilst drawing a multigeometry feature.</td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.FinishedDrawingEvent`</td>
            <td>Sent when the user has finished the drawing.</td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.SelectedDrawingEvent`</td>
            <td> Used for example to notify components to reset any saved "selected place" data. </td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`EscPressedEvent`</td>
            <td> Sent when ESC key in keyboard is pressed so bundles can react to it.</td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`FeatureData.AddedFeatureEvent`</td>
            <td> Used to notify components that the feature has been added.</td>
            <td>`framework/featuredata2`</td>
        </tr>
        <tr>
            <td>`FeatureData.FinishedDrawingEvent`</td>
            <td> Used to notify components that the drawing has been finished.</td>
            <td>`framework/featuredata2`</td>
        </tr>
        <tr>
            <td>`FeaturesAvailableEvent`</td>
            <td> Used to add/replace features on a Oskari.mapframework.domain.VectorLayer. See Oskari.mapframework.mapmodule.VectorLayerPlugin.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`GetInfoResultEvent`</td>
            <td> Sent when there's content for infobox. </td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`InfoBox.InfoBoxEvent`</td>
            <td> Sent after infobox has been refreshed using the request `InfoBox.RefreshInfoBoxRequest`.</td>
            <td>`framework/infobox`</td>
        </tr>
        <tr>
            <td>`LayerToolsEditModeEvent`</td>
            <td> Event is sent when user decides to edit layout order. </td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapClickedEvent`</td>
            <td>Sent when the map is clicked.</td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapLayerEvent`</td>
            <td>Sent whenever a layer is created, edited or deleted.</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`MapLayerVisibilityChangedEvent`</td>
            <td>Sent after the visibility of a map layer has changed.</td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapMoveStartEvent`</td>
            <td> Notifies application bundles that a map has began moving (is being dragged). </td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`MapMyPlaces.MyPlacesVisualizationChangeEvent`</td>
            <td> Sent when visualization of MyPlaces is changed. </td>
            <td>`framework/mapmyplaces`</td>
        </tr>
        <tr>
            <td>`MapSizeChangedEvent`</td>
            <td> Sent when the map div size is changed.</td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapStats.FeatureHighlightedEvent`</td>
            <td> Sent when a feature is highlighted in MapStats. </td>
            <td>`framework/mapstats`</td>
        </tr>
        <tr>
            <td>`MapStats.HoverTooltipContentEvent`</td>
            <td> Returns the content for the tooltip shown after the user hovers over a municipality on the map.</td>
            <td>`framework/mapstats`</td>
        </tr>
        <tr>
            <td>`MapStats.StatsVisualizationChangeEvent`</td>
            <td> Sent by function `sendVisualizationData` to build the visualization from. </td>
            <td>`framework/mapstats`</td>
        </tr>
        <tr>
            <td>`MouseHoverEvent`</td>
            <td> Notification about mouse hovering over the map. </td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`MyPlaces.MyPlaceHoverEvent`</td>
            <td> Sent when hovering on MyPlaces feature on the map. </td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`MyPlaces.MyPlacesChangedEvent`</td>
            <td> Tells components to reload data. </td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`Printout.PrintableContentEvent`</td>
            <td> Used for sending information to printout about what should be rendered besides the normal layer drawing.</td>
            <td>`framework/printout`</td>
        </tr>
        <tr>
            <td>`Printout.PrintWithoutUIEvent`</td>
            <td> Bundles could plot directly via this event. </td>
            <td>`framework/printout`</td>
        </tr>
        <tr>
            <td>`Printout.PrintWithParcelUIEvent`</td>
            <td> Used in parcel-application to use printoutUI differently as in normal printing. With Printout.PrintWithParcelUIEvent it is possible to print .pdf straight without asking anything from the user.</td>
            <td>`framework/printout`</td>
        </tr>
        <tr>
            <td>`Publisher.ColourSchemeChangedEvent`</td>
            <td> Used to notify getinfo plugin that the colour scheme has changed.</td>
            <td>`framework/publisher`</td>
        </tr>
        <tr>
            <td>`Publisher.FontChangedEvent`</td>
            <td> Used to notify tool plugins that the font has changed.</td>
            <td>`framework/publisher`</td>
        </tr>
        <tr>
            <td>`Publisher.MapPublishedEvent`</td>
            <td> Used to notify components that a new published map is available.</td>
            <td>`framework/publisher`</td>
        </tr>
        <tr>
            <td>`Publisher.ToolStyleChangedEvent`</td>
            <td> Used to notify tool plugins that the tool style has changed.</td>
            <td>`framework/publisher`</td>
        </tr>
        <tr>
            <td>`Realtime.RefreshLayerEvent`</td>
            <td>Sent for each real time layer at the time it's due to refresh.</td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`StateSavedEvent`</td>
            <td> Used to notify that application state has been saved and any listing should refresh. </td>
            <td>`framework/statehandler`</td>
        </tr>
        <tr>
            <td>`StatsGrid.ClearHilightsEvent`</td>
            <td> Used to notify StatsLayerPlugin to remove hilight effect.</td>
            <td>`statistics/statsgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.IndicatorsEvent`</td>
            <td> Sends data of the open indicators.</td>
            <td>`statistics/statsgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.ModeChangedEvent`</td>
            <td> Used to notify other components of StatsGrid mode changes.</td>
            <td>`statistics/statsgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.SelectHilightsModeEvent`</td>
            <td> Used to notify StatsLayerPlugin to remove hilight effect.</td>
            <td>`statistics/statsgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.StatsDataChangedEvent`</td>
            <td> Creates classification of stats column data and shows it on geostats legend html. </td>
            <td>`statistics/statsgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.UserIndicatorEvent`</td>
            <td> Sends data of a user indicator. Different data for different type of operation (create, update, delete). </td>
            <td>`statistics/statsgrid`</td>
        </tr>
        <tr>
            <td>`Toolbar.ToolSelectedEvent`</td>
            <td> Used to notify components that a tool has been selected and components should cancel their tool related operations if any.</td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`userinterface.ExtensionUpdatedEvent`</td>
            <td> Sent after Extension view state has changed. </td>
            <td>`framework/divmanazer`</td>
        </tr>
        <tr>
            <td>`WFSFeatureEvent`</td>
            <td> Updates grid data. </td>
            <td>`framework/mapwfs2`</td>
        </tr>
        <tr>
            <td>`WFSFeatureGeometriesEvent`</td>
            <td> Used to get feature geometries of those WFS Features, which has been highlighted. </td>
            <td>`framework/mapwfs2`</td>
        </tr>
        <tr>
            <td>`WFSFeaturesSelectedEvent`</td>
            <td> Used to indicate tha a WFS Feature has been selected and components should highlight it in UI. </td>
            <td>`framework/mapwfs2`</td>
        </tr>
        <tr>
            <td>`WFSImageEvent`</td>
            <td> Sent when WFSImage is created. </td>
            <td>`framework/mapwfs2`</td>
        </tr>
        <tr>
            <td>`WFSPropertiesEvent`</td>
            <td> Sent when function `GetWFSProperties` is used. </td>
            <td>`framework/mapwfs2`</td>
        </tr>
        <tr>
            <td>`WFSSetFilter`</td>
            <td> Used to set filter for a WFS layer. </td>
            <td>`framework/featuredata2`</td>
        </tr>
        <tr>
            <td>[RouteSuccessEvent](/documentation/events/routesuccessevent)</td>
            <td> Sent when route service get response of `GetRouteRequest`. </td>
            <td>[framework/routingService](/documentation/bundles/framework/routingservice)</td>
        </tr>

        <tr>
            <td>[UserLocationEvent](/documentation/events/userlocationevent)</td>
            <td> Sent when get user geolocation</td>
            <td>[framework/mapmodule/MyLocationPlugin](/documentation/bundles/framework/mapmodule/mylocationplugin)</td>
        </tr>
    </tbody>
</table>