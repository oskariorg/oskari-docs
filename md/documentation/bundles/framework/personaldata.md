# Personal Data

<table class="table">
  <tr>
    <td>ID</td><td>`personaldata`</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance.html)</td>
  </tr>
</table>

## Description

The bundle lists user's account information and saved data in the application. Currently lists account info, saved places, saved map views and embedded maps. Other bundles can request to list data related to their domain (eg. user indicators) here.

![Personal data](/images/bundles/personaldata.png)

*Here shown with tabs added by `statistics/statsgrid`, `analysis/analyse` and `myplacesimport` bundles*

## TODO

* Move the tabs for saved places, saved map views and embedded maps to more appropriate locations and use `PersonalData.AddTabRequest` to add them

## Bundle configuration

Some configuration is needed for URLs:

```javascript
"conf": {
  "changeInfoUrl": {
    "en": "https://www.paikkatietoikkuna.fi/web/en/profile",
    "fi": "https://www.paikkatietoikkuna.fi/web/fi/profiili",
    "sv": "https://www.paikkatietoikkuna.fi/web/sv/profil"
  },
  "publishedMapUrl": {
    "en": "/web/en/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&published=true&viewId=",
    "fi": "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&published=true&viewId=",
    "sv": "/web/sv/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&published=true&viewId="
  }  
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`PersonalData.AddTabRequest`</td><td>*Adds tab to Flyout Tab container*</td>
  </tr>
</table>

```javascript
var title = "Tab Title";
var content = jQuery("<div>Lorem ipsum</div>");
var first = true;
var reqName = 'PersonalData.AddTabRequest';
var reqBuilder = sandbox.getRequestBuilder(reqName);
var req = reqBuilder(title, content, first);
```

## Requests the bundle sends out

<table class="table">
<tr>
  <th> Request </th><th> Where/why it's used</th>
</tr>
<tr>
  <td> `publisher.PublishMapEditorRequest` </td><td> Register as part of the UI in `start()` method</td>
</tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th>
    <th>Linked from</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked on the page</td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
</table>
