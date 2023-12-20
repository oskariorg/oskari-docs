# CreateUserLayer (POST)
1. Receives parameters for importing shape or kml file data and parameters for userlayer metadata
2. Unzip import files and use GeoTools featurecollection extensions to read import files
3. Write GeoJSON out of featurecollections
4. Stores metadata for the layer (property types, name, desc, style) to db (iBatis)
5. Store GeoJSON features via ibatis to Postgres db.
6. Feature properties are stored into json type column in Pg for to support multiple schemas in the same data store
7. Responses results back to front (userlayer json)


## POST (multipart/form-data)

- Parts
<table>
  <tr>
    <th>name</th>
    <th>value</th>
  </tr>
  <tr>
    <td>file-import</td>
    <td>.zip file</td>
  </tr>
  <tr>
      <td>layer-name</td>
      <td>name string</td>
   </tr>
   <tr>
      <td>layer-desc</td>
      <td>description string</td>
   </tr>
   <tr>
      <td>layer-source</td>
      <td>source string</td>
   </tr>
   <tr>
      <td>layer-style</td>
      <td>style json</td>
   </tr>
</table>


### Raw example form-data

    **file-import** 	PK....
    **layer - name** risteys1900
    **layer - desc**
    **layer - source** hri
    **layer - style** {
        "dot": {
            "size": 1,
            "color": "#ff3334",
            "shape": 0
        },
        "line": {
            "size": 1,
            "color": "#3233ff",
            "cap": "butt",
            "corner": "mitre",
            "style": ""
        },
        "area": {
            "size": 1,
            "lineColor": "#000000",
            "fillColor": "#ffde00",
            "lineStyle": "",
            "fillStyle": -1,
            "lineCorner": "mitre"
        }
    }


## Response

### Raw example
{
    "wmsName": "risteys1900",
    "params": {},
    "baseLayerId": -1,
    "type": "userlayer",
    "orgName": "oskari.org",
    "renderingUrl": "/karttatiili/userlayer?",
    "legendImage": "",
    "isQueryable": true,
    "refreshRate": 0,
    "renderingElement": "oskari:user_layer_data_style",
    "id": "userlayer_59",
    "minScale": 1500000,
    "source": "hri",
    "realtime": false,
    "wmsUrl": "wfs",
    "description": "",
    "name": "risteys1900",
    "subtitle": "",
    "opacity": 50,
    "maxScale": 1,
    "fields": ["open", "Region", "phoneNumber", "visibility", "address", "description", "name", "LookAt", "Style", "Geometry"],
    "options": {}
}


### Success
- response is not null
- new User layer is drawn on a map



## Examples

### Example query for Paikkatietoikkuna
`http:/www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&&action_route=CreateUserLayer`
