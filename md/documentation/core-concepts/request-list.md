# List of Oskari requests

In order to start sending requests, you need the implementing bundle - that is, the one which registers a handler for the request - to be present in your application setup. The ones that are implemented in `core` are automatically available.

The availability of a request when sending one can always be checked from the sandbox: `Oskari.getSandbox().getRequestBuilder('requestName')` which returns `undefined` if the request is not available or if the handler has not been registered.

Search the [api](/api/latest/) for more info of a particular request.

<table class="table table-hover oskari-sortable">
    <thead>
        <tr>
            <th class="oskari-sortable-th" data-sort="string-ins">Name</th>
            <th>Description</th>
            <th class="oskari-sortable-th" data-sort="string-ins">Implementing bundle</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>`AddMapLayerRequest`</td>
            <td>Adds a layer to the map</td>
            <td>`core`</td>
        </tr>        
        <tr>
            <td>[MapModulePlugin.AddMarkerRequest](/documentation/requests/addmarkerrequest)</td>
            <td>Add/modify marker on map</td>
            <td>[framework/mapmodule-plugin/markersplugin](/documentation/bundles/framework/mapmodule/markersplugin)</td>
        </tr>
        <tr>
            <td>`AddSearchResultActionRequest`</td>
            <td>Updates the metadata catalogue search results list to show action element</td>
            <td>`catalogue/metadatacatalogue`</td>
        </tr>
        <tr>
            <td>`analyse.AnalyseRequest`</td>
            <td></td>
            <td>`analysis/analyse`</td>
        </tr>
        <tr>
            <td>`catalogue.ShowMetadataRequest`</td>
            <td></td>
            <td>`catalogue/metadataflyout`</td>
        </tr>
        <tr>
            <td>`ChangeMapLayerOpacityRequest`</td>
            <td>Changes the opacity of given layer to the given value</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`ChangeMapLayerStyleRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`CtrlKeyDownRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`CtrlKeyUpRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`DimMapLayerRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`DisableMapKeyboardMovementRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`DisableMapMouseMovementRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`DrawFilterPlugin.StartDrawFilteringRequest`</td>
            <td></td>
            <td>`framework/geometryeditor`</td>
        </tr>
        <tr>
            <td>`DrawFilterPlugin.StopDrawFilteringRequest`</td>
            <td></td>
            <td>`framework/geometryeditor`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.GetGeometryRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.StartDrawingRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`DrawPlugin.StopDrawingRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin/drawplugin`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.AddFeaturesToMapRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin/vectorlayer`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.RemoveFeaturesFromMapRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin/vectorlayer`</td>
        </tr>
        <tr>
            <td>`EnableMapKeyboardMovementRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`EnableMapMouseMovementRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`HideMapMarkerRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`HighlightMapLayerRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`InfoBox.HideInfoBoxRequest`</td>
            <td></td>
            <td>`framework/infobox`</td>
        </tr>
        <tr>
            <td>`InfoBox.RefreshInfoBoxRequest`</td>
            <td></td>
            <td>`framework/infobox`</td>
        </tr>
        <tr>
            <td>`InfoBox.ShowInfoBoxRequest`</td>
            <td></td>
            <td>`framework/infobox`</td>
        </tr>
        <tr>
            <td>`MapFull.MapResizeEnabledRequest`</td>
            <td></td>
            <td>`framework/mapfull`</td>
        </tr>
        <tr>
            <td>`MapFull.MapWindowFullScreenRequest`</td>
            <td></td>
            <td>`framework/mapfull`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.GetFeatureInfoActivationRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.GetFeatureInfoRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.MapLayerUpdateRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.MapLayerVisibilityRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MapModulePlugin.MapMoveByLayerContentRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>[MapModulePlugin.RemoveMarkersRequest](/documentation/requests/removemarkersrequest)</td>
            <td>Remove single marker or clear all markers</td>
            <td>[framework/mapmodule-plugin/markersplugin](/documentation/bundles/framework/mapmodule/markersplugin)</td>
        </tr>
        <tr>
            <td>`MapMoveRequest`</td>
            <td>Moves the map to given coordinates and zooms to given zoom level</td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`MyPlaces.DeleteCategoryRequest`</td>
            <td></td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`MyPlaces.DeletePlaceRequest`</td>
            <td></td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`MyPlaces.EditCategoryRequest`</td>
            <td></td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`MyPlaces.EditPlaceRequest`</td>
            <td></td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`MyPlaces.OpenAddLayerDialogRequest`</td>
            <td></td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`MyPlaces.PublishCategoryRequest`</td>
            <td></td>
            <td>`framework/myplaces2`</td>
        </tr>
        <tr>
            <td>`PersonalData.AddTabRequest`</td>
            <td></td>
            <td>`framework/personaldata`</td>
        </tr>
        <tr>
            <td>`printout.PrintMapRequest`</td>
            <td></td>
            <td>`framework/printout`</td>
        </tr>
        <tr>
            <td>`Publisher.PublishMapEditorRequest`</td>
            <td></td>
            <td>`framework/publisher`</td>
        </tr>
        <tr>
            <td>`RearrangeSelectedMapLayerRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`RemoveMapLayerRequest`</td>
            <td>Removes a layer from the map</td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`Search.AddSearchResultActionRequest`</td>
            <td>Adds an action link/button to a search results popup</td>
            <td>`framework/search`</td>
        </tr>
        <tr>
            <td>`Search.AddTabRequest`</td>
            <td>Adds a new tab to the search Flyout</td>
            <td>`framework/search`</td>
        </tr>
        <tr>
            <td>`Search.RemoveSearchResultActionRequest`</td>
            <td>Removes an action link/button from a search results popup</td>
            <td>`framework/search`</td>
        </tr>
        <tr>
            <td>`ShowFeatureDataRequest`</td>
            <td></td>
            <td>`framework/featuredata2`</td>
        </tr>
        <tr>
            <td>[ShowFilteredLayerListRequest](/documentation/requests/showfilteredlayerlistrequest)</td>
            <td>Shows filtered layer list.</td>
            <td>[framework/layerselector2](/documentation/bundles/framework/layerselector2)</td>
        </tr>
        <tr>
            <td>`ShowMapLayerInfoRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`ShowMapMeasurementRequest`</td>
            <td></td>
            <td>`core`</td>
        </tr>
        <tr>
            <td>`ShowOwnStyleRequest`</td>
            <td></td>
            <td>`framework/mapwfs2`</td>
        </tr>
        <tr>
            <td>`StateHandler.SaveStateRequest`</td>
            <td></td>
            <td>`framework/statehandler`</td>
        </tr>
        <tr>
            <td>`StateHandler.SetStateRequest`</td>
            <td></td>
            <td>`framework/statehandler`</td>
        </tr>
        <tr>
            <td>`StatsGrid.AddDataSourceRequest`</td>
            <td>Adds a new data source to statsgrid</td>
            <td>`statistics/statsgrid`, `statistics/publishedgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.IndicatorsRequest`</td>
            <td></td>
            <td>`statistics/statsgrid`, `statistics/publishedgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.StatsGridRequest`</td>
            <td></td>
            <td>`statistics/statsgrid`, `statistics/publishedgrid`</td>
        </tr>
        <tr>
            <td>`StatsGrid.TooltipContentRequest`</td>
            <td></td>
            <td>`statistics/statsgrid`, `statistics/publishedgrid`</td>
        </tr>
        <tr>
            <td>`Toolbar.AddToolButtonRequest`</td>
            <td></td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`Toolbar.RemoveToolButtonRequest`</td>
            <td></td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`Toolbar.SelectToolButtonRequest`</td>
            <td></td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`Toolbar.ToolbarRequest`</td>
            <td></td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`Toolbar.ToolButtonStateRequest`</td>
            <td></td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`Toolbar.ToolContainerRequest`</td>
            <td></td>
            <td>`framework/toolbar`</td>
        </tr>
        <tr>
            <td>`ToolSelectionRequest`</td>
            <td></td>
            <td>`framework/mapmodule-plugin`</td>
        </tr>
        <tr>
            <td>`userguide.ShowUserGuideRequest`</td>
            <td></td>
            <td>`framework/userguide`</td>
        </tr>
        <tr>
            <td>`userinterface.AddExtensionRequest`</td>
            <td>Adds an extension (eg. Flyout) to a bundle</td>
            <td>`framework/divmanazer`</td>
        </tr>
        <tr>
            <td>`userinterface.ModalDialogRequest`</td>
            <td></td>
            <td>`framework/divmanazer`</td>
        </tr>
        <tr>
            <td>`userinterface.RemoveExtensionRequest`</td>
            <td>Removes an extension (eg. Flyout) from a bundle</td>
            <td>`framework/divmanazer`</td>
        </tr>
        <tr>
            <td>`userinterface.UpdateExtensionRequest`</td>
            <td>Updates the state of an extension (eg. 'attach' for a Flyout, which opens it)</td>
            <td>`framework/divmanazer`</td>
        </tr>
        <tr>
            <td>[AddLayerListFilterRequest](/documentation/requests/addlayerlistfilterrequest)</td>
            <td>Add filter button to layer list.</td>
            <td>[framework/layerselector2](/documentation/bundles/framework/layerselector2)</td>
        </tr>


        <tr>
            <td>[AddToBasketRequest](/documentation/requests/addbasketrequest)</td>
            <td>Add item to basket.</td>
            <td>[liikennevirasto/lakapa-basket](/documentation/bundles/liikennevirasto/lakapa-basket)</td>
        </tr>
        <tr>
            <td>[ClearBasketRequest](/documentation/requests/clearbasketrequest)</td>
            <td>Clears basket.</td>
            <td>[liikennevirasto/lakapa-basket](/documentation/bundles/liikennevirasto/lakapa-basket)</td>
        </tr>
        <tr>
            <td>[RefreshBasketRequest](/documentation/requests/refreshbasketrequest)</td>
            <td>Refresh basket.</td>
            <td>[liikennevirasto/lakapa-basket](/documentation/bundles/liikennevirasto/lakapa-basket)</td>
        </tr>
        <tr>
            <td>[ChangeLanguageRequest](/documentation/requests/changelanguagerequest)</td>
            <td>Change help language.</td>
            <td>[liikennevirasto/lakapa-help](/documentation/bundles/liikennevirasto/lakapa-help)</td>
        </tr>
        <tr>
            <td>[ShowHelpRequest](/documentation/requests/showhelprequest)</td>
            <td>Shows help.</td>
            <td>[liikennevirasto/lakapa-help](/documentation/bundles/liikennevirasto/lakapa-help)</td>
        </tr>
        <tr>
            <td>[TransportChangedRequest](/documentation/requests/transportchangedrequest)</td>
            <td>Tranport changed.</td>
            <td>[liikennevirasto/lakapa-help](/documentation/bundles/liikennevirasto/lakapa-help)</td>
        </tr>
        <tr>
            <td>[HideSelectionRequest](/documentation/requests/hideselectionrequest)</td>
            <td>Hide selection from the map.</td>
            <td>[liikennevirasto/lakapa-transport-selector](/documentation/bundles/liikennevirasto/lakapa-transport-selector)</td>
        </tr>
        <tr>
            <td>[ShowBoundingBoxRequest](/documentation/requests/showboundingboxrequest)</td>
            <td>Show bounding box to map.</td>
            <td>[liikennevirasto/lakapa-transport-selector](/documentation/bundles/liikennevirasto/lakapa-transport-selector)</td>
        </tr>
        <tr>
            <td>[ShowFeatureRequest](/documentation/requests/showfeaturerequest)</td>
            <td>Dhow feature on the map.</td>
            <td>[liikennevirasto/lakapa-transport-selector](/documentation/bundles/liikennevirasto/lakapa-transport-selector)</td>
        </tr>
        <tr>
            <td>[ShowMessageRequest](/documentation/requests/showmessagerequest)</td>
            <td>Show message.</td>
            <td>[liikennevirasto/lakapa-transport-selector](/documentation/bundles/liikennevirasto/lakapa-transport-selector)</td>
        </tr>
        <tr>
            <td>[ToggleTransportSelectorRequest](/documentation/requests/toggletransportselectorrequest)</td>
            <td>Toggle transport selector.</td>
            <td>[liikennevirasto/lakapa-transport-selector](/documentation/bundles/liikennevirasto/lakapa-transport-selector)</td>
        </tr>
        <tr>
            <td>[GetRouteRequest](/documentation/requests/getrouterequest)</td>
            <td>Get route with two points.</td>
            <td>[framework/routingService](/documentation/bundles/framework/routingservice)</td>
        </tr>        

    </tbody>
</table>
