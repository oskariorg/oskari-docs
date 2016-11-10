# Feedback (GET/POST)
The action route is responsible for sending and receiving data to/from feedback service e.g. Open311.

##Requirements
The feedback service tool must have been selected in Oskari map publishing editor to the view and
there must be 2-3 internal properties defined in the current view metadata when creating the view:

View metadata for feedback service is managed in Oskari map publishing editor

![screenshot](feedbackService.png)

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
   <tr>
        <td>lang</td>
        <td>Language</td>
        <td>The language where the search will be targeted to</td>
        <td>**true**</td>
      </tr>
      <tr>
            <td>method</td>
            <td>String</td>
            <td>request method</td>
            <td>**true**</td>
          </tr>
       <tr>
          <td>srs</td>
          <td>String</td>
          <td>source CRS e.g. EPSG:3067</td>
          <td>**true/false**</td>
        </tr>
         <tr>
                  <td>serviceId</td>
                  <td>String</td>
                  <td>Open311 service_code</td>
                  <td>**true/false**</td>
                </tr>
                 <tr>
                                  <td>getServiceRequests</td>
                                  <td>JSON</td>
                                  <td>get feedback filter data</td>
                                  <td>**true/false**</td>
                                </tr>
                                 <tr>
                                                  <td>postServiceRequest</td>
                                                  <td>JSON</td>
                                                  <td>feedback data to post</td>
                                                  <td>**true/false**</td>
                                                </tr>
    
</table>

<pre class="event-code-block">
<code>

 Parameters of the feedback request. Possible values are:
     *                 method - *required (serviceList, serviceDefinition, getFeedback, postFeedback
     *                 srs - *required when method is postFeedback or getFeedback
     *                 lang - fi/sv/en
     *                 serviceId - for serviceDefinition request (Open311 service_code)
     *                 getServiceRequests {JSON}  filterparams for getFeedback method
     *                 postServiceRequest {JSON} data to post to service (postFeedback method)
     
</code>
</pre>

## Response

### Success


### Error

## Examples

### Example query method = serviceList
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=serviceList`

### Example query method = serviceDefinition
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=serviceDefinition&serviceId=172`

### Example query method = postFeedback 
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=postFeedback`

```javascript
                var postdata = {
                "service_code": "180",
                "description": "Kampin bussipysäkillä on roskakori täynnä",
                "first_name" : "Oskari",
                "last_name" : "Maanmittaushallitus",
                "lat": "6674188.748000",
                "long": "384717.640000"
                };
                var data = {
                "srs":"EPSG:3067",
                "postServiceRequest": JSON.stringify(postdata)
                };
                channel.postRequest('PostFeedbackRequest', [data]);
```

### Example query method = getFeedback 
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=getFeedback`

```javascript
                               var filterdata = {
                                 "start_date": "2016-04-01T00:00:00Z",
                                 "status": "open,closed"
                               };
                               var data = {                        
                               "srs":"EPSG:3067",
                               "getServiceRequests": JSON.stringify(filterdata)
                               };
                               channel.postRequest('GetFeedbackRequest', [data]);
```