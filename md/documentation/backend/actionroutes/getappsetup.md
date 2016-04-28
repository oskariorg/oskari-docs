# GetAppSetup
Returns an application setup describing bundles to be started and configuration/state for those bundles.
If an uuid/viewId/oldId parameter is given, checks if the user has permission to access the view.
Otherwise returns the default view based on the user. The default views can be configured by oskari-ext.properties.

## Parameters
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
    <th>Required?</th>
  </tr>
  <tr>
    <td>uuid</td>
    <td>UUID</td>
    <td>Preferred way to reference a view</td>
    <td>false</td>
  </tr>
  <tr>
    <td>viewId</td>
    <td>Number</td>
    <td>Only default views can be referenced with viewId.
    Exception to this is views in the database which have only_uuid-flag as false.
    Views prior to Oskari 1.25 have this by default so older embedded map URLs still work.</td>
    <td>false</td>
  </tr>
  <tr>
    <td>oldId</td>
    <td>Number</td>
    <td>Some very old views have an oldId defined in portti_view database.
        Those can be retrieved by this parameter.
        This parameter is deprecated and should not be used in any environment.</td>
    <td>false - deprecated</td>
  </tr>
  <tr>
    <td>noSavedState</td>
    <td>Boolean</td>
    <td>If true, won't override the loaded view state with state cookie</td>
    <td>false</td>
  </tr>
</table>

## Response

### Success
Returns the app setup in JSON.

```javascript
{
  "configuration": {
    "<bundle identifier>": {
      "state": { ... },
      "conf": { ... }
    }
  },
  "startupSequence": [
    // List of JSON objects describing bundles to be started
  ]
}
```

## Examples

### Example query for demo.oskari.org
http://demo.oskari.org/?action_route=GetAppSetup
