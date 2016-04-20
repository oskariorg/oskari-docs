# Feedback (GET/POST)
The action route is responsible for sending and receiving data to/from feedback service e.g. Open311 .

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
      <td>baseUrl</td>
      <td>String</td>
      <td>Feedback service url</td>
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

 Parameters of the feedback request. Possible values are:
     *                 method - *required (serviceList, serviceDefinition, getFeedback, postFeedback
     *                 srs - *required when method is postFeedback or getFeedback
     *                 lang - fi/sv/en
     *                 baseUrl - feedback service base url
     *                 serviceId - for serviceDefinition request (Open311 service_code)
     *                 getServiceRequests {JSON}  filterparams for getFeedback method
     *                 postServiceRequest {JSON} data to post to service (postFeedback method)
     

## Response

### Success


### Error

## Examples

### Example query method = serviceList
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=serviceList&baseUrl=https://asiointi.hel.fi/palautews/rest/v1`

### Example query method = serviceDefinition
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=serviceDefinition&baseUrl=https://asiointi.hel.fi/palautews/rest/v1&serviceId=172`

### Example query method = postFeedback 
`http://localhost:8080/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=Feedback&method=postFeedback`

```javascript
                var postdata = {
                "service_code": "180",
                "description": "Kampin bussipysäkillä haisee koiran pissi",
                "first_name" : "Oskari",
                "last_name" : "Maanmittaushallitus",
                "lat": "6674188.748000",
                "long": "384717.640000"
                };
                var data = {
                "baseUrl": "https://asiointi.hel.fi/palautews/rest/v1",
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
                               "baseUrl": "https://asiointi.hel.fi/palautews/rest/v1",
                               "srs":"EPSG:3067",
                               "getServiceRequests": JSON.stringify(filterdata)
                               };
                               channel.postRequest('GetFeedbackRequest', [data]);
```