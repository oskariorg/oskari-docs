# GetGeoLocatorSearchResult (GET)
The action route is responsible for handling the location search query based on the search key the user submitted and the language used.

## Parameters
<table class="table">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>`term`</td>
    <td>String</td>
    <td>User input search term</td>
    <td>**true** (unless `lon` and `lat` present)</td>
  </tr>
  <tr>
    <td>`region`</td>
    <td>String</td>
    <td>ELF AU name</td>
    <td>**optional**</td>
  </tr>
  <tr>
    <td>`epsg`</td>
    <td>String</td>
    <td>Target coordinate reference system e.g. epsg:3035</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>`fuzzy`</td>
    <td>Boolean</td>
    <td>Fuzzy search mode</td>
    <td>**optional** (defaults to false)</td>
  </tr>
  <tr>
    <td>`exonym`</td>
    <td>Boolean</td>
    <td>exonym names included</td>
    <td>**optional** (defaults to false)</td>
  </tr>
  <tr>
    <td>`lon`</td>
    <td>String</td>
    <td>Longitude - reverse geocoding, if this in parameters</td>
    <td>**optional**</td>
  </tr>
  <tr>
    <td>`lat`</td>
    <td>String</td>
    <td>Longitude - reverse geocoding, if this in parameters</td>
    <td>**optional**</td>
  </tr>
    <td>`language`</td>
    <td>String</td>
    <td>The language where the search will be targeted to</td>
    <td>**true**</td>
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
      "village": "<ELF parent title>",
      "name": "<name>",
      "zoomLevel": "<zoom level>",
      "type": "<ELF locationType title>",
      "lat": "<latitude>"
    }
  ]
}
```

### Error

Returns HTTP code 500 with an error message as a string in response body.
Will return an error if the `term` param is empty, if it contains the `*` character and is under 4 characters long or if it contains more than one `*` characters.
(not in reverse geocoding)

## Examples

### Example geocoding query for Paikkatietoikkuna
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetGeoLocatorSearchResult&lang=en&&epsg=EPSG:3067&term=Helsinki&region=&fuzzy=true&exonym=true

Response:

```json
{"totalCount":18,"locations":
[{"id":0,"rank":0,"lon":"388404.3740437103","village":"Helsinki (fin)","name":"Els&iacute;nki","type":"variant","lat":"6671584.128010677"},
{"id":1,"rank":0,"lon":"388404.3740437103","village":"Helsinki (fin)","name":"Helsingfors","type":"variant","lat":"6671584.128010677"},...}
```

### Example reverse geocoding query for Paikkatietoikkuna
`http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetGeoLocatorSearchResult&lang=en&lat=60.4848175&lon=22.4390926&epsg=EPSG:3067&exonym=false'


