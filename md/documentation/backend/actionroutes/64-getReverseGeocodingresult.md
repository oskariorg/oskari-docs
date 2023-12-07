# GetReverseGeocodingResult (POST)
The action route is responsible for handling the reverse geocoding search query based on the location submitted by the user and the language used.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>lon</td>
    <td>String</td>
    <td>clicked longitude coordinate value</td>
    <td>**true**</td>
  </tr>
  <tr>
      <td>lat</td>
      <td>String</td>
      <td>clicked latitude coordinate value</td>
      <td>**true**</td>
   </tr>
   <tr>
          <td>epsg</td>
          <td>String</td>
          <td>Srs name</td>
          <td>**true**</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>String</td>
    <td>The language where the search will be targeted to</td>
    <td>**true**</td>
  </tr>
   <tr>
      <td>buffer</td>
      <td>String</td>
      <td>Search distance around clicked point (default 5000 m)</td>
      <td>**false**</td>
    </tr>
   <tr>
          <td>maxfeatures</td>
          <td>String</td>
          <td>Maximum number of features for to request (default 1)</td>
          <td>**false**</td>
   </tr>
</table>

## Response

### Success
```javascript
{
  "totalCount": "<Total count from all result items>",
  "locations": [ // Array from search result items
    {
      "id": "<result identifier>",
      "rank": "<semantic ordering number>",
      "lon": "<longitude>",
      "village": "<municipality>",
      "name": "<name>",
      "zoomLevel": "<zoom level>",
      "type": "<result type>",
      "lat": "<latitude>"
    }
  ]
}
```

### Error
Returns HTTP code 500 with an error message as a string in response body.
Will return an error if no features found  (Error: No results found.)

## Examples

### Example query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetReverseGeocodingResult`

With POST params:
<table>
  <tr>
    <th>name</th>
    <th>value</th>
  </tr>
  <tr>
    <td>epsg</td>
    <td>EPSG:3067</td>
  </tr>
   <tr>
      <td>lon</td>
      <td>370892</td>
    </tr>
    <tr>
          <td>lat</td>
          <td>6676190</td>
    </tr>
  <tr>
    <td>Language</td>
    <td>fi</td>
  </tr>
</table>

Response:

```json
{
    "totalCount": 1,
    "locations": [{
        "id": 0,
        "rank": 0,
        "lon": "370884.551",
        "village": "Espoo",
        "bbox": {
            "bottom": "6676286.584",
            "left": "370884.551",
            "right": "370884.551",
            "top": "6676286.584"
        },
        "name": "Kirstintie 13",
        "type": "",
        "lat": "6676286.584"
    }]
}
```

### Example curl request