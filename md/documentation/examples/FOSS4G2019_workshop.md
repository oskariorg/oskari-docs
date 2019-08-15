# FOSS4G2019 Oskari workshop

This document guides you through the Oskari workshop describing the steps needed to embed a map to a webpage and control it from the parent page using Oskari RPC functionality. In this workshop we publish a map from the https://demo.oskari.org, embed the published map to a webpage, add locations of attractions in Bucharest to a map and add some functionalities to get information about the attractions. We also cover how to add own points of interests to a map by clicking the location.

## Initial preparations

In this workshop we use CodePen for the development to prevent using time by installing software or setting up a server.

1. Sign up / Log in to CodePen (https://codepen.io)
2. Search 'Oskari RPC demo' (by Sami Mäkinen) pen from the CodePen and click to open it
3. Start using Oskari RPC demo as a template for your workshop by clicking 'Create Pen from This Template' on the lower right corner.

As an example and a starting point, the template already has an embedded map published from the Oskari-based map application. The template also includes the necessary stuff to get RPC up and running.

Let's take a closer look at the template html code:

First we include RPC javascript in html
```html
<script src="https://oskari.org/js/rpc/rpc-client.min.js"></script>
```

Next we embed a published map by copying the iframe code from the Oskari-based map application to html template
```html
<iframe src="https://demo-kartta.paikkatietoikkuna.fi/published/fi/c4ddaa13-ba2a-4593-bb85-5dbaecf7fd6c" allow="geolocation" id="map" style="border: none; width: 100%; height: 100%;"></iframe>
```

That's the html code so far. Then let's take a closer took to the JavaScript.

First we initialize the RPC connection. Note that the IFRAME_DOMAIN must match to the source domain in the iframe.
```html
const IFRAME_DOMAIN = 'https://demo-kartta.paikkatietoikkuna.fi';
const mapEl = document.getElementById('map');
const channel = OskariRPC.connect(mapEl, IFRAME_DOMAIN);
var metadata;
channel.onReady(function() {
    //channel is now ready and listening.
    channel.log('Map is now listening');
    // getInfo can be used to get the current Oskari version
    channel.getInfo(function(oskariInfo) {
       channel.log('Current Oskari-instance reports version as: ', oskariInfo);
       metadata = oskariInfo;
    });
});
```
Then we test the RPC-functionality using MapClickedEvent to cause alert that shows the clicked coordinates and coordinate system.
```html
channel.handleEvent('MapClickedEvent', function(data) {
  alert('Map clicked! At ' + data.lon + ', ' + data.lat + ' (' + metadata.srs + ')');
});
```

Now that we are familiar with the basic setup, let's start building our own map application showing attractions of Bucharest!

## Adding RPC functionality

1. Publish a map
Publish a world-wide map from the https://dev.oskari.org/. 

2. Add map to the CodePen html template (Iframe siirto codepeniin HTML pohjaan)
Copy the iframe code and replace the existing one in the CodePen html template with this new one

3.  Linkataan tiedosto joka palauttaa geojsonin (tai käydään läpi että tällainen helper funkkari on olemassa esimerkissä)
5. Listataan kohteet sivupaneeliin
6. Filteröidään kohteet bounding boxin mukaan?
- Helper funkkari valmiina?
- Demoaa että kartan viewport saadaan tietoon upottavalla sivulla
7. Lisätään kohteet kartalle /. AddFeaturesToMapRequest
8. Lisätään hover-tyyli joka näyttää kohteen nimen kartalla hoveroitaessa
9. Lisätään kohteen clickin kuuntelija ja näytetään sivupaneelissa lisätietoa kohteesta kun kohdetta klikataan
10. Lisätään sivupaneelin listaukseen click-handler josta korostetaan kartalla kohde.
- Lisätään “siivous” joka poistaa korostuksen edelliseltä kohteelta
- Tehdään funktio joka korostaa kohteen ja näyttää kohteen tiedot sivupaneelissa -> kutsutaan sekä feature-clickissä että sivupaneelin clickissä.
11. ???
12. Profit

