# SystemViews

SystemViews inherits RestActionRoute and is only available for admin users. Calling it with GET returns the global default view and
a list of roles in the system where each role can have a different default view. Calling the route with POST will update the location and
layers of a view.

## Parameters

GET doesn't need/use any parameters.
POST uses the following:

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>id</td>
    <td>Integer</td>
    <td>ID for view to update</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>selectedLayers</td>
    <td>String</td>
    <td>Stringified JSON describing selectedLayers for the view like '[{id: 1}]'</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>srs</td>
    <td>String</td>
    <td>The value must match the SRS of target view, otherwise update is canceled.</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>north</td>
    <td>Double</td>
    <td>Latitude</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>east</td>
    <td>Double</td>
    <td>Longitude</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>zoom</td>
    <td>Integer</td>
    <td>Zoom level</td>
    <td>**true**</td>
  </tr>
  <tr>
    <td>force</td>
    <td>Boolean</td>
    <td>Update isn't allowed if some of the selected layers is not accessible with guest user. Update can be forced by adding this parameter with 'true' as value</td>
    <td>**false**</td>
  </tr>
</table>

## Response

### Success

GET:
```javascript
{
	"viewId": 1,
	"roles": [{
		"name": "Guest",
		"id": 1,
		"viewId": 2
	}, {
		"name": "User",
		"id": 2
	}, {
		"name": "Admin",
		"id": 3
	}],
	"timestamp": "Tue Aug 12 17:07:49 EEST 2014"
}
```

POST

```javascript
{"success":"true"}
```

### Error

If session expired/user is not admin:

```javascript
{
    "error":"Admin only"
}
```

Selected layers contain one or more layers that are not accessible by guest user.
Problematic layerIds are listed in info.selectedLayers as an array.

```javascript
{
	"error": "Contains layers not available for guests",
	"info": {
		"selectedLayers": [142],
		"code": "guest_not_available"
	}
}
```
