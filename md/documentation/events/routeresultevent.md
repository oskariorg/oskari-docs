# RouteResultEvent

Notifies that route has been got successfully from the service. Includes information about the route.

## Description

Used to notify if getRouteRequest was successfull and the route has been got from the service. 

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>success</td><td> Boolean</td><td>Successfully got route</td><td> </td>
</tr>
<tr>
  <td>requestParameters</td><td> JSON</td><td>Parameters that were used to get route.</td><td> </td>
</tr>
<tr>
  <td>plan</td><td> JSON</td><td>Route instructions.</td><td> </td>
</tr>
</table>

## Event methods

###getName()
Returns name of the event.

###getSuccess()
Returns true or false depending on if the route was got successfully.

###getPlan()
Returns route instructions including duration, start time, end time, waiting time, transit time and walking distance.

###getRequestParameters()
Returns the parameters that were used to request route. Parameter options are: lang, fromlon, fromlat, tolon, tolat, srs, date, time, arriveby, mode, maxwalkdistance, wheelchair.

## Examples

Used in routingService bundle in method getRoute:

```javascript
getRoute: function (params) {
    var me = this;
        getRouteUrl = this.sandbox.getAjaxUrl() + 'action_route=Routing';

    jQuery.ajax({
        data: params,
        dataType : "json",
        type : "GET",
        beforeSend: function(x) {
          if(x && x.overrideMimeType) {
           x.overrideMimeType("application/json");
          }
         },
        url : getRouteUrl,
        error : this.routeError,
        success : function (response) {
            var success = response.success,
                requestParameters = response.requestParameters,
                plan = response.plan;
            var evt = me.sandbox.getEventBuilder('RouteResultEvent')(success, requestParameters, plan);
            me.sandbox.notifyAll(evt);
        }
    });
},
```